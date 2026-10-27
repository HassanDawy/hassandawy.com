"use client";

import { Mail } from "lucide-react";
import type { ReactNode } from "react";
import { useFs } from "@/lib/fs/provider";
import { resolve } from "@/lib/fs/resolve";

interface Link {
  label: string;
  href: string;
}

export function DesktopIcons() {
  const tree = useFs();
  const resume = resolve(tree, "~/resume.pdf");
  const links = (resolve(tree, "~/about.json")?.meta.links ?? []) as Link[];
  // Until there is a Contact window, Contact opens an email.
  const email = links.find((l) => l.href.startsWith("mailto:"));

  return (
    <div className="absolute top-14 right-7 flex flex-col items-center gap-[22px] text-xs text-menubar-text">
      {resume && (
        <DesktopIcon label="Resume.pdf" href={String(resume.meta.href)} newTab>
          <span className="bg-window flex h-16 w-[52px] items-end justify-center rounded pb-2 text-[10px] font-bold text-[#B42318]">
            PDF
          </span>
        </DesktopIcon>
      )}
      {email && (
        <DesktopIcon label="Contact" href={email.href}>
          <span className="flex size-14 items-center justify-center rounded-xl bg-[#1E2A3D]">
            <Mail size={28} strokeWidth={1.8} aria-hidden />
          </span>
        </DesktopIcon>
      )}
    </div>
  );
}

function DesktopIcon({
  label,
  href,
  newTab,
  children,
}: {
  label: string;
  href: string;
  newTab?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener" : undefined}
      className="group flex w-[84px] flex-col items-center gap-1.5 rounded-md p-1 focus-visible:bg-white/10"
    >
      {children}
      <span className="rounded px-1 group-hover:bg-white/10 [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]">
        {label}
      </span>
    </a>
  );
}
