import { resolve } from "./resolve";
import type { DirNode, FsNode } from "./types";

// Deep links: /projects/<slug> and /notes/<slug> map to nodes in the tree.
// Slugs are checked first so "/projects/.." can't resolve to another folder.
const SLUG = /^[\w-]+$/;

export function projectBySlug(tree: DirNode, slug: string): FsNode | null {
  const node = SLUG.test(slug) ? resolve(tree, `~/projects/${slug}`) : null;
  return node?.type === "dir" ? node : null;
}

export function noteBySlug(tree: DirNode, slug: string): FsNode | null {
  const node = SLUG.test(slug) ? resolve(tree, `~/notes/${slug}.md`) : null;
  return node?.type === "file" ? node : null;
}

export function slugsIn(tree: DirNode, dirPath: "~/projects" | "~/notes"): string[] {
  const dir = resolve(tree, dirPath);
  return dir?.type === "dir" ? dir.children.map((n) => n.name.replace(/\.md$/, "")) : [];
}
