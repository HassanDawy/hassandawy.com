import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DesktopPage } from "@/components/os/DesktopPage";
import { projectBySlug, slugsIn } from "@/lib/fs/deep-links";
import { getTree } from "@/lib/fs/get-tree";
import { pageMetadata } from "@/lib/metadata";

// /projects/<slug>: the desktop with that project's write-up open in Preview.
export async function generateStaticParams() {
  return slugsIn(await getTree(), "~/projects").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(await getTree(), slug);
  if (!project) return {};
  return pageMetadata({
    title: String(project.meta.title ?? slug),
    description: typeof project.meta.summary === "string" ? project.meta.summary : undefined,
    path: `/projects/${slug}`,
  });
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = projectBySlug(await getTree(), slug);
  if (!project) notFound();
  return <DesktopPage initial={{ appId: "viewer", props: { path: `${project.path}/about.md` } }} />;
}
