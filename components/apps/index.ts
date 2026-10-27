import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { AppId } from "@/lib/apps/registry";
import type { AppProps } from "./types";

// Each app's code loads only when its window first opens.
const Terminal = dynamic(() => import("./terminal/Terminal"));
const Finder = dynamic(() => import("./finder/Finder"));
const Viewer = dynamic(() => import("./viewer/Viewer"));
const Skills = dynamic(() => import("./skills/Skills"));
const Notes = dynamic(() => import("./notes/Notes"));

export const appComponents: Record<AppId, ComponentType<AppProps>> = {
  terminal: Terminal,
  finder: Finder,
  notes: Notes,
  skills: Skills,
  viewer: Viewer,
};
