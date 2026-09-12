// Aquascapes from the atom vocabulary.
//
// Reads the atom library (the <style> and <defs> of atoms.html) and writes
// index.html, the landing page: seven tanks composed from the same
// symbols, in the styles the research named. Nothing here is a new atom; this
// is the vocabulary being spoken. One rule holds: salt water and the planted
// garden never share a tank.
//
//   node tools/scapes-gen.mjs
//
// Shrimp are salt water only in this vocabulary (John, 2026-09-02).

import { readFileSync, writeFileSync } from "node:fs";
import { toDocument } from "./page.mjs";

const atomsUrl = new URL("../atoms.html", import.meta.url);
const atoms = readFileSync(atomsUrl, "utf8");
// the atom styles are the <style> block that declares the tokens, not the document head paint rule
const styleStart = atoms.lastIndexOf("<style>", atoms.indexOf(":root"));
const style = atoms.slice(styleStart, atoms.indexOf("</style>", styleStart) + "</style>".length);
const defs = atoms.slice(atoms.indexOf("    <defs>"), atoms.indexOf("    </defs>") + "    </defs>".length);
const stages = atoms.match(/  <svg class="stage"[\s\S]*?<\/svg>/g);
const natureStage = stages[0].replace(defs, "").replace(/<svg class="stage"/, '<svg class="stage" data-scene="nature"');

// ── scene grammar ─────────────────────────────────────────────────────────
// the living rooms the tanks stand in: the cabinet each room would have, and the plant on it
const LIT = "--hp-leaf:#3f6a3a;--hp-vein:#5a8a4a";
const ROOM = {
  paris: { cab: "#2f2c36", lip: "#4a4652", plant: `<use href="#plant-trailing" x="372" y="720" style="${LIT}"/>` },
  nordic: { cab: "#3b2f24", lip: "#5a4a38", plant: `<use href="#plant-trailing" x="1228" y="720" style="${LIT}"/>` },
  vienna: { cab: "#2a1c14", lip: "#4a3324", plant: `<use href="#plant-fern" x="384" y="720" style="${LIT}"/>` },
};
const room = (wall, which) => `    <rect width="1600" height="900" fill="var(--room)"/>
    <use href="#room-${which}"/>
    <ellipse cx="800" cy="230" rx="560" ry="260" fill="url(#${wall})"/>
    <rect x="352" y="720" width="896" height="180" fill="${ROOM[which].cab}"/>
    <rect x="352" y="720" width="896" height="9" fill="${ROOM[which].lip}"/>
    <rect x="380" y="729" width="840" height="10" fill="#000" opacity=".35"/>
    ${ROOM[which].plant}`;
const water = (g) => `    <rect x="380" y="240" width="840" height="480" fill="url(#${g})"/>`;
const pendantLight = () => `    <polygon points="710,164 890,164 1150,720 450,720" fill="url(#g-cone)" style="mix-blend-mode:screen"/>
    <ellipse cx="800" cy="240" rx="180" ry="9" fill="url(#g-surface-glow)" filter="url(#f-soft-sm)"/>`;
const barLight = () => `    <polygon points="620,126 980,126 1200,720 400,720" fill="url(#g-reef-cone)" style="mix-blend-mode:screen"/>
    <ellipse cx="800" cy="240" rx="260" ry="9" fill="url(#g-reef-surface)" filter="url(#f-soft-sm)"/>`;
const rays = (g) => `      <polygon points="768,240 804,240 700,720 640,720" fill="url(#${g})" style="mix-blend-mode:screen"/>
      <polygon points="812,240 846,240 990,720 930,720" fill="url(#${g})" style="mix-blend-mode:screen"/>`;
