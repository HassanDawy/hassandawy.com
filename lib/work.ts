import { formatPeriod } from "./format";
import type { FsMeta } from "./fs/types";

// Shared by Preview's WorkHeader and the mobile page's WorkItem.

export interface WorkLink {
  label: string;
  href: string;
}

/** The GitHub repo (if any), then the frontmatter `links`. */
export function workLinks(meta: FsMeta): WorkLink[] {
  return [
    ...(typeof meta.repo === "string" ? [{ label: `GitHub: ${meta.repo}`, href: `https://github.com/${meta.repo}` }] : []),
    ...((meta.links as WorkLink[] | undefined) ?? []),
  ];
}

/** "noon · Jun 2026 – Aug 2026 · UAE" */
export function workKicker(meta: FsMeta): string {
  return [meta.org, formatPeriod(meta.start, meta.end), meta.location].filter(Boolean).join(" · ");
}

/** A frontmatter list as strings (metrics, skills, methods, collaborators). */
export function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}
