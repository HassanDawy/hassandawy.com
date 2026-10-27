import { Folder, NotebookPen, SquareTerminal, type LucideIcon } from "lucide-react";

// App metadata used by the window manager, Dock and MenuBar. The app components
// live in components/apps/index.ts, so importing this never pulls in app code.
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
  /** Window chrome: light (default) or dark like the Terminal. */
  theme?: "light" | "dark";
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
    theme: "dark",
  },
  notes: {
    id: "notes",
    title: "Notes",
    defaultSize: { w: 720, h: 520 },
    icon: NotebookPen,
    tile: { bg: "#F3D46B", fg: "#1A1D23" },
  },
};
