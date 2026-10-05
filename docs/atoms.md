# The atom library

This page covers the atom library, `atoms.html`: the vocabulary every tank in
Aquarium Saver is composed from, and how the scene pages consume it.

## Two parts

There is the **engine**, and there is what **consumes** it.

- **The atom library** (`atoms.html`, [live](https://johnfrog76.github.io/aquarium-saver/atoms.html))
  is the vocabulary: every plant, fish, stone, light and room is a `<symbol>`,
  every instance a `<use>` carrying two or three custom properties
  (`--period`, `--phase`, `--sway`), colour variants from a handful more. The
  page shows each atom alone, then in its tank.
- **The scenes** (`index.html`, [live](https://johnfrog76.github.io/aquarium-saver/))
  are the vocabulary spoken: seven aquascapes in the styles the hobby names,
  four in fresh water and three in salt, composed from the same symbols and
  placed differently. `counterparts.html`
  ([live](https://johnfrog76.github.io/aquarium-saver/counterparts.html)) pairs
  five close compositions with the UX skeleton each one rhymes with.

Both scene pages are generated from the atom library; see
[Development](development.md). The tanks themselves are described in
[The seven tanks](tanks.md), and the clocks the custom properties drive in
[The room clock](clocks.md).

## Adding an atom

To add an atom, add a `<symbol>` to `atoms.html` and give it a plate. The
generators pick it up from there; [Development](development.md) has the rest.
