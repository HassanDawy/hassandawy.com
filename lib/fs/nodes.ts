import type { DirNode, FileNode, FsMeta, FsNode, LinkNode } from "./types";

export function dir(nodePath: string, meta: FsMeta, children: FsNode[]): DirNode {
  return { type: "dir", name: basename(nodePath), path: nodePath, meta, children };
}

export function file(nodePath: string, meta: FsMeta, body?: string): FileNode {
  return { type: "file", name: basename(nodePath), path: nodePath, meta, body };
}

export function link(nodePath: string, target: string, meta: FsMeta): LinkNode {
  return { type: "link", name: basename(nodePath), path: nodePath, meta, target };
}

function basename(nodePath: string) {
  return nodePath.slice(nodePath.lastIndexOf("/") + 1);
}
