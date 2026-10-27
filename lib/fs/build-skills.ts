import fs from "node:fs";
import path from "node:path";
import { dir, link } from "./nodes";
import { slugify, tagsOf } from "./tags";
import type { DirNode, FsNode, SkillsConfig } from "./types";

// Builds ~/skills from the `skills` and `methods` lists in project and
// experience frontmatter. Each tag becomes ~/skills/<slug>/ holding links to
// the work that used it. Categories and themes come from content/skills.json
// and are stored as the meta of ~/skills.
export function buildSkills(contentDir: string, work: FsNode[]): DirNode {
  const config = readConfig(path.join(contentDir, "skills.json"));
  const rank = new Map<string, number>();
  const categoryOf = new Map<string, string>();
  config.categories.forEach((category, c) =>
    category.tags.forEach((tag, t) => {
      rank.set(tag, c * 1000 + t);
      categoryOf.set(tag, category.id);
    }),
  );

  const used = new Map<string, { kind: "skill" | "method"; nodes: FsNode[] }>();
  for (const node of work) {
    for (const [field, kind] of [["skills", "skill"], ["methods", "method"]] as const) {
      for (const tag of tagsOf(node.meta[field])) {
        const entry = used.get(tag) ?? { kind, nodes: [] };
        entry.nodes.push(node);
        used.set(tag, entry);
      }
    }
  }

  const children = [...used]
    .sort(([a], [b]) => (rank.get(a) ?? Infinity) - (rank.get(b) ?? Infinity) || a.localeCompare(b))
    .map(([tag, { kind, nodes }]) => {
      const skillPath = `~/skills/${slugify(tag)}`;
      const meta = { title: tag, kind, category: categoryOf.get(tag) ?? null };
      return dir(
        skillPath,
        meta,
        nodes.map((n) => link(`${skillPath}/${n.name}`, n.path, { title: n.meta.title })),
      );
    });

  return dir("~/skills", { ...config }, children);
}

function readConfig(file: string): SkillsConfig {
  if (!fs.existsSync(file)) return { categories: [], themes: [] };
  return JSON.parse(fs.readFileSync(file, "utf8")) as SkillsConfig;
}
