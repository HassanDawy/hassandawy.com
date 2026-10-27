"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// Element styles for rendered Markdown: Source Serif body, small-caps section
// headings (the "The problem / What I built" layout), links open in a new tab.
const components: Components = {
  h1: (p) => <h1 className="mt-6 mb-3 font-serif text-[26px] font-semibold" {...p} />,
  h2: (p) => (
    <h2 className="mt-7 mb-2 font-sans text-[12px] font-semibold tracking-[0.08em] text-[#B4540F] uppercase" {...p} />
  ),
  h3: (p) => <h3 className="mt-5 mb-1.5 font-sans text-[14px] font-semibold" {...p} />,
  p: (p) => <p className="my-3" {...p} />,
  ul: (p) => <ul className="my-3 list-disc space-y-1.5 pl-5 marker:text-[#9AA0A8]" {...p} />,
  ol: (p) => <ol className="my-3 list-decimal space-y-1.5 pl-5 marker:text-[#9AA0A8]" {...p} />,
  a: ({ href, ...p }) => (
    <a href={href} target="_blank" rel="noopener" className="text-[#B4540F] underline underline-offset-2" {...p} />
  ),
  strong: (p) => <strong className="font-semibold text-[#1A1D23]" {...p} />,
  blockquote: (p) => <blockquote className="my-4 border-l-2 border-[#D8D5CE] pl-4 text-[#4A4E57]" {...p} />,
  code: (p) => <code className="rounded bg-[#E9E7E2] px-1 py-0.5 font-mono text-[0.85em]" {...p} />,
  pre: (p) => (
    <pre
      className="my-4 overflow-x-auto rounded-lg bg-terminal p-4 font-mono text-[12.5px] leading-relaxed text-terminal-text [&_code]:bg-transparent [&_code]:p-0"
      {...p}
    />
  ),
  hr: () => <hr className="my-6 border-[#E2DFD8]" />,
  // eslint-disable-next-line @next/next/no-img-element -- README images come from arbitrary hosts
  img: ({ alt, ...p }) => <img alt={alt ?? ""} className="my-4 inline-block max-w-full rounded-md" loading="lazy" {...p} />,
  table: (p) => <table className="my-4 w-full border-collapse font-sans text-sm" {...p} />,
  th: (p) => <th className="border-b border-[#D8D5CE] py-1.5 text-left font-semibold" {...p} />,
  td: (p) => <td className="border-b border-[#ECE9E3] py-1.5" {...p} />,
};

export function Markdown({ children }: { children: string }) {
  return (
    <div className="font-serif text-[16px] leading-[1.65] text-[#2A2D33]">
      {/* skipHtml: raw HTML in READMEs is dropped rather than shown as text; rendering it would need a sanitizer. */}
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components} skipHtml>
        {children}
      </ReactMarkdown>
    </div>
  );
}
