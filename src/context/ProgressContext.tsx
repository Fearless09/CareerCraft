"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
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
  const { data: session, status } = useSession();
  const [progress, setProgress] = useState<UserProgress>(initialProgress);
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Hydrate states (Authenticated DB fetch or Unauthenticated localStorage)
  useEffect(() => {
    if (status === "loading") return;

    const hydrate = async () => {
      const localData = getStorageItem<UserProgress>(
        STORAGE_KEY,
        initialProgress,
      );

      if (status === "authenticated") {
        try {
          setIsHydrated(false);
          const res = await fetch("/api/progress");
          if (res.ok) {
            const { progress } = await res.json();
            const cloudData = progress as UserProgress | null;
            if (cloudData) {
              // Found database-stored progress, hydrate
              setProgress({
                ...cloudData,
                lastVisited: new Date().toISOString(),
              });
            } else {
              // No DB progress found. Check if localData holds actual data to migrate
              const isLocalModified =
                localData.resumeCompletedSections.length > 0 ||
                localData.practiceQuestionsAnswered.length > 0 ||
                localData.bookmarkedQuestions.length > 0 ||
                localData.blogArticlesRead.length > 0;

              if (isLocalModified) {
                console.log(
                  "Migrating local learning progress to cloud database...",
                );
                await fetch("/api/progress", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ progressData: localData }),
                });
              }
              setProgress({
                ...localData,
                lastVisited: new Date().toISOString(),
              });
            }
          } else {
            setProgress({
              ...localData,
              lastVisited: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error(
            "Failed to fetch progress from database, falling back to local storage:",
            error,
          );
          setProgress({
            ...localData,
            lastVisited: new Date().toISOString(),
          });
        } finally {
          setIsHydrated(true);
        }
      } else {
        // Unauthenticated -> Use localStorage
        setProgress({
          ...localData,
          lastVisited: new Date().toISOString(),
        });
        setIsHydrated(true);
      }
    };

    hydrate();
  }, [status, session]);

  // 2. Debounced sync to database (if authenticated) and local safety net (always)
  useEffect(() => {
    if (!isHydrated) return;

    const handler = setTimeout(async () => {
      // Always store locally as fallback
      setStorageItem(STORAGE_KEY, progress);

      if (status === "authenticated") {
        try {
          await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ progressData: progress }),
          });
        } catch (error) {
          console.error(
            "Failed to automatically synchronize progress with DB:",
            error,
          );
        }
      }
    }, 1000); // 1000ms debounce to prevent database query overhead

    return () => clearTimeout(handler);
  }, [progress, isHydrated, status]);

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
