import { describe, expect, it } from "vitest";
import { dir, file } from "./nodes";
import { absolutizeUrls, attachReadmes, type ReadmeFetcher } from "./readmes";
import { resolve } from "./resolve";

describe("absolutizeUrls", () => {
  const repo = "me/proj";

  it("points relative images at raw.githubusercontent.com", () => {
    expect(absolutizeUrls("![arch](docs/arch.png)", repo, "README.md")).toBe(
      "![arch](https://raw.githubusercontent.com/me/proj/HEAD/docs/arch.png)",
    );
    expect(absolutizeUrls('<img width="400" src="./img/a.png">', repo, "README.md")).toBe(
      '<img width="400" src="https://raw.githubusercontent.com/me/proj/HEAD/img/a.png">',
    );
  });

  it("resolves against the README's folder, and / against the repo root", () => {
    expect(absolutizeUrls("![a](../a.png) ![b](/b.png)", repo, "docs/README.md")).toBe(
      "![a](https://raw.githubusercontent.com/me/proj/HEAD/a.png) ![b](https://raw.githubusercontent.com/me/proj/HEAD/b.png)",
    );
  });

  it("points relative links at github.com and leaves absolute ones alone", () => {
    expect(absolutizeUrls("[license](LICENSE) [site](https://x.com) [top](#usage)", repo, "README.md")).toBe(
      "[license](https://github.com/me/proj/blob/HEAD/LICENSE) [site](https://x.com) [top](#usage)",
    );
    expect(absolutizeUrls("![badge](https://img.shields.io/x.svg)", repo, "README.md")).toBe(
      "![badge](https://img.shields.io/x.svg)",
    );
  });
});

describe("attachReadmes", () => {
  const makeTree = () =>
    dir("~", {}, [
      dir("~/projects", {}, [
        dir("~/projects/ok", { title: "OK", repo: "me/ok" }, [file("~/projects/ok/about.md", {}, "about")]),
        dir("~/projects/down", { title: "Down", repo: "me/down" }, [file("~/projects/down/about.md", {}, "about")]),
        dir("~/projects/norepo", { title: "No repo" }, [file("~/projects/norepo/about.md", {}, "about")]),
      ]),
    ]);

  const fetcher: ReadmeFetcher = async (repo) => {
    if (repo === "me/down") throw new Error("network down");
    return { markdown: "# Hi\n![x](x.png)", path: "README.md" };
  };

  it("adds README.md first in projects whose fetch worked, with absolute URLs", async () => {
    const tree = await attachReadmes(makeTree(), fetcher);
    const ok = resolve(tree, "~/projects/ok");
    expect(ok?.type === "dir" && ok.children.map((c) => c.name)).toEqual(["README.md", "about.md"]);
    expect(resolve(tree, "~/projects/ok/README.md")).toMatchObject({
      meta: { title: "README · OK", repo: "me/ok" },
      body: "# Hi\n![x](https://raw.githubusercontent.com/me/ok/HEAD/x.png)",
    });
  });

  it("skips failed fetches and projects without a repo, without throwing", async () => {
    const tree = await attachReadmes(makeTree(), fetcher);
    expect(resolve(tree, "~/projects/down/README.md")).toBeNull();
    expect(resolve(tree, "~/projects/norepo/README.md")).toBeNull();
  });
});
