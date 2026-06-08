"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  ArrowUp,
  ArrowDown,
  CornerDownRight,
  Check,
} from "lucide-react";
import { apiRequest, cn } from "@/lib/utils";
import { Guide, GuideInsert } from "@/db/schema";
import { useUI } from "@/context";
import DeleteModal from "@/components/shared/DeletModal";
import AddnUpdateModalWrapper from "@/components/shared/AddnUpdateModalWrapper";
import { Loader } from "@/components/shared/Loader";

const emptyForm = (order: number): GuideInsert => ({
  type: "Resume",
  title: "",
  subtitle: "",
  content: "",
  bullets: [],
  ctaText: "",
  ctaLink: "",
  sortOrder: order,
});

export default function AdminResumeGuidePage() {
  const { data, mutate, isLoading } = useSWR<{ sections: Guide[] }>(
    "/api/guides",
    apiRequest,
  );
  const { addToast } = useUI();

  // Modal State
  const [editId, setEditId] = useState<Guide["id"] | null>(null);
  const [formData, setFormData] = useState<GuideInsert | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [deletingSection, setDeletingSection] = useState<Guide | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const sectionsList = data?.sections?.filter((s) => s.type === "Resume") || [];

  const nextSortOder: number = useMemo(() => {
    const max = sectionsList[sectionsList.length - 1]?.sortOrder;
    return max ? max + 1 : 0;
  }, [sectionsList]);

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData(emptyForm(nextSortOder));
  };

  const handleOpenEdit = (section: Guide) => {
    setEditId(section.id);
    setFormData({
      type: "Resume",
      title: section.title,
      subtitle: section.subtitle,
      content: section.content,
      bullets: section.bullets,
      ctaText: section.ctaText,
      ctaLink: section.ctaLink,
      sortOrder: section.sortOrder,
    });
  };

  const handleFormChange = (data: Partial<GuideInsert>) => {
    setFormData((prev) => {
      if (!prev) return { ...emptyForm(nextSortOder), ...data };
      return { ...prev, ...data };
    });
  };

  const handleAddBullet = (bullet: string) => {
    setFormData((prev) => {
      if (!prev)
        return {
          ...emptyForm(nextSortOder),
          bullets: [bullet],
        };
      return { ...prev, bullets: [...(prev.bullets || []), bullet] };
    });
  };

  const handleRemoveBullet = (index: number) => {
    setFormData((prev) => {
      if (!prev) return emptyForm(nextSortOder);
      return { ...prev, bullets: prev.bullets?.filter((_, i) => i !== index) };
    });
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);

    const url = editId ? `/api/admin/guides?id=${editId}` : "/api/admin/guides";
    const method = editId ? "PUT" : "POST";

    try {
      await apiRequest<{ success: boolean; section: Guide }>(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      await mutate();

      addToast(
        `Resume blueprint section ${editId ? "updated" : "added"} successfully`,
        "success",
      );
      setFormData(null);
      if (editId) setEditId(null);
    } catch (err: any) {
      const msg =
        err instanceof Error
          ? err.message
          : `Failed to ${editId ? "update" : "add"} resume blueprint section`;
      addToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMove = async (section: Guide, direction: "up" | "down") => {
    setIsSubmitting(true);

    const currentIndex = sectionsList.findIndex((s) => s.id === section.id);
    if (currentIndex === -1) return;
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === sectionsList.length - 1)
      return;

    const swapTarget =
      sectionsList[direction === "up" ? currentIndex - 1 : currentIndex + 1];

    const { createdAt, id, ...restSection } = section;
    const { id: _id, createdAt: _c, ...restSwapTarget } = swapTarget;

    try {
      // Swapping sort orders
      await Promise.all([
        apiRequest<{ success: boolean; section: Guide }>(
          `/api/admin/guides?id=${section.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...restSection,
              sortOrder: swapTarget.sortOrder,
            }),
          },
        ),
        apiRequest<{ success: boolean; section: Guide }>(
          `/api/admin/guides?id=${swapTarget.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...restSwapTarget,
              sortOrder: section.sortOrder,
            }),
          },
        ),
      ]);
      await mutate();

      addToast("Resume blueprint section moved successfully", "success");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to move resume blueprint section";
      addToast(msg, "error");
      console.error("Sorting swap failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSection) return;
    setIsDeleting(true);

    try {
      await apiRequest<{ success: boolean; section: Guide }>(
        `/api/admin/guides?id=${deletingSection.id}`,
        { method: "DELETE" },
      );
      await mutate();

      addToast("Resume blueprint section deleted successfully", "success");
      setDeletingSection(null);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to delete resume blueprint section";
      addToast(msg, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left">
        <div>
          <h1 className="font-display flex items-center justify-center gap-2 text-3xl font-extrabold tracking-tight text-zinc-900 md:justify-start">
            <BookOpen className="text-accent mt-1.25 size-6" />
            Resume Writing Blueprint
          </h1>
          <p className="mt-1 max-w-xl text-sm text-balance text-zinc-500">
            Manage the step-by-step reading modules shown on the public Resume
            Guide page.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-accent hover:bg-accent/90 transition-300 flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md active:scale-95"
        >
          <Plus className="size-4" />
          Add Section
        </button>
      </header>

      {/* Guide sections listing */}
      <>
        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <Loader length={12} />
            <span className="text-xs font-medium text-zinc-500">
              Loading blueprint...
            </span>
          </div>
        ) : sectionsList.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 px-4 py-8 text-center">
            <BookOpen className="text-accent mb-3 size-10" />
            <h3 className="text-sm font-bold text-zinc-800">
              No blueprint sections found
            </h3>
            <p className="mt-1 max-w-xs text-xs text-zinc-400">
              Click &quot;Add Section&quot; to create your first resume
              blueprint.
            </p>
          </div>
        ) : (
          <section className="space-y-4">
            {sectionsList.map((sect, index) => (
              <main
                key={sect.id}
                className="group transition-300 relative flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs hover:shadow-md sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  {sect.subtitle && (
                    <span className="text-accent mb-1 block text-[10px] font-bold tracking-wider uppercase">
                      {sect.subtitle}
                    </span>
                  )}
                  <h2 className="font-display text-lg font-bold text-zinc-900">
                    {index + 1}. {sect.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-xs leading-relaxed text-balance text-zinc-500">
                    {sect.content}
                  </p>

                  {sect.bullets && sect.bullets.length > 0 && (
                    <ul className="mt-4 space-y-2 border-t border-zinc-200 pt-4">
                      {sect.bullets.map((b, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2.5 text-xs text-zinc-500"
                        >
                          <span className="rounded border border-emerald-200 bg-emerald-50 p-0.5 text-emerald-700">
                            <Check className="size-3 stroke-3" />
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {sect.ctaText && sect.ctaLink && (
                    <div className="mt-6 flex items-center gap-1.5 text-[11px] font-bold text-zinc-500">
                      <CornerDownRight className="text-accent size-3.5" />
                      Take action:{" "}
                      <span className="text-zinc-800">{sect.ctaText}</span>{" "}
                      &rarr;{" "}
                      <span className="font-mono text-zinc-400">
                        {sect.ctaLink}
                      </span>
                    </div>
                  )}
                </div>

                {/* CRUD & Sorting Actions */}
                <div
                  className={cn(
                    "relative grid h-9 w-40 shrink-0 grid-cols-4 overflow-clip rounded-xl border border-zinc-200 bg-zinc-50 sm:self-start [&_svg]:size-3.5",
                    "after:absolute after:top-1/2 after:left-1/2 after:h-[75%] after:w-px after:-translate-1/2 after:bg-zinc-200",
                  )}
                >
                  {/* Sorting */}
                  <button
                    disabled={index === 0 || isSubmitting}
                    onClick={() => handleMove(sect, "up")}
                    className="transition-300 flex cursor-pointer items-center justify-center text-zinc-400 hover:bg-zinc-200 hover:text-zinc-800 disabled:pointer-events-none disabled:opacity-50"
                    title="Move Up"
                  >
                    <ArrowUp />
                  </button>
                  <button
                    disabled={index === sectionsList.length - 1 || isSubmitting}
                    onClick={() => handleMove(sect, "down")}
                    className="transition-300 flex cursor-pointer items-center justify-center text-zinc-400 hover:bg-zinc-200 hover:text-zinc-800 disabled:pointer-events-none disabled:opacity-50"
                    title="Move Down"
                  >
                    <ArrowDown />
                  </button>

                  {/* Actions */}
                  <button
                    onClick={() => handleOpenEdit(sect)}
                    disabled={isSubmitting}
                    className="transition-300 flex cursor-pointer items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-800 disabled:pointer-events-none disabled:opacity-50"
                    title="Edit"
                  >
                    <Edit2 />
                  </button>
                  <button
                    onClick={() => setDeletingSection(sect)}
                    disabled={isSubmitting}
                    className="transition-300 flex cursor-pointer items-center justify-center text-zinc-400 hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 />
                  </button>
                </div>
              </main>
            ))}
          </section>
        )}
      </>

      {/* CRUD Slide-over Modal */}
      <AddnUpdateModal
        editId={editId}
        formData={formData}
        isSubmitting={isSubmitting}
        onCancel={() => {
          setFormData(null);
          if (editId) setEditId(null);
        }}
        onSubmit={handleFormSubmit}
        onAddBullet={(str) => handleAddBullet(str)}
        onRemoveBullet={(idx) => handleRemoveBullet(idx)}
        onChange={(data) => handleFormChange(data)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isDeleting={isDeleting}
        onCancel={() => setDeletingSection(null)}
        onDelete={handleDelete}
        itemTitle={deletingSection?.title}
        modalTitle="Remove Blueprint Module"
      />
    </div>
  );
}

const AddnUpdateModal = ({
  editId,
  formData,
  isSubmitting,
  onCancel,
  onChange,
  onSubmit,
  onAddBullet,
  onRemoveBullet,
}: {
  formData: GuideInsert | null;
  editId: Guide["id"] | null;
  isSubmitting: boolean;
  onChange: (data: Partial<GuideInsert>) => void;
  onCancel: () => void;
  onSubmit: () => void;
  onAddBullet: (bullet: string) => void;
  onRemoveBullet: (index: number) => void;
}) => {
  const [newBullet, setNewBullet] = useState<string>("");

  return (
    <AddnUpdateModalWrapper isOpen={!!formData}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
        <h3 className="font-display text-lg font-bold text-zinc-900">
          {editId ? "Modify Resume Blueprint" : "Add Resume Blueprint"}
        </h3>
        <button
          onClick={onCancel}
          className="transition-300 cursor-pointer rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Form */}
      {!!formData && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="mt-4 flex flex-1 flex-col gap-y-5"
        >
          <main>
            <label
              htmlFor="resume-title"
              className="mb-2 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
            >
              Module Title
            </label>
            <input
              id="resume-title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="e.g. Why Your Resume Matters"
              className="transition-300 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
              disabled={isSubmitting}
            />
          </main>

          <main>
            <label
              htmlFor="resume-subtitle"
              className="mb-2 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
            >
              Subtitle Header
            </label>
            <input
              id="resume-subtitle"
              type="text"
              value={formData.subtitle || ""}
              onChange={(e) => onChange({ subtitle: e.target.value })}
              placeholder="e.g. The 6-Second Screen"
              className="transition-300 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
              disabled={isSubmitting}
            />
          </main>

          <main>
            <label
              htmlFor="resume-content"
              className="mb-2 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
            >
              Content Paragraph
            </label>
            <textarea
              id="resume-content"
              required
              rows={5}
              value={formData.content}
              onChange={(e) => onChange({ content: e.target.value })}
              placeholder="Provide step-by-step technical guides content..."
              className="transition-300 w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
              disabled={isSubmitting}
            />
          </main>

          {/* Bullets List Manager */}
          <main>
            <label
              htmlFor="resume-bullet"
              className="mb-2 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
            >
              Key Highlights Bullets
            </label>
            <div className="mb-2 flex gap-2">
              <input
                id="resume-bullet"
                type="text"
                value={newBullet}
                onChange={(e) => setNewBullet(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (!newBullet.trim()) return;
                    onAddBullet(newBullet.trim());
                    setNewBullet("");
                  }
                }}
                placeholder="Add key takeaway bullet item"
                className="transition-300 flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => {
                  if (!newBullet.trim()) return;
                  onAddBullet(newBullet.trim());
                  setNewBullet("");
                }}
                className="transition-300 cursor-pointer rounded-xl bg-zinc-700 px-3.5 text-xs font-bold text-white hover:bg-zinc-900"
                disabled={isSubmitting}
              >
                Add
              </button>
            </div>

            <ul className="max-h-36 space-y-1 overflow-y-auto">
              {formData?.bullets?.map((b, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-[11px]"
                >
                  <span className="truncate pr-4 text-zinc-700">{b}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveBullet(i)}
                    className="transition-300 cursor-pointer text-zinc-400 hover:text-rose-600"
                    disabled={isSubmitting}
                  >
                    <X className="size-3.25" />
                  </button>
                </li>
              ))}
            </ul>
          </main>

          <main className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="resume-cta-text"
                className="mb-2 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
              >
                CTA Text (Optional)
              </label>
              <input
                id="resume-cta-text"
                type="text"
                value={formData.ctaText || ""}
                onChange={(e) => onChange({ ctaText: e.target.value })}
                placeholder="e.g. Build Resume now"
                className="transition-300 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label
                htmlFor="resume-cta-link"
                className="mb-2 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
              >
                CTA Link (Optional)
              </label>
              <input
                id="resume-cta-link"
                type="text"
                value={formData.ctaLink || ""}
                onChange={(e) => onChange({ ctaLink: e.target.value })}
                placeholder="e.g. /generator"
                className="transition-300 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
                disabled={isSubmitting}
              />
            </div>
          </main>

          <div className="mt-auto flex justify-end gap-3 border-t border-zinc-200 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="cursor-pointer rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-500 hover:bg-zinc-50 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-accent hover:bg-accent/90 transition-300 flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                "Save Section"
              )}
            </button>
          </div>
        </form>
      )}
    </AddnUpdateModalWrapper>
  );
};
