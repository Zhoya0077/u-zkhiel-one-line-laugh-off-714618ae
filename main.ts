// One-Line Laugh-Off — a single original joke, written to /output/entry.txt.
//
// The joke is a constant: the program is deterministic, so every run
// produces the exact same entry bytes.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "My to-do list filed a restraining order — I only open it to feel guilty, never to actually do anything.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");
console.log(ENTRY);

// Self-checking gate: the sealed scorer only accepts a file of 1-200
// non-whitespace characters, so verify the file we just wrote before
// declaring success. Fail loudly instead of silently shipping a bad entry.
const written = existsSync(outPath) ? readFileSync(outPath, "utf8") : "";
const failures: string[] = [];
if (!existsSync(outPath)) failures.push("entry.txt missing");
if (written.length < 1 || written.length > 200) {
  failures.push(`entry length ${written.length} outside 1-200`);
}
if (written.trim().length === 0) failures.push("entry is only whitespace");
if (written !== ENTRY) failures.push("written entry differs from printed line");
if (failures.length > 0) {
  console.error(`SELF-CHECK FAILED: ${failures.join("; ")}`);
  process.exit(1);
}
console.error(`SELF-CHECK OK: ${written.length} chars`);
