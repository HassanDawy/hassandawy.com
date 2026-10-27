"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { DESKTOP_QUERY } from "@/lib/breakpoints";
import type { DirNode } from "@/lib/fs/types";
import type { InitialWindow } from "./Desktop";

// The desktop's code (windows, Dock, react-rnd, Motion) loads only on screens
// 768px and wider. Phones get the mobile page and never download it.
const Desktop = dynamic(() => import("./Desktop").then((m) => m.Desktop), { ssr: false });

function subscribe(onChange: () => void) {
  const media = window.matchMedia(DESKTOP_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export function DesktopGate({ tree, initial }: { tree: DirNode; initial?: InitialWindow }) {
  const wide = useSyncExternalStore(subscribe, () => window.matchMedia(DESKTOP_QUERY).matches, () => false);
  return wide ? <Desktop tree={tree} initial={initial} /> : null;
}
