import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { DirNode, FileNode, FsMeta, FsNode } from "./types";

// Reads content/ at build time and returns the visitor-facing tree:
//   ~/projects/<slug>/about.md
//   ~/experience/<slug>.md
//   ~/notes/<date-slug>.md
//   ~/.trash/<slug>/WHY_I_STOPPED.md
//   ~/about.json
//   ~/resume.pdf (only if public/resume.pdf exists)
// Uses sync fs on purpose: Next prerenders sync reads into the static shell.
export function buildTree(rootDir = process.cwd()): DirNode {
  const contentDir = path.join(rootDir, "content");
  const children: FsNode[] = [
    dir("~/projects", {}, buildProjects(contentDir)),
    dir("~/experience", {}, buildExperience(contentDir)),
    dir("~/notes", {}, buildNotes(contentDir)),
    dir("~/.trash", {}, buildTrash(contentDir)),
  ];

  const aboutFile = path.join(contentDir, "about.json");
  if (fs.existsSync(aboutFile)) {
    const raw = fs.readFileSync(aboutFile, "utf8");
    children.push(file("~/about.json", JSON.parse(raw) as FsMeta, raw.trim()));
  }

  if (fs.existsSync(path.join(rootDir, "public", "resume.pdf"))) {
    children.push(file("~/resume.pdf", { href: "/resume.pdf" }));
  }

  return dir("~", {}, children);
}

function buildProjects(contentDir: string): DirNode[] {
  return readMarkdown(path.join(contentDir, "projects"))
    .map(({ slug, meta, body }) =>
      dir(`~/projects/${slug}`, meta, [file(`~/projects/${slug}/about.md`, meta, body)]),
    )
    .sort(byOrderThenNewest);
}

function buildExperience(contentDir: string): FileNode[] {
  return readMarkdown(path.join(contentDir, "experience"))
    .map(({ slug, meta, body }) => file(`~/experience/${slug}.md`, meta, body))
    .sort(byOrderThenNewest);
}

// Optional `order` wins; otherwise newest `start` ("YYYY-MM") first.
function byOrderThenNewest(a: FsNode, b: FsNode) {
  const order = Number(a.meta.order ?? Infinity) - Number(b.meta.order ?? Infinity);
  return order || String(b.meta.start ?? "").localeCompare(String(a.meta.start ?? ""));
}

function buildNotes(contentDir: string): FileNode[] {
  return readMarkdown(path.join(contentDir, "notes"))
    .map(({ slug, meta, body }) => file(`~/notes/${slug}.md`, meta, body))
    .sort((a, b) => String(b.meta.date ?? b.name).localeCompare(String(a.meta.date ?? a.name)));
}

function buildTrash(contentDir: string): DirNode[] {
  return readMarkdown(path.join(contentDir, "trash")).map(({ slug, meta, body }) =>
    dir(`~/.trash/${slug}`, meta, [file(`~/.trash/${slug}/WHY_I_STOPPED.md`, meta, body)]),
  );
}

function readMarkdown(dirPath: string) {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((name) => name.endsWith(".md"))
    .sort()
    .map((name) => {
      const { data, content } = matter(fs.readFileSync(path.join(dirPath, name), "utf8"));
      return { slug: name.slice(0, -3), meta: normalizeMeta(data), body: content.trim() };
    });
}

// YAML dates parse to Date objects; keep plain strings so the tree serializes cleanly.
function normalizeMeta(data: Record<string, unknown>): FsMeta {
  const meta: FsMeta = {};
  for (const [key, value] of Object.entries(data)) {
    meta[key] = value instanceof Date ? value.toISOString().slice(0, 10) : value;
  }
  return meta;
}

function dir(nodePath: string, meta: FsMeta, children: FsNode[]): DirNode {
  return { type: "dir", name: basename(nodePath), path: nodePath, meta, children };
}

function file(nodePath: string, meta: FsMeta, body?: string): FileNode {
  return { type: "file", name: basename(nodePath), path: nodePath, meta, body };
}

function basename(nodePath: string) {
  return nodePath.slice(nodePath.lastIndexOf("/") + 1);
}
