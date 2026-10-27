import type { Metadata } from "next";
import Link from "next/link";
import { MissingPath } from "@/components/os/MissingPath";

export const metadata: Metadata = { title: "Page not found" };

// 404: a Terminal window that failed to `cd` to the requested path.
export default function NotFound() {
  return (
    <main className="bg-desktop-grid flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-[560px] overflow-hidden rounded-window bg-terminal shadow-window">
        <div className="flex h-10 items-center gap-2 bg-terminal-titlebar px-4">
          <span aria-hidden className="size-3 rounded-full bg-light-close" />
          <span aria-hidden className="size-3 rounded-full bg-light-minimize" />
          <span aria-hidden className="size-3 rounded-full bg-light-maximize" />
          <span className="ml-3 text-[13px] text-[#9AA3AF]">hassan@portfolio: ~</span>
        </div>

        <div className="p-5 font-mono text-[13px] leading-relaxed text-terminal-text">
          <p>
            <span className="text-accent">~ $</span> cd <MissingPath />
          </p>
          <p className="text-[#F07B72]">
            cd: no such file or directory: <MissingPath />
          </p>
          <h1 className="mt-5 font-sans text-xl font-semibold text-[#E8EAED]">Page not found</h1>
          <p className="mt-1 font-sans text-sm text-[#9AA3AF]">
            This page doesn&apos;t exist. The link may be old or have a typo.
          </p>

          <nav className="mt-5 flex flex-wrap gap-2 font-sans text-sm">
            <Link href="/" className="rounded-md bg-accent px-3.5 py-2 font-semibold text-[#1A1D23] hover:brightness-105">
              Open the desktop
            </Link>
            <Link href="/resume" className="rounded-md border border-white/15 bg-white/5 px-3.5 py-2 font-semibold text-[#E8EAED] hover:bg-white/10">
              Resume
            </Link>
          </nav>
        </div>
      </div>
    </main>
  );
}
