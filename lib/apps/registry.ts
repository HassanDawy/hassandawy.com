import { Folder, NotebookPen, SquareTerminal, type LucideIcon } from "lucide-react";

// App registry. Lazily loaded components are added as each app is built
// (TASKS.md 5+); the window manager and Dock only need this metadata.
export type AppId = "terminal" | "finder" | "notes";

export interface AppDef {
  id: AppId;
  title: string;
  defaultSize: { w: number; h: number };
  /** Allow more than one window (Finder can open several folders). */
  multiWindow?: boolean;
  icon: LucideIcon;
  /** Dock tile background and icon colors. */
  tile: { bg: string; fg: string };
}

export const apps: Record<AppId, AppDef> = {
  finder: {
    id: "finder",
    title: "Finder",
    defaultSize: { w: 560, h: 380 },
    multiWindow: true,
    icon: Folder,
    tile: { bg: "#5B8DEF", fg: "#FFFFFF" },
  },
  terminal: {
    id: "terminal",
    title: "Terminal",
    defaultSize: { w: 600, h: 400 },
    icon: SquareTerminal,
    tile: { bg: "#12161D", fg: "#F2A93B" },
  },
  notes: {
    id: "notes",
    title: "Notes",
    defaultSize: { w: 720, h: 520 },
    icon: NotebookPen,
    tile: { bg: "#F3D46B", fg: "#1A1D23" },
  },
};
