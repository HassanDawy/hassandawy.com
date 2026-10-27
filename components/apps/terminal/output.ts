import type { AppId } from "@/lib/apps/registry";
import type { DirNode } from "@/lib/fs/types";

// Output types and helpers shared by the Terminal's command files.
export type Tone = "accent" | "muted" | "error" | "dir";
export interface Segment {
  text: string;
  tone?: Tone;
  href?: string;
}
export type Line = Segment[];

/** Side effects the Terminal component applies (it owns the store and window). */
export type Effect =
  | { type: "open"; appId: AppId; props?: Record<string, unknown> }
  | { type: "url"; href: string };

export interface Result {
  lines: Line[];
  cwd?: string;
  clear?: boolean;
  effects?: Effect[];
}

export interface Ctx {
  tree: DirNode;
  cwd: string;
}

export interface Command {
  usage: string;
  help: string;
  run: (args: string[], ctx: Ctx) => Result;
}

export const text = (s: string, tone?: Tone): Line => [{ text: s, tone }];
export const fail = (s: string): Result => ({ lines: [text(s, "error")] });
