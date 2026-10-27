import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildTree } from "./build-tree";
import { resolve } from "./resolve";
import type { DirNode } from "./types";

let root: string;
let tree: DirNode;

function write(rel: string, text: string) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text);
}

beforeAll(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "fs-tree-"));
  write("content/projects/b.md", "---\ntitle: B\norder: 2\n---\nB body\n");
  write("content/projects/a.md", "---\ntitle: A\norder: 1\n---\nA body\n");
  write("content/notes/2026-01-01-old.md", "---\ntitle: Old\ndate: 2026-01-01\n---\nold");
  write("content/notes/2026-03-01-new.md", "---\ntitle: New\ndate: 2026-03-01\n---\nnew");
  write("content/trash/bot.md", "---\ntitle: Bot\nstopped: 2025-06-01\n---\nWhy");
  write("content/about.json", '{ "name": "Test" }');
  tree = buildTree(root);
});

afterAll(() => fs.rmSync(root, { recursive: true, force: true }));

describe("buildTree", () => {
  it("maps projects to folders with about.md, sorted by order", () => {
    const projects = resolve(tree, "~/projects") as DirNode;
    expect(projects.children.map((c) => c.name)).toEqual(["a", "b"]);
    const about = resolve(tree, "~/projects/a/about.md");
    expect(about).toMatchObject({ type: "file", body: "A body", meta: { title: "A" } });
  });

  it("lists notes newest first with dates as strings", () => {
    const notes = resolve(tree, "~/notes") as DirNode;
    expect(notes.children.map((c) => c.name)).toEqual(["2026-03-01-new.md", "2026-01-01-old.md"]);
    expect(notes.children[0].meta.date).toBe("2026-03-01");
  });

  it("puts trash items under ~/.trash/<slug>/WHY_I_STOPPED.md", () => {
    const why = resolve(tree, "~/.trash/bot/WHY_I_STOPPED.md");
    expect(why).toMatchObject({ body: "Why", meta: { stopped: "2025-06-01" } });
  });

  it("mounts about.json and skips resume.pdf when missing", () => {
    expect(resolve(tree, "~/about.json")?.meta).toEqual({ name: "Test" });
    expect(resolve(tree, "~/resume.pdf")).toBeNull();
  });

  it("does not crash when content/ is empty", () => {
    const empty = fs.mkdtempSync(path.join(os.tmpdir(), "fs-empty-"));
    expect(buildTree(empty).children.map((c) => c.name)).toEqual(["projects", "notes", ".trash"]);
    fs.rmSync(empty, { recursive: true, force: true });
  });
});