const sandFresh = (id, d) => `      <clipPath id="c-sand-${id}"><path d="${d}"/></clipPath>
      <path d="${d}" fill="url(#g-sand)"/>
      <path d="M380,676 C520,670 640,684 800,680 C960,676 1100,690 1220,686 L1220,720 L380,720 Z" fill="var(--soil)"/>
      <g fill="var(--gravel)"><ellipse cx="402" cy="706" rx="6" ry="3.4"/><ellipse cx="531" cy="704" rx="7" ry="3.6"/><ellipse cx="672" cy="705" rx="6" ry="3.2"/><ellipse cx="822" cy="706" rx="7" ry="3.4"/><ellipse cx="968" cy="705" rx="6" ry="3.2"/><ellipse cx="1118" cy="706" rx="7" ry="3.6"/></g>
      <g clip-path="url(#c-sand-${id})" mask="url(#m-caustic)" opacity=".3" style="mix-blend-mode:screen">
        <g class="caustic-a"><rect x="300" y="560" width="1000" height="160" fill="url(#p-caustic)"/></g>
        <g class="caustic-b"><rect x="300" y="560" width="1000" height="160" fill="url(#p-caustic-b)" opacity=".7"/></g>
      </g>`;
const sandReef = (id, d) => `      <clipPath id="c-sand-${id}"><path d="${d}"/></clipPath>
      <path d="${d}" fill="url(#g-reef-sand)"/>
      <g clip-path="url(#c-sand-${id})" mask="url(#m-caustic)" opacity=".34" style="mix-blend-mode:screen">
        <g class="caustic-a"><rect x="300" y="560" width="1000" height="160" fill="url(#p-reef-caustic)"/></g>
        <g class="caustic-b"><rect x="300" y="560" width="1000" height="160" fill="url(#p-reef-caustic-b)" opacity=".7"/></g>
      </g>`;
const haze = (g, o) => `      <rect x="380" y="240" width="840" height="480" fill="url(#${g})" opacity="${o}"/>`;
const glass = () => `    <g clip-path="url(#c-tank)">
      <path class="surface" d="M340,240 q30,-4 60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0" fill="none" stroke="rgba(215,245,255,.4)" stroke-width="1.6"/>
    </g>
    <polygon points="392,240 424,240 404,720 386,720" fill="url(#g-glass-gleam)"/>
    <polygon points="1120,240 1200,240 1060,560 1010,560" fill="#fff" opacity=".025"/>
    <rect x="380" y="220" width="840" height="500" fill="none" stroke="var(--glass)" stroke-width="2"/>
    <path d="M380,220 H1220" stroke="rgba(220,245,255,.75)" stroke-width="2.4"/>`;
const shadows = (list, o = ".5") => `      <g opacity="${o}">` + list.map(([x, y, sx, sy]) => `<use href="#shadow" transform="translate(${x},${y}) scale(${sx},${sy})"/>`).join("") + `</g>`;
const place = (href, x, y, s = 1, style = "", extra = "") => `      <g transform="translate(${x},${y})${s === 1 ? "" : ` scale(${s})`}${extra}"><use href="#${href}"${style ? ` style="${style}"` : ""}/></g>`;

