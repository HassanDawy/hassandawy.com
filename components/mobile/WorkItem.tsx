import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Markdown } from "@/components/content/Markdown";
import type { FileNode } from "@/lib/fs/types";
import { strings, workKicker, workLinks } from "@/lib/work";

// One project or role on the mobile page. The summary row shows what a skimmer
// needs (dates, title, summary, key numbers); tapping it opens the full write-up.
export function WorkItem({ id, file, open }: { id: string; file: FileNode; open: boolean }) {
  const { meta } = file;
  const metrics = strings(meta.metrics);
  const links = workLinks(meta);

  return (
    <details id={id} open={open} className="group scroll-mt-14 border-b border-[#E2DFD8] py-5 last:border-b-0">
      <summary className="flex cursor-pointer list-none gap-3 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-[#5A5E67]">{workKicker(meta)}</p>
          <h3 className="mt-1 text-[17px] leading-snug font-semibold">{String(meta.title ?? file.name)}</h3>
          {typeof meta.summary === "string" && <p className="mt-1.5 text-sm text-[#4A4E57]">{meta.summary}</p>}
          {metrics.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {metrics.map((m) => (
                <li key={m} className="rounded-md border border-[#E2DFD8] bg-white px-2 py-1 text-xs font-semibold">
                  {m}
                </li>
              ))}
            </ul>
          )}
        </div>
        <ChevronDown
          size={18}
          aria-hidden
          className="mt-6 shrink-0 text-[#9AA0A8] transition-transform group-open:rotate-180"
        />
      </summary>

      <div className="mt-4">
        <Tags label="Skills" tags={strings(meta.skills)} />
        <Tags label="Methods" tags={strings(meta.methods)} />
        {strings(meta.collaborators).length > 0 && (
          <p className="mt-2 text-xs text-[#5A5E67]">With {strings(meta.collaborators).join(", ")}</p>
        )}
        {links.length > 0 && (
          <ul className="mt-3 flex flex-col gap-1.5 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener" className="inline-flex items-center gap-0.5 font-semibold text-[#B4540F]">
                  {l.label}
                  <ArrowUpRight size={14} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-2">
          <Markdown>{file.body ?? ""}</Markdown>
        </div>
      </div>
    </details>
  );
}

// Plain chips: the Skills app is desktop-only. Placeholders like "[ADD SKILLS]" stay visible but faded.
function Tags({ label, tags }: { label: string; tags: string[] }) {
  if (!tags.length) return null;
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-[11px] font-semibold tracking-wide text-[#6B6F78] uppercase">{label}</span>
      {tags.map((tag) => (
        <span
          key={tag}
          className={`rounded-full px-2.5 py-0.5 text-xs ${tag.startsWith("[") ? "text-[#9AA0A8]" : "bg-[#E9E7E2]"}`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
