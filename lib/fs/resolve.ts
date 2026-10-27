import type { DirNode, FsNode } from "./types";

export const HOME = "~";

// Turns any user-typed path into an absolute "~/a/b" path.
// "~" and "/" both mean home; ".." never goes above home.
export function normalize(input: string, cwd: string = HOME): string {
  const trimmed = input.trim();
  const isAbsolute = trimmed === "~" || trimmed.startsWith("~/") || trimmed.startsWith("/");
  const rest = trimmed.startsWith("~") && isAbsolute ? trimmed.slice(1) : trimmed;
  const start = isAbsolute ? [] : splitPath(cwd);

  const parts = [...start];
  for (const part of rest.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part);
  }
  return parts.length ? `${HOME}/${parts.join("/")}` : HOME;
}

// Returns the node at `input` (relative to `cwd`), or null if it does not exist.
export function resolve(root: DirNode, input: string, cwd: string = HOME): FsNode | null {
  let node: FsNode = root;
  for (const name of splitPath(normalize(input, cwd))) {
    if (node.type !== "dir") return null;
    const child: FsNode | undefined = node.children.find((c) => c.name === name);
    if (!child) return null;
    node = child;
  }
  // "about.md/" is not a directory.
  if (input.trim().endsWith("/") && node.type !== "dir") return null;
  return node;
}

// Children of a directory, or the file itself (like `ls file`). Null if missing.
export function list(root: DirNode, input: string = ".", cwd: string = HOME): FsNode[] | null {
  const node = resolve(root, input, cwd);
  if (!node) return null;
  return node.type === "dir" ? node.children : [node];
}

// "~/a/b" -> ["a", "b"]; "~" -> []
function splitPath(absPath: string): string[] {
  return absPath.replace(/^~/, "").split("/").filter(Boolean);
}
