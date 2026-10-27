// App metadata used by the window manager, Dock and MenuBar. The app components
// live in components/apps/index.ts, so importing this never pulls in app code.
export type AppId = "terminal" | "finder" | "notes" | "skills" | "viewer";

export interface AppDef {
  id: AppId;
  title: string;
  defaultSize: { w: number; h: number };
  /** Allow more than one window (Finder can open several folders). Opening a
   *  `path` that is already open still focuses that window. */
  multiWindow?: boolean;
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
  },
  terminal: {
    id: "terminal",
    title: "Terminal",
    defaultSize: { w: 600, h: 400 },
    theme: "dark",
  },
  notes: {
    id: "notes",
    title: "Notes",
    defaultSize: { w: 720, h: 520 },
  },
  skills: {
    id: "skills",
    title: "Skills",
    defaultSize: { w: 780, h: 540 },
  },
  viewer: {
    id: "viewer",
    title: "Preview",
    defaultSize: { w: 680, h: 580 },
    multiWindow: true,
    fileOnly: true,
  },
};

/** Apps a visitor can open by name (Terminal `open <app>`). */
export const namedApps = (Object.keys(apps) as AppId[]).filter((id) => !apps[id].fileOnly);
