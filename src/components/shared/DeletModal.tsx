import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ComponentProps, FC, ReactNode } from "react";

const DeleteModal = ({
  isDeleting,
  onCancel,
  onDelete,
  itemTitle,
  modalTitle,
  Icon,
  cta,
  excerpt,
}: {
  isDeleting: boolean;
  onDelete: () => void;
  onCancel: () => void;
  itemTitle?: string;
  modalTitle: string;
  Icon?: FC<ComponentProps<"svg">>;
  excerpt?: ReactNode;
  cta?: string;
}) => {
  return (
    <section
      className={cn(
        "transition-300 fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 p-4 backdrop-blur-sm",
        { "pointer-events-none opacity-0": !itemTitle && !excerpt },
      )}
      aria-label="delete-modal"
      aria-hidden={!itemTitle && !excerpt}
    >
      <main
        className={cn(
          "transition-300 w-full max-w-sm origin-center rounded-2xl border border-zinc-200 bg-white p-6 shadow-md",
          { "scale-0": !itemTitle && !excerpt },
        )}
        aria-modal="true"
        role="dialog"
      >
        <h3 className="font-display flex items-center gap-2 text-base font-bold text-zinc-900">
          {Icon && <Icon className="size-5 text-red-600" />}
          {modalTitle}
        </h3>

        {(excerpt || itemTitle) && (
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">
            {excerpt ? (
              excerpt
            ) : itemTitle ? (
              <>
                Are you sure you want to remove &ldquo;
                <span className="font-semibold text-zinc-800">{itemTitle}</span>
                &rdquo;? This action is permanent.
              </>
            ) : null}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            disabled={isDeleting}
            onClick={onCancel}
            className="transition-300 cursor-pointer rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-500 hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            disabled={isDeleting}
            onClick={onDelete}
            className="transition-300 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-red-700 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              cta || "Delete Permanently"
            )}
          </button>
        </div>
      </main>
    </section>
  );
};

export default DeleteModal;
