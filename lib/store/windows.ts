import { create } from "zustand";
import { apps, type AppId } from "@/lib/apps/registry";

// Window coordinates are relative to the desktop area below the menu bar, so
// (0, 0) is just under it and the viewport is that area's size.
export const MENU_BAR_HEIGHT = 30;
export const CASCADE_OFFSET = 24;
export const CASCADE_ORIGIN = { x: 80, y: 40 };
export const MIN_SIZE = { w: 320, h: 200 };

export type WindowProps = Record<string, unknown>;

export interface WindowState {
  id: string;
  appId: AppId;
  props: WindowProps;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
}

interface Viewport {
  w: number;
  h: number;
}

interface WindowStore {
  windows: WindowState[];
  viewport: Viewport;
  nextId: number;
  /** Opens a window (or focuses the existing one) and returns its id. */
  open: (appId: AppId, props?: WindowProps) => string;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  move: (id: string, x: number, y: number) => void;
  resize: (id: string, w: number, h: number) => void;
  /** Desktop area size (below the menu bar); set by the Desktop on mount and resize. */
  setViewport: (w: number, h: number) => void;
}

export const useWindows = create<WindowStore>()((set, get) => ({
  windows: [],
  viewport: { w: 1440, h: 900 - MENU_BAR_HEIGHT },
  nextId: 1,

  open: (appId, props) => {
    const { windows, viewport, nextId } = get();
    const z = maxZ(windows) + 1;

    const existing = apps[appId].multiWindow ? undefined : windows.find((w) => w.appId === appId);
    if (existing) {
      update(set, existing.id, (w) => ({
        ...w,
        props: props ? { ...w.props, ...props } : w.props,
        minimized: false,
        z,
      }));
      return existing.id;
    }

    const { w, h } = apps[appId].defaultSize;
    const top = topWindow(windows);
    let x = top ? top.x + CASCADE_OFFSET : CASCADE_ORIGIN.x;
    let y = top ? top.y + CASCADE_OFFSET : CASCADE_ORIGIN.y;
    if (x + w > viewport.w || y + h > viewport.h) ({ x, y } = CASCADE_ORIGIN);

    const id = `${appId}-${nextId}`;
    const win: WindowState = {
      id,
      appId,
      props: props ?? {},
      ...clampRect({ x, y, w, h }, viewport),
      z,
      minimized: false,
      maximized: false,
    };
    set({ windows: [...windows, win], nextId: nextId + 1 });
    return id;
  },

  close: (id) => set({ windows: get().windows.filter((w) => w.id !== id) }),

  focus: (id) => {
    if (focusedWindowId(get().windows) === id) return;
    const z = maxZ(get().windows) + 1;
    update(set, id, (w) => ({ ...w, z, minimized: false }));
  },

  minimize: (id) => update(set, id, (w) => ({ ...w, minimized: true })),

  toggleMaximize: (id) => update(set, id, (w) => ({ ...w, maximized: !w.maximized })),

  move: (id, x, y) =>
    update(set, id, (w) => ({ ...w, ...clampRect({ x, y, w: w.w, h: w.h }, get().viewport) })),

  resize: (id, w, h) =>
    update(set, id, (win) => ({ ...win, ...clampRect({ x: win.x, y: win.y, w, h }, get().viewport) })),

  setViewport: (w, h) => {
    const viewport = { w, h };
    set({
      viewport,
      windows: get().windows.map((win) => ({ ...win, ...clampRect(win, viewport) })),
    });
  },
}));

/** The topmost visible window, which receives keyboard input (e.g. Esc). */
export function focusedWindowId(windows: WindowState[]): string | null {
  return topWindow(windows)?.id ?? null;
}

function topWindow(windows: WindowState[]): WindowState | undefined {
  return windows
    .filter((w) => !w.minimized)
    .reduce<WindowState | undefined>((top, w) => (!top || w.z > top.z ? w : top), undefined);
}

function maxZ(windows: WindowState[]): number {
  return windows.reduce((max, w) => Math.max(max, w.z), 0);
}

type Rect = Pick<WindowState, "x" | "y" | "w" | "h">;

// Keeps a window fully inside the desktop area.
export function clampRect({ x, y, w, h }: Rect, viewport: Viewport): Rect {
  const width = Math.min(Math.max(w, MIN_SIZE.w), viewport.w);
  const height = Math.min(Math.max(h, MIN_SIZE.h), viewport.h);
  return {
    w: width,
    h: height,
    x: Math.min(Math.max(x, 0), viewport.w - width),
    y: Math.min(Math.max(y, 0), viewport.h - height),
  };
}

function update(
  set: (partial: (state: WindowStore) => Partial<WindowStore>) => void,
  id: string,
  fn: (w: WindowState) => WindowState,
) {
  set((state) => ({ windows: state.windows.map((w) => (w.id === id ? fn(w) : w)) }));
}
