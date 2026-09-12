# Aquarium Saver

**A screen worth leaving open: an aquarium in SVG and CSS that runs on its own slow clocks and never asks you for anything.**

One lamp with a source, plants that bend like trees in a shared current, fish
with mass, bubbles from nowhere, pearls that grow on the leaves and let go.
Seven tanks, each standing in a European living room at night. No script, no
controls, no framework. Turn on reduced motion and it holds its resting pose.

- **[Try it](https://johnfrog76.github.io/aquarium-saver/)** — no install
- MIT licensed, pure SVG and CSS, zero dependencies, zero JavaScript at run time
- **Don't take our word for it — [run the tests yourself](https://johnfrog76.github.io/aquarium-saver/checks.html)**,
  live, in your browser — or `npm test` at a terminal, which is what CI gates on

---

## Two parts

Like every repo in this family, there is the **engine** and there is what
**consumes** it.

- **The atom library** (`atoms.html`) is the vocabulary: every plant, fish,
  stone, light and room is a `<symbol>`, every instance a `<use>` carrying two
  or three custom properties (`--period`, `--phase`, `--sway`), colour
  variants from a handful more. The page shows each atom alone, then in its
  tank.
- **The scenes** (`index.html`) are the vocabulary spoken: seven aquascapes in
  the styles the hobby names, four in fresh water and three in salt, composed
  from the same symbols and placed differently. `counterparts.html` pairs five
  close compositions with the UX skeleton each one rhymes with.

Both scene pages are generated from the atom library; see **Tools**.

## The room clock

Everything that moves moves on the room's own clock, and the rules are what
make the tank restful rather than busy:

- **No period under seven seconds.** Corals pulse on 7.3, 9.1, 11.7 and 13.2
  second clocks; the clam breathes over 9.3 with the exhale held; a discus
  drifts over 43; a school over 37; a pearl grows for most of 37 to 47.
- **Uneven keyframes, and more rest than motion.** A coral spends more than
  half its cycle between beats. A fish drifts to a pause it has reached and
  stays there. Nothing stops dead.
- **Negative phase on every instance.** Every clock is mid-cycle on the first
  frame, so nothing is ever *about to* happen.
- **One current.** Plants and corals bend like trees, trunk a little, crown
  more, tips most and last, on one shared 9.5 second current, each meeting the
  beat a little late.
- **One light.** A pendant over the garden, a cool LED bar over the reef.
  Brightest at the surface, caustics on the sand, dim at the glass, and the
  room behind falls off into the dark.
- **Reduced motion is the resting pose.** The static geometry *is* the rest
  state, so `prefers-reduced-motion` shows a tank at rest, not frame zero.

## Two worlds, one rule

Salt water and the planted garden never share a tank.

| Fresh water | Salt water |
| --- | --- |
| swords, stems, eel grass, moss, moss tree, carpet, marimo | soft corals grown from a binary tree, giant clam, anemone |
| driftwood, seiryu stone | live rock with coralline flecks |
| discus in blue and red, a school of neon tetras | clownfish that live in the anemone, cleaner shrimp |
| a warm pendant, a CO₂ trail, pearling leaves | a blue LED bar, whiter sand |

CO₂ and pearling belong to fresh water; shrimp belong to salt. This is not a
style guide, it is a check — `tools/invariants.mjs` fails the build if a tank
ever mixes the two.

## Does it actually work?

The claims above are narrow and mechanical, so they are checked rather than
asserted: no page carries a script, no room clock is under seven seconds or a
two-stop metronome, every clocked instance starts mid-cycle, every tank has
exactly one light, reduced motion stops everything, and the two worlds never
meet.

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

## Development

There are no runtime dependencies, and the only dev dependency is ESLint.

```bash
npm ci
npm test           # the invariants, under node:test
npm run checks     # the same invariants, one printed line each
npm run lint       # eslint over tools/ — the pages have no script to lint
npm run verify     # lint + test
npm run build      # regenerate the three pages from the atom library
```

`npm run build` must leave the tree clean: the committed pages are exactly what
the generators produce, and CI diffs them to prove it.

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
run it unchanged.

The coral generator is the one algorithm in the repo: a seeded binary tree,
five forks deep to thirty-two fingers, with every fork a joint so the tree
bends from the trunk out. It bakes symbols; nothing runs at view time.

To add a scene, add a `scene(...)` to `tools/scapes-gen.mjs` using the scene
grammar at the top of the file (room, water, light, sand, haze, glass) and
place atoms with `place(...)`. To add an atom, add a `<symbol>` to
`atoms.html` and give it a plate.

## What it does not do

Stated rather than hidden, because a maintainer needs to know where the edges
are:

| Concern | Status |
| --- | --- |
| JavaScript on a tank page | **None, ever** — checked, not promised |
| Interaction, controls, settings | **None by design** — a place, not a panel |
| A light theme | **Not supported** — a lamp over dark water is the whole image |
| Fish behaviour, flocking, collision | **Not modelled** — every motion is a CSS clock |
| Sound | **None** |
| An OS screen saver binary (`.scr`, `.saver`) | **Not supported** — open the page full-screen |
| A build step for the visitor | **None** — the three pages are the artefact |

## Provenance

Built for a deck about places to rest inside web applications, where these
tanks are the argument and `counterparts.html` is the turn: the same
composition, once as a tank and once as the skeleton screen it rhymes with.
This repo is the engine, the deck is one consumer.

## Why

Screens are mostly things that ask. This is a screen that is a place: light
with a source, something moving below attention, nothing mid-decision,
nothing left to decode, nothing that asks. The deck built on it argues that
web applications need such places too.

## Licence

MIT. If this turns out to be useful to you and you want to maintain it, get in
touch.
