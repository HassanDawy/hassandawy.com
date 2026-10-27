import { describe, expect, it } from "vitest";
import { dir, file, link } from "@/lib/fs/nodes";
import { complete } from "./complete";
import { runCommand, type Line } from "./commands";
import { unwrap } from "./unwrap";

const tree = dir("~", {}, [
  dir("~/projects", {}, [
    dir("~/projects/fed-signal", { title: "Fed" }, [file("~/projects/fed-signal/about.md", {}, "# Fed\nbody")]),
    dir("~/projects/facebook-graph", {}, []),
  ]),
  dir("~/notes", {}, [file("~/notes/2026-01-01-hi.md", { title: "Hi" }, "hello")]),
  dir(
    "~/skills",
    {
      categories: [{ id: "llm", title: "LLM systems", kind: "method", tags: ["RAG"] }],
      themes: [{ id: "t", title: "Retrieval", description: "d", tags: ["RAG"] }],
    },
    [
      dir("~/skills/rag", { title: "RAG", kind: "method", category: "llm" }, [
        link("~/skills/rag/fed-signal", "~/projects/fed-signal", {}),
      ]),
    ],
  ),
  dir("~/.trash", {}, []),
  file("~/about.json", {
    name: "Hassan Dawy",
    tagline: "Tagline.",
    links: [
      { label: "Email", href: "mailto:a@b.c" },
      { label: "GitHub", href: "https://github.com/x" },
      { label: "Resume", href: "/resume.pdf" },
    ],
  }, "{}"),
  file("~/resume.pdf", { href: "/resume.pdf" }),
]);

const run = (input: string, cwd = "~") => runCommand(input, { tree, cwd });
const plain = (lines: Line[]) => lines.map((l) => l.map((s) => s.text).join(""));

describe("commands", () => {
  it("lists help for every command", () => {
    const out = plain(run("help").lines).join("\n");
    for (const c of ["help", "whoami", "ls", "cd", "pwd", "cat", "open", "resume", "contact", "clear"]) {
      expect(out).toContain(c);
    }
  });

  it("ls hides dotfiles unless -a and marks directories", () => {
    expect(plain(run("ls").lines)).toEqual(["projects/   notes/   skills/   about.json   resume.pdf"]);
    expect(plain(run("ls -a").lines)[0]).toContain(".trash/");
    expect(plain(run("ls skills/rag").lines)).toEqual(["fed-signal/"]);
    expect(run("ls nope").lines[0][0].tone).toBe("error");
  });

  it("cd changes directory and rejects files and missing paths", () => {
    expect(run("cd projects").cwd).toBe("~/projects");
    expect(run("cd", "~/projects").cwd).toBe("~");
    expect(run("cd ..", "~/projects/fed-signal").cwd).toBe("~/projects");
    expect(run("cd about.json").cwd).toBeUndefined();
    expect(plain(run("cd about.json").lines)).toEqual(["cd: not a directory: about.json"]);
    expect(plain(run("cd nope").lines)).toEqual(["cd: no such file or directory: nope"]);
  });

  it("pwd prints the current directory", () => {
    expect(plain(run("pwd", "~/notes").lines)).toEqual(["~/notes"]);
  });

  it("cat prints files, following links", () => {
    expect(plain(run("cat projects/fed-signal/about.md").lines)).toEqual(["# Fed", "body"]);
    expect(plain(run("cat skills/rag/fed-signal/about.md").lines)).toEqual(["# Fed", "body"]);
    expect(plain(run("cat projects").lines)).toEqual(["cat: projects: Is a directory"]);
    expect(plain(run("cat resume.pdf").lines)[0]).toContain("Try: open resume.pdf");
  });

  it("open launches apps, folders, notes and links", () => {
    expect(run("open Notes").effects).toEqual([{ type: "open", appId: "notes" }]);
    expect(run("open projects").effects).toEqual([
      { type: "open", appId: "finder", props: { path: "~/projects" } },
    ]);
    expect(run("open skills/rag/fed-signal").effects).toEqual([
      { type: "open", appId: "finder", props: { path: "~/projects/fed-signal" } },
    ]);
    expect(run("open 2026-01-01-hi.md", "~/notes").effects).toEqual([
      { type: "open", appId: "viewer", props: { path: "~/notes/2026-01-01-hi.md" } },
    ]);
    expect(run("open resume.pdf").effects).toEqual([{ type: "url", href: "/resume.pdf" }]);
    expect(run("open projects/fed-signal/about.md").effects?.[0]).toMatchObject({ appId: "viewer" });
    expect(run("open viewer").effects).toBeUndefined();
    expect(run("open nope").effects).toBeUndefined();
  });

  it("cat joins hard-wrapped Markdown paragraphs but keeps block lines", () => {
    const md = "## Title\nfirst line\nsecond line\n\n- item one\n  continues\n- item two\n> quote";
    expect(unwrap(md)).toEqual([
      "## Title",
      "first line second line",
      "",
      "- item one continues",
      "- item two",
      "> quote",
    ]);
  });

  it("resume, contact, whoami and clear", () => {
    expect(run("resume").effects).toEqual([{ type: "url", href: "/resume.pdf" }]);
    expect(plain(run("contact").lines)).toEqual(["  Email     a@b.c", "  GitHub    github.com/x"]);
    expect(plain(run("whoami").lines).slice(0, 2)).toEqual(["Hassan Dawy", "Tagline."]);
    expect(run("clear").clear).toBe(true);
  });

  it("skills lists themes and categories; which finds where a skill was used", () => {
    const skills = plain(run("skills").lines).join("\n");
    expect(skills).toContain("Retrieval");
    expect(skills).toContain("LLM systems: RAG");
    expect(plain(run("which rag").lines)).toEqual(["RAG, used in 1:", "  Fed  "]);
    expect(plain(run("which RAG").lines)[0]).toBe("RAG, used in 1:");
    expect(plain(run("which cobol").lines)[0]).toContain('no skill called "cobol"');
    expect(run("open skills").effects).toEqual([{ type: "open", appId: "skills" }]);
  });

  it("is friendly about unknown commands and ignores blank input", () => {
    expect(plain(run("sudo rm -rf /").lines)).toEqual([
      "command not found: sudo",
      "Type help to see what I can do.",
    ]);
    expect(run("   ").lines).toEqual([]);
  });
});

