import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Resume",
  description: "Hassan Dawy's resume (PDF).",
  path: "/resume",
});

// A plain page for people in a hurry: no desktop, just the PDF.
export default function ResumePage() {
  return (
    <main className="min-h-dvh bg-window text-[#1A1D23]">
      <div className="mx-auto flex max-w-4xl flex-col gap-5 px-4 py-8">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl font-semibold">Hassan Dawy</h1>
            <p className="mt-1 text-sm text-[#5A5E67]">Resume</p>
          </div>
          <nav className="flex gap-2 text-sm">
            <a
              href="/resume.pdf"
              download="Hassan_Dawy_Resume.pdf"
              className="rounded-md bg-accent px-3.5 py-2 font-semibold text-[#1A1D23] hover:brightness-105"
            >
              Download PDF
            </a>
            <Link href="/" className="rounded-md border border-[#CFCBC3] bg-white px-3.5 py-2 hover:bg-[#EFEDE8]">
              Open the desktop
            </Link>
          </nav>
        </header>

        <object
          data="/resume.pdf"
          type="application/pdf"
          aria-label="Hassan Dawy's resume"
          className="h-[80dvh] w-full rounded-lg border border-[#D8D5CE] bg-white"
        >
          <p className="p-6 text-sm">
            Your browser can&apos;t show the PDF here.{" "}
            <a href="/resume.pdf" className="font-semibold text-[#B4540F] underline">
              Download it instead
            </a>
            .
          </p>
        </object>
      </div>
    </main>
  );
}
