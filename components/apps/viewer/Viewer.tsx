"use client";

import { useEffect } from "react";
import { useFs } from "@/lib/fs/provider";
import { follow, resolve } from "@/lib/fs/resolve";
import { useWindows } from "@/lib/store/windows";
import type { AppProps } from "../types";
import { NoteHeader, TrashHeader, WorkHeader } from "./Headers";
import { Markdown } from "./Markdown";

// Preview: renders one Markdown or JSON file from the filesystem (props.path).
export default function Viewer({ windowId, props }: AppProps) {
  const tree = useFs();
  const path = String(props.path ?? "");
  const node = resolve(tree, path);
  const file = node && follow(tree, node);
  const title = file ? String(file.meta.title ?? file.name) : "Not found";

  useEffect(() => {
    useWindows.getState().setProps(windowId, { title });
  }, [windowId, title]);

  if (!file || file.type !== "file" || file.body === undefined) {
    return <p className="p-6 text-sm text-[#5A5E67]">This file could not be opened.</p>;
  }

  const body = file.name.endsWith(".json") ? "```json\n" + file.body + "\n```" : file.body;
  const isWork = /^~\/(projects|experience)\//.test(file.path);

  return (
    <article className="mx-auto max-w-[660px] px-8 py-7">
      {isWork && <WorkHeader meta={file.meta} />}
      {file.path.startsWith("~/notes/") && <NoteHeader meta={file.meta} />}
      {file.path.startsWith("~/.trash/") && <TrashHeader meta={file.meta} />}
      <Markdown>{body}</Markdown>
    </article>
  );
}
