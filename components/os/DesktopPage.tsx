import { MobilePage } from "@/components/mobile/MobilePage";
import { getTree } from "@/lib/fs/get-tree";
import { Desktop, type InitialWindow } from "./Desktop";

// The route body shared by /, /projects/[slug] and /notes/[slug]. Both views are
// server-rendered and CSS picks one: the mobile page below 768px (md), the
// desktop above. Desktop opens no window (and loads no app code) while hidden.
export async function DesktopPage({ initial }: { initial?: InitialWindow }) {
  const tree = await getTree();
  const openPath = typeof initial?.props.path === "string" ? initial.props.path : undefined;

  return (
    <main>
      <div className="md:hidden">
        <MobilePage tree={tree} openPath={openPath} />
      </div>
      <div className="hidden md:block">
        <h1 className="sr-only">Hassan Dawy</h1>
        <Desktop tree={tree} initial={initial} />
      </div>
    </main>
  );
}
