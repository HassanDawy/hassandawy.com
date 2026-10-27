import { describe, expect, it } from "vitest";
import { noteBySlug, projectBySlug, slugsIn } from "./deep-links";
import { dir, file } from "./nodes";

const tree = dir("~", {}, [
  dir("~/projects", {}, [dir("~/projects/fed", { title: "Fed" }, [file("~/projects/fed/about.md", {}, "")])]),
  dir("~/notes", {}, [file("~/notes/2026-01-01-hi.md", { title: "Hi" }, "")]),
]);

describe("deep links", () => {
  it("finds projects and notes by slug", () => {
    expect(projectBySlug(tree, "fed")?.path).toBe("~/projects/fed");
    expect(noteBySlug(tree, "2026-01-01-hi")?.path).toBe("~/notes/2026-01-01-hi.md");
  });

  it("rejects unknown slugs and anything that isn't a plain slug", () => {
    expect(projectBySlug(tree, "nope")).toBeNull();
    expect(projectBySlug(tree, "..")).toBeNull();
    expect(projectBySlug(tree, "fed/about.md")).toBeNull();
    expect(noteBySlug(tree, "../projects/fed/about")).toBeNull();
  });

  it("lists slugs for generateStaticParams", () => {
    expect(slugsIn(tree, "~/projects")).toEqual(["fed"]);
    expect(slugsIn(tree, "~/notes")).toEqual(["2026-01-01-hi"]);
  });
});
