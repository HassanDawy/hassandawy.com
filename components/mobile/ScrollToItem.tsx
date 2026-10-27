"use client";

import { useEffect } from "react";
import { DESKTOP_QUERY } from "@/lib/breakpoints";

// On a phone, a deep link (/projects/<slug>, /notes/<slug>) scrolls to its item,
// which the server already rendered open.
export function ScrollToItem({ id }: { id: string }) {
  useEffect(() => {
    if (window.matchMedia(DESKTOP_QUERY).matches) return;
    document.getElementById(id)?.scrollIntoView();
  }, [id]);
  return null;
}
