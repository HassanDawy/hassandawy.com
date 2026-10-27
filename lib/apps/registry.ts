import { FileText, Folder, NotebookPen, SquareTerminal, type LucideIcon } from "lucide-react";

// App metadata used by the window manager, Dock and MenuBar. The app components
// live in components/apps/index.ts, so importing this never pulls in app code.
export type AppId = "terminal" | "finder" | "notes" | "viewer";

export interface AppDef {
  id: AppId;
  title: string;
  defaultSize: { w: number; h: number };
  /** Allow more than one window (Finder can open several folders). Opening a
   *  `path` that is already open still focuses that window. */
  multiWindow?: boolean;
  icon: LucideIcon;
  /** Dock tile background and icon colors. */
  tile: { bg: string; fg: string };
  /** Window chrome: light (default) or dark like the Terminal. */
  theme?: "light" | "dark";
  /** Only opened for a file (never by name, e.g. `open viewer`). */
  fileOnly?: boolean;
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
  viewer: {
    id: "viewer",
    title: "Preview",
    defaultSize: { w: 680, h: 580 },
    multiWindow: true,
    fileOnly: true,
    icon: FileText,
    tile: { bg: "#F6F5F2", fg: "#1A1D23" },
  },
};

/** Apps a visitor can open by name (Terminal `open <app>`). */
export const namedApps = (Object.keys(apps) as AppId[]).filter((id) => !apps[id].fileOnly);
