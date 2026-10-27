"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { DirNode } from "./types";

// The tree is built on the server (build-tree.ts) and shared with every
// client component through this context.
const FsContext = createContext<DirNode | null>(null);

export function FsProvider({ tree, children }: { tree: DirNode; children: ReactNode }) {
  return <FsContext.Provider value={tree}>{children}</FsContext.Provider>;
}

export function useFs(): DirNode {
  const tree = useContext(FsContext);
  if (!tree) throw new Error("useFs must be used inside <FsProvider>");
  return tree;
}
