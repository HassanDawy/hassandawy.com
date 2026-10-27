import { cacheLife } from "next/cache";
import { buildTree } from "./build-tree";
import { attachReadmes } from "./readmes";

// The tree pages render: content/ plus GitHub READMEs. Prerendered at build
// time and refreshed in the background every 6 hours (21600 s).
export async function getTree() {
  "use cache";
  cacheLife({ revalidate: 21600 });
  return attachReadmes(buildTree());
}
