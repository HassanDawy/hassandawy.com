// Markdown sources are hard-wrapped at ~80 columns; join those lines back into
// paragraphs so the terminal can wrap them to its own width. Headings, list
// items, quotes and table rows still start a new line.
export function unwrap(body: string): string[] {
  const out: string[] = [];
  const startsBlock = /^\s*([#>|]|[-*+] |\d+\. )/;
  for (const line of body.split("\n")) {
    const prev = out[out.length - 1];
    const joinable = prev && line.trim() && !startsBlock.test(line) && !/^\s*#/.test(prev);
    if (joinable) out[out.length - 1] = `${prev} ${line.trim()}`;
    else out.push(line);
  }
  return out;
}
