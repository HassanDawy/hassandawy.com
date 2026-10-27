"use client";

import { ArrowUpRight } from "lucide-react";
import { formatPeriod } from "@/lib/format";
import type { FsNode } from "@/lib/fs/types";

interface Props {
  node: FsNode;
  /** For a theme: which of its tags this work used. */
  matched?: string[];
  onOpen: () => void;
}

// One project or role: title, where and when, its headline number, and Open.
export function WorkCard({ node, matched, onOpen }: Props) {
  const { meta } = node;
  const metric = Array.isArray(meta.metrics) ? String(meta.metrics[0]) : null;
  const kicker = [meta.org, formatPeriod(meta.start, meta.end)].filter(Boolean).join(" · ");

  return (
    <article className="rounded-xl border border-[#E2DFD8] bg-white px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-serif text-[16px] leading-snug font-semibold">{String(meta.title ?? node.name)}</h3>
          <p className="mt-0.5 text-xs text-[#5A5E67]">{kicker}</p>
        </div>
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Open ${String(meta.title ?? node.name)}`}
          className="flex shrink-0 items-center gap-0.5 rounded-md border border-[#D8D5CE] px-2 py-1 text-xs font-semibold hover:bg-[#EFEDE8]"
        >
          Open
          <ArrowUpRight size={13} aria-hidden />
        </button>
      </div>
      {typeof meta.summary === "string" && <p className="mt-2 text-[13px] leading-relaxed text-[#4A4E57]">{meta.summary}</p>}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {metric && (
          <span className="rounded-md bg-[#FFF3DE] px-2 py-0.5 text-xs font-semibold text-[#8A4B0B]">{metric}</span>
        )}
        {matched?.map((tag) => (
          <span key={tag} className="rounded-full bg-[#E9E7E2] px-2 py-0.5 text-[11px]">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
