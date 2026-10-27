// Checks the real content/ folder, so a malformed Markdown file fails `pnpm test`
// with a clear message instead of breaking a window at runtime.
import { describe, expect, it } from "vitest";
import { buildTree } from "./build-tree";
import { resolve } from "./resolve";
import { tagsOf } from "./tags";
import type { DirNode, FsNode, SkillsConfig } from "./types";

const tree = buildTree();
const children = (path: string) => (resolve(tree, path) as DirNode).children;

const isStringArray = (v: unknown) => Array.isArray(v) && v.every((s) => typeof s === "string");
const MONTH = /^\d{4}-\d{2}$/;

function checkWork(node: FsNode) {
  const { meta } = node;
  expect(typeof meta.title, `${node.path}: title`).toBe("string");
  expect(typeof meta.summary, `${node.path}: summary`).toBe("string");
  expect(meta.start, `${node.path}: start must be "YYYY-MM"`).toMatch(MONTH);
  expect(String(meta.end), `${node.path}: end must be "YYYY-MM" or "present"`).toMatch(
    /^(\d{4}-\d{2}|present)$/,
  );
  expect(isStringArray(meta.skills), `${node.path}: skills must be a list`).toBe(true);
  expect(isStringArray(meta.methods), `${node.path}: methods must be a list`).toBe(true);
  if (meta.repo !== undefined) expect(meta.repo, `${node.path}: repo`).toMatch(/^[\w.-]+\/[\w.-]+$/);
}

describe("content/", () => {
  it("projects have the fields the UI needs", () => {
    children("~/projects").forEach(checkWork);
  });

  it("experience entries have the fields the UI needs", () => {
    children("~/experience").forEach(checkWork);
  });

  it("notes are named YYYY-MM-DD-slug.md and have a title and date", () => {
    for (const note of children("~/notes")) {
      expect(note.name, note.path).toMatch(/^\d{4}-\d{2}-\d{2}-[\w-]+\.md$/);
      expect(typeof note.meta.title, `${note.path}: title`).toBe("string");
      expect(note.meta.date, `${note.path}: date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(note.name.startsWith(String(note.meta.date)), `${note.path}: name matches date`).toBe(true);
      if (note.meta.external !== undefined) {
        expect(note.meta.external, `${note.path}: external`).toMatch(/^https:\/\//);
      }
    }
  });

  it("has at most one pinned note", () => {
    expect(children("~/notes").filter((n) => n.meta.pinned).length).toBeLessThanOrEqual(1);
  });
});

describe("content/skills.json", () => {
  const config = (resolve(tree, "~/skills") as DirNode).meta as unknown as SkillsConfig;
  const kindOf = new Map<string, string>();
  for (const category of config.categories) {
    for (const tag of category.tags) {
      expect(kindOf.has(tag), `"${tag}" is in more than one category`).toBe(false);
      kindOf.set(tag, category.kind);
    }
  }

  it("puts every tag used in content/ in a category of the right kind", () => {
    for (const node of [...children("~/projects"), ...children("~/experience")]) {
      for (const [field, kind] of [["skills", "skill"], ["methods", "method"]] as const) {
        for (const tag of tagsOf(node.meta[field])) {
          expect(kindOf.get(tag), `${node.path}: add "${tag}" to a "${kind}" category in content/skills.json`).toBe(kind);
        }
      }
    }
  });

  it("only uses known tags in themes", () => {
    for (const theme of config.themes) {
      for (const tag of theme.tags) {
        expect(kindOf.has(tag), `theme "${theme.id}": unknown tag "${tag}"`).toBe(true);
      }
    }
  });
});
