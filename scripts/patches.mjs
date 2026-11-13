/* Generates the embroidered patches in public/images/stickers/, which live
   in the Archive folder (Finder → Archive, and Archive on the phone).

   Military pieces (aviator wings, a palm-tree crest, a round unit badge, a
   tiger-stripe name tape) and print pieces (zebra star, checker, paisley
   bandana, a music-staff ribbon), drawn like hand-made stickers: flat marker
   colours, dark ink outlines, light hatching, stitched borders, and a white
   die-cut edge. The print patches reuse the tiles from scripts/prints.mjs,
   so run that first if you change a print.

   The hand-drawn look is SVG filters: every line is pushed around by a
   low-frequency noise field (feTurbulence + feDisplacementMap), with a
   different seed for the colour and the ink layers so they sit slightly off
   each other, the way a marker drawing never quite lines up. Lettering is
   Permanent Marker (Apache 2.0), embedded as a small subset in each SVG,
   since an SVG shown as an <img> can't load fonts from elsewhere.

   Run: node scripts/patches.mjs */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "images", "stickers");
const FONT = `'Permanent Marker', 'Arial Black', Arial, sans-serif`;
// Just the letters the patches use (OLIVER NAUMOV NEW YORK CITY ✦).
const MARKER = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "fonts", "PermanentMarker-subset.woff2")).toString("base64");
const INK = "#211c18";

// Flat marker colours. GOLD[2] is the outline colour wherever the old
// bullion shading used it, so it's ink now.
const GOLD = ["#f6d98a", "#e3b24a", INK, "#e3b24a"];
const NAVY = "#2a3566";
const RED = "#d23a3f";
const CREAM = "#f6eed8";
const OLIVE = "#5b5a32";

/* ---------- shared defs ---------- */

const defs = () => `
  <style>@font-face{font-family:'Permanent Marker';src:url(data:font/woff2;base64,${MARKER}) format('woff2')}</style>
  <!-- "gold" is a flat marker yellow now, with the faintest variation. -->
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#eabd55"/><stop offset="1" stop-color="#dca640"/>
  </linearGradient>
  <!-- Hatching instead of woven texture: loose diagonal pen lines. -->
  <pattern id="twill" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(38)">
    <line x1="0" y1="2" x2="7" y2="2" stroke="${INK}" stroke-opacity="0.16" stroke-width="1.1" stroke-linecap="round"/>
  </pattern>
  <pattern id="satin" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(-48)">
    <line x1="0" y1="1.5" x2="5" y2="1.5" stroke="${INK}" stroke-opacity="0.18" stroke-width="0.9" stroke-linecap="round"/>
  </pattern>
  <!-- Inner shapes: their own wobble (different seed), so colour and ink
       don't register perfectly. -->
  <filter id="raised" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="11" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <!-- The whole patch: a hand wobble, then a white die-cut sticker edge and
       a soft shadow under it. -->
  <filter id="patch" x="-15%" y="-15%" width="130%" height="135%">
    <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="4.5" xChannelSelector="R" yChannelSelector="G" result="drawn"/>
    <feMorphology in="drawn" operator="dilate" radius="6" result="fat"/>
    <feFlood flood-color="#ffffff"/>
    <feComposite in2="fat" operator="in" result="edge"/>
    <feMorphology in="fat" operator="dilate" radius="0.8" result="fatter"/>
    <feFlood flood-color="${INK}" flood-opacity="0.18"/>
    <feComposite in2="fatter" operator="in" result="edgeLine"/>
    <feDropShadow in="edge" dx="0" dy="2.5" stdDeviation="2.5" flood-color="#000" flood-opacity="0.28" result="edgeShadow"/>
    <feMerge><feMergeNode in="edgeLine"/><feMergeNode in="edgeShadow"/><feMergeNode in="drawn"/></feMerge>
  </filter>`;

