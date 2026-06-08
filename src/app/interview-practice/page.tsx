"use client";

import { useMemo, useState } from "react";
import { useProgress } from "../../context/ProgressContext";
import { useUI } from "../../context/UIContext";
import {
  Star,
  Eye,
  EyeOff,
  CheckCircle,
  RotateCcw,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { apiRequest, cn } from "../../lib/utils";
import useSWR from "swr";
import { PracticeQuestion } from "@/db/schema";
import { Loader } from "@/components/shared/Loader";

export default function InterviewPracticePage() {
  const { data, isLoading } = useSWR<{
    practiceQuestions: PracticeQuestion[];
  }>("/api/practice", apiRequest);
  const practiceQuestions = data?.practiceQuestions || [];
  const categories: ("All" | PracticeQuestion["category"] | "Bookmarked")[] = [
    "All",
    ...new Set(practiceQuestions.map((q) => q.category)),
    "Bookmarked",
  ];

  const {
    progress,
    markQuestionAnswered,
    toggleBookmark,
    resetPracticeProgress,
  } = useProgress();
  const { addToast } = useUI();
  const [selectedCategory, setSelectedCategory] = useState<
    "All" | PracticeQuestion["category"] | "Bookmarked"
  >("All");
  const [revealedAnswers, setRevealedAnswers] = useState<
    Record<string, boolean>
  >({});

  const filteredQuestions = practiceQuestions.filter((q) => {
    if (selectedCategory === "Bookmarked") {
      return progress.bookmarkedQuestions.includes(q.id);
    }
    if (selectedCategory === "All") return true;
    return q.category === selectedCategory;
  });

  const toggleReveal = (id: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMarkAnswered = (id: string) => {
    markQuestionAnswered(id);
    addToast("Question marked as practiced!", "success");
  };

  const handleToggleBookmark = (id: string) => {
    toggleBookmark(id);
    const isBookmarked = progress.bookmarkedQuestions.includes(id);
    addToast(
      isBookmarked ? "Bookmark removed" : "Question bookmarked!",
      "info",
    );
  };

  const handleReset = () => {
    const idsToReset =
      selectedCategory === "All" || selectedCategory === "Bookmarked"
        ? undefined
        : practiceQuestions
            .filter((q) => q.category === selectedCategory)
            .map((q) => q.id);

    resetPracticeProgress(idsToReset);
    addToast("Practice progress reset successfully!", "info");
  };

  // Progress Calculation
  const totalCount: number = useMemo(() => {
    if (selectedCategory === "Bookmarked") {
      return progress.bookmarkedQuestions.length;
    } else if (selectedCategory === "All") {
      return practiceQuestions.length;
    } else {
      return practiceQuestions.filter((q) => q.category === selectedCategory)
        .length;
    }
  }, [selectedCategory, progress, practiceQuestions]);

  const answeredInScope: number = useMemo(() => {
    if (selectedCategory === "Bookmarked") {
      return progress.bookmarkedQuestions.filter((id) =>
        progress.practiceQuestionsAnswered.includes(id),
      ).length;
    } else if (selectedCategory === "All") {
      return progress.practiceQuestionsAnswered.length;
    } else {
      return practiceQuestions.filter(
        (q) =>
          q.category === selectedCategory &&
          progress.practiceQuestionsAnswered.includes(q.id),
      ).length;
    }
  }, [selectedCategory, progress, practiceQuestions]);

  const progressPercent =
    totalCount > 0 ? (answeredInScope / totalCount) * 100 : 0;

  return (
    <section className="wrapper max-w-5xl flex-1 py-12 md:py-16">
      {/* Header */}
      <header id="header" className="mx-auto mb-12 max-w-2xl text-center">
        <span className="bg-accent/10 border-accent/10 text-accent mb-4 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm">
          <HelpCircle className="size-3.75 animate-pulse" />
          Interactive Trainer
        </span>

        <h1 className="font-display text-primary mb-4 text-3xl leading-tight font-extrabold sm:text-4xl">
          STAR Interview Q&A Flashcards
        </h1>
        <p className="text-base leading-relaxed text-zinc-500">
          Drill common and tough interview questions. Study structurally indexed
          STAR replies, bookmark key flashcards, and track your overall practice
          progress.
        </p>
      </header>

      {/* Categories Tab navigation */}
      <main
        id="categories"
        className="mb-8 flex flex-wrap items-center justify-center gap-2"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              if (cat === selectedCategory) return;
              setSelectedCategory(cat);
            }}
            className={cn(
              "transition-300 cursor-pointer rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100",
              {
                "bg-primary border-primary hover:bg-primary/90 hover:border-primary text-white shadow-sm":
                  cat === selectedCategory,
              },
            )}
          >
            {cat}
          </button>
        ))}
      </main>

      {/* Progress & Control Card */}
      <main
        id="progress-card"
        className="mb-10 flex flex-col items-center justify-between gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow sm:flex-row"
      >
        <div className="w-full sm:w-2/3">
          <div className="text-primary mb-2 flex items-center justify-between text-xs font-bold tracking-wider uppercase">
            <span>{selectedCategory} progress</span>
            <span>
              {answeredInScope} / {totalCount} practiced
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 shadow-sm">
            <div
              className="bg-accent transition-300 h-full rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleReset}
          disabled={answeredInScope === 0}
          className={cn(
            "transition-300 flex w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2.5 text-xs font-semibold text-zinc-400 sm:w-auto",
            {
              "cursor-pointer border-zinc-200 bg-zinc-100 text-zinc-600 shadow hover:bg-zinc-200 hover:text-zinc-700":
                answeredInScope > 0,
            },
          )}
        >
          <RotateCcw className="size-3.5" />
          Reset progress
        </button>
      </main>

      {/* Questions Stack */}
      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <Loader length={12} />
          <span className="text-xs font-medium text-zinc-500">
            Loading questions...
          </span>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <main
          id="no-questions-found"
          className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white px-5 py-16 text-center shadow"
        >
          <AlertCircle className="mx-auto mb-4 size-10 text-zinc-300" />
          <h3 className="font-display text-primary mb-2 text-lg font-bold">
            No questions found
          </h3>
          <p className="px-6 text-sm text-zinc-500">
            {selectedCategory === "Bookmarked"
              ? "You haven't bookmarked any interview questions yet. Star some questions to see them here!"
              : "Choose a different filter category to get started."}
          </p>
        </main>
      ) : (
        <section id="questions-stack" className="space-y-6 md:space-y-8">
          {filteredQuestions.map((q) => {
            const isAnswered = progress.practiceQuestionsAnswered.includes(
              q.id,
            );
            const isBookmarked = progress.bookmarkedQuestions.includes(q.id);
            const isRevealed = !!revealedAnswers[q.id];

            return (
              <article
                key={q.id}
                className={cn(
                  "transition-300 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8",
                  { "border-accent/20 bg-zinc-50": isAnswered },
                )}
              >
                {/* Header card meta */}
                <div className="mb-4 flex items-center justify-between gap-4">
                  <span className="rounded-md border border-zinc-200 bg-zinc-100 px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-zinc-600 uppercase">
                    {q.category}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleBookmark(q.id)}
                      className={cn(
                        "transition-300 cursor-pointer rounded-lg border border-zinc-200 bg-white p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600",
                        {
                          "border-amber-200 bg-amber-50 text-amber-500 hover:bg-amber-100 hover:text-amber-500":
                            isBookmarked,
                        },
                      )}
                      aria-label="Bookmark question"
                    >
                      <Star
                        className={cn("size-4", {
                          "fill-amber-500": isBookmarked,
                        })}
                      />
                    </button>

                    <button
                      onClick={() => handleMarkAnswered(q.id)}
                      disabled={isAnswered}
                      className={cn(
                        "transition-300 cursor-pointer rounded-lg border border-zinc-200 bg-white p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600",
                        {
                          "cursor-default border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-600":
                            isAnswered,
                        },
                      )}
                      aria-label="Mark practiced"
                    >
                      <CheckCircle className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Question Prompt */}
                <h3 className="font-display text-primary mb-4 text-lg leading-snug font-bold sm:text-xl">
                  {q.question}
                </h3>

                {/* Quick Hint Card */}
                <div className="font-body mb-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-relaxed text-zinc-500 shadow">
                  <span className="text-primary mb-1 block font-bold">
                    Preparation Hint:
                  </span>
                  {q.tip}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleReveal(q.id)}
                    className={cn(
                      "transition-300 bg-accent hover:bg-accent/90 flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold text-white shadow-sm [&_svg]:size-3.5",
                      {
                        "bg-primary text-white hover:bg-slate-900": isRevealed,
                      },
                    )}
                  >
                    {isRevealed ? (
                      <>
                        <EyeOff />
                        Hide answer
                      </>
                    ) : (
                      <>
                        <Eye />
                        Reveal model answer
                      </>
                    )}
                  </button>

                  {!isAnswered && (
                    <button
                      onClick={() => handleMarkAnswered(q.id)}
                      className="transition-300 cursor-pointer rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-600 shadow-sm hover:bg-zinc-100 hover:text-zinc-700"
                    >
                      Mark as practiced
                    </button>
                  )}
                </div>

                {/* Hidden STAR Answer Container */}
                <div
                  className={cn("transition-300 grid grid-rows-[0fr]", {
                    "grid-rows-[1fr] pt-5": isRevealed,
                  })}
                >
                  <div
                    className={cn(
                      "transition-300 flex flex-col gap-6 overflow-hidden border-zinc-200",
                      { "border-t pt-5": isRevealed },
                    )}
                  >
                    <p className="text-sm leading-relaxed font-semibold text-zinc-600">
                      {q.modelAnswer.overview}
                    </p>

                    {q.modelAnswer.generalAnswer ? (
                      // General prompt answers
                      <div className="font-body rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-sm leading-relaxed text-zinc-600 italic">
                        {q.modelAnswer.generalAnswer}
                      </div>
                    ) : (
                      // Behavioral prompt answers
                      <ul className="font-body space-y-4">
                        <BehavioralAnswer
                          title="S - Situation"
                          answer={q.modelAnswer.situation || ""}
                        />
                        <BehavioralAnswer
                          title="T - Task"
                          answer={q.modelAnswer.task || ""}
                        />
                        <BehavioralAnswer
                          title="A - Action"
                          answer={q.modelAnswer.action || ""}
                        />
                        <BehavioralAnswer
                          title="R - Result"
                          answer={q.modelAnswer.result || ""}
                        />
                      </ul>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </section>
  );
}

const BehavioralAnswer = ({
  title,
  answer,
}: {
  title: string;
  answer: string;
}) => {
  return (
    <li className="grid grid-cols-1 gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-relaxed text-zinc-500 sm:grid-cols-12">
      <span className="text-primary size-fit rounded border border-zinc-300 bg-zinc-200 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase sm:col-span-2">
        {title}
      </span>
      <span
        className={cn("italic sm:col-span-10", {
          "text-primary font-semibold": title.toLowerCase().includes("result"),
        })}
      >
        {answer}
      </span>
    </li>
  );
};
