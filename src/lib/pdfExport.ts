import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

/**
 * Intelligent A4 dynamic page-splitting exporter.
 * Clones the resume preview container, measures elements with '.pdf-block',
 * and inserts dynamic page-break spacers to prevent text/components from being cut in half.
 */
export async function exportResumeToPDF(
  elementId: string,
  fileName: string = "Resume.pdf",
) {
  const originalElement = document.getElementById(elementId);
  if (!originalElement) {
    console.error(`Element with ID "${elementId}" not found for PDF export.`);
    return;
  }

  // Create container clone to manipulate DOM for spacing off-screen
  const clone = originalElement.cloneNode(true) as HTMLElement;

  // Remove dynamic page-fold indicators from the export clone so they are not rendered in the PDF
  const foldIndicators = clone.querySelectorAll(".page-fold-indicator");
  foldIndicators.forEach((indicator) => indicator.remove());

  clone.style.position = "absolute";
  clone.style.left = "-9999px";
  clone.style.top = "0";
  clone.style.width = `${originalElement.offsetWidth}px`;
  clone.style.height = "auto";
  // Ensure the clone is visible so getBoundingClientRect works correctly
  clone.style.visibility = "visible";
  document.body.appendChild(clone);

  try {
    const elementWidth = clone.offsetWidth;
    const pxPerMm = elementWidth / 210;
    const pageHeightPx = 297 * pxPerMm;
    const paddingTopPx = 15 * pxPerMm; // 15mm padding top
    const paddingBottomPx = 13 * pxPerMm; // 15mm padding bottom
    const usablePageHeightPx = pageHeightPx - paddingTopPx - paddingBottomPx; // 267mm

    // Let's query all blocks that we want to prevent from breaking in the middle (e.g. experience cards, sections, headings)
    const blocks = Array.from(
      clone.querySelectorAll(".pdf-block"),
    ) as HTMLElement[];

    // We adjust block offsets dynamically as we insert spacers.
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const containerRect = clone.getBoundingClientRect();
      const blockRect = block.getBoundingClientRect();

      const topOffset = blockRect.top - containerRect.top;
      const bottomOffset = blockRect.bottom - containerRect.top;
      const blockHeight = blockRect.height;

      const page = Math.floor(topOffset / pageHeightPx);
      const localTop = topOffset - page * pageHeightPx;
      const localBottom = bottomOffset - page * pageHeightPx;

      // 1. If this is not the first page, and the block starts inside the top padding zone, push it down
      if (page > 0 && localTop < paddingTopPx) {
        const targetTop = page * pageHeightPx + paddingTopPx;
        const requiredSpacerHeight = targetTop - topOffset;

        if (requiredSpacerHeight > 0) {
          const spacer = document.createElement("div");
          spacer.style.height = `${requiredSpacerHeight}px`;
          spacer.style.width = "100%";
          spacer.style.backgroundColor = "transparent";
          spacer.className = "pdf-page-spacer";

          block.parentNode?.insertBefore(spacer, block);
          // Re-measure this block since it has shifted
          i--;
          continue;
        }
      }

      // 2. If the block overflows the bottom content limit of the current page
      const contentEnd = pageHeightPx - paddingBottomPx;
      if (localBottom > contentEnd && blockHeight < usablePageHeightPx) {
        const targetTop = (page + 1) * pageHeightPx + paddingTopPx;
        const requiredSpacerHeight = targetTop - topOffset;

        if (requiredSpacerHeight > 0) {
          const spacer = document.createElement("div");
          spacer.style.height = `${requiredSpacerHeight}px`;
          spacer.style.width = "100%";
          spacer.style.backgroundColor = "transparent";
          spacer.className = "pdf-page-spacer";

          block.parentNode?.insertBefore(spacer, block);
          // Re-measure this block since it has shifted
          i--;
          continue;
        }
      }
    }

    // Now capture the canvas of the padded clone
    const canvas = await html2canvas(clone, {
      scale: 2, // High DPI for crystal-clear text rendering
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm

    const canvasWidthPx = canvas.width;
    const canvasHeightPx = canvas.height;

    // Calculate total height in mm matching the A4 scale
    const imgHeight = (canvasHeightPx * imgWidth) / canvasWidthPx;
    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add extra pages as needed with precise vertical offsets
    while (heightLeft >= 0.5) {
      // Threshold to prevent trailing blank pages
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
  } catch (error) {
    console.error("Error generating dynamic page-split PDF:", error);
    throw error;
  } finally {
    // Cleanup the cloned DOM element
    if (clone.parentNode) {
      clone.parentNode.removeChild(clone);
    }
  }
}
