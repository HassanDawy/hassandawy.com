import { resolve } from "./resolve";
import type { DirNode, FileNode } from "./types";

/** ~/notes in display order. The tree is already newest first; the pinned note goes on top. */
export function notesInOrder(tree: DirNode): FileNode[] {
  const dir = resolve(tree, "~/notes");
  const all = dir?.type === "dir" ? dir.children.filter((n): n is FileNode => n.type === "file") : [];
  return [...all.filter((n) => n.meta.pinned), ...all.filter((n) => !n.meta.pinned)];
}
