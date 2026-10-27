import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { AppId } from "@/lib/apps/registry";
import type { AppProps } from "./types";

// Each app's code loads only when its window first opens.
// Apps still on EmptyApp are replaced as they are built (TASKS.md 6+).
const EmptyApp = dynamic(() => import("./empty/EmptyApp"));
const Terminal = dynamic(() => import("./terminal/Terminal"));
const Finder = dynamic(() => import("./finder/Finder"));
const Viewer = dynamic(() => import("./viewer/Viewer"));
const Skills = dynamic(() => import("./skills/Skills"));

export const appComponents: Record<AppId, ComponentType<AppProps>> = {
  terminal: Terminal,
  finder: Finder,
  notes: EmptyApp,
  skills: Skills,
  viewer: Viewer,
};
