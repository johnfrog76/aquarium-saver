# The seven tanks

This page covers the scenes on `index.html`: the seven aquascapes, the rooms
they stand in, the one rule that keeps salt water and the planted garden
apart, and the counterparts page.

## The scenes

Seven aquascapes in the styles the hobby names, four in fresh water and three
in salt, composed from the same symbols in [the atom library](atoms.md) and
placed differently. Each stands in a European living room at night: a
Haussmann flat in Paris, a Nordic room, a Vienna room.
[See them live](https://johnfrog76.github.io/aquarium-saver/).

| Tank | World | Room |
| --- | --- | --- |
| Nature style | Fresh water | Nordic |
| Iwagumi | Fresh water | Nordic |
| Dutch street | Fresh water | Vienna |
| Moss jungle | Fresh water | Paris |
| Reef range | Salt water | Vienna |
| Lagoon | Salt water | Nordic |
| Coral garden | Salt water | Paris |

Each tank has one light: a pendant over the garden, a cool LED bar over the
reef. The rest of the motion and lighting rules are in
[The room clock](clocks.md).

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
ever mixes the two. [How the checks run](checks.md) has the whole list.

## Counterparts

`counterparts.html`
([live](https://johnfrog76.github.io/aquarium-saver/counterparts.html)) pairs
five close compositions with the UX skeleton each one rhymes with: the same
composition, once as a tank and once as the skeleton screen it rhymes with.
