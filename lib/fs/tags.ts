// Skill/method tag helpers, safe to use in the browser (no node:fs).

/** "Hybrid retrieval (BM25 + dense)" -> "hybrid-retrieval-bm25-dense". Used for ~/skills/<slug>. */
export function slugify(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Tags from frontmatter, skipping visible placeholders like "[ADD SKILLS]". */
export function tagsOf(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((t): t is string => typeof t === "string" && !t.startsWith("["));
}
