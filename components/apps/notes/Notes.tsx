"use client";

import { ArrowUpRight } from "lucide-react";
import { useMemo } from "react";
import { Markdown } from "@/components/content/Markdown";
import { formatDate } from "@/lib/format";
import { useFs } from "@/lib/fs/provider";
import { notesInOrder } from "@/lib/fs/notes";
import { useWindows } from "@/lib/store/windows";
import type { AppProps } from "../types";
import { NoteList } from "./NoteList";

// Notes: the list on the left, the selected note on the right in Source Serif.
// The selection lives in window props (`path`), so `open notes/<file>` from the
// Terminal or Finder switches this window to that note.
export default function Notes({ windowId, props }: AppProps) {
  const tree = useFs();
  const notes = useMemo(() => notesInOrder(tree), [tree]);

  const selected = notes.find((n) => n.path === props.path) ?? notes[0];
  const select = (path: string) => useWindows.getState().setProps(windowId, { path });

  if (!selected) return <p className="p-6 text-sm text-[#5A5E67]">No notes yet.</p>;

  const external = typeof selected.meta.external === "string" ? selected.meta.external : null;

  return (
    <div className="flex h-full bg-[#FBFAF7] text-[#1A1D23]">
      <NoteList notes={notes} selectedPath={selected.path} onSelect={select} />
      <article aria-live="polite" className="min-w-0 flex-1 overflow-y-auto px-9 py-7">
        <p className="text-xs text-[#5A5E67]">
          {[formatDate(selected.meta.date), selected.meta.location].filter(Boolean).join(" · ")}
        </p>
        <h1 className="mt-2 font-serif text-[30px] leading-tight font-semibold">
          {String(selected.meta.title ?? selected.name)}
        </h1>
        {external && (
          <a
            href={external}
            target="_blank"
            rel="noopener"
            className="mt-2 inline-flex items-center gap-0.5 text-[13px] font-semibold text-[#B4540F] hover:underline"
          >
            Read the full post on {new URL(external).hostname.replace(/^www\./, "")}
            <ArrowUpRight size={13} aria-hidden />
          </a>
        )}
        <div className="mt-2">
          <Markdown>{selected.body ?? ""}</Markdown>
        </div>
      </article>
    </div>
  );
}
