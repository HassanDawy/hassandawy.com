import { Desktop } from "@/components/os/Desktop";
import { buildTree } from "@/lib/fs/build-tree";

export default function Home() {
  // Sync fs reads, so this is prerendered at build time.
  const tree = buildTree();

  return (
    <main>
      <h1 className="sr-only">Hassan Dawy</h1>
      <Desktop tree={tree} />
    </main>
  );
}
