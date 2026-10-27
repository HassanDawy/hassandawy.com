import { getTree } from "@/lib/fs/get-tree";
import { Desktop, type InitialWindow } from "./Desktop";

// The desktop route body, shared by /, /projects/[slug] and /notes/[slug].
export async function DesktopPage({ initial }: { initial?: InitialWindow }) {
  const tree = await getTree();

  return (
    <main>
      <h1 className="sr-only">Hassan Dawy</h1>
      <Desktop tree={tree} initial={initial} />
    </main>
  );
}
