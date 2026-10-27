import { describe, expect, it } from "vitest";
import { dir, file, link } from "@/lib/fs/nodes";
import { openPath } from "./open-path";

const tree = dir("~", {}, [
  dir("~/projects", {}, [dir("~/projects/a", {}, [file("~/projects/a/about.md", {}, "body")])]),
  dir("~/notes", {}, [file("~/notes/2026-01-01-hi.md", {}, "hello")]),
  dir("~/skills", {}, [dir("~/skills/x", {}, [link("~/skills/x/a", "~/projects/a", {})])]),
  file("~/about.json", {}, "{}"),
  file("~/resume.pdf", { href: "/resume.pdf" }),
  file("~/empty.bin", {}),
]);

describe("openPath", () => {
  it("opens folders in Finder, following links", () => {
    expect(openPath(tree, "~/projects")).toEqual({ type: "open", appId: "finder", props: { path: "~/projects" } });
    expect(openPath(tree, "~/skills/x/a")).toEqual({ type: "open", appId: "finder", props: { path: "~/projects/a" } });
  });

  it("opens text files in Preview, relative to cwd", () => {
    expect(openPath(tree, "about.md", "~/projects/a")).toEqual({
      type: "open",
      appId: "viewer",
      props: { path: "~/projects/a/about.md" },
    });
    expect(openPath(tree, "~/about.json")?.type).toBe("open");
  });

  it("opens notes in Notes", () => {
    expect(openPath(tree, "~/notes/2026-01-01-hi.md")).toEqual({
      type: "open",
      appId: "notes",
      props: { path: "~/notes/2026-01-01-hi.md" },
    });
  });

  it("opens files with an href as a URL", () => {
    expect(openPath(tree, "~/resume.pdf")).toEqual({ type: "url", href: "/resume.pdf" });
  });

  it("returns null for missing or unopenable paths", () => {
    expect(openPath(tree, "~/nope")).toBeNull();
    expect(openPath(tree, "~/empty.bin")).toBeNull();
  });
});
