"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  X,
  FileText,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { apiRequest, cn } from "@/lib/utils";
import { Tip, TipInsert } from "@/db/schema";
import { useUI } from "@/context";
import { useRouter, useSearchParams } from "next/navigation";
import DeleteModal from "@/components/shared/DeletModal";
import AddnUpdateModalWrapper from "@/components/shared/AddnUpdateModalWrapper";
import { Loader } from "@/components/shared/Loader";

const emptyForm = (activeTab: "All" | Tip["resourceType"]): TipInsert => ({
  category: activeTab === "Interview" ? "Preparation" : "ATS",
  type: "do",
  headline: "",
  explanation: "",
  example: "",
  resourceType: activeTab === "All" ? "Resume" : "Interview",
});

export default function AdminTipsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const action = searchParams.get("action");

  const { data, mutate, isLoading } = useSWR<{ tips: Tip[] }>(
    "/api/tips",
    apiRequest,
  );
  const { addToast } = useUI();
  const [activeTab, setActiveTab] = useState<"All" | Tip["resourceType"]>(
    "All",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "All" | Tip["category"]
  >("All");

  // Modal State
  const [editId, setEditId] = useState<Tip["id"] | null>(null);
  const [formData, setFormData] = useState<TipInsert | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [deletingTip, setDeletingTip] = useState<Tip | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const tipsList = data?.tips || [];

  // Filter Tips
  const filteredTips = tipsList.filter((tip) => {
    const matchesTab = activeTab === "All" || tip.resourceType === activeTab;
    const matchesSearch =
      tip.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || tip.category === selectedCategory;
    return matchesTab && matchesSearch && matchesCategory;
  });

  const categories: ("All" | Tip["category"])[] = [
    "All",
    ...new Set(
      tipsList
        .filter((t) => activeTab === "All" || t.resourceType === activeTab)
        .map((t) => t.category),
    ),
  ];

  const handleFormChange = (data: Partial<TipInsert>) => {
    setFormData((prev) => {
      if (!prev) return { ...emptyForm(activeTab), ...data };
      return { ...prev, ...data };
    });
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData(emptyForm(activeTab));
  };

  const handleOpenEdit = (tip: Tip) => {
    setEditId(tip.id);
    setFormData({
      category: tip.category,
      type: tip.type,
      headline: tip.headline,
      explanation: tip.explanation,
      example: tip.example || "",
      resourceType: tip.resourceType,
    });
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);

    const url = editId ? `/api/admin/tips?id=${editId}` : "/api/admin/tips";
    const method = editId ? "PUT" : "POST";

    try {
      await apiRequest<{ success: boolean; tip: Tip }>(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      await mutate();

      addToast(`Tip ${editId ? "updated" : "added"} successfully`, "success");
      setFormData(null);
      if (editId) setEditId(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      addToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTip) return;
    setIsDeleting(true);

    try {
      await apiRequest<{ success: boolean; tip: Tip }>(
        `/api/admin/tips?id=${deletingTip.id}`,
        {
          method: "DELETE",
        },
      );

      await mutate();
      addToast("Tip deleted successfully", "success");
      setDeletingTip(null);
    } catch (err) {
      console.error(err);
      addToast("Failed to delete tip", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (action === "new") handleOpenAdd();
  }, [action]);

  return (
    <section className="space-y-8">
      {/* Header */}
      <header className="flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left">
        <div>
          <h1 className="font-display flex items-center justify-center gap-2 text-3xl font-extrabold tracking-tight text-zinc-900 md:justify-start">
            <Sparkles className="text-accent size-6" />
            Manage Cheat Sheets
          </h1>
          <p className="mt-1 max-w-lg text-sm text-balance text-zinc-500">
            Create, update, or remove the Do&apos;s and Don&apos;ts listed in
            CareerCraft guidelines.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-accent hover:bg-accent/90 transition-300 flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md active:scale-95"
        >
          <Plus className="size-4" />
          Add New Tip
        </button>
      </header>

      {/* Tabs Menu */}
      <section className="grid grid-cols-3 border-b border-zinc-200">
        {[
          { id: "All", name: "All Cheat Sheets", icon: Sparkles },
          { id: "Resume", name: "Resume guidelines", icon: FileText },
          { id: "Interview", name: "Interview guidelines", icon: HelpCircle },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setActiveTab(t.id as Tip["resourceType"] | "All");
              setSelectedCategory("All");
            }}
            className={cn(
              "transition-300 hover:border-accent -mb-px flex cursor-pointer items-center justify-center gap-2 rounded-t-xl border-b-2 border-transparent p-4 text-sm font-semibold text-zinc-500 hover:border-b hover:text-zinc-900",
              {
                "border-accent bg-zinc-100 text-zinc-900 hover:border-b-2":
                  activeTab === t.id,
              },
            )}
          >
            <t.icon className="hidden size-4 sm:inline" />
            {t.name}
          </button>
        ))}
      </section>

      {/* Filter and Search Bar */}
      <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tip content..."
            className="transition-300 w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2.5 pr-4 pl-10 text-xs text-zinc-900 placeholder-zinc-400 shadow-inner focus:border-zinc-300 focus:outline-none"
          />
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-2 flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase">
            <Filter className="size-3" />
            Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "transition-300 cursor-pointer rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-0.75 text-[10px] font-semibold text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100",
                {
                  "border-accent bg-accent/10 text-accent hover:border-accent/90 hover:bg-accent/15 hover:text-accent/90 font-bold":
                    selectedCategory === cat,
                },
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Content Grid */}
      <>
        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <Loader length={12} />
            <span className="text-xs font-medium text-zinc-500">
              Loading Cheat Sheets...
            </span>
          </div>
        ) : filteredTips.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center">
            <Sparkles className="text-accent mb-3 size-10" />
            <h3 className="text-sm font-bold text-zinc-800">
              No cheat sheets found
            </h3>
            <p className="mt-1.5 max-w-xs text-xs text-zinc-400">
              Try adjusting your category filter, or click &quot;Add New
              Tip&quot; to seed your own.
            </p>
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredTips.map((tip) => {
              const isDo = tip.type === "do";
              return (
                <article
                  key={tip.id}
                  className={cn(
                    "transition-300 group relative flex flex-col overflow-clip rounded-2xl border border-red-200 bg-white p-5 shadow-md hover:border-red-300 hover:shadow-lg",
                    {
                      "border-emerald-200 hover:border-emerald-300": isDo,
                    },
                  )}
                >
                  {/* Visual highlights */}
                  <span
                    className={cn(
                      "transition-300 absolute top-0.5 left-1/2 h-1 w-25 -translate-x-1/2 rounded-full bg-rose-500 group-hover:top-0 group-hover:w-full",
                      { "bg-emerald-500": isDo },
                    )}
                  />

                  {/* Meta Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-stretch gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-bold tracking-wider text-rose-700 uppercase [&>svg]:size-3",
                          {
                            "border-emerald-200 bg-emerald-50 text-emerald-700":
                              isDo,
                          },
                        )}
                      >
                        {isDo ? (
                          <>
                            <CheckCircle />
                            Do
                          </>
                        ) : (
                          <>
                            <AlertCircle />
                            Don't
                          </>
                        )}
                      </span>
                      <span className="flex items-center justify-center rounded border border-zinc-200 bg-zinc-100 px-2 py-1 text-[10px] font-bold tracking-wider text-zinc-600 uppercase">
                        {tip.category}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 [&_svg]:size-3.5">
                      <button
                        onClick={() => handleOpenEdit(tip)}
                        className="transition-300 cursor-pointer rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
                        title="Edit"
                      >
                        <Edit2 />
                      </button>
                      <button
                        onClick={() => setDeletingTip(tip)}
                        className="transition-300 cursor-pointer rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex-1">
                    <h3 className="font-display text-base leading-snug font-bold text-zinc-900">
                      {tip.headline}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                      {tip.explanation}
                    </p>

                    {tip.example && (
                      <div
                        className={cn(
                          "mt-4 rounded-xl border border-red-100 bg-red-50/50 p-3 text-xs leading-relaxed text-red-700",
                          {
                            "border-emerald-100 bg-emerald-50/50 text-emerald-700":
                              isDo,
                          },
                        )}
                      >
                        <span className="mb-1 block font-bold tracking-wider uppercase">
                          Example:
                        </span>
                        <span className="italic">
                          &ldquo;{tip.example}&rdquo;
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </>

      {/* CRUD Side-over Modal */}
      <AddnUpdateModal
        editId={editId}
        formData={formData}
        isSubmitting={isSubmitting}
        onCancel={() => {
          setFormData(null);
          setEditId(null);
          if (action) router.replace("/admin/tips");
        }}
        onSubmit={() => handleFormSubmit()}
        onChange={(data) => handleFormChange(data)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isDeleting={isDeleting}
        onCancel={() => setDeletingTip(null)}
        onDelete={() => handleDelete()}
        modalTitle="Delete Guideline"
        itemTitle={deletingTip?.headline}
      />
    </section>
  );
}

const resourceTypes: {
  id: Tip["resourceType"];
  icon: React.FC<React.ComponentProps<"svg">>;
}[] = [
  { id: "Resume", icon: FileText },
  { id: "Interview", icon: HelpCircle },
];
const types: {
  id: Tip["type"];
  title: string;
}[] = [
  { id: "do", title: "✅ DO" },
  { id: "dont", title: "❌ DON'T" },
];
const resumeCategory: Tip["category"][] = ["ATS", "Formatting", "Wording"];
const interviewCategory: Tip["category"][] = [
  "Preparation",
  "Behavior",
  "Negotiation",
  "Follow Up",
];

const AddnUpdateModal = ({
  editId,
  formData,
  isSubmitting,
  onCancel,
  onSubmit,
  onChange,
}: {
  editId: Tip["id"] | null;
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  formData: TipInsert | null;
  onChange: (data: Partial<TipInsert>) => void;
}) => {
  return (
    <AddnUpdateModalWrapper isOpen={!!formData}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <h3 className="font-display text-lg font-bold text-zinc-900">
          {editId ? "Modify Cheat Sheet" : "Add New Guideline"}
        </h3>
        <button
          onClick={() => onCancel()}
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
          className="mt-6 flex flex-1 flex-col gap-y-5"
        >
          {/* Resume and Interview */}
          <main>
            <label className="mb-2 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
              Guideline Target
            </label>
            <div className="grid grid-cols-2 gap-2">
              {resourceTypes.map((r) => (
                <button
                  key={r.id}
                  id={r.id + "-tip"}
                  type="button"
                  onClick={() => onChange({ resourceType: r.id })}
                  className={cn(
                    "transition-300 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 text-xs font-bold text-zinc-500 hover:bg-zinc-100 disabled:pointer-events-none",
                    {
                      "border-accent bg-accent/10 text-accent hover:bg-accent/15 font-semibold":
                        formData.resourceType === r.id,
                    },
                  )}
                  disabled={isSubmitting}
                >
                  <r.icon className="size-3.5" />
                  {r.id}
                </button>
              ))}
            </div>
          </main>

          {/* Tip Type and Category */}
          <main className="grid grid-cols-2 gap-4">
            {/* Do's and Don'r */}
            <main>
              <label
                htmlFor="tip-type"
                className="mb-2 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
              >
                Tip Type
              </label>
              <select
                id="tip-type"
                value={formData.type}
                onChange={(e) =>
                  onChange({ type: e.target.value as Tip["type"] })
                }
                className="transition-300 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 focus:border-zinc-400 focus:outline-none"
                disabled={isSubmitting}
              >
                {types.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </main>

            {/* Category Tag */}
            <main>
              <label
                htmlFor="category-tag"
                className="mb-2 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
              >
                Category Tag
              </label>
              <select
                id="category-tag"
                value={formData.category}
                onChange={(e) =>
                  onChange({ category: e.target.value as Tip["category"] })
                }
                className="transition-300 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 focus:border-zinc-400 focus:outline-none"
                disabled={isSubmitting}
              >
                {(formData.resourceType === "Interview"
                  ? interviewCategory
                  : resumeCategory
                ).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </main>
          </main>

          {/* Tip Summary */}
          <main>
            <label
              htmlFor="tip-summary"
              className="mb-2 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
            >
              Headline Summary
            </label>
            <input
              type="text"
              id="tip-summary"
              required
              value={formData.headline}
              onChange={(e) => onChange({ headline: e.target.value })}
              placeholder="Brief action-oriented title"
              className="transition-300 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
              disabled={isSubmitting}
            />
          </main>

          {/* Tip Explanation */}
          <main>
            <label
              htmlFor="tip-explanation"
              className="mb-2 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
            >
              Detailed Explanation
            </label>
            <textarea
              id="tip-explanation"
              required
              rows={4}
              value={formData.explanation}
              onChange={(e) => onChange({ explanation: e.target.value })}
              placeholder="Provide depth on why this do/dont matters..."
              className="transition-300 w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
              disabled={isSubmitting}
            />
          </main>

          {/* Top Example */}
          <main>
            <label
              htmlFor="tip-example"
              className="mb-2 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
            >
              Example Quote (Optional)
            </label>
            <input
              id="tip-example"
              type="text"
              value={formData.example || ""}
              onChange={(e) => onChange({ example: e.target.value })}
              placeholder="Provide a real-world script example"
              className="transition-300 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
              disabled={isSubmitting}
            />
          </main>

          <div className="mt-auto flex justify-end gap-3 border-t border-zinc-200 pt-4">
            <button
              type="button"
              onClick={() => onCancel()}
              className="transition-300 cursor-pointer rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-500 hover:bg-zinc-50"
              disabled={isSubmitting}
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
                `${editId ? "Update" : "Save"} Cheat Sheet`
              )}
            </button>
          </div>
        </form>
      )}
    </AddnUpdateModalWrapper>
  );
};
