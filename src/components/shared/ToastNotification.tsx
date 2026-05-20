"use client";

import { useUI } from "../../context/UIContext";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "../../lib/utils";

export default function ToastNotification() {
  const { toasts, dismissToast } = useUI();

  if (toasts.length === 0) return null;

  return (
    <div className="no-print pointer-events-none fixed right-6 bottom-6 z-[9999] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const Icon = {
          success: CheckCircle,
          error: AlertCircle,
          info: Info,
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={cn(
              "animate-fade-in-up pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg transition-all duration-300",
              {
                "border-emerald-200 bg-emerald-50 text-emerald-900":
                  toast.type === "success",
                "border-rose-200 bg-rose-50 text-rose-900":
                  toast.type === "error",
                "border-blue-200 bg-blue-50 text-blue-900":
                  toast.type === "info",
              },
            )}
            role="alert"
          >
            <Icon
              className={cn("mt-0.5 h-5 w-5 shrink-0", {
                "text-emerald-600": toast.type === "success",
                "text-rose-600": toast.type === "error",
                "text-blue-600": toast.type === "info",
              })}
            />
            <div className="flex-1 text-sm leading-relaxed font-medium">
              {toast.message}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className={cn(
                "rounded-lg p-0.5 transition-colors duration-150 hover:bg-black/5",
                {
                  "text-emerald-700": toast.type === "success",
                  "text-rose-700": toast.type === "error",
                  "text-blue-700": toast.type === "info",
                },
              )}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
