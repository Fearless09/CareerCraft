import { ReactNode } from "react";
import { UIProvider } from "./UIContext";
import { ProgressProvider } from "./ProgressContext";
import { ResumeProvider } from "./ResumeContext";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { SWRConfig } from "swr";

export { useUI } from "./UIContext";
export { useProgress } from "./ProgressContext";
export { useResume } from "./ResumeContext";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
      }}
    >
      <SessionProvider>
        <UIProvider>
          <ProgressProvider>
            <ResumeProvider>{children}</ResumeProvider>
          </ProgressProvider>
        </UIProvider>
      </SessionProvider>
    </SWRConfig>
  );
}
