"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  MessageSquarePlus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { cn } from "../../lib/utils";
import Link from "next/link";

// ─── Constants ────────────────────────────────────────────────────────────────

type LABEL = {
  value:
    | "feedback"
    | "bug"
    | "feature-request"
    | "improvement"
    | "question"
    | "documentation"
    | "ui/ux";
  display: string;
  color: string;
};
type SubmitStatus = "idle" | "loading" | "success" | "error";

interface FeedbackForm {
  title: string;
  description: string;
  reporter: string;
  label: LABEL["value"];
}

// ─── Component ────────────────────────────────────────────────────────────────

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [form, setForm] = useState<FeedbackForm>(INITIAL_FORM);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [labelDropdownOpen, setLabelDropdownOpen] = useState(false);
  const [issueUrl, setIssueUrl] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const labelDropdownRef = useRef<HTMLDivElement>(null);

  // Focus title input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => titleInputRef.current?.focus(), 80);
    } else {
      // Reset form when modal closes (after animation)
      setTimeout(() => {
        setForm(INITIAL_FORM);
        setStatus("idle");
        setErrorMessage("");
        setIssueUrl(null);
        setLabelDropdownOpen(false);
      }, 300);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Close label dropdown on outside click
  useEffect(() => {
    if (!labelDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        labelDropdownRef.current &&
        !labelDropdownRef.current.contains(e.target as Node)
      ) {
        setLabelDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [labelDropdownOpen]);

  const updateField = useCallback(
    (field: keyof FeedbackForm, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    if (!form.title.trim()) {
      setErrorMessage("Please provide a title for your feedback.");
      return;
    }
    if (!form.description.trim()) {
      setErrorMessage(
        "Please describe your feedback in the description field.",
      );
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          reporter: form.reporter.trim() || undefined,
          label: form.label,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      setIssueUrl(data.issueUrl ?? null);
      setStatus("success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(message);
      setStatus("error");
    }
  }, [form]);

  const selectedLabel = LABELS.find((l) => l.value === form.label) ?? LABELS[0];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <main
        className="animate-fade-in fixed inset-0 z-9998 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal */}
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
        className={cn(
          "animate-fade-in-up fixed inset-x-4 bottom-0 z-9999 mx-auto w-full max-w-sm rounded-t-2xl bg-white shadow-2xl",
          "sm:inset-x-auto sm:right-6 sm:bottom-6 sm:rounded-2xl",
        )}
      >
        {/* Header */}
        <header className="flex items-center justify-between gap-0.5 border-b border-zinc-100 px-5 py-4">
          <span className="bg-accent/10 flex size-8 shrink-0 items-center justify-center rounded-lg">
            <MessageSquarePlus className="text-accent size-4" />
          </span>
          <h2
            id="feedback-modal-title"
            className="font-display text-primary ml-2 flex-1 truncate text-base font-semibold"
          >
            Share Feedback
          </h2>

          <button
            onClick={onClose}
            aria-label="Close feedback form"
            className="transition-300 shrink-0 cursor-pointer rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
          >
            <X className="size-4" />
          </button>
        </header>

        {/* Body */}
        <main className="p-5">
          {/* ── Success State ── */}
          {status === "success" ? (
            <main className="flex flex-col items-center gap-4 py-6 text-center">
              <span className="flex size-14 items-center justify-center rounded-xl bg-emerald-50">
                <CheckCircle2 className="size-8 text-emerald-500" />
              </span>

              <div>
                <p className="font-display text-primary text-lg font-semibold">
                  Thank you for your feedback!
                </p>
                <p className="text-muted mt-1 text-sm">
                  Your submission has been logged as a GitHub issue and will be
                  reviewed by our team.
                </p>
              </div>
              {issueUrl && (
                <Link
                  href={issueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent text-sm font-medium underline-offset-4 hover:underline"
                >
                  View your issue on GitHub →
                </Link>
              )}

              <button
                onClick={onClose}
                className="transition-300 bg-primary hover:bg-primary/90 mt-2 w-full max-w-40 cursor-pointer rounded-xl px-8 py-2.5 text-sm font-semibold text-white"
              >
                Done
              </button>
            </main>
          ) : (
            /* ── Form ── */
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              noValidate
              className="flex flex-col gap-4"
            >
              {/* Label selector */}
              <main ref={labelDropdownRef} className="flex flex-col gap-1.5">
                <label
                  htmlFor="feedback-label-btn"
                  className="text-xs font-semibold tracking-wide text-zinc-500 uppercase"
                >
                  Category
                </label>
                <div className="relative">
                  <button
                    id="feedback-label-btn"
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={labelDropdownOpen}
                    onClick={() => setLabelDropdownOpen((v) => !v)}
                    className={cn(
                      "transition-300 flex w-full cursor-pointer items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-sm font-medium",
                      "hover:border-accent/50 focus-visible:ring-accent/40 focus:outline-none focus-visible:ring-2",
                    )}
                    disabled={status === "loading"}
                  >
                    <span
                      className={cn(
                        "rounded-md px-2 py-1 text-xs font-semibold",
                        selectedLabel.color,
                      )}
                    >
                      {selectedLabel.display}
                    </span>
                    <ChevronDown
                      className={cn("transition-300 size-4 text-zinc-400", {
                        "rotate-180": labelDropdownOpen,
                      })}
                    />
                  </button>

                  {labelDropdownOpen && (
                    <ul
                      role="listbox"
                      aria-label="Feedback category"
                      className="animate-fade-in-up absolute top-full left-0 z-10 mt-1.5 w-full space-y-px overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl"
                    >
                      {LABELS.map((label) => (
                        <li
                          key={label.value}
                          role="option"
                          aria-selected={form.label === label.value}
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              label: label.value,
                            }));
                            setLabelDropdownOpen(false);
                          }}
                          className={cn(
                            "transition-300 flex cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-zinc-100",
                            { "bg-zinc-100": form.label === label.value },
                          )}
                        >
                          <span
                            className={cn(
                              "rounded-md px-2 py-1 text-xs font-semibold",
                              label.color,
                            )}
                          >
                            {label.display}
                          </span>
                          {form.label === label.value && (
                            <CheckCircle2 className="text-accent size-4s" />
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </main>

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="feedback-title"
                  className="text-xs font-semibold tracking-wide text-zinc-500 uppercase"
                >
                  Title <span className="text-accent">*</span>
                </label>
                <input
                  ref={titleInputRef}
                  id="feedback-title"
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Short summary of your feedback"
                  maxLength={120}
                  required
                  className={cn(
                    "transition-300 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm placeholder:text-zinc-400",
                    "focus:border-accent/60 focus-visible:ring-accent/30 focus:bg-white focus:outline-none focus-visible:ring-2",
                  )}
                  disabled={status === "loading"}
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="feedback-description"
                  className="text-xs font-semibold tracking-wide text-zinc-500 uppercase"
                >
                  Description <span className="text-accent">*</span>
                </label>
                <textarea
                  id="feedback-description"
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Describe your feedback, bug, or suggestion in detail…"
                  rows={4}
                  required
                  className={cn(
                    "transition-300 w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm placeholder:text-zinc-400",
                    "focus:border-accent/60 focus-visible:ring-accent/30 focus:bg-white focus:outline-none focus-visible:ring-2",
                  )}
                  disabled={status === "loading"}
                />
              </div>

              {/* Reporter (optional) */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="feedback-reporter"
                  className="flex items-center justify-between gap-2 text-xs font-semibold tracking-wide text-zinc-500 uppercase"
                >
                  Your name or email
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium tracking-normal text-zinc-400 normal-case">
                    Anonymous by default
                  </span>
                </label>
                <input
                  id="feedback-reporter"
                  type="text"
                  value={form.reporter}
                  onChange={(e) => updateField("reporter", e.target.value)}
                  placeholder="e.g. Jane or jane@example.com"
                  maxLength={100}
                  className={cn(
                    "transition-300 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm placeholder:text-zinc-400",
                    "focus:border-accent/60 focus-visible:ring-accent/30 focus:bg-white focus:outline-none focus-visible:ring-2",
                  )}
                  disabled={status === "loading"}
                />
              </div>

              {/* Error message */}
              {(status === "error" || errorMessage) && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-500" />
                  <p className="text-sm text-red-700">
                    {errorMessage || "Something went wrong. Please try again."}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-zinc-200 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="transition-300 cursor-pointer rounded-xl bg-zinc-100 px-5 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-200"
                >
                  Cancel
                </button>

                <button
                  id="feedback-submit-btn"
                  type="submit"
                  disabled={status === "loading"}
                  className={cn(
                    "transition-300 bg-accent flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white",
                    "hover:bg-accent/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60",
                  )}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Feedback"
                  )}
                </button>
              </div>
            </form>
          )}
        </main>
      </section>
    </>
  );
}

const LABELS: LABEL[] = [
  {
    value: "feedback",
    display: "💬 Feedback",
    color: "bg-blue-100 text-blue-700",
  },
  { value: "bug", display: "🐛 Bug Report", color: "bg-red-100 text-red-700" },
  {
    value: "feature-request",
    display: "✨ Feature Request",
    color: "bg-purple-100 text-purple-700",
  },
  {
    value: "improvement",
    display: "🚀 Improvement",
    color: "bg-amber-100 text-amber-700",
  },
  {
    value: "question",
    display: "❓ Question",
    color: "bg-cyan-100 text-cyan-700",
  },
  {
    value: "documentation",
    display: "📄 Documentation",
    color: "bg-slate-200 text-slate-800",
  },
  { value: "ui/ux", display: "🎨 UI / UX", color: "bg-pink-100 text-pink-700" },
];

const INITIAL_FORM: FeedbackForm = {
  title: "",
  description: "",
  reporter: "",
  label: "feedback",
};
