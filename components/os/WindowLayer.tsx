"use client";

import { AnimatePresence } from "motion/react";
import { useEffect, useRef } from "react";
import { focusedWindowId, useWindows } from "@/lib/store/windows";
import { Window } from "./Window";

// The desktop area below the menu bar. Its own stacking context (`isolate`) keeps
// window z-indexes below the Dock and MenuBar however high they climb.
export function WindowLayer() {
  const windows = useWindows((s) => s.windows);
  const activeId = focusedWindowId(windows);
  const layerRef = useRef<HTMLDivElement>(null);

  // Window coordinates are relative to this layer, so its size is the viewport.
  useEffect(() => {
    const el = layerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() =>
      useWindows.getState().setViewport(el.clientWidth, el.clientHeight),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Esc closes the focused window.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      const { windows, close } = useWindows.getState();
      const id = focusedWindowId(windows);
      if (!id) return;
      e.preventDefault();
      close(id);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div ref={layerRef} className="pointer-events-none absolute inset-x-0 top-menubar bottom-0 isolate">
      <AnimatePresence>
        {windows.map((w) => (
          <Window key={w.id} win={w} active={w.id === activeId} />
        ))}
      </AnimatePresence>
    </div>
  );
}
