// Tank and skeleton.
//
// The question: do the close compositions have a counterpart
// in the web? This page answers it in pictures. Five atom compositions from
// the library, and beside each one the UX skeleton it rhymes with: the grey
// placeholder blocks a page shows before its content arrives, drawn in the
// atom's silhouette.
//
//   node tools/counterparts-gen.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { toDocument } from "./page.mjs";

const atoms = readFileSync(new URL("../atoms.html", import.meta.url), "utf8");
// the atom styles are the <style> block that declares the tokens, not the document head paint rule
const styleStart = atoms.lastIndexOf("<style>", atoms.indexOf(":root"));
const style = atoms.slice(styleStart, atoms.indexOf("</style>", styleStart) + "</style>".length);
const defs = atoms.slice(atoms.indexOf("    <defs>"), atoms.indexOf("    </defs>") + "    </defs>".length);

// ── skeleton grammar: a dark page, grey blocks, one warm light ────────────
const PAGE = "#15131c", BLOCK = "#2a2735", BLOCK_LIT = "#3d3949", LINE = "#3f3b4a", INK = "#cfc8b8";
const page = (extra = "") => `<rect x="-150" y="-176" width="300" height="232" rx="6" fill="${PAGE}" stroke="${BLOCK}" stroke-width="1.5"/>${extra}`;
const header = () => `<rect x="-150" y="-176" width="300" height="22" rx="6" fill="#1c1926"/><circle cx="-134" cy="-165" r="4" fill="${BLOCK}"/><rect x="-120" y="-168" width="60" height="6" rx="3" fill="${BLOCK}"/>`;

// 1. one lamp: one block lit, every other block a step down by distance
const lampSkeleton = () => {
  const cells = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const x = -132 + c * 96, y = -130 + r * 60;
    const d = Math.hypot(c - 1, r - 1);
    if (d === 0) continue;
    const tone = d < 1.2 ? BLOCK_LIT : BLOCK;
    cells.push(`<rect x="${x}" y="${y}" width="76" height="44" rx="4" fill="${tone}"/>`);
  }
  return page(header() + cells.join("") +
    `<ellipse cx="2" cy="-48" rx="110" ry="60" fill="url(#g-lens-halo)" opacity=".28" filter="url(#f-soft)"/>` +
    `<rect x="-36" y="-70" width="76" height="44" rx="4" fill="var(--lamp)"/>` +
    `<rect x="-24" y="-56" width="52" height="6" rx="3" fill="var(--lamp-hot)"/><rect x="-24" y="-44" width="34" height="6" rx="3" fill="var(--lamp-hot)" opacity=".7"/>`);
};

// 2. the sword: a card of nine lines, lit at the top, shaded to the base
const swordSkeleton = () => {
  const widths = [150, 120, 140, 110, 130, 100, 90, 78, 60];
  const lines = widths.map((w, i) => {
    const t = i / 8;
    const tone = i === 0 ? INK : `rgb(${Math.round(200 - t * 150)},${Math.round(194 - t * 150)},${Math.round(180 - t * 135)})`;
    return `<rect x="-90" y="${-136 + i * 20}" width="${w}" height="${i === 0 ? 12 : 8}" rx="4" fill="${tone}"/>`;
  }).join("");
  return page(header() + `<rect x="-110" y="-150" width="220" height="196" rx="6" fill="#1c1926"/><ellipse cx="0" cy="52" rx="100" ry="6" fill="#000" opacity=".4"/>` + lines +
    `<polygon points="-40,-176 40,-176 70,56 -70,56" fill="url(#g-ray)" style="mix-blend-mode:screen"/>`);
};

// 3. substrate: content over layout over tokens, the page's cutaway
const substrateSkeleton = () => {
  const content = `<rect x="-130" y="-146" width="120" height="14" rx="4" fill="${INK}"/><rect x="-130" y="-124" width="240" height="8" rx="4" fill="#8f8878"/><rect x="-130" y="-108" width="200" height="8" rx="4" fill="#7a735f"/><rect x="-130" y="-92" width="220" height="8" rx="4" fill="#6a6353"/>`;
  let grid = "";
  for (let c = 0; c < 12; c++) grid += `<rect x="${-130 + c * 22}" y="-66" width="16" height="64" fill="${BLOCK}"/>`;
  let tokens = "";
  for (let c = 0; c < 14; c++) tokens += `<circle cx="${-124 + c * 19.6}" cy="30" r="3.6" fill="${c % 3 === 0 ? "#6a5a44" : "#4e4032"}"/>`;
  return page(header() + content + `<path d="M-150,-76 H150" stroke="${LINE}" stroke-width="1"/>` + grid + `<path d="M-150,10 H150" stroke="${LINE}" stroke-width="1"/><rect x="-150" y="10" width="300" height="46" fill="#100e15"/>` + tokens +
    `<rect x="-150" y="-176" width="300" height="232" rx="6" fill="url(#g-caustic-fade)" opacity=".06" style="mix-blend-mode:screen"/>`);
};

