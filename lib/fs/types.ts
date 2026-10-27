// Frontmatter (or JSON) attached to a node. Dates are normalized to "YYYY-MM-DD".
export type FsMeta = Record<string, unknown>;

export interface FileNode {
  type: "file";
  name: string;
  /** Visitor-facing path, e.g. "~/notes/2026-10-27-example-note.md". */
  path: string;
  meta: FsMeta;
  body?: string;
}

export interface DirNode {
  type: "dir";
  name: string;
  path: string;
  meta: FsMeta;
  children: FsNode[];
}

export type FsNode = FileNode | DirNode;
