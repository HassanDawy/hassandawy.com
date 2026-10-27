import { openPath } from "@/lib/apps/open-path";
import { apps, namedApps, type AppId } from "@/lib/apps/registry";
import { follow, list, normalize, resolve } from "@/lib/fs/resolve";
import type { DirNode, FsNode } from "@/lib/fs/types";
import { fail, text, type Command, type Ctx, type Effect, type Result } from "./output";
import { skillCommands } from "./skill-commands";
import { unwrap } from "./unwrap";

export type { Effect, Line, Result, Segment, Tone } from "./output";

const isDir = (tree: DirNode, node: FsNode) => follow(tree, node)?.type === "dir";

export const COMMANDS: Record<string, Command> = {
  help: {
    usage: "help",
    help: "list commands",
    run: () => ({
      lines: Object.values(COMMANDS).map((c) => [
        { text: `  ${c.usage.padEnd(18)}`, tone: "accent" },
        { text: c.help },
      ]),
    }),
  },
  whoami: {
    usage: "whoami",
    help: "who I am",
    run: (_, { tree }) => {
      const about = resolve(tree, "~/about.json")?.meta ?? {};
      const edu = (about.education ?? {}) as Record<string, string>;
      return {
        lines: [
          text(String(about.name ?? "Hassan Dawy")),
          ...(about.tagline ? [text(String(about.tagline))] : []),
          ...(edu.degree ? [text(`${edu.degree}, ${edu.school} (${edu.graduation})`, "muted")] : []),
          ...(about.location ? [text(String(about.location), "muted")] : []),
        ],
      };
    },
  },
  ls: {
    usage: "ls [path] [-a]",
    help: "list files (-a shows hidden ones)",
    run: (args, { tree, cwd }) => {
      const target = args.find((a) => !a.startsWith("-")) ?? ".";
      const nodes = list(tree, target, cwd);
      if (!nodes) return fail(`ls: ${target}: No such file or directory`);
      const shown = nodes.filter((n) => args.includes("-a") || !n.name.startsWith("."));
      if (!shown.length) return { lines: [] };
      return {
        lines: [
          shown.flatMap((n, i) => [
            ...(i ? [{ text: "   " }] : []),
            isDir(tree, n) ? { text: `${n.name}/`, tone: "dir" as const } : { text: n.name },
          ]),
        ],
      };
    },
  },
  cd: {
    usage: "cd [path]",
    help: "change directory",
    run: (args, { tree, cwd }) => {
      const target = args[0] ?? "~";
      const node = resolve(tree, target, cwd);
      if (!node || !follow(tree, node)) return fail(`cd: no such file or directory: ${target}`);
      if (!isDir(tree, node)) return fail(`cd: not a directory: ${target}`);
      return { lines: [], cwd: normalize(target, cwd) };
    },
  },
  pwd: {
    usage: "pwd",
    help: "print the current directory",
    run: (_, { cwd }) => ({ lines: [text(cwd)] }),
  },
  cat: {
    usage: "cat <file>",
    help: "print a file",
    run: (args, { tree, cwd }) => {
      const target = args[0];
      if (!target) return fail("cat: which file? Try: cat about.json");
      const node = resolve(tree, target, cwd);
      const real = node && follow(tree, node);
      if (!real) return fail(`cat: ${target}: No such file or directory`);
      if (real.type === "dir") return fail(`cat: ${target}: Is a directory`);
      if (real.type !== "file" || real.body === undefined) {
        return fail(`cat: ${target}: can't print this one. Try: open ${target}`);
      }
      return { lines: unwrap(real.body).map((l) => text(l)) };
    },
  },
  open: {
    usage: "open <app|path>",
    help: "open an app, folder or file",
    run: (args, { tree, cwd }) => {
      const target = args[0];
      if (!target) return fail("open: what should I open? Try: open finder, open notes");
      const appId = findApp(target);
      if (appId) return opening(apps[appId].title, { type: "open", appId });

      const launch = openPath(tree, target, cwd);
      if (!launch) return fail(`open: ${target}: no such app, file or directory`);
      return opening(target.replace(/\/+$/, "").split("/").pop() || target, launch);
    },
  },
  resume: {
    usage: "resume",
    help: "open my resume (PDF)",
    run: (_, { tree }) => {
      const href = resolve(tree, "~/resume.pdf")?.meta.href;
      if (typeof href !== "string") return fail("resume: not available yet");
      return opening("resume.pdf", { type: "url", href });
    },
  },
  contact: {
    usage: "contact",
    help: "how to reach me",
    run: (_, { tree }) => {
      const links = (resolve(tree, "~/about.json")?.meta.links ?? []) as { label: string; href: string }[];
      return {
        lines: links
          .filter((l) => l.label !== "Resume")
          .map((l) => [
            { text: `  ${l.label.padEnd(10)}`, tone: "muted" as const },
            { text: l.href.replace(/^mailto:|^https:\/\/(www\.)?/g, ""), href: l.href },
          ]),
      };
    },
  },
  ...skillCommands,
  clear: {
    usage: "clear",
    help: "clear the screen",
    run: () => ({ lines: [], clear: true }),
  },
};

export function runCommand(input: string, ctx: Ctx): Result {
  const [name, ...args] = input.trim().split(/\s+/);
  if (!name) return { lines: [] };
  const command = COMMANDS[name.toLowerCase()];
  if (!command) {
    return {
      lines: [text(`command not found: ${name}`, "error"), text("Type help to see what I can do.", "muted")],
    };
  }
  return command.run(args, ctx);
}

export function findApp(name: string): AppId | undefined {
  const lower = name.toLowerCase();
  return namedApps.find((id) => id === lower);
}

function opening(name: string, effect: Effect): Result {
  return { lines: [text(`Opening ${name}...`, "muted")], effects: [effect] };
}
