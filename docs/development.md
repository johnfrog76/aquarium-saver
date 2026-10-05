# Development

This page covers the tools that generate and check the pages, and how to add
a scene or an atom. Installing and running the scripts is in the README's
[Run it locally](../README.md#run-it-locally).

## Tools

```
node tools/coral-gen.mjs          # regrow the three coral seeds into atoms.html
node tools/scapes-gen.mjs         # write index.html from the atom library
node tools/counterparts-gen.mjs   # write counterparts.html from the atom library
node tools/checks.mjs             # run the invariants over the pages
```

`tools/page.mjs` wraps a page in the document shell every page here shares —
one head, one icon, the dark ground painted before anything can flash white.
`tools/invariants.mjs` holds the rules themselves, and is deliberately free of
node and of the DOM so that a terminal, a test runner and a browser can each
run it unchanged; [How the checks run](checks.md#three-ways-to-run-them) covers
the three.

The coral generator is the one algorithm in the repo: a seeded binary tree,
five forks deep to thirty-two fingers, with every fork a joint so the tree
bends from the trunk out. It bakes symbols; nothing runs at view time.

## Adding a scene or an atom

To add a scene, add a `scene(...)` to `tools/scapes-gen.mjs` using the scene
grammar at the top of the file (room, water, light, sand, haze, glass) and
place atoms with `place(...)`. To add an atom, add a `<symbol>` to
`atoms.html` and give it a plate. [The atom library](atoms.md) describes the
vocabulary a new atom joins.
