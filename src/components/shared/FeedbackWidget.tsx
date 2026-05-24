"use client";

import { useState, useCallback } from "react";
import { MessageSquarePlus } from "lucide-react";
import { cn } from "../../lib/utils";
import FeedbackModal from "./FeedbackModal";
import { usePathname } from "next/navigation";

const BLACKLISTED_URL = ["/generator"];

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  if (BLACKLISTED_URL.includes(pathname)) return;

  return (
    <>
      {/* Floating trigger button — bottom-left to avoid clash with toasts (bottom-right) */}
      <main className="fixed bottom-6 left-6 z-9990">
        <button
          id="feedback-widget-trigger"
          onClick={openModal}
          aria-label="Open feedback form"
          aria-haspopup="dialog"
          className={cn(
            "group transition-300 bg-primary shadow-accent/5 border-accent/10 flex cursor-pointer items-center gap-2 rounded-full border py-2 pr-4 pl-3 text-white shadow-sm",
            "hover:shadow-lg active:scale-95",
            "focus-visible:ring-primary/50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          )}
        >
          <MessageSquarePlus className="transition-300 size-3.75 shrink-0 group-hover:rotate-6" />
          <span className="text-xs font-semibold tracking-wide">Feedback</span>
        </button>
      </main>

      <FeedbackModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
}
