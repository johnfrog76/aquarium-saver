```text
     .------------------------------------.
     |  ~    ~    ~    ~    ~    ~    ~   |
     |                      o             |
     |   ( )        o          .          |
     |    )(   ><(((('>     o             |
     |   ( )          .          ( )      |
     |    )(                    ) ( )     |
     |   ( )       <><         ( ) (      |
     |__)__(__________________)_(_)_)_____|
     |____________________________________|
            [______________________]

  ============================================
    A  Q  U  A  R  I  U  M     S  A  V  E  R
  ============================================
```

<p align="center"><em>A screen worth leaving open.</em></p>

**Aquarium Saver is a screen worth leaving open: an aquarium in SVG and CSS that
runs on its own slow clocks and never asks you for anything.**

One lamp with a source, plants that bend like trees in a shared current, fish
with mass, bubbles from nowhere, pearls that grow on the leaves and let go.
Seven tanks, each standing in a European living room at night. No script, no
controls, no framework. Turn on reduced motion and it holds its resting pose.

Screens are mostly things that ask. This is a screen that is a place: light
with a source, something moving below attention, nothing mid-decision, nothing
left to decode, nothing that asks. It is for anyone who wants that on a screen
they leave open, and for anyone curious how far SVG and CSS go with no script.

- **[Try it](https://johnfrog76.github.io/aquarium-saver/)** — no install
- MIT licensed, pure SVG and CSS, zero dependencies, zero JavaScript at run time
- **Don't take our word for it — [run the tests yourself](https://johnfrog76.github.io/aquarium-saver/checks.html)**,
  live, in your browser — or `npm test` at a terminal, which is what CI gates on

---

## Documentation

| Page | What it covers |
| --- | --- |
| [The atom library](docs/atoms.md) | The vocabulary: every plant, fish, stone, light and room as a `<symbol>`, and how the scenes speak it |
| [The seven tanks](docs/tanks.md) | The aquascapes, the rooms they stand in, the two worlds that never share a tank, and the counterparts page |
| [The room clock](docs/clocks.md) | The motion rules that make a tank restful rather than busy |
| [How the checks run](docs/checks.md) | What is checked, and the three ways to run it: `npm test`, `npm run checks`, `checks.html` |
| [Development](docs/development.md) | The generators, the shared page shell, and how to add a scene or an atom |

## Run it locally

There is nothing to build for a visitor: the pages are the artefact. Open
`index.html` in a browser, or [try it live](https://johnfrog76.github.io/aquarium-saver/).

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
the generators produce, and CI diffs them to prove it. The generators are
described in [Development](docs/development.md).

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

## Licence

MIT — see [LICENSE](LICENSE). If this turns out to be useful to you and you
want to maintain it, get in touch.

## Issues

Bugs and improvements are [GitHub issues](https://github.com/johnfrog76/aquarium-saver/issues) on this repository.