// 4. mountains: navigation as a silhouette, one peak and two shoulders, strata through all of it
const mountainSkeleton = () => {
  const heights = [56, 104, 172, 136, 88, 118, 66];
  const cols = heights.map((h, i) => `<rect x="${-134 + i * 40}" y="${46 - h}" width="32" height="${h}" rx="3" fill="${i === 2 || i === 3 || i === 5 ? BLOCK_LIT : BLOCK}"/>`).join("");
  let strata = "";
  for (let y = 22; y > -140; y -= 24) strata += `<path d="M-140,${y} H140" stroke="${LINE}" stroke-width="1" opacity=".55"/>`;
  return page(header() + cols + strata + `<path d="M-150,46 H150" stroke="${LINE}" stroke-width="1.5"/>` + `<ellipse cx="0" cy="52" rx="120" ry="5" fill="#000" opacity=".4"/>`);
};

// 5. the front of the garden: chips, an avatar, a footer; things that have finished
const footerSkeleton = () => {
  let chips = "";
  const w = [34, 26, 40, 30, 36, 28, 32];
  let x = -130;
  for (const cw of w) { chips += `<rect x="${x}" y="22" width="${cw}" height="14" rx="7" fill="${BLOCK_LIT}"/>`; x += cw + 8; }
  const faint = `<rect x="-130" y="-140" width="200" height="8" rx="4" fill="${BLOCK}"/><rect x="-130" y="-124" width="160" height="8" rx="4" fill="${BLOCK}"/><rect x="-130" y="-108" width="180" height="8" rx="4" fill="${BLOCK}"/>`;
  const avatar = `<circle cx="-100" cy="-30" r="20" fill="${BLOCK_LIT}"/><circle cx="-100" cy="-38" r="7" fill="${BLOCK}"/><path d="M-116,-16 a16,12 0 0 1 32,0 Z" fill="${BLOCK}"/><rect x="-70" y="-38" width="80" height="8" rx="4" fill="#8f8878"/><rect x="-70" y="-24" width="50" height="6" rx="3" fill="${BLOCK_LIT}"/>`;
  const tree = `<rect x="44" y="-64" width="60" height="16" rx="8" fill="${BLOCK_LIT}"/><rect x="34" y="-44" width="80" height="16" rx="8" fill="${BLOCK_LIT}"/><rect x="54" y="-24" width="40" height="16" rx="8" fill="${BLOCK_LIT}"/><rect x="70" y="-8" width="8" height="18" fill="${BLOCK}"/>`;
  return page(header() + faint + avatar + tree + `<path d="M-150,10 H150" stroke="${LINE}" stroke-width="1"/>` + chips);
};

// ── the atom compositions, as they stand on the atom page ────────────────
const water = `<rect x="-160" y="-190" width="320" height="260" fill="url(#g-water)"/>`;
const lampPlate = `<rect x="-160" y="-190" width="320" height="260" fill="var(--room)"/><ellipse cx="0" cy="-40" rx="220" ry="150" fill="url(#g-wall-glow)"/><use href="#lamp" x="0" y="0"/>`;
const swordPlate = `${water}<polygon points="-20,-190 20,-190 60,70 -60,70" fill="url(#g-ray)" style="mix-blend-mode:screen"/><g opacity=".5"><use href="#shadow" transform="translate(10,52) scale(1.4,1)"/><use href="#shadow" transform="translate(-92,56) scale(.7,.7)"/></g><g transform="translate(0,50) scale(1.5)"><use href="#sword" style="--sway:-.3s"/></g><g transform="translate(-90,56) scale(.7)" style="filter:brightness(.7)"><use href="#sword" style="--sway:-1.1s"/></g>`;
const substratePlate = `${water}<svg x="-160" y="-100" width="320" height="80" viewBox="380 540 840 210" preserveAspectRatio="xMidYMid slice"><polygon points="710,164 890,164 1150,720 450,720" fill="url(#g-cone)" style="mix-blend-mode:screen"/><use href="#substrate"/></svg>`;
const mountainPlate = `${water}<polygon points="-40,-190 40,-190 90,70 -90,70" fill="url(#g-cone)" style="mix-blend-mode:screen"/><g opacity=".5"><use href="#shadow" transform="translate(10,54) scale(2.6,1.2)"/></g><g transform="translate(0,50) scale(1.05)"><use href="#mountain" style="--rock-a:#6b7480;--rock-b:#3e4650;--rock-edge:#2a3038;--strata:#9aa4b0;--fleck-o:0"/></g><g transform="translate(-70,40)"><use href="#moss"/></g><g transform="translate(64,30) scale(.8)"><use href="#moss"/></g>`;
const mossPlate = `${water}<g opacity=".5"><use href="#shadow" transform="translate(-20,44) scale(1.2,1)"/></g><g transform="translate(-110,46) scale(1.2)"><use href="#carpet"/></g><g transform="translate(70,48) scale(1.2)"><use href="#carpet"/></g><g transform="translate(-30,44) scale(1.5)"><use href="#mosstree"/></g><g transform="translate(96,30) scale(1.3)"><use href="#marimo"/></g>`;

