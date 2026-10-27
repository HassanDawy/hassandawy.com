import { ArrowUpRight, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { notesInOrder } from "@/lib/fs/notes";
import { resolve } from "@/lib/fs/resolve";
import type { DirNode, FileNode, FsNode } from "@/lib/fs/types";
import type { WorkLink } from "@/lib/work";
import { NoteItem } from "./NoteItem";
import { ScrollToItem } from "./ScrollToItem";
import { WorkItem } from "./WorkItem";

// content/about.json, as stored in the meta of ~/about.json.
interface About {
  name?: string;
  tagline?: string;
  location?: string;
  specSheet?: string[];
  links?: WorkLink[];
}

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "notes", label: "Notes" },
  { id: "contact", label: "Contact" },
];

// Below 768px the desktop is not shown; this plain scrolling page is, built from
// the same tree. It is server-rendered, so it is also the text crawlers read.
// `openPath` (from a deep link) renders that item open and scrolls to it.
export function MobilePage({ tree, openPath }: { tree: DirNode; openPath?: string }) {
  const about = (resolve(tree, "~/about.json")?.meta ?? {}) as About;
  const links = about.links ?? [];
  const projects = filesIn(tree, "~/projects").map(projectAbout).filter((f): f is FileNode => f !== null);
  const experience = filesIn(tree, "~/experience").filter((n): n is FileNode => n.type === "file");
  const notes = notesInOrder(tree);

  return (
    <div className="min-h-dvh bg-window text-[#1A1D23]">
      <nav
        aria-label="Sections"
        className="sticky top-0 z-10 flex h-11 items-center gap-5 overflow-x-auto bg-menubar px-4 text-[13px] whitespace-nowrap text-menubar-text backdrop-blur-md"
      >
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="py-2 hover:text-accent">
            {s.label}
          </a>
        ))}
      </nav>

      <header className="bg-desktop-grid px-4 pt-10 pb-9 text-menubar-text">
        <h1 className="text-[32px] leading-tight font-semibold">{about.name ?? "Hassan Dawy"}</h1>
        {about.tagline && <p className="mt-3 text-[15px] leading-relaxed text-[#B9C0CA]">{about.tagline}</p>}
        {about.location && (
          <p className="mt-3 inline-flex items-center gap-1 text-[13px] text-[#9AA3AF]">
            <MapPin size={14} aria-hidden />
            {about.location}
          </p>
        )}
        <LinkButtons links={links} />
      </header>

      <Section id="about" title="About">
        <ul className="list-disc space-y-1.5 pl-5 text-[15px] marker:text-[#9AA0A8]">
          {(about.specSheet ?? []).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </Section>

      <Section id="projects" title="Projects">
        {projects.map((f) => (
          <WorkItem key={f.path} id={itemId(f.path)} file={f} open={f.path === openPath} />
        ))}
      </Section>

      <Section id="experience" title="Experience">
        {experience.map((f) => (
          <WorkItem key={f.path} id={itemId(f.path)} file={f} open={f.path === openPath} />
        ))}
      </Section>

      <Section id="notes" title="Notes">
        {notes.map((n) => (
          <NoteItem key={n.path} id={itemId(n.path)} note={n} open={n.path === openPath} />
        ))}
      </Section>

      <Section id="contact" title="Resume and contact">
        <ul className="divide-y divide-[#E2DFD8] rounded-lg border border-[#E2DFD8] bg-white">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} {...external(l.href)} className="flex items-center justify-between px-4 py-3 text-[15px]">
                <span className="font-semibold">{l.label}</span>
                <span className="inline-flex items-center gap-1 text-sm text-[#5A5E67]">
                  {l.href.replace(/^mailto:|^https:\/\/(www\.)?/, "")}
                  <ArrowUpRight size={14} aria-hidden />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <footer className="bg-desktop-grid px-4 py-8 text-[13px] text-[#9AA3AF]">
        On a laptop, this site is a desktop you can explore: Terminal, Finder, Notes and more.
      </footer>

      {openPath && <ScrollToItem id={itemId(openPath)} />}
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-11 border-b border-[#E2DFD8] px-4 py-8">
      <h2 id={`${id}-title`} className="mb-2 text-[12px] font-semibold tracking-[0.08em] text-[#B4540F] uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

// about.json links as buttons; Resume gets the accent.
function LinkButtons({ links }: { links: WorkLink[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-2 text-sm">
      {links.map((l) => (
        <li key={l.href}>
          <a
            href={l.href}
            {...external(l.href)}
            className={`inline-flex rounded-md px-3.5 py-2 font-semibold ${
              l.label === "Resume" ? "bg-accent text-[#1A1D23]" : "border border-white/15 bg-white/5"
            }`}
          >
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

// mailto opens the mail app; everything else opens in a new tab.
function external(href: string) {
  return href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener" };
}

function filesIn(tree: DirNode, dirPath: string) {
  const dir = resolve(tree, dirPath);
  return dir?.type === "dir" ? dir.children : [];
}

// A project folder's write-up (about.md); the README stays on the desktop.
function projectAbout(project: FsNode): FileNode | null {
  if (project.type !== "dir") return null;
  const about = project.children.find((c) => c.name === "about.md");
  return about?.type === "file" ? about : null;
}

/** "~/projects/x/about.md" -> "projects-x", "~/notes/y.md" -> "notes-y". */
function itemId(path: string) {
  return path.replace(/^~\//, "").replace(/(\/about)?\.md$/, "").replaceAll("/", "-");
}
