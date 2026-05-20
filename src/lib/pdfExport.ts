import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Intelligent A4 dynamic page-splitting exporter.
 * Clones the resume preview container, measures elements with '.pdf-block',
 * and inserts dynamic page-break spacers to prevent text/components from being cut in half.
 */
export async function exportResumeToPDF(elementId: string, fileName: string = 'Resume.pdf') {
  const originalElement = document.getElementById(elementId);
  if (!originalElement) {
    console.error(`Element with ID "${elementId}" not found for PDF export.`);
    return;
  }

  // Create container clone to manipulate DOM for spacing off-screen
  const clone = originalElement.cloneNode(true) as HTMLElement;
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  clone.style.width = `${originalElement.offsetWidth}px`;
  clone.style.height = 'auto';
  // Ensure the clone is visible so getBoundingClientRect works correctly
  clone.style.visibility = 'visible'; 
  document.body.appendChild(clone);

  try {
    // 1 A4 page at 96 DPI is approximately 1123px high for standard width of 794px.
    // We base our scaling on the actual width of the element to keep aspect ratio perfect.
    const elementWidth = clone.offsetWidth;
    const pageHeightPx = (297 / 210) * elementWidth; // A4 aspect ratio (297mm / 210mm)

    // Let's query all blocks that we want to prevent from breaking in the middle (e.g. experience cards, sections, headings)
    const blocks = Array.from(clone.querySelectorAll('.pdf-block')) as HTMLElement[];
    
    // We adjust block offsets dynamically as we insert spacers.
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const containerRect = clone.getBoundingClientRect();
      const blockRect = block.getBoundingClientRect();
      
      const topOffset = blockRect.top - containerRect.top;
      const bottomOffset = blockRect.bottom - containerRect.top;
      
      const topPage = Math.floor(topOffset / pageHeightPx);
      const bottomPage = Math.floor(bottomOffset / pageHeightPx);
      
      // If the block spans across two pages, insert a spacer to push it to the next page
      if (topPage !== bottomPage && blockRect.height < pageHeightPx) {
        const nextPageStartOffset = bottomPage * pageHeightPx;
        const requiredSpacerHeight = nextPageStartOffset - topOffset;
        
        if (requiredSpacerHeight > 0 && requiredSpacerHeight < pageHeightPx) {
          const spacer = document.createElement('div');
          spacer.style.height = `${requiredSpacerHeight}px`;
          spacer.style.width = '100%';
          spacer.style.backgroundColor = 'transparent';
          spacer.className = 'pdf-page-spacer'; // Identifier
          
          block.parentNode?.insertBefore(spacer, block);
        }
      }
    }

    // Now capture the canvas of the padded clone
    const canvas = await html2canvas(clone, {
      scale: 2, // High DPI for crystal-clear text rendering
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    
    const canvasWidthPx = canvas.width;
    const canvasHeightPx = canvas.height;
    
    // Calculate total height in mm matching the A4 scale
    const imgHeight = (canvasHeightPx * imgWidth) / canvasWidthPx;
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add extra pages as needed with precise vertical offsets
    while (heightLeft >= 0.5) { // Threshold to prevent trailing blank pages
      position = heightLeft - imgHeight; 
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating dynamic page-split PDF:', error);
    throw error;
  } finally {
    // Cleanup the cloned DOM element
    if (clone.parentNode) {
      clone.parentNode.removeChild(clone);
    }
  }
}

