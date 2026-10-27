import { follow, resolve } from "@/lib/fs/resolve";
import type { DirNode } from "@/lib/fs/types";
import type { AppId } from "./registry";

export type Launch =
  | { type: "open"; appId: AppId; props: { path: string } }
  | { type: "url"; href: string };

// What opening a path does, shared by Finder, Terminal and the Dock so they
// always agree. Links are followed. Null if the path is missing or unopenable.
export function openPath(tree: DirNode, path: string, cwd?: string): Launch | null {
  const node = resolve(tree, path, cwd);
  const real = node && follow(tree, node);
  if (!real) return null;
  if (real.type === "dir") return { type: "open", appId: "finder", props: { path: real.path } };
  if (typeof real.meta.href === "string") return { type: "url", href: real.meta.href };
  if (real.type === "file" && real.body !== undefined) {
    return { type: "open", appId: "viewer", props: { path: real.path } };
  }
  return null;
}
