// Turns a page authored in the "artifact" shape — a <title>, a font <link>,
// one or more <style> blocks, then a <div class="page"> — into a complete
// standalone HTML document. Every page in this repo goes through here, so
// the head is the same everywhere: dark before anything paints, one icon,
// one description.

const ICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='10' fill='#0d0b16'/><path d='M32 6v9' stroke='#2e2840' stroke-width='3'/><path d='M22 15h20l8 8H14z' fill='#1c1826'/><ellipse cx='32' cy='23' rx='12' ry='2.5' fill='#ffe0b0'/><rect x='10' y='30' width='44' height='26' rx='2' fill='#123a4f' stroke='#8fd0e6' stroke-width='1.5'/><path d='M14 52c8-14 12-6 20-16s8-2 16 6v10H14z' fill='#4f8a34'/><circle cx='40' cy='40' r='4' fill='#e0623c'/></svg>`
  );

export function toDocument(artifactHtml, { description = "", url = "" } = {}) {
  const cut = artifactHtml.indexOf('<div class="page">');
  if (cut < 0) throw new Error("page has no <div class=\"page\">");
  const head = artifactHtml.slice(0, cut).trim();
  const body = artifactHtml.slice(cut).trim();
  const title = (head.match(/<title>(.*?)<\/title>/) || ["", "Aquarium Saver"])[1];
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${description.replace(/"/g, "&quot;")}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description.replace(/"/g, "&quot;")}" />
    <meta property="og:type" content="website" />
    ${url ? `<link rel="canonical" href="${url}" />` : ""}
    <link rel="icon" href="${ICON}" />
    <style>
      /* painted before anything else so a slow font never shows a white flash:
         the whole thing is a dark room */
      html, body { margin: 0; background: #0d0b16; color: #d9d4e6; color-scheme: dark; }
      * { color-scheme: dark; }
      img { max-width: 100%; }
    </style>
    ${head}
  </head>
  <body>
    ${body}
  </body>
</html>
`;
}