const SEIRYU = "--rock-a:#6b7480;--rock-b:#3e4650;--rock-edge:#2a3038;--strata:#9aa4b0;--fleck-o:0";
const LIVEROCK = "--rock-a:#6a5f7c;--rock-b:#3f3852;--rock-edge:#2a2438;--strata:#8f83a6;--fleck:#e08ab0;--fleck-o:.8";
const CLEANER = "--shrimp:#f2e6c8;--shrimp-stripe:#d8342c;--shrimp-line:#fff;--shrimp-antenna:#ffffff";
const STEM = {
  green: "--stem:#4c8f3a;--stem-lit:#8fcf5e;--stem-dark:#2a5a24",
  lime: "--stem:#5a9a42;--stem-lit:#a3d86a;--stem-dark:#2f5f28",
  red: "--stem:#b8404f;--stem-lit:#e8788c;--stem-dark:#6e2430",
  orange: "--stem:#c0524c;--stem-lit:#ef8f7a;--stem-dark:#732c2a",
  pink: "--stem:#c46a8a;--stem-lit:#f0a4c0;--stem-dark:#6e3450",
};
const CORAL = {
  rose: "--coral:var(--coral-rose);--coral-dark:var(--coral-rose-dark);--polyp:var(--polyp-rose)",
  ochre: "--coral:var(--coral-ochre);--coral-dark:var(--coral-ochre-dark);--polyp:var(--polyp-ochre)",
  plum: "--coral:var(--coral-plum);--coral-dark:var(--coral-plum-dark);--polyp:var(--polyp-plum)",
  green: "--coral:#5fb08a;--coral-dark:#2f7058;--polyp:#c9f2dc",
  pink: "--coral:#d97a9a;--coral-dark:#8a3f5c;--polyp:#ffd2e0",
  sky: "--coral:#6aa8d8;--coral-dark:#2f5f8a;--polyp:#cfe8ff",
  gold: "--coral:#e0b04a;--coral-dark:#8a6a20;--polyp:#fff0b0",
};
let clock = 0;
const coral = (seed, x, y, s, tone) => {
  const periods = [11.7, 9.1, 13.2, 7.3, 10.4, 12.6, 8.4];
  const i = clock++ % periods.length;
  return `      <g transform="translate(${x},${y})${s === 1 ? "" : ` scale(${s})`}"><use href="#coral-${seed}" class="pulse" style="${CORAL[tone]};--period:${periods[i]}s;--phase:-${(i * 1.7 + 1.1).toFixed(1)}s;--sway:-${((i * .37) % 1.3).toFixed(2)}s"/></g>`;
};
const school = (x, y, s, phase) => `      <g transform="translate(${x},${y}) scale(${s})"><g class="school" style="--phase:${phase}"><use href="#school"/></g></g>`;
const DISCUS = {
  blue: "--discus:#6cc8d4;--discus-deep:#3a8a98;--discus-line:#b8603c",
  red: "--discus:#e0623c;--discus-deep:#9e3320;--discus-line:#9fe6e0",
};
const discus = (x, y, s, dphase, phase, tone = "blue") => `      <g class="drift" style="--phase:${dphase}"><g transform="translate(${x},${y})${s === 1 ? "" : ` scale(${s})`}"><use href="#discus" style="${DISCUS[tone]};--phase:${phase}"/></g></g>`;
const anemoneHome = (x, y, s, sway = "-.4s") => `      <g transform="translate(${x},${y}) scale(${s})">
        <use href="#anemone" style="--sway:${sway}"/>
        <g transform="translate(-16,-22) scale(.62)"><g class="hang" style="--phase:-3s"><g transform="scale(-1,1)"><use href="#clown" style="--phase:-1.1s"/></g></g></g>
        <g transform="translate(6,-30)"><g class="home" style="--phase:-9s"><g class="home-face" style="--phase:-9s"><g transform="scale(.9)"><use href="#clown" style="--phase:-.6s"/></g></g></g></g>
        <use href="#anemone-front" style="--sway:${sway}"/>
      </g>`;

const reefStage = stages[1]
  .replace(/<svg class="stage"/, '<svg class="stage" data-scene="reef"')
  .replace('<rect width="1600" height="900" fill="var(--room)"/>', '<rect width="1600" height="900" fill="var(--room)"/>\n    <use href="#room-vienna"/>')
  .replace('<rect x="352" y="720" width="896" height="180" fill="var(--cabinet)"/>', '<rect x="352" y="720" width="896" height="180" fill="#2a1c14"/>')
  .replace('<rect x="352" y="720" width="896" height="9" fill="var(--cabinet-lip)"/>', `<rect x="352" y="720" width="896" height="9" fill="#4a3324"/>\n    ${ROOM.vienna.plant}`);

