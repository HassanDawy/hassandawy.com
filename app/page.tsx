import { Desktop } from "@/components/os/Desktop";
import { getTree } from "@/lib/fs/get-tree";

export default async function Home() {
  const tree = await getTree();

  return (
    <main>
      <h1 className="sr-only">Hassan Dawy</h1>
      <Desktop tree={tree} />
    </main>
  );
}
