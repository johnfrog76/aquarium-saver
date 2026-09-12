// The invariants that make a tank restful, as pure functions over page HTML.
//
// Nothing in here touches node or the DOM: it takes the three pages as
// strings and returns a list of results. That is deliberate. `tools/checks.mjs`
// runs it from a terminal, `tools/checks.test.mjs` runs it under node:test,
// and `checks.html` imports this very file in the browser — so the page in
// front of a visitor cannot claim a check that CI does not also run.
//
// The rules themselves are the deal the tanks make with you:
//
//   · no page runs a script
//   · no room clock is under seven seconds, and none is a two-stop metronome
//   · reduced motion shows the resting pose, not frame zero
//   · every clocked instance starts mid-cycle
//   · salt water and the planted garden never share a tank
//   · CO2 and pearling are fresh water only; shrimp are salt water only
//   · one light per tank

/** Fin flutter, tail wag, antenna twitch and the bubble rise are sub-motions
 *  of an atom, not clocks of the room, so the seven-second floor is not theirs. */
const SUB_MOTIONS = new Set(["pectoral", "tail-ripple", "tail-wag", "twitch", "rise"]);

/** Two drifts that have to loop seamlessly, so two stops is correct for them. */
const SEAMLESS = new Set(["surface-drift", "caustic-a"]);

const FRESH = [
  "#sword", "#stems", "#eelgrass", '#moss"', "#mosstree", "#carpet", "#marimo",
  "#discus", "#school", "#bubbles", "#diffuser", "#driftwood", '#lamp"', "#substrate",
];
const SALT = ["#clam", "#anemone", "#clown", "#shrimp", "#reefbar", "#coral-"];

/** The stylesheet that carries the room's clocks lives at the end of atoms.html. */
function themeStyle(atoms) {
  const start = atoms.lastIndexOf("<style>", atoms.indexOf(":root"));
  return atoms.slice(start, atoms.indexOf("</style>", start));
}

/** Walk to the matching brace so nested rule blocks count as one keyframes body. */
function keyframeBlocks(style) {
  const blocks = [];
  for (const m of style.matchAll(/@keyframes\s+([\w-]+)\s*\{/g)) {
    let depth = 1;
    let i = m.index + m[0].length;
    while (i < style.length && depth > 0) {
      if (style[i] === "{") depth++;
      else if (style[i] === "}") depth--;
      i++;
    }
    blocks.push([m[1], style.slice(m.index + m[0].length, i - 1)]);
  }
  return blocks;
}

/**
 * Run every invariant over the three pages.
 *
 * @param {{atoms: string, index: string, counterparts: string}} pages
 * @returns {{name: string, ok: boolean, detail: string}[]}
 */
export function runChecks({ atoms, index, counterparts }) {
  const results = [];
  const check = (name, ok, detail = "") => results.push({ name, ok: Boolean(ok), detail });
  const style = themeStyle(atoms);

  // 1. No script runs on any page.
  for (const [name, html] of [
    ["atoms.html", atoms],
    ["index.html", index],
    ["counterparts.html", counterparts],
  ]) {
    check(`${name} has no <script>`, !/<script[\s>]/i.test(html));
  }

  // 2. Every room clock is seven seconds or longer.
  const clocks = [...style.matchAll(/animation:\s*([\w-]+)\s+(?:var\([^)]*,\s*)?([\d.]+)s/g)];
  const slow = clocks.filter(([, name]) => !SUB_MOTIONS.has(name));
  const tooFast = slow.filter(([, , s]) => Number(s) < 7).map(([, name, s]) => `${name} ${s}s`);
  check("every room clock is 7 s or longer", tooFast.length === 0, tooFast.join(", ") || `${slow.length} clocks`);

  // 3. Uneven keyframes: no room clock is a plain two-stop metronome, except
  //    the seamless drifts.
  const metronomes = keyframeBlocks(style)
    .filter(([name, body]) =>
      !SEAMLESS.has(name) && !SUB_MOTIONS.has(name) && (body.match(/\d+%/g) || []).length <= 2)
    .map(([name]) => name);
  check("no room clock is a two-stop metronome", metronomes.length === 0, metronomes.join(", "));

  // 4. Reduced motion shows the resting pose.
  check(
    "prefers-reduced-motion stops every animation",
    /prefers-reduced-motion:\s*reduce[\s\S]*animation:\s*none/.test(style),
  );

  // 5. Every instance of a clocked atom starts mid-cycle.
  const corals = [...atoms.matchAll(/<use href="#coral-[abc]"[^>]*>/g)].map((m) => m[0]);
  check(
    "every coral instance has --period and --phase",
    corals.every((u) => /--period:/.test(u) && /--phase:/.test(u)),
    `${corals.length} corals`,
  );
  // the clock rides the <g>, not the <circle> — a CSS animation on a geometry
  // element does not run inside a <use> shadow tree when a consumer mounts the
  // symbols from a separate <svg><defs>, so every clocked atom animates a group
  const bubbles = [...atoms.matchAll(/<g class="bubble"[^>]*>/g)].map((m) => m[0]);
  check(
    "every bubble has its own duration and phase",
    bubbles.length === 12 && bubbles.every((b) => /--d:/.test(b) && /--p:/.test(b)),
    `${bubbles.length} bubbles`,
  );

  // 6. Two worlds, one rule: salt water and the planted garden never share a tank.
  const scenes = [...index.matchAll(/<svg class="stage" data-scene="([\w-]+)"[\s\S]*?<\/svg>/g)];
  check("index.html has seven tanks", scenes.length === 7, `${scenes.length}`);
  for (const [svg, id] of scenes) {
    const fresh = FRESH.filter((a) => svg.includes(`href="${a}`));
    const salt = SALT.filter((a) => svg.includes(`href="${a}`));
    check(
      `${id}: one world only`,
      fresh.length === 0 || salt.length === 0,
      fresh.length && salt.length
        ? `fresh ${fresh.join(" ")} with salt ${salt.join(" ")}`
        : salt.length
          ? "salt"
          : "fresh",
    );
    const lights = (svg.match(/href="#lamp"|href="#reefbar"/g) || []).length;
    check(`${id}: exactly one light`, lights === 1, `${lights}`);
    const co2 = /href="#bubbles"|href="#diffuser"/.test(svg);
    const pearls = /href="#sword"/.test(svg);
    check(`${id}: CO2 and pearling only in fresh water`, salt.length === 0 || (!co2 && !pearls));
  }

  // 7. Shrimp are salt water only.
  const shrimpInFresh = scenes
    .filter(([svg]) => svg.includes('href="#shrimp"') && FRESH.some((a) => svg.includes(`href="${a}`)))
    .map(([, id]) => id);
  check("shrimp appear in salt water only", shrimpInFresh.length === 0, shrimpInFresh.join(", "));

  return results;
}

/** The three files the checks read, in the order runChecks wants them. */
export const PAGES = ["atoms.html", "index.html", "counterparts.html"];