const scene = (id, label, body) => `  <svg class="stage" data-scene="${id}" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}">
${body}
  </svg>`;

// ── the scapes ────────────────────────────────────────────────────────────

// Iwagumi: three stones, a carpet, and mostly water. Rest through what is left out.
const iwagumi = scene("iwagumi", "Iwagumi: three seiryu stones on a hairgrass carpet, a school of tetras, and open water.", [
  room("g-wall-glow", "nordic"), water("g-water"), pendantLight(),
  `    <g clip-path="url(#c-tank)">`,
  sandFresh("iwagumi", "M380,642 C600,634 900,648 1220,642 L1220,720 L380,720 Z"),
  rays("g-ray"),
  shadows([[790, 644, 3.4, 1.4], [1030, 648, 1.8, 1.1], [575, 642, 1.3, 1]]),
  place("bubbles", 772, 560, 1, "--rise:-310px"),
  place("mountain", 760, 642, 1.3, SEIRYU),
  place("mountain", 1010, 646, .7, SEIRYU),
  place("mountain", 560, 640, .5, SEIRYU),
  place("moss", 636, 640, .9), place("moss", 900, 646, .8), place("moss", 1060, 648, .7), place("moss", 540, 640, .6),
  ...[440, 540, 640, 900, 1000, 1100, 1190].map((x) => place("carpet", x, 641 + (x > 800 ? 4 : 0), 1.1)),
  school(560, 380, 1.1, "-6s"),
  haze("g-water", ".06"),
  `    </g>`,
  glass(),
  `    <use href="#lamp" x="800" y="160" style="--phase:-13s"/>`,
].join("\n"));

// Dutch street: no wood, no stone — terraces of stems in colour, a street of carpet running back.
const dutch = scene("dutch", "Dutch street: terraces of red and green stem plants, a street of carpet running to the back, two discus.", [
  room("g-wall-glow", "vienna"), water("g-water"), pendantLight(),
  `    <g clip-path="url(#c-tank)">`,
  sandFresh("dutch", "M380,606 C600,600 900,640 1220,650 L1220,720 L380,720 Z"),
  shadows([[440, 606, 1.8, 1.1], [560, 608, 1.8, 1.1], [690, 616, 1.8, 1.1], [820, 628, 1.8, 1.1], [950, 638, 1.8, 1.1], [1070, 646, 1.8, 1.1], [1180, 650, 1.8, 1.1]], ".4"),
  place("stems", 440, 606, 2.1, `${STEM.green};--sway:-.3s`),
  place("stems", 560, 607, 2.3, `${STEM.red};--sway:-.9s`),
  place("stems", 690, 615, 2.0, `${STEM.lime};--sway:-.5s`),
  place("stems", 820, 627, 2.2, `${STEM.orange};--sway:-1.1s`),
  place("stems", 950, 637, 2.0, `${STEM.green};--sway:-.2s`),
  place("stems", 1070, 645, 2.3, `${STEM.red};--sway:-.7s`),
  place("stems", 1180, 650, 1.9, `${STEM.lime};--sway:-1.2s`),
  haze("g-water", ".34"),
  rays("g-ray"),
  place("stems", 500, 605, 1.4, `${STEM.pink};--sway:-.6s`),
  place("stems", 640, 611, 1.3, `${STEM.green};--sway:-1s`),
  place("bubbles", 786, 540, 1, "--rise:-290px"),
  place("sword", 780, 623, 1.5, "--sway:-.4s;--rise:-128px"),
  place("stems", 900, 634, 1.4, `${STEM.red};--sway:-.8s`),
  place("stems", 1010, 642, 1.3, `${STEM.pink};--sway:-.1s`),
  place("stems", 1130, 648, 1.5, `${STEM.green};--sway:-1.3s`),
  discus(640, 440, 1, "-9s", "-2.1s"),
  discus(770, 362, .86, "-27s", "-5.4s", "red"),
  haze("g-water", ".1"),
  // the street: a lighter run of carpet from the front left toward the back right
  ...[[470, 700], [530, 684], [590, 668], [650, 652], [710, 636], [770, 624]].map(([x, y], i) => place("carpet", x, y, 1.25 - i * .08)),
  ...[[880, 636], [1000, 644], [1120, 650], [1200, 652]].map(([x, y]) => place("carpet", x, y, .95)),
  place("sword", 600, 662, .55, "--sway:-1.3s;--rise:-640px", "").replace("<g ", '<g style="filter:brightness(.72)" '),
  place("sword", 1060, 650, .5, "--sway:-.4s;--rise:-693px").replace("<g ", '<g style="filter:brightness(.66)" '),
  `    </g>`,
  glass(),
  `    <use href="#lamp" x="800" y="160" style="--phase:-13s"/>`,
].join("\n"));

