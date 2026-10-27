// App registry. Icons and lazily loaded components are added as each app is
// built (TASKS.md 4+); the window manager only needs this metadata.
export type AppId = "terminal" | "finder" | "notes";

export interface AppDef {
  id: AppId;
  title: string;
  defaultSize: { w: number; h: number };
  /** Allow more than one window (Finder can open several folders). */
  multiWindow?: boolean;
}

export const apps: Record<AppId, AppDef> = {
  terminal: { id: "terminal", title: "Terminal", defaultSize: { w: 600, h: 400 } },
  finder: { id: "finder", title: "Finder", defaultSize: { w: 560, h: 380 }, multiWindow: true },
  notes: { id: "notes", title: "Notes", defaultSize: { w: 720, h: 520 } },
};
