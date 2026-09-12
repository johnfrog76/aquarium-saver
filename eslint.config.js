import js from "@eslint/js";
import globals from "globals";

/**
 * Lint covers the tools and nothing else.
 *
 * The three tank pages are the product, and they are hand-drawn SVG and CSS
 * with no script in them at all — there is nothing for a JavaScript linter to
 * say about a coral. What can rot is `tools/`: the generators that write the
 * pages, the invariants that check them, and the test that runs those.
 *
 * Flat config, ESLint's recommended set, node globals. No plugins, because a
 * repo whose whole claim is "zero dependencies at run time" should not need a
 * dependency tree to check five files.
 */
export default [
  { ignores: ["node_modules/**", "dist/**", "*.html"] },

  {
    ...js.configs.recommended,
    files: ["**/*.mjs", "**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node },
    },
    rules: {
      ...js.configs.recommended.rules,
      // The generators keep long explanatory comments about the clocks and the
      // scene grammar, and name a few scene parts they do not place yet. An
      // underscore is the opt-out, the same convention the sibling repos use.
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      // The generators find their splice points by matching atoms.html's literal
      // text, indentation included — those runs of spaces in the regexes are the
      // anchor, not a typo, and {2} would only make them harder to read against
      // the file they match.
      "no-regex-spaces": "off",
      eqeqeq: ["error", "smart"],
      "prefer-const": "error",
      "no-var": "error",
    },
  },

  {
    // checks.html imports this module straight into a browser, so it must not
    // reach for anything node-only.
    files: ["tools/invariants.mjs"],
    languageOptions: { globals: {} },
  },
];
