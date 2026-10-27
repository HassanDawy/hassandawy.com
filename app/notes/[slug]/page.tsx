import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DesktopPage } from "@/components/os/DesktopPage";
import { firstLine } from "@/lib/format";
import { noteBySlug, slugsIn } from "@/lib/fs/deep-links";
import { getTree } from "@/lib/fs/get-tree";
import { pageMetadata } from "@/lib/metadata";

// /notes/<slug>: the desktop with Notes open on that note.
export async function generateStaticParams() {
  return slugsIn(await getTree(), "~/notes").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const note = noteBySlug(await getTree(), slug);
  if (!note) return {};
  return pageMetadata({
    title: String(note.meta.title ?? slug),
    description: note.type === "file" ? firstLine(note.body ?? "") || undefined : undefined,
    path: `/notes/${slug}`,
    type: "article",
  });
}

export default async function NotePage({ params }: PageProps<"/notes/[slug]">) {
  const { slug } = await params;
  const note = noteBySlug(await getTree(), slug);
  if (!note) notFound();
  return <DesktopPage initial={{ appId: "notes", props: { path: note.path } }} />;
}
