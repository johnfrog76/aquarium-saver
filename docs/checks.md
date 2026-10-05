# How the checks run

This page covers what Aquarium Saver checks about its own pages, and the three
ways to run those checks.

## What is checked

The claims the project makes are narrow and mechanical, so they are checked
rather than asserted: no page carries a script, no room clock is under seven
seconds or a two-stop metronome, every clocked instance starts mid-cycle,
every tank has exactly one light, reduced motion stops everything, and the two
worlds never meet. The rules behind those claims are described in
[The room clock](clocks.md) and [The seven tanks](tanks.md#two-worlds-one-rule).

## Three ways to run them

One set of rules, three ways to run them:

- `npm test` runs them under **node:test**. That is the authoritative suite,
  and it is what CI gates the deploy on.
- `npm run checks` prints them one line at a time, `PASS`/`FAIL`, for a
  terminal.
- **[checks.html](https://johnfrog76.github.io/aquarium-saver/checks.html)**
  runs them **in your browser**, against the pages this site is actually
  serving — it fetches them and imports the very same `tools/invariants.mjs`.
  If a tank breaks and ships anyway, that page goes red on its own.

The checks get their own page because the three tank pages carry no script at
all, and that is the point of them. Nothing runs while you are watching a tank.

## Where the rules live

All three read one module, `tools/invariants.mjs`, which is why they cannot
disagree; [Development](development.md#tools) says how it is built to run in
all three places.
