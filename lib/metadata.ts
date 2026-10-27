import type { Metadata } from "next";

// A page's own `openGraph` replaces the root one entirely, image included, so
// every page that sets a title goes through here to keep the link preview.
const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630 };

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description?: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    openGraph: { type, siteName: "Hassan Dawy", title, description, url: path, images: [OG_IMAGE] },
  };
}
