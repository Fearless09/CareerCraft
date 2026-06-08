"use client";

import React, { useState } from "react";
import useSWR from "swr";
import {
  CheckSquare,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from "lucide-react";
import { apiRequest, cn } from "@/lib/utils";
import {
  ModelAnswer,
  PracticeQuestion,
  practiceQuestionCategory,
  PracticeQuestionInsert,
} from "@/db/schema";
import { useUI } from "@/context";
import { Loader } from "@/components/shared/Loader";
import DeleteModal from "@/components/shared/DeletModal";
import AddnUpdateModalWrapper from "@/components/shared/AddnUpdateModalWrapper";

const emptyForm = (
  cat: PracticeQuestion["category"],
): PracticeQuestionInsert => ({
  category: cat,
  question: "",
  tip: "",
  modelAnswer: {
    overview: "",
    situation: "",
    task: "",
    action: "",
    result: "",
    generalAnswer: "",
  },
});

export default function AdminPracticeQuestionsPage() {
  const { data, mutate, isLoading } = useSWR<{
    practiceQuestions: PracticeQuestion[];
  }>("/api/practice", apiRequest);
  const { addToast } = useUI();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "All" | PracticeQuestion["category"]
  >("All");
  const [expandedQuestions, setExpandedQuestions] = useState<
    Record<string, boolean>
  >({});

  // CRUD Modal State
  const [editId, setEditId] = useState<PracticeQuestion["id"] | null>(null);
  const [formData, setFormData] = useState<PracticeQuestionInsert | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [deletingQuestion, setDeletingQuestion] =
    useState<PracticeQuestion | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const questionsList = data?.practiceQuestions || [];

  // Filter questions
  const filteredQuestions = questionsList.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.modelAnswer.overview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories: ("All" | PracticeQuestion["category"])[] = [
    "All",
    ...new Set(questionsList.map((q) => q.category)),
  ];

  const handleOpenAdd = () => {
    if (editId) setEditId(null);
    setFormData(emptyForm("General"));
  };

  const handleOpenEdit = (q: PracticeQuestion) => {
    setEditId(q.id);
    setFormData({
      category: q.category,
      question: q.question,
      tip: q.tip,
      modelAnswer: q.modelAnswer,
    });
  };

  const handleFormChange = (data: Partial<PracticeQuestionInsert>) => {
    setFormData((prev) => {
      if (!prev) return { ...emptyForm("General"), ...data };
      return { ...prev, ...data };
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);

    const url = editId
      ? `/api/admin/practice?id=${editId}`
      : "/api/admin/practice";
    const method = editId ? "PUT" : "POST";

    try {
      await apiRequest<{ success: boolean; question: PracticeQuestion }>(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      await mutate();

      addToast(
        `Practice question ${editId ? "updated" : "added"} successfully`,
        "success",
      );
      setFormData(null);
    } catch (err: any) {
      const msg =
        err instanceof Error
          ? err.message
          : `Failed to ${editId ? "update" : "add"} practice question`;
      addToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingQuestion) return;
    setIsDeleting(true);

    try {
      await apiRequest<{ success: boolean; question: PracticeQuestion }>(
        `/api/admin/practice?id=${deletingQuestion.id}`,
        {
          method: "DELETE",
        },
      );
      await mutate();

      addToast("Practice question deleted successfully", "success");
      setDeletingQuestion(null);
    } catch (err) {
      console.error(err);
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to delete practice question";
      addToast(msg, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="space-y-8">
      {/* Header */}
      <header className="flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left">
        <div>
          <h1 className="font-display flex items-center justify-center gap-2 text-3xl font-extrabold tracking-tight text-zinc-900 md:justify-start">
            <CheckSquare className="text-accent mt-0.75 size-6" />
            Interview Practice Q&A
          </h1>
          <p className="mt-1 max-w-xl text-sm text-balance text-zinc-500">
            Manage practice questions, detailed tips, and structured model
            answers (STAR format).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-accent hover:bg-accent/90 transition-300 flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md active:scale-95"
        >
          <Plus className="size-4" />
          Add Question
        </button>
      </header>

      {/* Filters and Search */}
      <section className="flex flex-col gap-4 border-b border-zinc-200 pb-3 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search questions, tips, overview..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="transition-300 w-full rounded-xl border border-zinc-200 bg-white py-2 pr-4 pl-10 text-xs text-zinc-900 placeholder-zinc-400 shadow-xs focus:border-zinc-400 focus:outline-none"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "transition-300 cursor-pointer rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:bg-zinc-50",
                {
                  "bg-accent border-accent hover:bg-accent/90 text-white":
                    selectedCategory === cat,
                },
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Questions Listing */}
      <>
        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <Loader length={12} />
            <span className="text-xs font-medium text-zinc-500">
              Loading questions...
            </span>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 p-8 text-center">
            <HelpCircle className="text-accent mb-3 size-10" />
            <h3 className="text-sm font-bold text-zinc-800">
              No practice questions found
            </h3>
            <p className="mt-1 max-w-xs text-xs text-zinc-400">
              Create a question or adjust the filters/search criteria.
            </p>
          </div>
        ) : (
          <section className="space-y-4">
            {filteredQuestions.map((q) => {
              const isExpanded = !!expandedQuestions[q.id];
              return (
                <main
                  key={q.id}
                  className="group transition-300 relative flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs hover:border-zinc-300 hover:shadow-md sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="flex-1 space-y-3">
                    <span className="inline-block rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 font-mono text-[10px] font-bold text-zinc-600">
                      {q.category}
                    </span>

                    <h3 className="font-display text-base leading-tight font-bold text-balance text-zinc-900">
                      {q.question}
                    </h3>

                    <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 text-xs text-balance text-zinc-500 shadow-sm">
                      <strong className="text-accent font-semibold">
                        Tip:
                      </strong>{" "}
                      {q.tip}
                    </div>

                    {/* Collapsible Answer Preview */}
                    <div className="pt-2">
                      <button
                        onClick={() => toggleExpand(q.id)}
                        className="transition-300 inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-zinc-500 hover:text-zinc-900 [&_svg]:size-3"
                      >
                        {isExpanded ? (
                          <>
                            Hide Model Answer <ChevronUp />
                          </>
                        ) : (
                          <>
                            Show Model Answer <ChevronDown />
                          </>
                        )}
                      </button>

                      <main
                        className={cn(
                          "transition-300 pointer-events-none grid grid-rows-[0fr] border-t border-transparent",
                          {
                            "pointer-events-auto mt-3 grid-rows-[1fr] border-zinc-200 pt-3":
                              isExpanded,
                          },
                        )}
                      >
                        <div className="space-y-3 overflow-hidden">
                          <div>
                            <span className="block text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                              Overview
                            </span>
                            <p className="mt-0.5 text-xs leading-relaxed text-zinc-700">
                              {q.modelAnswer.overview}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {q.modelAnswer.situation && (
                              <div className="rounded-lg border border-orange-100 bg-orange-50/30 p-2.5">
                                <span className="text-[10px] font-bold tracking-wider text-orange-600 uppercase">
                                  Situation (S)
                                </span>
                                <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                                  {q.modelAnswer.situation}
                                </p>
                              </div>
                            )}
                            {q.modelAnswer.task && (
                              <div className="rounded-lg border border-blue-100 bg-blue-50/30 p-2.5">
                                <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase">
                                  Task (T)
                                </span>
                                <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                                  {q.modelAnswer.task}
                                </p>
                              </div>
                            )}
                            {q.modelAnswer.action && (
                              <div className="rounded-lg border border-purple-100 bg-purple-50/30 p-2.5">
                                <span className="text-[10px] font-bold tracking-wider text-purple-600 uppercase">
                                  Action (A)
                                </span>
                                <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                                  {q.modelAnswer.action}
                                </p>
                              </div>
                            )}
                            {q.modelAnswer.result && (
                              <div className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-2.5">
                                <span className="text-[10px] font-bold tracking-wider text-emerald-600 uppercase">
                                  Result (R)
                                </span>
                                <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                                  {q.modelAnswer.result}
                                </p>
                              </div>
                            )}
                          </div>

                          {q.modelAnswer.generalAnswer && (
                            <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-2.5">
                              <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                                Suggested Answer Structure
                              </span>
                              <p className="mt-0.5 text-xs leading-relaxed text-zinc-600">
                                {q.modelAnswer.generalAnswer}
                              </p>
                            </div>
                          )}
                        </div>
                      </main>
                    </div>
                  </div>

                  {/* Actions Panel */}
                  <main
                    className={cn(
                      "relative grid h-9 w-20 shrink-0 grid-cols-2 overflow-clip rounded-xl border border-zinc-200 bg-zinc-50 sm:self-start [&_svg]:size-3.5",
                      "after:absolute after:top-1/2 after:left-1/2 after:h-[70%] after:w-px after:-translate-1/2 after:rounded-full after:bg-zinc-200",
                    )}
                  >
                    <button
                      onClick={() => handleOpenEdit(q)}
                      className="transition-300 flex cursor-pointer items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-50"
                      title="Edit"
                      disabled={isSubmitting}
                    >
                      <Edit2 />
                    </button>
                    <button
                      onClick={() => setDeletingQuestion(q)}
                      className="transition-300 flex cursor-pointer items-center justify-center text-zinc-500 hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-50"
                      title="Delete"
                      disabled={isDeleting}
                    >
                      <Trash2 />
                    </button>
                  </main>
                </main>
              );
            })}
          </section>
        )}
      </>

      {/* CRUD Modal Sheet */}
      <AddnUpdateModal
        editId={editId}
        formData={formData}
        onChange={(data) => handleFormChange(data)}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          if (editId) setEditId(null);
          setFormData(null);
        }}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isDeleting={isDeleting}
        onCancel={() => setDeletingQuestion(null)}
        onDelete={handleDelete}
        itemTitle={deletingQuestion?.question}
        modalTitle="Remove Practice Question"
      />
    </section>
  );
}