// Moss jungle: the log, three moss trees, eel grass, moss on everything, shrimp everywhere.
const jungle = scene("jungle", "Moss jungle: driftwood and three moss trees, eel grass in the corners, moss on every surface, two discus.", [
  room("g-wall-glow", "paris"), water("g-water"), pendantLight(),
  `    <g clip-path="url(#c-tank)">`,
  sandFresh("jungle", "M380,598 C540,588 660,606 800,624 C940,640 1080,650 1220,652 L1220,720 L380,720 Z"),
  shadows([[590, 606, 1.7, 1.1], [1020, 646, 1.6, 1]], ".45"),
  place("eelgrass", 430, 598, 1.15, "--sway:-.2s"),
  place("eelgrass", 1188, 652, 1.2, "--sway:-.7s"),
  place("bubbles", 606, 520, 1, "--rise:-270px"),
  place("sword", 600, 606, 1.6, "--sway:-.8s;--rise:-102px"),
  place("sword", 1000, 645, 1.5, "--sway:-.5s;--rise:-143px"),
  haze("g-water", ".5"),
  rays("g-ray"),
  place("eelgrass", 960, 641, .8, "--sway:-1s"),
  shadows([[540, 594, 1.6, 1], [720, 616, 2.0, 1.2], [1100, 650, 1.5, 1]]),
  `      <use href="#driftwood"/>`,
  ...[[650, 506, 1.1], [830, 431, .9], [962, 375, .8], [486, 600, .8], [590, 545, 1], [760, 470, .9], [900, 400, .8]].map(([x, y, s]) => place("moss", x, y, s)),
  place("mosstree", 520, 592, 1.1),
  place("mosstree", 700, 612, 1.45),
  place("mosstree", 1090, 648, 1.0),
  discus(600, 452, 1, "-9s", "-2.1s"),
  discus(780, 336, .86, "-27s", "-5.4s", "red"),
  haze("g-water", ".08"),
  ...[[470, 602, .9], [560, 608, .8], [640, 614, 1], [760, 630, .9], [850, 636, .8], [930, 642, 1], [1010, 650, .9], [1160, 654, 1]].map(([x, y, s]) => place("moss", x, y, s)),
  place("marimo", 700, 632, 1), place("marimo", 880, 640, .8), place("marimo", 1200, 656, .7),
  `    </g>`,
  glass(),
  `    <use href="#lamp" x="800" y="160" style="--phase:-13s"/>`,
].join("\n"));

