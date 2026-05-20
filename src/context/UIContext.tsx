"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface UIContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toasts: Toast[];
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  dismissToast: (id: string) => void;
  mobilePreviewActive: boolean;
  setMobilePreviewActive: (active: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mobilePreviewActive, setMobilePreviewActive] =
    useState<boolean>(false);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      // Auto-dismiss after 4 seconds
      setTimeout(() => {
        dismissToast(id);
      }, 4000);
    },
    [dismissToast],
  );

  return (
    <UIContext.Provider
      value={{
        activeTab,
        setActiveTab,
        toasts,
        addToast,
        dismissToast,
        mobilePreviewActive,
        setMobilePreviewActive,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}
