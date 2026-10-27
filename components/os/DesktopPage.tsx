import { MobilePage } from "@/components/mobile/MobilePage";
import { getTree } from "@/lib/fs/get-tree";
import { BootScreen } from "./BootScreen";
import type { InitialWindow } from "./Desktop";
import { DesktopGate } from "./DesktopGate";

// The route body shared by /, /projects/[slug] and /notes/[slug]. Below 768px
// (md) CSS shows the mobile page, which is server-rendered. At 768px and up it
// shows the desktop, which renders in the browser only (see DesktopGate).
export async function DesktopPage({ initial }: { initial?: InitialWindow }) {
  const tree = await getTree();
  const openPath = typeof initial?.props.path === "string" ? initial.props.path : undefined;

  return (
    <main>
      <div className="md:hidden">
        <MobilePage tree={tree} openPath={openPath} />
      </div>
      <div className="bg-desktop-grid hidden h-dvh md:block">
        <h1 className="sr-only">Hassan Dawy</h1>
        <DesktopGate tree={tree} initial={initial} />
        <BootScreen />
      </div>
    </main>
  );
}