// Lagoon: white sand and open water, one small rock, the anemone island, the clam under the bar.
const lagoon = scene("lagoon", "Lagoon: white sand, one small rock with two corals, a giant clam under the bar, an anemone with its clownfish, cleaner shrimp.", [
  room("g-reef-wall", "nordic"), water("g-reef-water"), barLight(),
  `    <g clip-path="url(#c-tank)">`,
  sandReef("lagoon", "M380,632 C600,622 900,646 1220,640 L1220,720 L380,720 Z"),
  rays("g-reef-ray"),
  shadows([[610, 650, 2.0, 1.2], [840, 644, 1.6, 1.1], [1020, 650, 1.6, 1.1], [1095, 652, 1.1, .9]]),
  place("mountain", 600, 628, .75, LIVEROCK),
  coral("a", 594, 531, .7, "rose"),
  coral("c", 627, 543, .5, "plum"),
  place("shrimp", 556, 612, 1, CLEANER),
  place("shrimp", 776, 642, .9, CLEANER, " scale(-1,1)"),
  `      <use href="#clam" x="830" y="642" style="--period:9.3s;--phase:-2.6s"/>`,
  place("mountain", 1090, 648, .5, LIVEROCK),
  coral("b", 1085, 583, .45, "gold"),
  anemoneHome(1005, 646, 1.5),
  haze("g-reef-water", ".06"),
  `    </g>`,
  glass(),
  `    <use href="#reefbar" x="800" y="126" style="--phase:-21s"/>`,
].join("\n"));

// Coral garden: one long range, corals of seven colours on every peak and ledge.
const garden = scene("garden", "Coral garden: a long range of live rock with soft corals of seven colours on its peaks and ledges, an anemone with clownfish, cleaner shrimp.", [
  room("g-reef-wall", "paris"), water("g-reef-water"), barLight(),
  `    <g clip-path="url(#c-tank)">`,
  sandReef("garden", "M380,650 C600,640 900,662 1220,652 L1220,720 L380,720 Z"),
  rays("g-reef-ray"),
  shadows([[810, 662, 3.8, 1.5], [1130, 666, 2.2, 1.2], [505, 664, 2.4, 1.2], [610, 658, 1.6, 1]]),
  place("mountain", 500, 662, .9, LIVEROCK),
  place("mountain", 800, 660, 1.5, LIVEROCK),
  place("mountain", 1120, 664, .8, LIVEROCK),
  coral("a", 788, 466, 1.0, "rose"),
  coral("b", 854, 490, .8, "gold"),
  coral("c", 722, 520, .85, "plum"),
  coral("a", 920, 544, .7, "green"),
  coral("b", 650, 577, .7, "sky"),
  coral("c", 953, 616, .55, "pink"),
  coral("a", 887, 571, .5, "ochre"),
  coral("b", 493, 546, .75, "green"),
  coral("c", 453, 578, .55, "gold"),
  coral("a", 1114, 561, .7, "sky"),
  coral("b", 1149, 574, .55, "rose"),
  place("shrimp", 700, 606, 1, CLEANER),
  place("shrimp", 1090, 640, .9, CLEANER, " scale(-1,1)"),
  anemoneHome(600, 656, 1.1),
  haze("g-reef-water", ".06"),
  `    </g>`,
  glass(),
  `    <use href="#reefbar" x="800" y="126" style="--phase:-21s"/>`,
].join("\n"));

// ── the page ──────────────────────────────────────────────────────────────
const scapes = [
  ["nature", "Nature style", "Fresh water · Nordic room", "The tank from the atom page. One log as the one diagonal, swords in three depths, eel grass in the corners, a moss tree, a carpet, discus and tetras. The lit sand under the lamp stays open.", natureStage],
  ["iwagumi", "Iwagumi", "Fresh water · Nordic room", "Three stones and a carpet. The big stone leans one way, the second answers it, the third settles the argument. Most of the frame is water, and that is the rest.", iwagumi],
  ["dutch", "Dutch street", "Fresh water · Vienna room", "No wood and no stone. Terraces of stems in colour, red against green, and a street of carpet running from the front glass toward the back. Discus hang in the lane above it.", dutch],
  ["jungle", "Moss jungle", "Fresh water · Paris room", "Everything moss will grow on, it grows on. The log, three moss trees, eel grass at the edges, marimo on the floor.", jungle],
  ["reef", "Reef range", "Salt water · Vienna room", "Two ranges of live rock with corals on the peaks, cleaner shrimp on the ledges, the clam under the bar, and the anemone with the two fish that live in it.", reefStage],
  ["lagoon", "Lagoon", "Salt water · Nordic room", "White sand and open water. One small rock, the clam in the light, the anemone island with its clownfish. The reef version of leaving most of the frame alone.", lagoon],
  ["garden", "Coral garden", "Salt water · Paris room", "One long range, and corals of seven colours on every peak and ledge, each tree its own seed and its own clock. The densest thing the vocabulary can say.", garden],
];

