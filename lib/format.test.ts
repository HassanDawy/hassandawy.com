import { describe, expect, it } from "vitest";
import { firstLine, formatDate, formatPeriod, formatShortDate } from "./format";

describe("format", () => {
  it("formats work periods", () => {
    expect(formatPeriod("2026-04", "2026-05")).toBe("Apr 2026 – May 2026");
    expect(formatPeriod("2026-04", "2026-04")).toBe("Apr 2026");
    expect(formatPeriod("2026-02", "present")).toBe("Feb 2026 – Present");
  });

  it("formats note dates", () => {
    expect(formatDate("2026-04-06")).toBe("April 6, 2026");
    expect(formatShortDate("2026-10-27")).toBe("Oct 27");
  });

  it("takes the first line of Markdown as plain text", () => {
    expect(firstLine("I'm **Hassan**, a [student](https://bu.edu).\nMore")).toBe("I'm Hassan, a student.");
    expect(firstLine("## Heading\n\n- first *item*")).toBe("first item");
    expect(firstLine("![img](a.png)\n\n> quoted `code`")).toBe("quoted code");
    expect(firstLine("")).toBe("");
  });
});
