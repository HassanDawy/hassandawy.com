"use client";

import type { ReactNode } from "react";
import { useFs } from "@/lib/fs/provider";
import { resolve } from "@/lib/fs/resolve";
import { AppIcon } from "./AppIcon";

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
          <AppIcon kind="pdf" size={56} />
        </DesktopIcon>
      )}
      {email && (
        <DesktopIcon label="Contact" href={email.href}>
          <AppIcon kind="mail" size={56} />
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
