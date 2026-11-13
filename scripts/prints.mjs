/* Generates the site's drawn prints — leopard, zebra, checker and bandana
   paisley —
   and everything built from them:

     public/images/patterns/<print>.svg        seamless tiles (CSS backgrounds)
     public/images/app-icons/folder-<print>.svg patterned Finder folders

   Every print is drawn from a seeded random generator, so re-running gives
   the same artwork. Tweak a colour or a SEED below and run:
     node scripts/prints.mjs */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "images");
const OUT = {
    patterns: path.join(ROOT, "patterns"),
    icons: path.join(ROOT, "app-icons"),
};

// Small deterministic PRNG (mulberry32).
const rng = (seed) => () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const f = (n) => Number(n.toFixed(2));

/* ---------- prints: each returns { w, h, body } for one seamless tile ---------- */

// Copies of an element across tile edges, so shapes crossing a seam wrap.
const wrapped = (w, h, draw) => {
    let out = "";
    for (const dx of [-w, 0, w]) for (const dy of [-h, 0, h]) out += draw(dx, dy);
    return out;
};

const leopard = ({ ground = "#e3a95f", centre = "#c27c37", ink = "#2b1a0e", seed = 11 } = {}) => {
    const W = 120;
    const r = rng(seed);
    const rosettes = [];
    for (let gy = 0; gy < 3; gy++)
        for (let gx = 0; gx < 3; gx++)
            rosettes.push({
                x: gx * 40 + 20 + (r() - 0.5) * 16 + (gy % 2) * 10,
                y: gy * 40 + 20 + (r() - 0.5) * 16,
                s: 9 + r() * 5,
                rot: r() * 360,
                n: 3 + Math.floor(r() * 3),
            });
    const specks = Array.from({ length: 7 }, () => ({ x: r() * W, y: r() * W, rx: 1.5 + r() * 2, ry: 1.2 + r() * 1.6, a: r() * 180 }));

    const body = wrapped(W, W, (dx, dy) => {
        let s = "";
        for (const ro of rosettes) {
            const cx = ro.x + dx;
            const cy = ro.y + dy;
            s += `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(ro.s * 0.8)}" ry="${f(ro.s * 0.65)}" transform="rotate(${f(ro.rot)} ${f(cx)} ${f(cy)})" fill="${centre}"/>`;
            // A broken ring of dark blobs around the lighter centre.
            for (let k = 0; k < ro.n; k++) {
                const a = ((k + 0.15) / ro.n) * Math.PI * 2 + (ro.rot * Math.PI) / 180;
                const bx = cx + Math.cos(a) * ro.s;
                const by = cy + Math.sin(a) * ro.s * 0.85;
                s += `<ellipse cx="${f(bx)}" cy="${f(by)}" rx="${f(ro.s * 0.5)}" ry="${f(ro.s * 0.24)}" transform="rotate(${f((a * 180) / Math.PI + 90)} ${f(bx)} ${f(by)})" fill="${ink}"/>`;
            }
        }
        for (const sp of specks)
            s += `<ellipse cx="${f(sp.x + dx)}" cy="${f(sp.y + dy)}" rx="${f(sp.rx)}" ry="${f(sp.ry)}" transform="rotate(${f(sp.a)} ${f(sp.x + dx)} ${f(sp.y + dy)})" fill="${ink}"/>`;
        return s;
    });
    return { w: W, h: W, body: `<rect width="${W}" height="${W}" fill="${ground}"/>${body}` };
};

const zebra = ({ ground = "#f4f1ea", ink = "#111111", seed = 5 } = {}) => {
    const W = 160;
    const PITCH = 20;
    const r = rng(seed);
    let stripes = "";
    for (let i = 0; i < W / PITCH; i++) {
        const cx = i * PITCH + PITCH / 2;
        const p1 = r() * Math.PI * 2;
        const p2 = r() * Math.PI * 2;
        const width = 6 + r() * 4;
        const left = [];
        const right = [];
        // Periodic in y over the tile height, so the tile repeats seamlessly.
        for (let y = 0; y <= W; y += 4) {
            const t = (y / W) * Math.PI * 2;
            const x = cx + Math.sin(t + p1) * 6 + Math.sin(t * 2 + p2) * 2;
            const w = Math.max(1.5, width + Math.sin(t * 2 + p2) * 4);
            left.push(`${f(x - w / 2)} ${y}`);
            right.unshift(`${f(x + w / 2)} ${y}`);
        }
        stripes += `<path d="M${left.join(" L")} L${right.join(" L")} Z" fill="${ink}"/>`;
    }
    return { w: W, h: W, body: `<rect width="${W}" height="${W}" fill="${ground}"/>${stripes}` };
};

const checker = ({ a = "#111111", b = "#f5f5f2", size = 16 } = {}) => ({
    w: size * 2,
    h: size * 2,
    body: `<rect width="${size * 2}" height="${size * 2}" fill="${b}"/><rect width="${size}" height="${size}" fill="${a}"/><rect x="${size}" y="${size}" width="${size}" height="${size}" fill="${a}"/>`,
});

