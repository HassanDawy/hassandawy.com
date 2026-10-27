import { namedApps } from "@/lib/apps/registry";
import { follow, list } from "@/lib/fs/resolve";
import type { DirNode } from "@/lib/fs/types";
import { skillsIndex } from "@/lib/skills";
import { COMMANDS } from "./commands";

interface Candidate {
  name: string;
  /** Added after a unique match: "/" for directories, " " otherwise. */
  suffix: string;
}

export interface Completion {
  value: string;
  /** Shown to the user when the input is ambiguous and can't be extended. */
  options: string[];
}

// Tab completion: command names for the first word, then paths (app names after
// `open`, skill slugs after `which`). Hidden entries only match a "." prefix.
export function complete(input: string, cwd: string, tree: DirNode): Completion {
  const words = input.split(" ");
  const word = words[words.length - 1];

  if (words.length === 1) {
    const names = Object.keys(COMMANDS).filter((c) => c.startsWith(word));
    return finish(input, word, names.map((name) => ({ name, suffix: " " })));
  }

  if (words[0] === "which" && words.length === 2) {
    const slugs = [...skillsIndex(tree).entries.values()].map((e) => e.slug).filter((s) => s.startsWith(word));
    return finish(input, word, slugs.map((name) => ({ name, suffix: " " })));
  }

  const slash = word.lastIndexOf("/");
  const dirPart = word.slice(0, slash + 1);
  const prefix = word.slice(slash + 1);
  let candidates: Candidate[] = (list(tree, dirPart || ".", cwd) ?? [])
    .filter((n) => n.name.startsWith(prefix) && (prefix.startsWith(".") || !n.name.startsWith(".")))
    .map((n) => ({ name: n.name, suffix: follow(tree, n)?.type === "dir" ? "/" : " " }));

  // `open notes` opens the app, not ~/notes, so app names win over same-named paths.
  if (words[0] === "open" && words.length === 2 && !dirPart) {
    const appIds: string[] = namedApps.filter((id) => id.startsWith(prefix));
    candidates = [
      ...candidates.filter((c) => !appIds.includes(c.name)),
      ...appIds.map((name) => ({ name, suffix: " " })),
    ];
  }
  return finish(input, prefix, candidates);
}

function finish(input: string, prefix: string, candidates: Candidate[]): Completion {
  const base = input.slice(0, input.length - prefix.length);
  if (candidates.length === 0) return { value: input, options: [] };
  if (candidates.length === 1) {
    const [only] = candidates;
    return { value: base + only.name + only.suffix, options: [] };
  }
  const names = candidates.map((c) => c.name);
  const common = names.reduce((a, b) => {
    let i = 0;
    while (i < a.length && a[i] === b[i]) i++;
    return a.slice(0, i);
  });
  if (common.length > prefix.length) return { value: base + common, options: [] };
  return { value: input, options: names };
}
