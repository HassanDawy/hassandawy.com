"use client";

import { useMemo } from "react";
import { useFs } from "@/lib/fs/provider";
import { skillsIndex, themeWork, workFile } from "@/lib/skills";
import { useWindows } from "@/lib/store/windows";
import type { AppProps } from "../types";
import { SkillsSidebar, type Selection } from "./SkillsSidebar";
import { WorkCard } from "./WorkCard";

// Skills: pick a theme or a tag on the left, see every project and role that
// used it on the right. The selection lives in window props (`tag` or `theme`),
// so a skill chip in Preview can retarget this window.
export default function Skills({ windowId, props }: AppProps) {
  const tree = useFs();
  const index = useMemo(() => skillsIndex(tree), [tree]);
  const { categories, themes } = index.config;

  const selection: Selection =
    typeof props.tag === "string" && index.entries.has(props.tag)
      ? { kind: "tag", title: props.tag }
      : { kind: "theme", id: typeof props.theme === "string" ? props.theme : (themes[0]?.id ?? "") };

  function select(next: Selection) {
    useWindows
      .getState()
      .setProps(windowId, next.kind === "tag" ? { tag: next.title, theme: null } : { theme: next.id, tag: null });
  }

  function open(path: string) {
    useWindows.getState().open("viewer", { path });
  }

  const theme = selection.kind === "theme" ? themes.find((t) => t.id === selection.id) : undefined;
  const entry = selection.kind === "tag" ? index.entries.get(selection.title) : undefined;
  const items = theme
    ? themeWork(index, theme)
    : (entry?.work ?? []).map((node) => ({ node, matched: undefined }));
  const categoryTitle = entry && categories.find((c) => c.id === entry.category)?.title;

  return (
    <div className="flex h-full text-[#1A1D23]">
      <SkillsSidebar index={index} selection={selection} onSelect={select} />
      <section aria-live="polite" className="min-w-0 flex-1 overflow-y-auto px-6 py-5">
        <p className="text-[11px] font-semibold tracking-[0.06em] text-[#B4540F] uppercase">
          {theme ? "Theme" : [entry?.kind === "method" ? "Method" : "Skill", categoryTitle].filter(Boolean).join(" · ")}
        </p>
        <h2 className="mt-1 font-serif text-[26px] leading-tight font-semibold">{theme?.title ?? entry?.title ?? ""}</h2>
        {theme && <p className="mt-1.5 text-[14px] text-[#4A4E57]">{theme.description}</p>}
        <p className="mt-1.5 text-xs text-[#5A5E67]">
          Used in {items.length} {items.length === 1 ? "project or role" : "projects and roles"}
        </p>

        <div className="mt-4 flex flex-col gap-3">
          {items.map(({ node, matched }) => (
            <WorkCard key={node.path} node={node} matched={matched} onOpen={() => open(workFile(node))} />
          ))}
        </div>
      </section>
    </div>
  );
}
