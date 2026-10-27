import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { AppId } from "@/lib/apps/registry";
import type { AppProps } from "./types";

// Each app's code loads only when its window first opens.
// Apps still on EmptyApp are replaced as they are built (TASKS.md 6+).
const EmptyApp = dynamic(() => import("./empty/EmptyApp"));

export const appComponents: Record<AppId, ComponentType<AppProps>> = {
  terminal: EmptyApp,
  finder: EmptyApp,
  notes: EmptyApp,
};
