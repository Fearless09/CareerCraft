import { ReactNode } from "react";
import { UIProvider } from "./UIContext";
import { ProgressProvider } from "./ProgressContext";
import { ResumeProvider } from "./ResumeContext";

export { useUI } from "./UIContext";
export { useProgress } from "./ProgressContext";
export { useResume } from "./ResumeContext";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <UIProvider>
      <ProgressProvider>
        <ResumeProvider>{children}</ResumeProvider>
      </ProgressProvider>
    </UIProvider>
  );
}
