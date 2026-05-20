"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UserProgress } from "../types/resume";
import { getStorageItem, setStorageItem } from "../lib/localStorage";

interface ProgressContextType {
  progress: UserProgress;
  markSectionComplete: (sectionId: string) => void;
  markQuestionAnswered: (questionId: string) => void;
  toggleBookmark: (questionId: string) => void;
  markArticleRead: (slug: string) => void;
  resetPracticeProgress: (categoryQuestionIds?: string[]) => void;
}

const STORAGE_KEY = "cc_user_progress";

const initialProgress: UserProgress = {
  resumeCompletedSections: [],
  practiceQuestionsAnswered: [],
  bookmarkedQuestions: [],
  blogArticlesRead: [],
  lastVisited: new Date().toISOString(),
};

const ProgressContext = createContext<ProgressContextType | undefined>(
  undefined,
);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(initialProgress);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = getStorageItem<UserProgress>(STORAGE_KEY, initialProgress);
    setProgress({
      ...stored,
      lastVisited: new Date().toISOString(),
    });
    setIsHydrated(true);
  }, []);

  // Save to localStorage when progress changes
  useEffect(() => {
    if (isHydrated) {
      setStorageItem(STORAGE_KEY, progress);
    }
  }, [progress, isHydrated]);

  const markSectionComplete = (sectionId: string) => {
    setProgress((prev) => {
      if (prev.resumeCompletedSections.includes(sectionId)) return prev;
      return {
        ...prev,
        resumeCompletedSections: [...prev.resumeCompletedSections, sectionId],
      };
    });
  };

  const markQuestionAnswered = (questionId: string) => {
    setProgress((prev) => {
      if (prev.practiceQuestionsAnswered.includes(questionId)) return prev;
      return {
        ...prev,
        practiceQuestionsAnswered: [
          ...prev.practiceQuestionsAnswered,
          questionId,
        ],
      };
    });
  };

  const toggleBookmark = (questionId: string) => {
    setProgress((prev) => {
      const isBookmarked = prev.bookmarkedQuestions.includes(questionId);
      const updated = isBookmarked
        ? prev.bookmarkedQuestions.filter((id) => id !== questionId)
        : [...prev.bookmarkedQuestions, questionId];
      return {
        ...prev,
        bookmarkedQuestions: updated,
      };
    });
  };

  const markArticleRead = (slug: string) => {
    setProgress((prev) => {
      if (prev.blogArticlesRead.includes(slug)) return prev;
      return {
        ...prev,
        blogArticlesRead: [...prev.blogArticlesRead, slug],
      };
    });
  };

  const resetPracticeProgress = (categoryQuestionIds?: string[]) => {
    setProgress((prev) => {
      if (categoryQuestionIds) {
        // Reset only specified questions
        return {
          ...prev,
          practiceQuestionsAnswered: prev.practiceQuestionsAnswered.filter(
            (id) => !categoryQuestionIds.includes(id),
          ),
          bookmarkedQuestions: prev.bookmarkedQuestions.filter(
            (id) => !categoryQuestionIds.includes(id),
          ),
        };
      }
      return {
        ...prev,
        practiceQuestionsAnswered: [],
        bookmarkedQuestions: [],
      };
    });
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        markSectionComplete,
        markQuestionAnswered,
        toggleBookmark,
        markArticleRead,
        resetPracticeProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