const html = `<title>Aquarium Rest Scapes</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400&display=swap">
${style}
<style>
  .scene { margin: 0 0 40px; content-visibility: auto; contain-intrinsic-size: 1000px 640px; }
  .scene header { display: flex; align-items: baseline; gap: 18px; margin: 0 0 12px; }
  .scene h2 { margin: 0; font-size: 16px; font-weight: 500; letter-spacing: 0; text-transform: none; color: var(--ink); }
  .scene .world { font-family: "IBM Plex Mono", Consolas, monospace; font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
  .scene p { margin: 10px 0 0; color: var(--muted); font-size: 14px; max-width: 70ch; }
  .lib { position: absolute; width: 0; height: 0; overflow: hidden; }
  footer.family { display: flex; flex-wrap: wrap; gap: 8px 22px; }
  footer.family a { color: var(--accent); text-decoration: none; }
  footer.family a:hover { text-decoration: underline; }
  .nav { font-family: "IBM Plex Mono", Consolas, monospace; font-size: 12.5px; letter-spacing: .08em; text-transform: uppercase; margin: 0 0 30px; display: flex; gap: 22px; }
  .nav a { color: var(--muted); text-decoration: none; } .nav a:hover, .nav a[aria-current] { color: var(--accent); }
</style>

<div class="page">
  <nav class="nav"><a href="./" aria-current="page">Tanks</a><a href="./atoms.html">Atoms</a><a href="./counterparts.html">Counterparts</a><a href="./checks.html">Checks</a></nav>
  <header>
    <div>
      <p class="eyebrow">Places to rest · aquascapes</p>
      <h1>Seven tanks from one vocabulary</h1>
      <p>The atoms are the words. These are sentences: the aquascape styles the research named, composed from the same symbols and running on the same slow clocks. Four in fresh water, three in salt, and never both in one tank. Each stands in a European living room at night, lit only by its own lamp: a Haussmann flat, a Nordic room, a Vienna room, with houseplants on the floor and on the cabinet. Each is a place you could leave open.</p>
    </div>
    <div class="mechanisms">
      <b>The room</b> — light has a source · low-key, warm-ish · something moves below attention · nothing asks you for anything<br>
      <b>The image</b> — nothing is mid-decision · nothing left to decode
    </div>
  </header>

  <!-- the atom library, shared by every tank below -->
  <svg class="lib" aria-hidden="true">
${defs}
  </svg>

${scapes.map(([id, title, world, blurb, svg]) => `  <section class="scene" id="${id}">
    <header><h2>${title}</h2><span class="world">${world}</span></header>
${svg}
    <p>${blurb}</p>
  </section>`).join("\n\n")}

  <footer class="family">
    <span>MIT licensed.</span>
    <a href="https://github.com/johnfrog76/aquarium-saver">Source on GitHub</a>
    <span>Seven tanks from one atom library, generated by <code>tools/scapes-gen.mjs</code>; no script runs on this page.</span>
  </footer>
</div>
`;

writeFileSync(new URL("../index.html", import.meta.url), toDocument(html, { description: "Seven aquariums in pure SVG and CSS, each in a living room at night, running on their own slow clocks. A screen worth leaving open.", url: "https://johnfrog76.github.io/aquarium-saver/" }));
console.log(`wrote index.html with ${scapes.length} tanks`);
