// The checks page, at a terminal: run the checks yourself.
//
// The pages carry no script, so the invariants that make a tank restful are
// checked here, over the HTML, by node. Each check prints one line; the
// process exits non-zero if any fail.
//
//   node tools/checks.mjs
//
// The rules live in tools/invariants.mjs, which knows nothing about node.
// `npm test` runs the same rules under node:test; checks.html runs the same
// rules in a browser. This file is the plain-text reading of them.

import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { PAGES, runChecks } from "./invariants.mjs";

/** Read the three pages off disk, keyed the way runChecks wants them. */
export function readPages() {
  const [atoms, index, counterparts] = PAGES.map((f) =>
    readFileSync(new URL(`../${f}`, import.meta.url), "utf8"),
  );
  return { atoms, index, counterparts };
}

function main() {
  const results = runChecks(readPages());
  let failed = 0;
  for (const { name, ok, detail } of results) {
    console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
    if (!ok) failed++;
  }
  console.log(failed ? `\n${failed} check(s) failed` : "\nall checks passed");
  process.exit(failed ? 1 : 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