// A twisted gold rope along any shape: a thick gold stroke, then short
// diagonal dashes in two tones on top.
// `black` swaps the gold for black cord (zebra star).
const rope = (shape, width = 9, black = false) => {
    // A hand-drawn border: an ink outline, a band of colour, and a running
    // stitch drawn down its middle.
    const [band, stitch] = black ? ["#2b2b2b", "#e9e9e9"] : ["url(#gold)", INK];
    return `
  <g fill="none" stroke-linejoin="round" stroke-linecap="round">
    <g stroke="${INK}" stroke-width="${width + 3}">${shape}</g>
    <g stroke="${band}" stroke-width="${width - 1.5}">${shape}</g>
    <g stroke="${stitch}" stroke-width="1.5" stroke-dasharray="3.5 4.5" stroke-opacity="0.8">${shape}</g>
  </g>`;
};

// One of the site's print tiles (public/images/patterns, made by
// scripts/prints.mjs) as an SVG <pattern>, so patches share the exact prints.
const PATTERNS = path.join(OUT, "..", "patterns");
const printPattern = (name, id, scale = 1) => {
    const file = fs.readFileSync(path.join(PATTERNS, `${name}.svg`), "utf8");
    const [, w, h] = file.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    const inner = file.slice(file.indexOf(">") + 1, file.lastIndexOf("</svg>"));
    return `<pattern id="${id}" patternUnits="userSpaceOnUse" width="${w}" height="${h}" patternTransform="scale(${scale})">${inner}</pattern>`;
};

const star = (cx, cy, r, inner = 0.42) => {
    const pts = [];
    for (let i = 0; i < 10; i++) {
        const a = (Math.PI / 5) * i - Math.PI / 2;
        const rr = i % 2 ? r * inner : r;
        pts.push(`${(cx + Math.cos(a) * rr).toFixed(2)},${(cy + Math.sin(a) * rr).toFixed(2)}`);
    }
    return `<polygon points="${pts.join(" ")}"/>`;
};

// A sprig of laurel: leaves alternating along an arc.
const laurel = (cx, cy, r, from, to, mirror = 1) => {
    let s = "";
    const n = 9;
    for (let i = 0; i < n; i++) {
        const t = from + ((to - from) * i) / (n - 1);
        const x = cx + Math.cos(t) * r;
        const y = cy + Math.sin(t) * r;
        const ang = (t * 180) / Math.PI + 90 * mirror + (i % 2 ? 35 : -35);
        s += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="9" ry="3.8" transform="rotate(${ang.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    }
    return s;
};

// M: room around the artwork for the white die-cut edge and its shadow.
const M = 14;
const svg = (w, h, body) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-M} ${-M} ${w + M * 2} ${h + M * 2}" width="${w + M * 2}" height="${h + M * 2}">\n  <!-- Generated by scripts/patches.mjs -->\n  <defs>${defs()}</defs>\n${body}\n</svg>\n`;

/* ---------- patches ---------- */

// Aviator wings: tapered gold wings with feather stitching, a shield and a red star.
const WING = "M162 66 C196 52 238 44 292 38 C282 50 266 57 250 61 C266 63 274 69 273 74 C254 76 236 76 218 79 C229 81 234 86 231 90 C212 91 190 89 162 84 Z";
const wings = () => {
    let feathers = "";
    for (let i = 0; i < 8; i++) {
        const x = 176 + i * 14;
        feathers += `<path d="M${x} ${64 - i * 2.6} C${x + 6} ${70 - i * 2} ${x + 4} ${78 - i * 1.4} ${x - 2} ${86 - i * 0.5}"/>`;
    }
    const half = (flip) => `<g ${flip ? 'transform="translate(300 0) scale(-1 1)"' : ""}>
      <path d="${WING}" fill="url(#gold)" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="${WING}" fill="url(#satin)"/>
      <g fill="none" stroke="${INK}" stroke-width="1.3" stroke-opacity="0.7" stroke-linecap="round" clip-path="url(#wingClip)">${feathers}</g>
    </g>`;
    return svg(300, 130, `
  <defs><clipPath id="wingClip"><path d="${WING}"/></clipPath></defs>
  <g filter="url(#patch)">
    <g filter="url(#raised)">
      ${half(false)}${half(true)}
      <path d="M128 40 H172 V78 C172 96 150 106 150 106 C150 106 128 96 128 78 Z" fill="${NAVY}" stroke="url(#gold)" stroke-width="4"/>
      <g fill="${RED}" stroke="${GOLD[1]}" stroke-width="1.4">${star(150, 68, 16)}</g>
    </g>
  </g>`);
};