describe("complete", () => {
  const tab = (input: string, cwd = "~") => complete(input, cwd, tree);

  it("completes command names", () => {
    expect(tab("who")).toEqual({ value: "whoami ", options: [] });
    expect(tab("c").options.sort()).toEqual(["cat", "cd", "clear", "contact"]);
    expect(tab("co")).toEqual({ value: "contact ", options: [] });
  });

  it("completes paths, adding / after directories", () => {
    expect(tab("cd pro")).toEqual({ value: "cd projects/", options: [] });
    expect(tab("cat projects/fed-signal/ab")).toEqual({ value: "cat projects/fed-signal/about.md ", options: [] });
    expect(tab("cd skills/rag/f")).toEqual({ value: "cd skills/rag/fed-signal/", options: [] });
  });

  it("extends to the common prefix, then lists the options", () => {
    expect(tab("cd projects/f")).toEqual({ value: "cd projects/f", options: ["fed-signal", "facebook-graph"] });
    expect(tab("ls ", "~/projects")).toEqual({ value: "ls f", options: [] });
    expect(tab("ls ")).toEqual({
      value: "ls ",
      options: ["projects", "notes", "skills", "about.json", "resume.pdf"],
    });
  });

  it("only offers hidden entries for a dot prefix", () => {
    expect(tab("cd .")).toEqual({ value: "cd .trash/", options: [] });
    expect(tab("cd ").options).not.toContain(".trash");
  });

  it("completes skill slugs after which", () => {
    expect(tab("which r")).toEqual({ value: "which rag ", options: [] });
  });

  it("offers app names after open", () => {
    expect(tab("open fin")).toEqual({ value: "open finder ", options: [] });
    expect(tab("open n")).toEqual({ value: "open notes ", options: [] });
  });
});
