import { formatPeriod } from "@/lib/format";
import { slugify } from "@/lib/fs/tags";
import { findSkill, skillsIndex, themeWork } from "@/lib/skills";
import { fail, text, type Command, type Line } from "./output";

export const skillCommands: Record<string, Command> = {
  skills: {
    usage: "skills",
    help: "what I work with",
    run: (_, { tree }) => {
      const index = skillsIndex(tree);
      const lines: Line[] = [text("Themes", "accent")];
      for (const theme of index.config.themes) {
        const count = themeWork(index, theme).length;
        lines.push([{ text: `  ${theme.title.padEnd(30)}` }, { text: `${count} projects and roles`, tone: "muted" }]);
      }
      for (const [kind, heading] of [["skill", "Skills"], ["method", "Methods"]] as const) {
        lines.push(text(""), text(heading, "accent"));
        for (const category of index.config.categories.filter((c) => c.kind === kind)) {
          const tags = category.tags.filter((t) => index.entries.has(t));
          if (tags.length) lines.push([{ text: `  ${category.title}: `, tone: "muted" }, { text: tags.join(", ") }]);
        }
      }
      lines.push(text(""), [
        { text: "Try ", tone: "muted" },
        { text: "which pytorch", tone: "accent" },
        { text: " or ", tone: "muted" },
        { text: "open skills", tone: "accent" },
      ]);
      return { lines };
    },
  },
  which: {
    usage: "which <skill>",
    help: "where I used a skill",
    run: (args, { tree }) => {
      const query = args.join(" ");
      if (!query) return fail("which: which skill? Try: which pytorch");
      const index = skillsIndex(tree);
      const entry = findSkill(index, query);
      if (!entry) {
        const close = [...index.entries.values()].filter((e) => e.slug.includes(slugify(query))).map((e) => e.title);
        return {
          lines: [
            text(`which: no skill called "${query}". Type skills to see them all.`, "error"),
            ...(close.length ? [text(`Did you mean: ${close.slice(0, 5).join(", ")}?`, "muted")] : []),
          ],
        };
      }
      return {
        lines: [
          text(`${entry.title}, used in ${entry.work.length}:`, "accent"),
          ...entry.work.map((n): Line => [
            { text: `  ${String(n.meta.title ?? n.name)}` },
            { text: `  ${formatPeriod(n.meta.start, n.meta.end)}`, tone: "muted" },
          ]),
        ],
      };
    },
  },
};
