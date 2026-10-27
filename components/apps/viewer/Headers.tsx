"use client";

import { ArrowUpRight } from "lucide-react";
import { formatDate, formatPeriod } from "@/lib/format";
import type { FsMeta } from "@/lib/fs/types";
import { slugify, tagsOf } from "@/lib/fs/tags";
import { useWindows } from "@/lib/store/windows";

interface Link {
  label: string;
  href: string;
}

// Header for a project or experience entry: dates, title, summary, key numbers,
// skills and methods, links. Skill chips open that skill's folder.
export function WorkHeader({ meta }: { meta: FsMeta }) {
  const strings = (v: unknown) => (Array.isArray(v) ? v.map(String) : []);
  const links: Link[] = [
    ...(typeof meta.repo === "string" ? [{ label: `GitHub: ${meta.repo}`, href: `https://github.com/${meta.repo}` }] : []),
    ...((meta.links as Link[] | undefined) ?? []),
  ];
  const kicker = [meta.org, formatPeriod(meta.start, meta.end), meta.location].filter(Boolean).join(" · ");

  return (
    <header className="mb-6 border-b border-[#E2DFD8] pb-6">
      <p className="text-xs text-[#5A5E67]">{kicker}</p>
      <h1 className="mt-1.5 font-serif text-[28px] leading-tight font-semibold">{String(meta.title ?? "")}</h1>
      {typeof meta.summary === "string" && <p className="mt-2 text-[15px] text-[#4A4E57]">{meta.summary}</p>}

      {strings(meta.metrics).length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {strings(meta.metrics).map((m) => (
            <li key={m} className="rounded-lg border border-[#E2DFD8] bg-white px-3 py-1.5 text-[13px] font-semibold">
              {m}
            </li>
          ))}
        </ul>
      )}

      <TagRow label="Skills" tags={strings(meta.skills)} filled />
      <TagRow label="Methods" tags={strings(meta.methods)} />

      {strings(meta.collaborators).length > 0 && (
        <p className="mt-3 text-xs text-[#5A5E67]">With {strings(meta.collaborators).join(", ")}</p>
      )}
      {links.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener" className="inline-flex items-center gap-0.5 font-semibold text-[#B4540F] hover:underline">
                {l.label}
                <ArrowUpRight size={13} aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

function TagRow({ label, tags, filled }: { label: string; tags: string[]; filled?: boolean }) {
  const real = new Set(tagsOf(tags));
  if (!tags.length) return null;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      <span className="mr-1 w-16 text-[11px] font-semibold tracking-wide text-[#6B6F78] uppercase">{label}</span>
      {tags.map((tag) =>
        real.has(tag) ? (
          <button
            key={tag}
            type="button"
            onClick={() => useWindows.getState().open("finder", { path: `~/skills/${slugify(tag)}` })}
            className={`rounded-full px-2.5 py-0.5 text-xs ${
              filled ? "bg-[#E9E7E2] hover:bg-[#DDD9D1]" : "border border-[#D8D5CE] hover:bg-[#EFEDE8]"
            }`}
          >
            {tag}
          </button>
        ) : (
          <span key={tag} className="text-xs text-[#9AA0A8]">{tag}</span>
        ),
      )}
    </div>
  );
}

// Header for a note: date and place, title, and a link if it was published elsewhere.
export function NoteHeader({ meta }: { meta: FsMeta }) {
  const external = typeof meta.external === "string" ? meta.external : null;
  return (
    <header className="mb-4">
      <p className="text-xs text-[#5A5E67]">{[formatDate(meta.date), meta.location].filter(Boolean).join(" · ")}</p>
      <h1 className="mt-1.5 font-serif text-[30px] leading-tight font-semibold">{String(meta.title ?? "")}</h1>
      {external && (
        <a href={external} target="_blank" rel="noopener" className="mt-2 inline-flex items-center gap-0.5 text-[13px] font-semibold text-[#B4540F] hover:underline">
          Read the full post on {new URL(external).hostname.replace(/^www\./, "")}
          <ArrowUpRight size={13} aria-hidden />
        </a>
      )}
    </header>
  );
}

// Header for a trash item's WHY_I_STOPPED.md.
export function TrashHeader({ meta }: { meta: FsMeta }) {
  return (
    <header className="mb-4">
      <p className="text-[11px] font-semibold tracking-[0.06em] text-[#6B6F78] uppercase">Why I stopped</p>
      <h1 className="mt-1.5 font-serif text-[26px] font-semibold">{String(meta.title ?? "")}</h1>
      {typeof meta.summary === "string" && <p className="mt-2 text-[15px] text-[#4A4E57]">{meta.summary}</p>}
      {meta.stopped !== undefined && <p className="mt-1 text-xs text-[#5A5E67]">Stopped: {String(meta.stopped)}</p>}
    </header>
  );
}
