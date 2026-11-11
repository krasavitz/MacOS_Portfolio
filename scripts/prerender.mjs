/* Post-build step: bakes search-friendly HTML into dist/.

   1. Every /simple page is rendered to real HTML (via src/entry-server.jsx)
      and written to dist/<path>/index.html, with that page's own title,
      description, canonical URL, share image and structured data.
   2. The home page (/) gets the same head treatment plus a <noscript> list of
      links, so crawlers that don't run JavaScript can still find every page.
   3. dist/sitemap.xml is written from the same list of pages.

   Runs after `vite build` and `vite build --ssr` — see "build" in
   package.json. Page copy lives in src/seo.js, not here. */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const server = await import(pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href);
const { render, routeMeta, indexablePaths, personSchema, SITE_URL } = server;

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");

const escape = (value) =>
    String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const urlFor = (p) => `${SITE_URL}${p === "/" ? "/" : p}`;

const headFor = (p) => {
    const { title, description, image } = routeMeta(p);
    const url = urlFor(p);
    const type = p.startsWith("/simple/") && p !== "/simple/about" ? "article" : "website";

    return [
        `<title>${escape(title)}</title>`,
        `<meta name="description" content="${escape(description)}" />`,
        `<link rel="canonical" href="${url}" />`,
        `<meta property="og:type" content="${type}" />`,
        `<meta property="og:site_name" content="Oliver Naumov" />`,
        `<meta property="og:title" content="${escape(title)}" />`,
        `<meta property="og:description" content="${escape(description)}" />`,
        `<meta property="og:url" content="${url}" />`,
        `<meta property="og:image" content="${escape(image)}" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${escape(title)}" />`,
        `<meta name="twitter:description" content="${escape(description)}" />`,
        `<meta name="twitter:image" content="${escape(image)}" />`,
        `<script type="application/ld+json">${JSON.stringify(personSchema()).replace(/</g, "\\u003c")}</script>`,
    ].join("\n    ");
};

// Plain links to every page, for crawlers that never run the app. Hidden from
// everyone else by <noscript>; the content matches what the app shows.
const linksFor = (paths) =>
    `<noscript>
      <h1>Oliver Naumov, product designer and founder</h1>
      <nav>
        <ul>
${paths
    .filter((p) => p !== "/")
    .map((p) => `          <li><a href="${p}">${escape(routeMeta(p).title.replace(/, Oliver Naumov$/, ""))}</a></li>`)
    .join("\n")}
        </ul>
      </nav>
    </noscript>`;

// The pre-rendered pages fade content in with JavaScript (.reveal); without
// it, show everything.
const NOSCRIPT_REVEAL = `<noscript><style>.reveal{opacity:1!important;transform:none!important}</style></noscript>`;

const SEO_BLOCK = /<!-- seo:start[\s\S]*?<!-- seo:end -->/;
if (!SEO_BLOCK.test(template)) throw new Error("index.html is missing the seo:start / seo:end markers");

const paths = indexablePaths();

for (const p of paths) {
    let html = template.replace(SEO_BLOCK, headFor(p));

    if (p === "/") {
        html = html.replace("<!-- seo:links -->", linksFor(paths));
    } else {
        html = html
            .replace("<!-- seo:links -->", NOSCRIPT_REVEAL)
            .replace('<div id="root"></div>', `<div id="root">${render(p)}</div>`);
    }

    const out = p === "/" ? path.join(dist, "index.html") : path.join(dist, p.slice(1), "index.html");
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
    .map(
        (p) => `  <url>
    <loc>${urlFor(p)}</loc>
    <lastmod>${today}</lastmod>
    <priority>${p === "/" ? "1.0" : p === "/simple" ? "0.9" : "0.7"}</priority>
  </url>`
    )
    .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);

console.log(`prerendered ${paths.length} pages + sitemap.xml`);
