import { follow, resolve } from "@/lib/fs/resolve";
import { slugify } from "@/lib/fs/tags";
import type { DirNode, FsNode, SkillsConfig, SkillTheme } from "@/lib/fs/types";

export interface SkillEntry {
  title: string;
  slug: string;
  kind: "skill" | "method";
  category: string | null;
  /** Projects and experience that used this tag, newest first (links followed). */
  work: FsNode[];
}

export interface SkillsIndex {
  config: SkillsConfig;
  entries: Map<string, SkillEntry>;
}

// Reads ~/skills (built by build-skills.ts) into a lookup the Skills app and
// Terminal share. Keyed by tag title, e.g. "PyTorch".
export function skillsIndex(tree: DirNode): SkillsIndex {
  const dir = resolve(tree, "~/skills");
  const meta = (dir?.meta ?? {}) as Partial<SkillsConfig>;
  const config = { categories: meta.categories ?? [], themes: meta.themes ?? [] };
  const entries = new Map<string, SkillEntry>();
  if (dir?.type === "dir") {
    for (const child of dir.children) {
      if (child.type !== "dir") continue;
      const title = String(child.meta.title ?? child.name);
      entries.set(title, {
        title,
        slug: child.name,
        kind: child.meta.kind === "method" ? "method" : "skill",
        category: typeof child.meta.category === "string" ? child.meta.category : null,
        work: newestFirst(child.children.map((l) => follow(tree, l)).filter((n): n is FsNode => n !== null)),
      });
    }
  }
  return { config, entries };
}

/** Work touched by a theme, with the theme's tags each one used. */
export function themeWork(index: SkillsIndex, theme: SkillTheme): { node: FsNode; matched: string[] }[] {
  const byPath = new Map<string, { node: FsNode; matched: string[] }>();
  for (const tag of theme.tags) {
    for (const node of index.entries.get(tag)?.work ?? []) {
      const hit = byPath.get(node.path) ?? { node, matched: [] };
      hit.matched.push(tag);
      byPath.set(node.path, hit);
    }
  }
  return [...byPath.values()].sort((a, b) => compareStart(a.node, b.node));
}

/** Case-insensitive lookup by title or slug: "pytorch", "PyTorch", "hybrid retrieval". */
export function findSkill(index: SkillsIndex, query: string): SkillEntry | undefined {
  const slug = slugify(query);
  return [...index.entries.values()].find((e) => e.slug === slug || e.title.toLowerCase() === query.toLowerCase());
}

/** The file to show for a piece of work: a project folder's about.md, or the experience file. */
export function workFile(node: FsNode): string {
  return node.type === "dir" ? `${node.path}/about.md` : node.path;
}

function newestFirst(nodes: FsNode[]): FsNode[] {
  return [...nodes].sort(compareStart);
}

function compareStart(a: FsNode, b: FsNode): number {
  return String(b.meta.start ?? "").localeCompare(String(a.meta.start ?? ""));
}