const svg = (label, body) => `<svg viewBox="-160 -190 320 260" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${label}">${body}</svg>`;
const skel = (label, body) => `<svg viewBox="-160 -190 320 260" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${label}"><rect x="-160" y="-190" width="320" height="260" fill="#0f0d16"/>${body}</svg>`;

const pairs = [
  ["The Lamp", "One lit element on a dim page", lampPlate, lampSkeleton(),
   "one source. in the tank, the pendant; on the page, the one primary action that glows while every other block sits a step down, dimmer by distance. two lamps is a pet shop."],
  ["The Sword", "A list lit at the top, shaded at the base", swordPlate, swordSkeleton(),
   "a rosette of nine leaves, lit at the tip and shaded at the base, read in one look. a card of nine lines is the same plant: the title bright, each line under it a step darker, the eye finishing at the base without being asked."],
  ["Substrate", "Content over layout over tokens", substratePlate, substrateSkeleton(),
   "sand, then soil, then gravel, seen through the front glass. a page in three bands: the content on top, the layout grid it sits on, the row of tokens under that. view source on a good page and you find the same cutaway."],
  ["Mountains", "Navigation as a silhouette", mountainPlate, mountainSkeleton(),
   "stacked stone read as a range: one peak, two shoulders, strata running one way through all of it. navigation should read like that, one main section and a couple beside it, the grid through all of them, read as one shape before any stone."],
  ["Moss Tree, Carpet, Marimo", "Chips, an avatar, a footer", mossPlate, footerSkeleton(),
   "the front of the garden, the last thing the lamp lights, and nothing on it moves. the bottom of a page is the same place: chips, an avatar, a footer, small things that have finished being decided."],
];

const html = `<title>Tank and Skeleton</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400&display=swap">
${style}
<style>
  .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; align-items: start; margin: 0 0 12px; }
  .pair svg { width: 100%; height: auto; display: block; border-radius: 4px; }
  .pairhead { display: flex; align-items: baseline; gap: 16px; margin: 36px 0 12px; }
  .pairhead h2 { margin: 0; font-size: 16px; font-weight: 500; letter-spacing: 0; text-transform: none; color: var(--ink); }
  .pairhead .skel { font-family: "IBM Plex Mono", Consolas, monospace; font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
  .pairnote { font-family: "IBM Plex Mono", Consolas, monospace; font-size: 12.5px; line-height: 1.6; color: var(--muted); max-width: 90ch; margin: 0 0 8px; }
  .lib { position: absolute; width: 0; height: 0; overflow: hidden; }
  .nav { font-family: "IBM Plex Mono", Consolas, monospace; font-size: 12.5px; letter-spacing: .08em; text-transform: uppercase; margin: 0 0 30px; display: flex; gap: 22px; }
  .nav a { color: var(--muted); text-decoration: none; } .nav a:hover, .nav a[aria-current] { color: var(--accent); }
  @media (max-width: 560px) { .pair { grid-template-columns: 1fr; } }
</style>

<div class="page">
  <nav class="nav"><a href="./">Tanks</a><a href="./atoms.html">Atoms</a><a href="./counterparts.html" aria-current="page">Counterparts</a><a href="./checks.html">Checks</a></nav>
  <header>
    <div>
      <p class="eyebrow">Places to rest · counterparts</p>
      <h1>Tank and skeleton</h1>
      <p>Do the close compositions have a counterpart in the web? Five of them, and beside each the UX skeleton it rhymes with: the grey placeholder blocks a page shows before its content arrives, drawn in the atom's silhouette. Same lamp, same hierarchy, same layers, same range, same settled foreground. These pairs are the beats between the tanks.</p>
    </div>
    <div class="mechanisms">
      <b>Left</b> — the composition from the atom page, running on its own clocks<br>
      <b>Right</b> — the same shape as a skeleton screen: one warm light, everything else grey
    </div>
  </header>

  <svg class="lib" aria-hidden="true">
${defs}
  </svg>

${pairs.map(([title, skelTitle, left, right, note]) => `  <div class="pairhead"><h2>${title}</h2><span class="skel">${skelTitle}</span></div>
  <div class="pair">
    ${svg(title, left)}
    ${skel(skelTitle, right)}
  </div>
  <p class="pairnote">${note}</p>`).join("\n\n")}

  <footer>
    Generated by <code>tools/counterparts-gen.mjs</code> from the atom library. The skeletons use two greys, one warm light, and no text, because a skeleton screen has none either.
  </footer>
</div>
`;

writeFileSync(new URL("../counterparts.html", import.meta.url), toDocument(html, { description: "Five close compositions from the aquarium atoms, each paired with the UX skeleton screen it rhymes with.", url: "https://johnfrog76.github.io/aquarium-saver/counterparts.html" }));
console.log(`wrote counterparts.html with ${pairs.length} pairs`);
