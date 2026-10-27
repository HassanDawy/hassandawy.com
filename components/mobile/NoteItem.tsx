import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Markdown } from "@/components/content/Markdown";
import { firstLine, formatDate } from "@/lib/format";
import type { FileNode } from "@/lib/fs/types";

// One note on the mobile page: date, title and first line; tap to read it all.
export function NoteItem({ id, note, open }: { id: string; note: FileNode; open: boolean }) {
  const { meta } = note;
  const external = typeof meta.external === "string" ? meta.external : null;
  const kicker = [meta.pinned ? "Pinned" : null, formatDate(meta.date), meta.location].filter(Boolean).join(" · ");

  return (
    <details id={id} open={open} className="group scroll-mt-14 border-b border-[#E2DFD8] py-5 last:border-b-0">
      <summary className="flex cursor-pointer list-none gap-3 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-[#5A5E67]">{kicker}</p>
          <h3 className="mt-1 font-serif text-[19px] leading-snug font-semibold">{String(meta.title ?? note.name)}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-[#4A4E57] group-open:hidden">{firstLine(note.body ?? "")}</p>
        </div>
        <ChevronDown
          size={18}
          aria-hidden
          className="mt-6 shrink-0 text-[#9AA0A8] transition-transform group-open:rotate-180"
        />
      </summary>

      <div className="mt-1">
        {external && (
          <a
            href={external}
            target="_blank"
            rel="noopener"
            className="mt-2 inline-flex items-center gap-0.5 text-sm font-semibold text-[#B4540F]"
          >
            Read the full post on {new URL(external).hostname.replace(/^www\./, "")}
            <ArrowUpRight size={14} aria-hidden />
          </a>
        )}
        <Markdown>{note.body ?? ""}</Markdown>
      </div>
    </details>
  );
}
