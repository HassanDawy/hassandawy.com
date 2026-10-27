"use client";

import { useEffect, useRef } from "react";
import type { SkillsIndex } from "@/lib/skills";
import { themeWork } from "@/lib/skills";

export type Selection = { kind: "theme"; id: string } | { kind: "tag"; title: string };

const keyOf = (s: Selection) => (s.kind === "theme" ? `theme:${s.id}` : `tag:${s.title}`);

interface Props {
  index: SkillsIndex;
  selection: Selection;
  onSelect: (selection: Selection) => void;
}

type Tab = "themes" | "skill" | "method";
const TABS: { id: Tab; label: string }[] = [
  { id: "themes", label: "Themes" },
  { id: "skill", label: "Skills" },
  { id: "method", label: "Methods" },
];

// Three tabs: themes (the cross-project story), skills (tools and languages)
// and methods (techniques), each grouped by category. The tab follows the
// selection; clicking a tab selects its first entry.
export function SkillsSidebar({ index, selection, onSelect }: Props) {
  const navRef = useRef<HTMLElement>(null);
  const selectedKey = keyOf(selection);
  const isSelected = (s: Selection) => keyOf(s) === selectedKey;
  const tab: Tab = selection.kind === "theme" ? "themes" : (index.entries.get(selection.title)?.kind ?? "skill");
  const categories = index.config.categories
    .filter((c) => c.kind === tab)
    .map((c) => ({ ...c, tags: c.tags.filter((t) => index.entries.has(t)) }))
    .filter((c) => c.tags.length);

  function openTab(next: Tab) {
    if (next === "themes") {
      const first = index.config.themes[0];
      if (first) onSelect({ kind: "theme", id: first.id });
      return;
    }
    const first = index.config.categories.find((c) => c.kind === next)?.tags.find((t) => index.entries.has(t));
    if (first) onSelect({ kind: "tag", title: first });
  }

  // Keep the selected row visible, e.g. after a chip in Preview picks a tag far down the list.
  useEffect(() => {
    navRef.current?.querySelector("[aria-current=\"true\"]")?.scrollIntoView({ block: "nearest" });
  }, [selectedKey]);

  return (
    <div className="flex w-[230px] shrink-0 flex-col bg-[#EFEDE8]">
      <div role="group" aria-label="Show" className="m-2.5 mb-1 flex rounded-lg bg-black/[0.06] p-0.5 text-xs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={tab === t.id}
            onClick={() => openTab(t.id)}
            className={`flex-1 rounded-md py-1 ${tab === t.id ? "bg-white font-semibold shadow-sm" : "text-[#4A4E57]"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <nav ref={navRef} aria-label={TABS.find((t) => t.id === tab)!.label} className="min-h-0 flex-1 overflow-y-auto px-2.5 pt-2 pb-3.5 text-xs">
        {tab === "themes" &&
          index.config.themes.map((theme) => (
            <Row
              key={theme.id}
              label={theme.title}
              count={themeWork(index, theme).length}
              selected={isSelected({ kind: "theme", id: theme.id })}
              onClick={() => onSelect({ kind: "theme", id: theme.id })}
            />
          ))}

        {categories.map((category, i) => (
          <div key={category.id} className={i ? "mt-4" : ""}>
            <Heading>{category.title}</Heading>
            {category.tags.map((tag) => (
              <Row
                key={tag}
                label={tag}
                count={index.entries.get(tag)!.work.length}
                selected={isSelected({ kind: "tag", title: tag })}
                onClick={() => onSelect({ kind: "tag", title: tag })}
              />
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
}

function Heading({ children }: { children: string }) {
  return <p className="mb-1 px-2 text-[11px] font-semibold text-[#6B6F78]">{children}</p>;
}

function Row({ label, count, selected, onClick }: { label: string; count: number; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={selected ? "true" : undefined}
      className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-1 text-left ${
        selected ? "bg-folder text-white" : "text-[#2A2D33] hover:bg-black/[0.05]"
      }`}
    >
      <span className="truncate">{label}</span>
      <span className={`tabular-nums ${selected ? "text-white/80" : "text-[#9AA0A8]"}`}>{count}</span>
    </button>
  );
}
