import { file } from "./nodes";
import type { DirNode } from "./types";

export interface Readme {
  markdown: string;
  /** Where the README lives in the repo, e.g. "README.md" or "docs/README.md". */
  path: string;
}

export type ReadmeFetcher = (repo: string) => Promise<Readme | null>;

// Adds ~/projects/<slug>/README.md for every project with `repo: owner/name`.
// A failed fetch only means that project has no README.md; Preview then shows
// about.md with the GitHub link. It never throws, so it can't break a build.
export async function attachReadmes(tree: DirNode, fetchReadme: ReadmeFetcher = fetchGithubReadme): Promise<DirNode> {
  const projects = tree.children.find((c) => c.path === "~/projects");
  if (projects?.type !== "dir") return tree;
  await Promise.all(
    projects.children.map(async (project) => {
      const repo = project.meta.repo;
      if (project.type !== "dir" || typeof repo !== "string") return;
      const readme = await fetchReadme(repo).catch(() => null);
      if (!readme) return;
      const meta = { title: `README · ${String(project.meta.title ?? project.name)}`, repo };
      project.children.unshift(file(`${project.path}/README.md`, meta, absolutizeUrls(readme.markdown, repo, readme.path)));
    }),
  );
  return tree;
}

export async function fetchGithubReadme(repo: string): Promise<Readme | null> {
  try {
    const headers: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "hassandawy.com" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(`https://api.github.com/repos/${repo}/readme`, { headers, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const json = (await res.json()) as { content?: string; encoding?: string; path?: string };
    if (json.encoding !== "base64" || !json.content) return null;
    return { markdown: Buffer.from(json.content, "base64").toString("utf8"), path: json.path ?? "README.md" };
  } catch {
    return null;
  }
}

// Relative image and link URLs in a README point into its repo; make them
// absolute so they work on this site. Images use raw.githubusercontent.com,
// links use github.com. "HEAD" is the repo's default branch.
export function absolutizeUrls(markdown: string, repo: string, readmePath: string): string {
  const dir = readmePath.slice(0, readmePath.lastIndexOf("/") + 1);
  const inRepo = (url: string) => new URL(url, `https://repo.invalid/${dir}`).pathname.slice(1);
  const isRelative = (url: string) => !/^([a-z][a-z0-9+.-]*:|#|\/\/)/i.test(url);
  const raw = (url: string) => (isRelative(url) ? `https://raw.githubusercontent.com/${repo}/HEAD/${inRepo(url)}` : url);
  const blob = (url: string) => (isRelative(url) ? `https://github.com/${repo}/blob/HEAD/${inRepo(url)}` : url);

  return markdown
    .replace(/(!\[[^\]]*\]\()([^)\s]+)/g, (_, head: string, url: string) => head + raw(url))
    .replace(/(<img\b[^>]*?\bsrc=["'])([^"']+)/gi, (_, head: string, url: string) => head + raw(url))
    .replace(/((?<!!)\[[^\]]*\]\()([^)\s]+)/g, (_, head: string, url: string) => head + blob(url));
}