// Palm tree for the crest: a curved trunk with ring stitches and seven fronds.
const palm = (x, y, s, flip) => {
    let fronds = "";
    const angles = [-160, -128, -96, -64, -32, -4, 22];
    for (const a of angles) {
        const r = (a * Math.PI) / 180;
        const ex = Math.cos(r) * 46;
        const ey = Math.sin(r) * 34 + 14;
        const cx = Math.cos(r) * 26;
        const cy = Math.sin(r) * 34 - 8;
        fronds += `<path d="M0 0 Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)} Q${(cx * 0.8).toFixed(1)} ${(cy * 0.6 + 6).toFixed(1)} 0 4 Z" fill="#4f9a45" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`;
        fronds += `<path d="M0 2 Q${(cx * 0.9).toFixed(1)} ${(cy * 0.9).toFixed(1)} ${(ex * 0.95).toFixed(1)} ${(ey * 0.95).toFixed(1)}" fill="none" stroke="${INK}" stroke-opacity="0.55" stroke-width="1"/>`;
    }
    let rings = "";
    for (let i = 1; i < 9; i++) rings += `<path d="M${-5 + i * 0.6} ${i * 11} q5 3 10 0" fill="none" stroke="${INK}" stroke-width="1.2" stroke-linecap="round"/>`;
    return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
      <path d="M-4 2 Q-2 50 6 100 L-6 100 Q-10 50 -10 2 Z" fill="#a0683a" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>
      ${rings}${fronds}
    </g>`;
};

const SHIELD = "M44 70 H196 V150 C196 206 152 236 120 252 C88 236 44 206 44 150 Z";
const crest = () =>
    svg(240, 280, `
  <g filter="url(#patch)">
    <path d="${SHIELD}" fill="${NAVY}"/>
    <path d="${SHIELD}" fill="url(#twill)"/>
    <g filter="url(#raised)">
      ${palm(78, 112, 0.95, false)}
      ${palm(162, 112, 0.95, true)}
      <g fill="url(#gold)" stroke="${GOLD[2]}" stroke-width="1.2">${star(120, 162, 30)}</g>
      <g fill="${RED}">${star(120, 162, 11)}</g>
    </g>
    ${rope(`<path d="${SHIELD}"/>`)}
    <g filter="url(#raised)">
      <path d="M14 46 C40 30 60 54 120 50 C180 54 200 30 226 46 L214 58 L226 72 C200 58 180 80 120 76 C60 80 40 58 14 72 L26 58 Z" fill="${CREAM}" stroke="${GOLD[2]}" stroke-width="2"/>
      <path id="bannerText" d="M40 66 C70 58 90 64 120 64 C150 64 170 58 200 66" fill="none"/>
      <text font-family="${FONT}" font-size="17" letter-spacing="3" fill="${NAVY}" text-anchor="middle"><textPath href="#bannerText" startOffset="50%">NAUMOV</textPath></text>
      <g fill="url(#gold)" stroke="${GOLD[2]}" stroke-width="1">${star(90, 22, 9)}${star(120, 14, 11)}${star(150, 22, 9)}</g>
    </g>
  </g>`);

const badge = () =>
    svg(240, 240, `
  <g filter="url(#patch)">
    <circle cx="120" cy="120" r="108" fill="${NAVY}"/>
    <circle cx="120" cy="120" r="108" fill="url(#twill)"/>
    <g filter="url(#raised)">
      <circle cx="120" cy="120" r="66" fill="${RED}" stroke="${INK}" stroke-width="2.5"/>
      <circle cx="120" cy="120" r="66" fill="url(#twill)"/>
      <g fill="url(#gold)" stroke="${INK}" stroke-width="1.2">${laurel(120, 124, 52, Math.PI * 0.62, Math.PI * 1.22, 1)}${laurel(120, 124, 52, Math.PI * 0.38, -Math.PI * 0.22, -1)}</g>
      <g fill="url(#gold)" stroke="${GOLD[2]}" stroke-width="1.2">${star(120, 118, 34)}</g>
      <path id="ring" d="M120 120 m-86 0 a86 86 0 1 1 172 0 a86 86 0 1 1 -172 0" fill="none"/>
      <text font-family="${FONT}" font-size="17" letter-spacing="2.5" fill="${CREAM}"><textPath href="#ring" startOffset="2%">OLIVER NAUMOV ✦ NEW YORK CITY ✦</textPath></text>
    </g>
    ${rope(`<circle cx="120" cy="120" r="108"/>`)}
    <circle cx="120" cy="120" r="66" fill="none" stroke="url(#gold)" stroke-width="3"/>
  </g>`);

/* ---------- print patches (not military) ---------- */

const zebraStar = () => {
    const shape = star(100, 106, 92, 0.46);
    return svg(200, 200, `
  <defs>${printPattern("zebra", "zeb", 0.55)}</defs>
  <g filter="url(#patch)">
    <g filter="url(#raised)" stroke-linejoin="round"><g fill="url(#zeb)">${shape}</g></g>
    ${rope(shape, 7, true)}
  </g>`);
};

const checkerPatch = () =>
    svg(180, 180, `
  <defs>${printPattern("checker", "chk", 0.72)}</defs>
  <g filter="url(#patch)">
    <circle cx="90" cy="90" r="80" fill="url(#chk)"/>
    <g filter="url(#raised)">
      <circle cx="90" cy="90" r="36" fill="${CREAM}" stroke="#111" stroke-width="3"/>
      <g fill="${RED}" stroke="#111" stroke-width="2">${star(90, 92, 26)}</g>
    </g>
    ${rope(`<circle cx="90" cy="90" r="80"/>`, 8)}
  </g>`);

// A folded bandana: a triangle of red paisley with a white running stitch.
const BANDANA = "M16 26 Q100 18 184 26 Q170 36 104 168 Q100 176 96 168 Q30 36 16 26 Z";
const bandana = () =>
    svg(200, 186, `
  <defs>${printPattern("paisley-red", "pais", 0.7)}<clipPath id="band"><path d="${BANDANA}"/></clipPath></defs>
  <g filter="url(#patch)">
    <g filter="url(#raised)"><path d="${BANDANA}" fill="url(#pais)"/></g>
    <path d="M40 38 Q100 32 160 38 Q148 50 100 146 Q52 50 40 38 Z" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="5 4" clip-path="url(#band)"/>
    <path d="${BANDANA}" fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  </g>`);

// Music-staff ribbon: a cream banner whose five staff lines and notes follow
// its wave, with forked ends.
const ribbon = () => {
    const W = 300;
    const yAt = (x) => 62 + Math.sin((x / W) * Math.PI * 2) * 12;
    const edge = (off, from, to) => {
        const pts = [];
        for (let x = from; x <= to; x += 6) pts.push(`${x} ${(yAt(x) + off).toFixed(1)}`);
        return pts;
    };
    const top = edge(-26, 24, 276);
    const bottom = edge(26, 24, 276).reverse();
    const body = `M${top.join(" L")} L292 ${(yAt(276) - 30).toFixed(1)} L282 ${yAt(276).toFixed(1)} L292 ${(yAt(276) + 30).toFixed(1)} L${bottom.join(" L")} L8 ${(yAt(24) + 30).toFixed(1)} L18 ${yAt(24).toFixed(1)} L8 ${(yAt(24) - 30).toFixed(1)} Z`;
    let staff = "";
    for (let k = -2; k <= 2; k++) staff += `<path d="M${edge(k * 7, 30, 270).join(" L")}" fill="none" stroke="#1a1a1a" stroke-width="1.4"/>`;
    // Notes: [x, staff position (-4..4, half-steps of the line gap), beamed?]
    const notes = [[58, 1], [84, -1], [104, 2], [136, 0], [160, -2], [182, 1], [214, 3], [240, -1]];
    let ink = "";
    for (const [x, pos] of notes) {
        const y = yAt(x) + pos * 3.5;
        ink += `<ellipse cx="${x}" cy="${y.toFixed(1)}" rx="5.2" ry="3.8" transform="rotate(-22 ${x} ${y.toFixed(1)})" fill="#111"/>`;
        ink += `<rect x="${x + 3.6}" y="${(y - 24).toFixed(1)}" width="1.8" height="24" fill="#111"/>`;
    }
    // Beam the pairs, flag the singles.
    for (const [a, b] of [[0, 1], [3, 4], [6, 7]]) {
        const [x1] = notes[a];
        const [x2] = notes[b];
        const y1 = yAt(x1) + notes[a][1] * 3.5 - 24;
        const y2 = yAt(x2) + notes[b][1] * 3.5 - 24;
        ink += `<path d="M${x1 + 3.6} ${y1.toFixed(1)} L${x2 + 5.4} ${y2.toFixed(1)} L${x2 + 5.4} ${(y2 + 4).toFixed(1)} L${x1 + 3.6} ${(y1 + 4).toFixed(1)} Z" fill="#111"/>`;
    }
    for (const i of [2, 5]) {
        const [x, pos] = notes[i];
        const y = yAt(x) + pos * 3.5 - 24;
        ink += `<path d="M${x + 5.4} ${y.toFixed(1)} q8 4 6 14 q-2 -7 -6 -8 Z" fill="#111"/>`;
    }
    return svg(W, 124, `
  <g filter="url(#patch)">
    <g filter="url(#raised)"><path d="${body}" fill="${CREAM}"/><path d="${body}" fill="url(#twill)"/></g>
    <path d="${body}" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
    <g filter="url(#raised)">${staff}${ink}</g>
  </g>`);
};

// Tiger-stripe camo: olive-khaki ground, brown blotches, black brush strokes.
const tigerStripe = () => {
    let s = `<rect width="320" height="96" fill="#8f8a52"/>`;
    const browns = [[20, 18, 70, 10], [130, 60, 90, 12], [240, 26, 70, 11], [70, 76, 60, 9]];
    for (const [x, y, w, h] of browns) s += `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${h}" fill="#5e4b2a" transform="rotate(-6 ${x} ${y})"/>`;
    for (let i = 0; i < 9; i++) {
        const y = 8 + i * 10 + ((i * 7) % 5);
        const x = ((i * 53) % 260) - 20;
        s += `<path d="M${x} ${y} q30 -6 60 0 q30 6 70 -2 q12 -2 24 2 q-30 6 -60 5 q-30 -2 -70 2 q-14 1 -24 -7 Z" fill="#141410"/>`;
    }
    return s;
};
const nametape = () =>
    svg(320, 100, `
  <defs><clipPath id="tape"><rect x="6" y="6" width="308" height="84" rx="6"/></clipPath></defs>
  <g filter="url(#patch)">
    <g clip-path="url(#tape)">${tigerStripe()}<rect width="320" height="100" fill="url(#twill)"/></g>
    <rect x="6" y="6" width="308" height="84" rx="6" fill="none" stroke="#141410" stroke-width="7"/>
    <rect x="6" y="6" width="308" height="84" rx="6" fill="none" stroke="#3a3826" stroke-width="2" stroke-dasharray="2 3"/>
    <g filter="url(#raised)">
      <text x="160" y="64" font-family="${FONT}" font-size="40" letter-spacing="6" text-anchor="middle" fill="#efe6cf" stroke="#141410" stroke-width="2.5" paint-order="stroke">NAUMOV</text>
    </g>
  </g>`);

const PATCHES = {
    // military
    "patch-wings": wings,
    "patch-crest": crest,
    "patch-badge": badge,
    "patch-nametape": nametape,
    // prints and music
    "patch-zebra-star": zebraStar,
    "patch-checker": checkerPatch,
    "patch-bandana": bandana,
    "patch-ribbon": ribbon,
};

fs.mkdirSync(OUT, { recursive: true });
for (const [name, make] of Object.entries(PATCHES)) fs.writeFileSync(path.join(OUT, `${name}.svg`), make());
console.log(`wrote ${Object.keys(PATCHES).length} patches to public/images/stickers/`);
