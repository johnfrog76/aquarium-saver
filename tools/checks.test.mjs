// The authoritative suite: the same invariants, under a real test runner.
//
//   npm test        →  node --test "tools/**/*.test.mjs"
//
// One test case per invariant, generated from the check list, so a new rule in
// tools/invariants.mjs becomes a new test with nothing to wire up here.

import test from "node:test";
import assert from "node:assert/strict";
import { readPages } from "./checks.mjs";
import { runChecks } from "./invariants.mjs";

const results = runChecks(readPages());

test("the checks actually ran", () => {
  assert.ok(results.length >= 30, `expected the full sweep, got ${results.length} checks`);
});

for (const [i, { name, ok, detail }] of results.entries()) {
  test(name, () => {
    assert.ok(ok, `check ${i + 1} — ${name}${detail ? `: ${detail}` : ""}`);
  });
}
