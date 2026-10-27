"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useFs } from "@/lib/fs/provider";
import { HOME, resolve } from "@/lib/fs/resolve";
import { useWindows } from "@/lib/store/windows";
import type { AppProps } from "../types";
import { runCommand, type Effect, type Line, type Tone } from "./commands";
import { complete } from "./complete";

type Entry = { kind: "prompt"; cwd: string; input: string } | { kind: "line"; line: Line };

const TONES: Record<Tone, string> = {
  accent: "text-accent",
  muted: "text-[#8B95A3]",
  error: "text-[#F07B72]",
  dir: "text-[#7AA2F7]",
};

export default function Terminal({ windowId }: AppProps) {
  const tree = useFs();
  const [cwd, setCwd] = useState(HOME);
  const [entries, setEntries] = useState<Entry[]>(() => welcome(tree));
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    useWindows.getState().setProps(windowId, { title: `hassan@portfolio: ${cwd}` });
  }, [windowId, cwd]);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entries]);

  function submit() {
    const result = runCommand(input, { tree, cwd });
    const echo: Entry = { kind: "prompt", cwd, input };
    const lines: Entry[] = result.lines.map((line) => ({ kind: "line", line }));
    setEntries((prev) => (result.clear ? [] : [...prev, echo, ...lines]));
    if (result.cwd) setCwd(result.cwd);
    if (input.trim() && history[history.length - 1] !== input) setHistory([...history, input]);
    setHistoryIndex(null);
    setInput("");
    result.effects?.forEach(apply);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      submit();
    } else if (e.key === "Tab") {
      e.preventDefault();
      const { value, options } = complete(input, cwd, tree);
      setInput(value);
      if (options.length) {
        setEntries((prev) => [
          ...prev,
          { kind: "prompt", cwd, input },
          { kind: "line", line: [{ text: options.join("   ") }] },
        ]);
      }
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      if (!history.length) return;
      const last = history.length - 1;
      const next =
        e.key === "ArrowUp"
          ? Math.max(0, (historyIndex ?? history.length) - 1)
          : historyIndex === null || historyIndex >= last
            ? null
            : historyIndex + 1;
      setHistoryIndex(next);
      setInput(next === null ? "" : history[next]);
    }
  }

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto px-5 py-4 font-mono text-[13.5px] leading-[1.7]"
      onClick={() => {
        if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
      }}
    >
      {entries.map((entry, i) =>
        entry.kind === "prompt" ? (
          <div key={i} className="break-all whitespace-pre-wrap">
            <Prompt cwd={entry.cwd} />
            {entry.input}
          </div>
        ) : (
          <div key={i} className="min-h-[1.7em] break-words whitespace-pre-wrap">
            {entry.line.map((seg, j) =>
              seg.href ? (
                <a key={j} href={seg.href} target="_blank" rel="noopener" className="text-accent underline-offset-2 hover:underline">
                  {seg.text}
                </a>
              ) : (
                <span key={j} className={seg.tone ? TONES[seg.tone] : undefined}>
                  {seg.text}
                </span>
              ),
            )}
          </div>
        ),
      )}
      <label className="flex">
        <Prompt cwd={cwd} />
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Terminal command"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className="caret-accent min-w-0 flex-1 bg-transparent outline-none"
        />
      </label>
    </div>
  );
}

function Prompt({ cwd }: { cwd: string }) {
  return <span className="text-accent mr-2 shrink-0">{cwd} $</span>;
}

function apply(effect: Effect) {
  if (effect.type === "open") useWindows.getState().open(effect.appId, effect.props);
  else window.open(effect.href, "_blank", "noopener");
}

function welcome(tree: ReturnType<typeof useFs>): Entry[] {
  const name = String(resolve(tree, "~/about.json")?.meta.name ?? "Hassan Dawy");
  const line = (text: string, tone?: Tone): Entry => ({ kind: "line", line: [{ text, tone }] });
  return [
    line(`Welcome to ${name}'s portfolio.`),
    {
      kind: "line",
      line: [
        { text: "Type ", tone: "muted" },
        { text: "help", tone: "accent" },
        { text: " to see what you can do, or try ", tone: "muted" },
        { text: "ls projects", tone: "accent" },
        { text: ".", tone: "muted" },
      ],
    },
    line(""),
  ];
}