const AddnUpdateModal = ({
  editId,
  formData,
  isSubmitting,
  onCancel,
  onChange,
  onSubmit,
}: {
  formData: PracticeQuestionInsert | null;
  editId: PracticeQuestion["id"] | null;
  isSubmitting: boolean;
  onChange: (data: Partial<PracticeQuestionInsert>) => void;
  onCancel: () => void;
  onSubmit: () => void;
}) => {
  return (
    <AddnUpdateModalWrapper width="512px" isOpen={!!formData}>
      {/* Header */}
      <header className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <h3 className="font-display text-lg font-bold text-zinc-900">
          {editId ? "Modify Practice Question" : "Add Practice Question"}
        </h3>
        <button
          onClick={onCancel}
          className="transition-300 cursor-pointer rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900"
        >
          <X className="size-5" />
        </button>
      </header>

      {/* Form */}
      {formData && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="mt-6 flex flex-1 flex-col gap-y-5"
        >
          <div>
            <label
              htmlFor="question-category"
              className="mb-2 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
            >
              Category
            </label>
            <select
              id="question-category"
              value={formData.category}
              onChange={(e) =>
                onChange({
                  category: e.target.value as PracticeQuestion["category"],
                })
              }
              required
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 focus:border-zinc-400 focus:outline-none disabled:pointer-events-none"
              disabled={isSubmitting}
            >
              {practiceQuestionCategory.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="question-title"
              className="mb-2 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
            >
              Interview Question
            </label>
            <input
              id="question-title"
              type="text"
              required
              value={formData.question}
              onChange={(e) => onChange({ question: e.target.value })}
              placeholder="e.g. Tell me about a time you had a conflict with a co-worker."
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none disabled:pointer-events-none"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="question-tip"
              className="mb-2 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
            >
              Coaching Tip
            </label>
            <input
              id="question-tip"
              type="text"
              required
              value={formData.tip}
              onChange={(e) => onChange({ tip: e.target.value })}
              placeholder="e.g. Focus on how you resolved the conflict constructively, rather than the dispute itself."
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none disabled:pointer-events-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Model Answer Fields */}
          <main className="space-y-4 border-t border-zinc-200 pt-4">
            <h4 className="text-xs font-bold tracking-wider text-zinc-800 uppercase">
              Model Answer Structuring
            </h4>

            {/* Model Overview */}
            <div>
              <label
                htmlFor="question-overview"
                className="mb-2 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
              >
                Overview (Main Takeaway)
              </label>
              <textarea
                id="question-overview"
                required
                rows={3}
                value={formData.modelAnswer.overview}
                onChange={(e) =>
                  onChange({ modelAnswer: { overview: e.target.value } })
                }
                placeholder="Summarize the core theme or perfect attitude for this answer..."
                className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none disabled:pointer-events-none"
              />
            </div>

            {/* Model General Answer */}
            <div>
              <label
                htmlFor="question-general-answer"
                className="mb-2 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase"
              >
                Suggested Answer Structure (General)
              </label>
              <textarea
                id="question-general-answer"
                rows={6}
                value={formData.modelAnswer.generalAnswer}
                onChange={(e) =>
                  onChange({
                    modelAnswer: {
                      ...formData.modelAnswer,
                      generalAnswer: e.target.value,
                    },
                  })
                }
                placeholder="Detail the ideal response points or structure for general questions..."
                className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none disabled:pointer-events-none"
                disabled={isSubmitting}
              />
            </div>

            {/* Model STAR Method Answer */}
            <main className="space-y-3 rounded-xl border border-orange-100/50 bg-orange-50/20 p-4">
              <span className="block text-[10px] font-bold tracking-widest text-orange-600 uppercase">
                STAR Method Fields
              </span>

              {/* Model Situation */}
              <div>
                <label
                  htmlFor="question-situation"
                  className="mb-1 block text-[9px] font-bold tracking-wider text-orange-700 uppercase"
                >
                  Situation (S)
                </label>
                <textarea
                  id="question-situation"
                  rows={2.5}
                  value={formData.modelAnswer.situation}
                  onChange={(e) =>
                    onChange({
                      modelAnswer: {
                        ...formData.modelAnswer,
                        situation: e.target.value,
                      },
                    })
                  }
                  placeholder="Set the context or challenge..."
                  className="w-full resize-none rounded-xl border border-orange-100 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-orange-300 focus:outline-none disabled:pointer-events-none"
                  disabled={isSubmitting}
                />
              </div>

              {/* Model Task */}
              <div>
                <label
                  htmlFor="question-task"
                  className="mb-1 block text-[9px] font-bold tracking-wider text-blue-700 uppercase"
                >
                  Task (T)
                </label>
                <textarea
                  rows={2}
                  value={formData.modelAnswer.task}
                  onChange={(e) =>
                    onChange({
                      modelAnswer: {
                        ...formData.modelAnswer,
                        task: e.target.value,
                      },
                    })
                  }
                  placeholder="State your exact responsibility..."
                  className="w-full resize-none rounded-xl border border-blue-100 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-blue-300 focus:outline-none disabled:pointer-events-none"
                  disabled={isSubmitting}
                />
              </div>

              {/* Model Action */}
              <div>
                <label
                  htmlFor="question-action"
                  className="mb-1 block text-[9px] font-bold tracking-wider text-purple-700 uppercase"
                >
                  Action (A)
                </label>
                <textarea
                  id="question-action"
                  rows={2}
                  value={formData.modelAnswer.action}
                  onChange={(e) =>
                    onChange({
                      modelAnswer: {
                        ...formData.modelAnswer,
                        action: e.target.value,
                      },
                    })
                  }
                  placeholder="Describe the steps you took..."
                  className="w-full resize-none rounded-xl border border-purple-100 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-purple-300 focus:outline-none disabled:pointer-events-none"
                  disabled={isSubmitting}
                />
              </div>

              {/* Model Result */}
              <div>
                <label
                  htmlFor="question-result"
                  className="mb-1 block text-[9px] font-bold tracking-wider text-emerald-700 uppercase"
                >
                  Result (R)
                </label>
                <textarea
                  id="question-result"
                  rows={2}
                  value={formData.modelAnswer.result}
                  onChange={(e) =>
                    onChange({
                      modelAnswer: {
                        ...formData.modelAnswer,
                        result: e.target.value,
                      },
                    })
                  }
                  placeholder="Share key outputs or quantifiable success..."
                  className="w-full resize-none rounded-xl border border-emerald-100 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-emerald-300 focus:outline-none disabled:pointer-events-none"
                  disabled={isSubmitting}
                />
              </div>
            </main>
          </main>

          <main className="mt-auto flex justify-end gap-3 border-t border-zinc-200 pt-4">
            <button
              onClick={onCancel}
              className="transition-300 cursor-pointer rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-500 hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="bg-accent hover:bg-accent/90 transition-300 flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                "Save Question"
              )}
            </button>
          </main>
        </form>
      )}
    </AddnUpdateModalWrapper>
  );
};
