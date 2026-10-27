import { describe, expect, it } from "vitest";
import { dir, file, link } from "@/lib/fs/nodes";
import { findSkill, skillsIndex, themeWork, workFile } from "./skills";

const config = {
  categories: [{ id: "lang", title: "Languages", kind: "skill", tags: ["Python"] }],
  themes: [{ id: "t", title: "Theme", description: "d", tags: ["Python", "Hybrid retrieval (BM25 + dense)"] }],
};

const tree = dir("~", {}, [
  dir("~/projects", {}, [
    dir("~/projects/old", { title: "Old", start: "2024-01" }, []),
    dir("~/projects/new", { title: "New", start: "2026-04" }, []),
  ]),
  dir("~/experience", {}, [file("~/experience/job.md", { title: "Job", start: "2025-06" }, "")]),
  dir("~/skills", config, [
    dir("~/skills/python", { title: "Python", kind: "skill", category: "lang" }, [
      link("~/skills/python/old", "~/projects/old", {}),
      link("~/skills/python/new", "~/projects/new", {}),
      link("~/skills/python/job.md", "~/experience/job.md", {}),
    ]),
    dir("~/skills/hybrid-retrieval-bm25-dense", { title: "Hybrid retrieval (BM25 + dense)", kind: "method", category: null }, [
      link("~/skills/hybrid-retrieval-bm25-dense/new", "~/projects/new", {}),
    ]),
  ]),
]);

const index = skillsIndex(tree);

describe("skills index", () => {
  it("reads entries with work sorted newest first", () => {
    const python = index.entries.get("Python")!;
    expect(python).toMatchObject({ slug: "python", kind: "skill", category: "lang" });
    expect(python.work.map((n) => n.meta.title)).toEqual(["New", "Job", "Old"]);
    expect(index.config.themes[0].id).toBe("t");
  });

  it("collects a theme's work with the tags each one matched", () => {
    expect(themeWork(index, index.config.themes[0]).map((w) => [w.node.meta.title, w.matched])).toEqual([
      ["New", ["Python", "Hybrid retrieval (BM25 + dense)"]],
      ["Job", ["Python"]],
      ["Old", ["Python"]],
    ]);
  });

  it("finds skills by title or slug, case-insensitively", () => {
    expect(findSkill(index, "python")?.title).toBe("Python");
    expect(findSkill(index, "Hybrid retrieval (BM25 + dense)")?.slug).toBe("hybrid-retrieval-bm25-dense");
    expect(findSkill(index, "hybrid retrieval bm25 dense")?.title).toBe("Hybrid retrieval (BM25 + dense)");
    expect(findSkill(index, "cobol")).toBeUndefined();
  });

  it("points work at the file to show", () => {
    expect(workFile(index.entries.get("Python")!.work[0])).toBe("~/projects/new/about.md");
    expect(workFile(index.entries.get("Python")!.work[1])).toBe("~/experience/job.md");
  });
});
