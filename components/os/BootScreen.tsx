"use client";

import { useEffect } from "react";
import { BOOTED_KEY } from "@/lib/boot";

// Shown over the desktop on a first visit: the wordmark and a progress bar,
// 1.2s in total. The animation is CSS only (globals.css), so it plays before
// any JS loads. On repeat visits, a script in the layout's <head> sets
// html[data-booted] before the first paint, and the CSS hides this.
export function BootScreen() {
  useEffect(() => {
    try {
      localStorage.setItem(BOOTED_KEY, "1");
    } catch {
      // Storage blocked (private mode): the boot screen just plays again next time.
    }
  }, []);

  return (
    <div aria-hidden className="boot bg-desktop-grid fixed inset-0 z-[20000] flex flex-col items-center justify-center gap-6">
      <span className="text-[28px] font-bold tracking-wide text-menubar-text">hassan</span>
      <span className="h-1 w-44 overflow-hidden rounded-full bg-white/10">
        <span className="boot-bar block h-full rounded-full bg-accent" />
      </span>
    </div>
  );
}
