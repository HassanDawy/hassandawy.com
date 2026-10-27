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

/** Like a symlink: e.g. ~/skills/pytorch/nyt-connections-solver -> ~/projects/nyt-connections-solver. */
export interface LinkNode {
  type: "link";
  name: string;
  path: string;
  /** Just the target's title, for display; follow the link for the rest. */
  meta: FsMeta;
  target: string;
}

export type FsNode = FileNode | DirNode | LinkNode;

// content/skills.json. Stored as the meta of ~/skills.
export interface SkillCategory {
  id: string;
  title: string;
  kind: "skill" | "method";
  tags: string[];
}

export interface SkillTheme {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export interface SkillsConfig {
  categories: SkillCategory[];
  themes: SkillTheme[];
}
