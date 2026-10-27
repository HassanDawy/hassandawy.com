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

// Themes first (the cross-project story), then every tag grouped by category.
export function SkillsSidebar({ index, selection, onSelect }: Props) {
  const navRef = useRef<HTMLElement>(null);
  const selectedKey = keyOf(selection);
  const isSelected = (s: Selection) => keyOf(s) === selectedKey;

  // Keep the selected row visible, e.g. after a chip in Preview picks a tag far down the list.
  useEffect(() => {
    navRef.current?.querySelector("[aria-current=\"true\"]")?.scrollIntoView({ block: "nearest" });
  }, [selectedKey]);

  return (
    <nav ref={navRef} aria-label="Skills and themes" className="w-[230px] shrink-0 overflow-y-auto bg-[#EFEDE8] px-2.5 py-3.5 text-xs">
      <Heading>Themes</Heading>
      {index.config.themes.map((theme) => (
        <Row
          key={theme.id}
          label={theme.title}
          count={themeWork(index, theme).length}
          selected={isSelected({ kind: "theme", id: theme.id })}
          onClick={() => onSelect({ kind: "theme", id: theme.id })}
        />
      ))}

      {index.config.categories.map((category) => (
        <div key={category.id} className="mt-4">
          <Heading>{category.title}</Heading>
          {category.tags
            .filter((tag) => index.entries.has(tag))
            .map((tag) => (
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