// Bandana paisley: a curled teardrop, an inner teardrop, a halo of dots, and
// small four-dot flowers between motifs.
const TEAR = "M0 -18 C13 -18 20 -5 16 8 C12 20 -3 24 -11 16 C-18 9 -14 -2 -5 -3 C3 -4 6 4 1 8";
const paisley = ({ ground = "#c8102e", line = "#ffffff", accent = "#111111" } = {}) => {
    const W = 96;
    const motif = (x, y, rot, s) => {
        let m = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">`;
        m += `<path d="${TEAR}" fill="none" stroke="${line}" stroke-width="2.8" stroke-linecap="round"/>`;
        m += `<path d="${TEAR}" transform="translate(2 3) scale(0.5)" fill="${accent}"/>`;
        for (let k = 0; k < 11; k++) {
            const a = (k / 11) * Math.PI * 2;
            m += `<circle cx="${f(2 + Math.cos(a) * 24)}" cy="${f(3 + Math.sin(a) * 24)}" r="1.6" fill="${line}"/>`;
        }
        return m + "</g>";
    };
    const flower = (x, y) =>
        [[0, -3.2], [3.2, 0], [0, 3.2], [-3.2, 0]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r="2" fill="${line}"/>`).join("") +
        `<circle cx="${x}" cy="${y}" r="1.4" fill="${accent}"/>`;
    const body = wrapped(W, W, (dx, dy) => motif(26 + dx, 26 + dy, -25, 0.95) + motif(72 + dx, 72 + dy, 155, 0.95) + flower(74 + dx, 20 + dy) + flower(20 + dx, 76 + dy) + flower(48 + dx, 48 + dy));
    return { w: W, h: W, body: `<rect width="${W}" height="${W}" fill="${ground}"/>${body}` };
};

const PRINTS = {
    leopard: leopard(),
    zebra: zebra(),
    checker: checker(),
    "checker-red": checker({ a: "#c8102e", b: "#f5f5f2" }),
    "paisley-red": paisley(),
    "paisley-navy": paisley({ ground: "#1f2c5c", accent: "#c8102e" }),
};

const tileSvg = ({ w, h, body }) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>\n`;

// An SVG <pattern> of a print, for filling shapes inside another SVG.
const patternDef = (id, { w, h, body }, scale = 1) =>
    `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${w}" height="${h}" patternTransform="scale(${scale})">${body}</pattern>`;

/* ---------- patterned folders (same shape as scripts/app-icons.mjs) ---------- */

// Folders use real fabric photos where there is one (scripts/textures, cut
// from public/images/textures; sources in SOURCES.md there), embedded so the
// SVG stands alone as an <img>. Checker stays drawn: it's a flat print.
const TEXTURES = path.join(path.dirname(fileURLToPath(import.meta.url)), "textures");
// Tile sizes matching the swatch ring (SwatchRing.jsx), scaled from its 76px
// swatches to the folder's 104-unit front, so folder and swatch show the
// fabric at the same size.
const PHOTO_TILE = { leopard: 164, zebra: 178, "paisley-red": 205, "paisley-navy": 205 };
const photoPattern = (id, print, size) => {
    const file = path.join(TEXTURES, `${print}-256.jpg`);
    if (!fs.existsSync(file)) return null;
    const data = fs.readFileSync(file).toString("base64");
    return `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${size}" height="${size}"><image href="data:image/jpeg;base64,${data}" width="${size}" height="${size}"/></pattern>`;
};

const BACK = "M12 30 Q12 24 18 24 H47 Q51 24 54 27 L60 33 H110 Q116 33 116 39 V100 Q116 106 110 106 H18 Q12 106 12 100 Z";
const FRONT = "M12 47 Q12 42 17 42 H111 Q116 42 116 47 V100 Q116 106 110 106 H18 Q12 106 12 100 Z";

// [print, back-panel colour, pattern scale]. The back panel (the tab) has to
// read against the dark Finder window (#1e1e1e), so no near-blacks here.
const FOLDERS = {
    leopard: ["leopard", "#a8692a", 0.55],
    zebra: ["zebra", "#76767c", 0.5],
    checker: ["checker", "#76767c", 0.77],
    "checker-red": ["checker-red", "#a50f27", 0.6],
    "paisley-red": ["paisley-red", "#a50f27", 0.55],
    "paisley-navy": ["paisley-navy", "#3d4f96", 0.55],
};

const folderSvg = (name, [print, back, scale]) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128" role="img" aria-label="${name} folder">
  <!-- Generated by scripts/prints.mjs — edit it there, not here. -->
  <defs>
    ${photoPattern("p", print, PHOTO_TILE[print]) ?? patternDef("p", PRINTS[print], scale)}
    <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.32"/>
      <stop offset="0.45" stop-color="#ffffff" stop-opacity="0.04"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.18"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#000" flood-opacity="0.28"/>
    </filter>
    <clipPath id="front"><path d="${FRONT}"/></clipPath>
  </defs>
  <g filter="url(#shadow)">
    <path d="${BACK}" fill="${back}"/>
    <path d="${BACK}" fill="url(#sheen)"/>
    <path d="${FRONT}" fill="url(#p)"/>
  </g>
  <rect y="42" width="128" height="64" fill="url(#sheen)" clip-path="url(#front)"/>
  <path d="M17 42.75 H111" stroke="#ffffff" stroke-opacity="0.55" stroke-width="1.5"/>
  <path d="M18 24.75 H47 Q50.5 24.75 53 27.5 L59.5 33.75 H110" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="1.2"/>
</svg>
`;

/* ---------- write ---------- */

Object.values(OUT).forEach((dir) => fs.mkdirSync(dir, { recursive: true }));
for (const [name, tile] of Object.entries(PRINTS)) fs.writeFileSync(path.join(OUT.patterns, `${name}.svg`), tileSvg(tile));
for (const [name, spec] of Object.entries(FOLDERS)) fs.writeFileSync(path.join(OUT.icons, `folder-${name}.svg`), folderSvg(name, spec));

console.log(
    `wrote ${Object.keys(PRINTS).length} prints, ${Object.keys(FOLDERS).length} folders`
);
