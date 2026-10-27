import { describe, expect, it } from "vitest";
import { list, normalize, resolve } from "./resolve";
import type { DirNode } from "./types";

const tree: DirNode = {
  type: "dir",
  name: "~",
  path: "~",
  meta: {},
  children: [
    {
      type: "dir",
      name: "projects",
      path: "~/projects",
      meta: {},
      children: [
        {
          type: "dir",
          name: "demo",
          path: "~/projects/demo",
          meta: {},
          children: [{ type: "file", name: "about.md", path: "~/projects/demo/about.md", meta: {} }],
        },
      ],
    },
    { type: "dir", name: "notes", path: "~/notes", meta: {}, children: [] },
    { type: "file", name: "about.json", path: "~/about.json", meta: {} },
  ],
};

describe("normalize", () => {
  it("treats ~ and / as home", () => {
    expect(normalize("~")).toBe("~");
    expect(normalize("~/")).toBe("~");
    expect(normalize("/")).toBe("~");
    expect(normalize("/projects")).toBe("~/projects");
    expect(normalize("~/projects", "~/notes")).toBe("~/projects");
  });

  it("resolves relative paths against cwd", () => {
    expect(normalize("demo", "~/projects")).toBe("~/projects/demo");
    expect(normalize("", "~/projects")).toBe("~/projects");
  });

  it("handles . and ..", () => {
    expect(normalize(".", "~/projects")).toBe("~/projects");
    expect(normalize("./demo/./about.md", "~/projects")).toBe("~/projects/demo/about.md");
    expect(normalize("..", "~/projects/demo")).toBe("~/projects");
    expect(normalize("../../notes", "~/projects/demo")).toBe("~/notes");
  });

  it("never goes above home", () => {
    expect(normalize("..")).toBe("~");
    expect(normalize("../../..", "~/projects")).toBe("~");
    expect(normalize("/../projects")).toBe("~/projects");
  });

  it("collapses trailing and repeated slashes", () => {
    expect(normalize("projects/")).toBe("~/projects");
    expect(normalize("projects//demo///")).toBe("~/projects/demo");
  });

  it("only treats a bare ~ prefix as home", () => {
    expect(normalize("~demo", "~/projects")).toBe("~/projects/~demo");
  });
});

describe("resolve", () => {
  it("finds dirs and files", () => {
    expect(resolve(tree, "~")?.path).toBe("~");
    expect(resolve(tree, "projects/demo")?.type).toBe("dir");
    expect(resolve(tree, "about.md", "~/projects/demo")?.path).toBe("~/projects/demo/about.md");
    expect(resolve(tree, "../about.json", "~/notes")?.path).toBe("~/about.json");
  });

  it("returns null for missing paths", () => {
    expect(resolve(tree, "nope")).toBeNull();
    expect(resolve(tree, "about.json/inside")).toBeNull();
  });

  it("accepts a trailing slash on dirs but not on files", () => {
    expect(resolve(tree, "projects/")?.path).toBe("~/projects");
    expect(resolve(tree, "about.json/")).toBeNull();
  });
});

describe("list", () => {
  it("lists a directory's children", () => {
    expect(list(tree)?.map((n) => n.name)).toEqual(["projects", "notes", "about.json"]);
    expect(list(tree, ".", "~/projects")?.map((n) => n.name)).toEqual(["demo"]);
  });

  it("lists a file as itself", () => {
    expect(list(tree, "about.json")?.map((n) => n.path)).toEqual(["~/about.json"]);
  });

  it("returns null for missing paths", () => {
    expect(list(tree, "missing/")).toBeNull();
  });
});
