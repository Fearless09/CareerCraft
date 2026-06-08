import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const AddnUpdateModalWrapper = ({
  isOpen,
  children,
  width = "448px",
}: {
  isOpen: boolean;
  children: ReactNode;
  width?: string;
}) => {
  return (
    <section
      className={cn(
        "transition-300 fixed inset-0 z-50 flex h-dvh items-center justify-end overflow-clip bg-zinc-900/50 backdrop-blur-sm",
        { "pointer-events-none opacity-0": !isOpen },
      )}
      aria-label="Add and Update Modal"
      aria-hidden={!isOpen}
    >
      <section
        className={cn(
          "transition-300 flex h-dvh w-full origin-right flex-col overflow-y-auto border-l border-zinc-200 bg-white p-8",
          { "scale-x-0": !isOpen },
        )}
        aria-modal="true"
        style={{ maxWidth: width }}
      >
        {children}
      </section>
    </section>
  );
};

export default AddnUpdateModalWrapper;
