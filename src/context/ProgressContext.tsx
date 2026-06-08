"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { useSession } from "next-auth/react";
import { UserProgress } from "../types/resume";
import { getStorageItem, setStorageItem } from "../lib/localStorage";
import { apiRequest } from "@/lib/utils";
import useSWR from "swr";

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
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    data: res,
    error,
    isLoading,
    mutate,
  } = useSWR<{ progress: UserProgress }, Error>("/api/progress", apiRequest);

  const { status } = useSession();
  const [progress, setProgress] = useState<UserProgress>(initialProgress);
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Hydrate states (Authenticated DB fetch or Unauthenticated localStorage)
  useEffect(() => {
    if (status === "loading" || isLoading) return;

    const hydrate = async () => {
      const localData = getStorageItem<UserProgress>(
        STORAGE_KEY,
        initialProgress,
      );

      if (status === "authenticated") {
        try {
          setIsHydrated(false);

          if (error) {
            const msg =
              error instanceof Error
                ? error.message
                : "Failed to fetch progress from database, falling back to local storage:";

            console.error(msg, error);
            setProgress({
              ...localData,
              lastVisited: new Date().toISOString(),
            });
          } else if (res?.progress) {
            // Found database-stored progress, hydrate
            setProgress({
              ...res.progress,
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
              await apiRequest<{ success: boolean }>("/api/progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ progressData: localData }),
              });
              mutate({ progress: localData }, { revalidate: false });
            }
            setProgress({
              ...localData,
              lastVisited: new Date().toISOString(),
            });
          }
        } catch (error) {
          const msg =
            error instanceof Error ? error.message : "Something went wrong";

          console.error(msg, error);
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
  }, [status, isLoading]);

  // 2. Debounced sync to database (if authenticated) and local safety
  const syncProgress = useCallback(
    (progress: UserProgress) => {
      if (!isHydrated) return;

      // Cancel the previous pending call ✅
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
        const updatedProgress = {
          ...progress,
          lastVisited: new Date().toISOString(),
        };
        setStorageItem(STORAGE_KEY, updatedProgress);

        if (status === "authenticated") {
          try {
            mutate({ progress: updatedProgress }, { revalidate: false });
            await apiRequest<{ success: boolean }>("/api/progress", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ progressData: updatedProgress }),
            });
          } catch (error) {
            console.error("Failed to sync progress:", error);
          }
        }
      }, 1000);
    },
    [isHydrated, status, progress],
  );

  const markSectionComplete = (sectionId: string) => {
    if (progress.resumeCompletedSections.includes(sectionId)) return;

    const updated = {
      ...progress,
      resumeCompletedSections: [...progress.resumeCompletedSections, sectionId],
    };
    setProgress(updated);
    syncProgress(updated);
  };

  const markQuestionAnswered = (questionId: string) => {
    if (progress.practiceQuestionsAnswered.includes(questionId)) return;

    const newProgress = {
      ...progress,
      practiceQuestionsAnswered: [
        ...progress.practiceQuestionsAnswered,
        questionId,
      ],
    };
    setProgress(newProgress);
    syncProgress(newProgress);
  };

  const toggleBookmark = (questionId: string) => {
    const isBookmarked = progress.bookmarkedQuestions.includes(questionId);
    const updated = {
      ...progress,
      bookmarkedQuestions: isBookmarked
        ? progress.bookmarkedQuestions.filter((id) => id !== questionId)
        : [...progress.bookmarkedQuestions, questionId],
    };

    setProgress(updated);
    syncProgress(updated);
  };

  const markArticleRead = (slug: string) => {
    if (progress.blogArticlesRead.includes(slug)) return;

    const newProgress = {
      ...progress,
      blogArticlesRead: [...progress.blogArticlesRead, slug],
    };
    setProgress(newProgress);
    syncProgress(newProgress);
  };

  const resetPracticeProgress = async (categoryQuestionIds?: string[]) => {
    if (!categoryQuestionIds) {
      const newProgress = {
        ...progress,
        practiceQuestionsAnswered: [],
        bookmarkedQuestions: [],
      };
      setProgress(newProgress);
      syncProgress(newProgress);
      return;
    }

    if (
      categoryQuestionIds.length === 0 &&
      progress.bookmarkedQuestions.length === 0 &&
      progress.practiceQuestionsAnswered.length === 0
    ) {
      return;
    }

    const newProgress = {
      ...progress,
      practiceQuestionsAnswered: progress.practiceQuestionsAnswered.filter(
        (id) => !categoryQuestionIds.includes(id),
      ),
      bookmarkedQuestions: progress.bookmarkedQuestions.filter(
        (id) => !categoryQuestionIds.includes(id),
      ),
    };

    setProgress(newProgress);
    syncProgress(newProgress);
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
