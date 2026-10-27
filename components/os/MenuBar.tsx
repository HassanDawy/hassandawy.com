"use client";

import { useSyncExternalStore } from "react";
import { apps } from "@/lib/apps/registry";
import { useFs } from "@/lib/fs/provider";
import { resolve } from "@/lib/fs/resolve";
import { focusedWindowId, useWindows } from "@/lib/store/windows";

export function MenuBar() {
  const tree = useFs();
  const about = resolve(tree, "~/about.json")?.meta ?? {};
  const resume = resolve(tree, "~/resume.pdf");
  const windows = useWindows((s) => s.windows);
  const focused = windows.find((w) => w.id === focusedWindowId(windows));
  // Like macOS: with no app window in front, the Finder owns the menu bar.
  const activeTitle = focused ? apps[focused.appId].title : "Finder";

  return (
    <header className="bg-menubar text-menubar-text absolute inset-x-0 top-0 z-[10000] flex h-menubar items-center justify-between px-4 text-[13px] backdrop-blur-md">
      <div className="flex items-center gap-5">
        <span className="font-bold tracking-wide">hassan</span>
        <span className="font-semibold">{activeTitle}</span>
      </div>
      <div className="flex items-center gap-[18px]">
        {resume && (
          <a
            href={String(resume.meta.href)}
            target="_blank"
            rel="noopener"
            className="text-accent font-semibold hover:text-[#FFC86B]"
          >
            Resume.pdf
          </a>
        )}
        {typeof about.location === "string" && (
          <span className="hidden lg:inline">{about.location}</span>
        )}
        <Clock />
      </div>
    </header>
  );
}

// The server renders an empty slot (null snapshot) so server and client HTML
// match; the browser then ticks once a minute.
const subscribeToClock = (onTick: () => void) => {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
};
const currentMinute = () => Math.floor(Date.now() / 60_000);
const noMinute = () => null;

function Clock() {
  const minute = useSyncExternalStore(subscribeToClock, currentMinute, noMinute);

  if (minute === null) return <span className="w-36" aria-hidden />;
  const now = new Date(minute * 60_000);
  return (
    <time dateTime={now.toISOString()} className="w-36 text-right tabular-nums">
      {formatClock(now)}
    </time>
  );
}

// "Mon 26 Oct  3:00 AM", as in the mockup.
export function formatClock(date: Date): string {
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${weekday} ${date.getDate()} ${month}  ${time}`;
}
