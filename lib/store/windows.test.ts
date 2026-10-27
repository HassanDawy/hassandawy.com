import { beforeEach, describe, expect, it } from "vitest";
import {
  CASCADE_OFFSET,
  CASCADE_ORIGIN,
  focusedWindowId,
  useWindows,
} from "./windows";

const AREA = useWindows.getInitialState().viewport;

const store = () => useWindows.getState();
const win = (id: string) => store().windows.find((w) => w.id === id)!;

beforeEach(() => {
  useWindows.setState(useWindows.getInitialState(), true);
});

describe("open", () => {
  it("opens a window at the cascade origin with the app's default size", () => {
    const id = store().open("terminal");
    expect(win(id)).toMatchObject({
      appId: "terminal",
      ...CASCADE_ORIGIN,
      w: 600,
      h: 400,
      z: 1,
      minimized: false,
      maximized: false,
    });
  });

  it("focuses the existing window for single-window apps and merges props", () => {
    const first = store().open("notes", { slug: "a" });
    store().open("terminal");
    store().minimize(first);

    const again = store().open("notes", { slug: "b" });
    expect(again).toBe(first);
    expect(store().windows).toHaveLength(2);
    expect(win(first)).toMatchObject({ props: { slug: "b" }, minimized: false });
    expect(focusedWindowId(store().windows)).toBe(first);
  });

  it("opens a new window each time for multi-window apps", () => {
    const a = store().open("finder", { path: "~/projects" });
    const b = store().open("finder", { path: "~/notes" });
    expect(a).not.toBe(b);
    expect(store().windows.map((w) => w.props.path)).toEqual(["~/projects", "~/notes"]);
  });

  it("focuses a multi-window app's window that already shows the same path", () => {
    const a = store().open("finder", { path: "~/projects" });
    store().open("finder", { path: "~/notes" });
    expect(store().open("finder", { path: "~/projects" })).toBe(a);
    expect(store().windows).toHaveLength(2);
    expect(focusedWindowId(store().windows)).toBe(a);
    // No path means "a new window", like clicking File > New Window.
    expect(store().open("finder")).not.toBe(a);
  });
});

describe("cascade", () => {
  it("offsets each new window 24px from the frontmost one", () => {
    const a = store().open("finder");
    const b = store().open("finder");
    const c = store().open("terminal");
    expect(win(b).x - win(a).x).toBe(CASCADE_OFFSET);
    expect(win(b).y - win(a).y).toBe(CASCADE_OFFSET);
    expect(win(c)).toMatchObject({ x: win(b).x + CASCADE_OFFSET, y: win(b).y + CASCADE_OFFSET });
  });

  it("cascades from the focused window, not the last opened", () => {
    const a = store().open("finder");
    store().open("finder");
    store().focus(a);
    const c = store().open("finder");
    expect(win(c)).toMatchObject({ x: win(a).x + CASCADE_OFFSET, y: win(a).y + CASCADE_OFFSET });
  });

  it("wraps back to the origin when the next window would leave the viewport", () => {
    store().setViewport(800, 600);
    const ids = Array.from({ length: 12 }, () => store().open("finder"));
    for (const id of ids) {
      const w = win(id);
      expect(w.x + w.w).toBeLessThanOrEqual(800);
      expect(w.y + w.h).toBeLessThanOrEqual(600);
    }
    expect(ids.some((id, i) => i > 0 && win(id).x === CASCADE_ORIGIN.x)).toBe(true);
  });
});

describe("focus and z-order", () => {
  it("sets z to the current max + 1", () => {
    const a = store().open("finder");
    const b = store().open("finder");
    const c = store().open("finder");
    expect([win(a).z, win(b).z, win(c).z]).toEqual([1, 2, 3]);

    store().focus(a);
    expect(win(a).z).toBe(4);
    expect(focusedWindowId(store().windows)).toBe(a);
  });

  it("does nothing when the window is already focused", () => {
    const a = store().open("terminal");
    store().focus(a);
    expect(win(a).z).toBe(1);
  });

  it("restores a minimized window when focused", () => {
    const a = store().open("terminal");
    const b = store().open("finder");
    store().minimize(b);
    expect(focusedWindowId(store().windows)).toBe(a);

    store().focus(b);
    expect(win(b).minimized).toBe(false);
    expect(focusedWindowId(store().windows)).toBe(b);
  });

  it("hands focus to the next window down on close", () => {
    const a = store().open("finder");
    const b = store().open("finder");
    store().close(b);
    expect(store().windows.map((w) => w.id)).toEqual([a]);
    expect(focusedWindowId(store().windows)).toBe(a);
  });

  it("has no focused window when all are minimized or closed", () => {
    const a = store().open("terminal");
    store().minimize(a);
    expect(focusedWindowId(store().windows)).toBeNull();
    store().close(a);
    expect(focusedWindowId(store().windows)).toBeNull();
  });
});

describe("move, resize and maximize", () => {
  it("keeps windows inside the desktop area", () => {
    const a = store().open("terminal");
    store().move(a, -100, 0);
    expect(win(a)).toMatchObject({ x: 0, y: 0 });

    store().move(a, 5000, 5000);
    expect(win(a)).toMatchObject({ x: AREA.w - 600, y: AREA.h - 400 });
  });

  it("clamps size to the viewport and a minimum", () => {
    const a = store().open("terminal");
    store().resize(a, 10, 10);
    expect(win(a)).toMatchObject({ w: 320, h: 200 });

    store().resize(a, 9999, 9999);
    expect(win(a)).toMatchObject({ x: 0, y: 0, w: AREA.w, h: AREA.h });
  });

  it("re-clamps open windows when the viewport shrinks", () => {
    const a = store().open("notes");
    store().move(a, 700, 300);
    store().setViewport(1024, 700);
    const w = win(a);
    expect(w.x + w.w).toBeLessThanOrEqual(1024);
    expect(w.y + w.h).toBeLessThanOrEqual(700);
  });

  it("ignores an empty viewport (a hidden or not yet laid out desktop)", () => {
    const a = store().open("notes");
    const before = win(a);
    store().setViewport(0, 0);
    expect(win(a)).toEqual(before);
    expect(store().viewport.w).toBeGreaterThan(0);
  });

  it("merges props without touching focus or geometry", () => {
    const a = store().open("terminal", { keep: 1 });
    const before = { ...win(a) };
    store().setProps(a, { title: "hassan@portfolio: ~" });
    expect(win(a)).toEqual({ ...before, props: { keep: 1, title: "hassan@portfolio: ~" } });
  });

  it("toggles maximized and keeps the restore size", () => {
    const a = store().open("terminal");
    store().toggleMaximize(a);
    expect(win(a)).toMatchObject({ maximized: true, w: 600, h: 400 });
    store().toggleMaximize(a);
    expect(win(a).maximized).toBe(false);
  });
});
