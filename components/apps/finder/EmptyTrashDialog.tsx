"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

// "Empty Trash" is a joke: it explains why nothing gets deleted and closes.
// Shown inside the Finder window; Esc closes only the dialog, not the window.
export function EmptyTrashDialog({ onClose }: { onClose: () => void }) {
  const okRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    okRef.current?.focus();
  }, []);

  return (
    <div className="absolute inset-0 z-10 flex items-start justify-center bg-black/10 pt-16">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="empty-trash-title"
        aria-describedby="empty-trash-message"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation(); // Keep the window-level Esc from closing Finder.
            onClose();
          }
        }}
        className="flex w-[300px] flex-col items-center gap-2 rounded-xl border border-[#D8D5CE] bg-[#F6F5F2] px-5 pt-5 pb-4 text-center shadow-window"
      >
        <span className="flex size-12 items-center justify-center rounded-xl bg-[#1E2A3D] text-menubar-text">
          <Trash2 size={24} aria-hidden />
        </span>
        <h2 id="empty-trash-title" className="mt-1 text-[13px] font-bold">
          You can&apos;t empty this Trash.
        </h2>
        <p id="empty-trash-message" className="text-xs leading-relaxed text-[#4A4E57]">
          Every project in here taught me something. I&apos;m keeping them for the lessons (and a little for the
          guilt).
        </p>
        <button
          ref={okRef}
          type="button"
          onClick={onClose}
          className="mt-2 w-full rounded-md bg-folder py-1.5 text-xs font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-folder"
        >
          Fair enough
        </button>
      </div>
    </div>
  );
}
