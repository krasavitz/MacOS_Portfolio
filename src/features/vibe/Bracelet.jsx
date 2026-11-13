import { useEffect, useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "#utils/motion.js";

/* A chunky beaded bracelet, BAZO-style: tiles with keyboard emoticons
   between black beads and stars, strung between two tacks, with a black
   tassel hanging from each tack. It's drawn in an edgy, punk-zine ink style:
   scratchy outlines whose strokes overshoot the corners, hard offset
   shadows, spiky stars, white scratch highlights, marker lettering, and a
   "boiling" line (the sketch flips between three slightly different
   drawings a few times a second, like hand-drawn animation).
   It's a little rope simulation (Verlet): it sags under gravity, swings when
   the pointer brushes past, and any bead can be grabbed and flung.

   With `assemble` it takes shape on load: the bare cord hangs first, then
   each bead drops onto it in turn and the cord bounces under its weight.
   `onAssembled` fires once the last bead has landed.

   Change the beads by editing BEADS. Kinds: "star", "round", or any short
   text (a letter or an emoticon like "<3"), which becomes a tile. */

const BEADS = ["round", "round", "star", "<3", ":)", "xD", ":P", ";)", ":D", "star", "round", "round", "round"];

// Anything that isn't a round bead or a star is a tile, printed with its text.
const isTile = (kind) => kind !== "round" && kind !== "star";

const INK = "#161616";
const MARKER = `"Permanent Marker", "Arial Black", sans-serif`;
// The boil: how many drawings each shape flips between, and how often.
const BOIL_FRAMES = 3;
const BOIL_MS = 130;

// Small deterministic PRNG, so each bead's wobble is the same every frame.
const rng = (seed) => () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// A jittered point list around a circle.
const roughRing = (r, rand, wob, count = 12) =>
    Array.from({ length: count }, (_, k) => {
        const a = (k / count) * Math.PI * 2 + rand() * 0.25;
        const rr = r * (1 + (rand() - 0.5) * wob * 2);
        return [Math.cos(a) * rr, Math.sin(a) * rr];
    });

// A spiky star's points.
const spikyStar = (r, rand) =>
    Array.from({ length: 10 }, (_, k) => {
        const a = (Math.PI / 5) * k - Math.PI / 2 + (rand() - 0.5) * 0.08;
        const rr = (k % 2 ? r * 0.38 : r) * (1 + (rand() - 0.5) * 0.14);
        return [Math.cos(a) * rr, Math.sin(a) * rr];
    });

// A square's corners, a little off true.
const roughBox = (s, rand) => {
    const h = s / 2;
    const j = () => (rand() - 0.5) * s * 0.08;
    return [[-h + j(), -h + j()], [h + j(), -h + j()], [h + j(), h + j()], [-h + j(), h + j()]];
};

// Strokes for a polygon drawn the edgy way: every edge a separate straight
// stroke that runs past both corners, nudged off its true line.
const sketchEdges = (poly, rand, over = 2.6) =>
    poly.map((p, k) => {
        const q = poly[(k + 1) % poly.length];
        const dx = q[0] - p[0];
        const dy = q[1] - p[1];
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        const o1 = over * (0.4 + rand());
        const o2 = over * (0.4 + rand());
        const n = (rand() - 0.5) * 1.2;
        return [p[0] - ux * o1 - uy * n, p[1] - uy * o1 + ux * n, q[0] + ux * o2 - uy * n, q[1] + uy * o2 + ux * n];
    });

const strokeSegs = (ctx, segs) => {
    ctx.beginPath();
    for (const [x1, y1, x2, y2] of segs) {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
    }
    ctx.stroke();
};

const fillPoly = (ctx, poly) => {
    ctx.beginPath();
    poly.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.fill();
};

// No gravity on the string: it's held level, and each bead springs back
// to its place on the line (HOME) after a push or a drag.
const HOME = 0.12;
// Heavily damped, so a push settles quickly instead of bouncing about.
const FRICTION = 0.9;
const ITERATIONS = 12;
const HOVER_RADIUS = 34;
const TASSEL = { colour: "#111111", strands: 9, length: 26 };

// Assembly timing (ms): first bead, gap between beads, and each drop.
const ASSEMBLE_DELAY = 250;
const STAGGER = 95;
const DROP = 420;

// Eases in to land, with only the slightest overshoot.
const easeOutBack = (t) => 1 + 1.15 * (t - 1) ** 3 + 0.15 * (t - 1) ** 2;

const Bracelet = ({ width = 340, height = 190, beadSize = 24, assemble = true, onAssembled, className = "" }) => {
    const canvasRef = useRef(null);
    // Latest callback, read when assembly finishes, so a new function each
    // render doesn't restart the animation.
    const doneRef = useRef(onAssembled);
    useLayoutEffect(() => {
        doneRef.current = onAssembled;
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Rope: tack, one point per bead, tack. The string is exactly as long
        // as the gap between the tacks, so it's pulled taut in a straight,
        // level line; pushing or dragging a bead flexes it and it springs back.
        const PIN_Y = Math.min(30, height / 2);
        const pinL = { x: width * 0.08, y: PIN_Y };
        const pinR = { x: width * 0.92, y: PIN_Y };
        const n = BEADS.length + 2;
        const span = pinR.x - pinL.x;
        const seg = span / (n - 1);
        const pts = Array.from({ length: n }, (_, i) => {
            const t = i / (n - 1);
            const x = pinL.x + span * t;
            const y = pinL.y;
            return { x, y, px: x, py: y, hx: x };
        });

        // Tassels swing on a spring, kicked by how fast the end beads move.
        const tassels = [
            { pin: pinL, bead: 1, a: 0, w: 0 },
            { pin: pinR, bead: n - 2, a: 0, w: 0 },
        ];

        const pointer = { x: -999, y: -999, vx: 0, vy: 0 };
        let grabbed = -1;

        const local = (e) => {
            const r = canvas.getBoundingClientRect();
            return { x: ((e.clientX - r.left) / r.width) * width, y: ((e.clientY - r.top) / r.height) * height };
        };

        const nearest = (p) => {
            let best = -1;
            let bestD = beadSize;
            for (let i = 1; i < n - 1; i++) {
                const d = Math.hypot(pts[i].x - p.x, pts[i].y - p.y);
                if (d < bestD) {
                    best = i;
                    bestD = d;
                }
            }
            return best;
        };

        const onMove = (e) => {
            const p = local(e);
            pointer.vx = p.x - pointer.x;
            pointer.vy = p.y - pointer.y;
            pointer.x = p.x;
            pointer.y = p.y;
            canvas.style.cursor = grabbed >= 0 ? "grabbing" : nearest(p) >= 0 ? "grab" : "";
        };

        const onDown = (e) => {
            const p = local(e);
            const i = nearest(p);
            if (i < 0) return;
            grabbed = i;
            pointer.x = p.x;
            pointer.y = p.y;
            canvas.setPointerCapture(e.pointerId);
            e.preventDefault();
        };

        const onUp = () => {
            grabbed = -1;
        };

        const step = () => {
            for (let i = 1; i < n - 1; i++) {
                const p = pts[i];
                const vx = (p.x - p.px) * FRICTION;
                const vy = (p.y - p.py) * FRICTION;
                p.px = p.x;
                p.py = p.y;
                p.x += vx + (p.hx - p.x) * HOME;
                p.y += vy + (PIN_Y - p.y) * HOME;

                // Brushing past nudges beads along with the pointer.
                if (grabbed < 0) {
                    const d = Math.hypot(p.x - pointer.x, p.y - pointer.y);
                    if (d < HOVER_RADIUS) {
                        const k = (1 - d / HOVER_RADIUS) * 0.18;
                        p.x += Math.max(-6, Math.min(6, pointer.vx)) * k;
                        p.y += Math.max(-6, Math.min(6, pointer.vy)) * k;
                    }
                }
            }
            pointer.vx *= 0.6;
            pointer.vy *= 0.6;

            for (const t of tassels) {
                const b = pts[t.bead];
                t.w += -(b.x - b.px) * 0.012 - t.a * 0.05;
                t.w *= 0.93;
                t.a = Math.max(-0.9, Math.min(0.9, t.a + t.w));
            }

            if (grabbed >= 0) {
                pts[grabbed].x = pointer.x;
                pts[grabbed].y = pointer.y;
            }

            for (let k = 0; k < ITERATIONS; k++) {
                for (let i = 0; i < n - 1; i++) {
                    const a = pts[i];
                    const b = pts[i + 1];
                    const dx = b.x - a.x;
                    const dy = b.y - a.y;
                    const d = Math.hypot(dx, dy) || 0.001;
                    const diff = (d - seg) / d / 2;
                    const aFixed = i === 0 || i === grabbed;
                    const bFixed = i + 1 === n - 1 || i + 1 === grabbed;
                    if (!aFixed && !bFixed) {
                        a.x += dx * diff;
                        a.y += dy * diff;
                        b.x -= dx * diff;
                        b.y -= dy * diff;
                    } else if (!aFixed) {
                        a.x += dx * diff * 2;
                        a.y += dy * diff * 2;
                    } else if (!bFixed) {
                        b.x -= dx * diff * 2;
                        b.y -= dy * diff * 2;
                    }
                }
                Object.assign(pts[0], { x: pinL.x, y: pinL.y });
                Object.assign(pts[n - 1], { x: pinR.x, y: pinR.y });
                // Keep beads inside the canvas.
                for (let i = 1; i < n - 1; i++) {
                    pts[i].x = Math.max(beadSize / 2, Math.min(width - beadSize / 2, pts[i].x));
                    pts[i].y = Math.max(beadSize / 2, Math.min(height - beadSize / 2, pts[i].y));
                }
            }
        };

        // Each bead's drawings, one per boil frame, built once so the lines
        // only change on the boil, never from frame to frame.
        const r0 = beadSize / 2;
        const sketches = Array.from({ length: BOIL_FRAMES }, (_, v) =>
            BEADS.map((kind, i) => {
                const rand = rng(i * 97 + v * 7919 + 13);
                if (isTile(kind)) {
                    const box = roughBox(beadSize * 0.94, rand);
                    return { box, edges: [...sketchEdges(box, rand), ...sketchEdges(roughBox(beadSize * 0.94, rand), rand, 1.5)], tilt: (rand() - 0.5) * 0.1 };
                }
                if (kind === "star") {
                    const star = spikyStar(r0 * 1.18, rand);
                    return { star, edges: sketchEdges(star, rand, 2.2) };
                }
                return {
                    ring: roughRing(r0 * 0.84, rand, 0.05),
                    rings: [roughRing(r0 * 0.9, rand, 0.06), roughRing(r0 * 0.86, rand, 0.08)],
                    // Three short scratch highlights, upper left.
                    scratches: Array.from({ length: 3 }, (_, k) => {
                        const ox = -r0 * (0.48 - k * 0.14) + (rand() - 0.5);
                        const oy = -r0 * (0.2 + k * 0.16) + (rand() - 0.5);
                        const l = r0 * (0.32 - k * 0.06);
                        return [ox, oy, ox + l * 0.7, oy - l * 0.7];
                    }),
                };
            })
        );
        // The cord's wobble, per boil frame and per point.
        const cordJitter = Array.from({ length: BOIL_FRAMES }, (_, v) => {
            const rand = rng(v * 31 + 5);
            return Array.from({ length: n * 2 }, () => (rand() - 0.5) * 1.1);
        });
        let boil = 0;

        const ringPath = (pts) => {
            ctx.beginPath();
            const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
            const m0 = mid(pts[pts.length - 1], pts[0]);
            ctx.moveTo(m0[0], m0[1]);
            pts.forEach((p, k) => {
                const m = mid(p, pts[(k + 1) % pts.length]);
                ctx.quadraticCurveTo(p[0], p[1], m[0], m[1]);
            });
            ctx.closePath();
        };

        const drawBead = (kind, x, y, angle, scale = 1, idx = 0) => {
            const sk = sketches[boil][idx];
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.scale(scale, scale);
            ctx.lineCap = "round";
            ctx.lineJoin = "miter";
            ctx.strokeStyle = INK;

            if (isTile(kind)) {
                // Letter tile: hard black offset shadow, white face, edges
                // drawn as overshooting strokes, a marker capital.
                ctx.rotate(sk.tilt);
                ctx.fillStyle = INK;
                ctx.save();
                ctx.translate(2.6, 2.6);
                fillPoly(ctx, sk.box);
                ctx.restore();
                ctx.fillStyle = "#ffffff";
                fillPoly(ctx, sk.box);
                ctx.lineWidth = 1.7;
                strokeSegs(ctx, sk.edges);
                ctx.fillStyle = INK;
                // Two characters need a smaller size than one to fit the tile.
                ctx.font = `${Math.round(beadSize * (kind.length > 1 ? 0.58 : 0.66))}px ${MARKER}`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(kind, 0, beadSize * 0.04);
            } else if (kind === "star") {
                ctx.fillStyle = INK;
                fillPoly(ctx, sk.star);
                ctx.lineWidth = 1.4;
                strokeSegs(ctx, sk.edges);
            } else {
                // Round bead: solid ink, two scratchy rings over it, white
                // scratch highlights.
                ctx.fillStyle = INK;
                ringPath(sk.ring);
                ctx.fill();
                ctx.lineWidth = 1.5;
                ringPath(sk.rings[0]);
                ctx.stroke();
                ctx.lineWidth = 0.9;
                ringPath(sk.rings[1]);
                ctx.stroke();
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 1.5;
                strokeSegs(ctx, sk.scratches);
            }
            ctx.restore();
        };

        // Tacks: a white pin head, ringed in scratchy ink.
        const drawTack = ({ x, y }) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(0, 0, 4.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = INK;
            ctx.lineWidth = 1.6;
            ringPath(roughRing(4.8, rng(boil * 11 + x | 0), 0.1, 8));
            ctx.stroke();
            ctx.fillStyle = INK;
            ctx.fillRect(-1.4, -1.4, 2.8, 2.8);
            ctx.restore();
        };

        const drawTassel = ({ pin, a }) => {
            ctx.save();
            ctx.translate(pin.x, pin.y);
            ctx.rotate(a);
            // Strands fan out a little from the cap and trail with the swing.
            ctx.strokeStyle = TASSEL.colour;
            ctx.lineWidth = 1.7;
            ctx.lineCap = "round";
            for (let k = 0; k < TASSEL.strands; k++) {
                const spread = (k / (TASSEL.strands - 1) - 0.5) * 7;
                const len = TASSEL.length * (0.85 + ((k * 7) % 5) / 25);
                ctx.beginPath();
                ctx.moveTo(spread * 0.4, 12);
                ctx.quadraticCurveTo(spread * 0.8 - a * 6, 12 + len * 0.5, spread - a * 10, 12 + len);
                ctx.stroke();
            }
            ctx.fillStyle = INK;
            ctx.fillRect(-4.5, 3.5, 9, 9.5);
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(-3, 6);
            ctx.lineTo(3, 6);
            ctx.moveTo(-3, 9.5);
            ctx.lineTo(3, 9.5);
            ctx.stroke();
            ctx.restore();
        };

        // When each bead appears; -Infinity means it's already on the cord.
        const still = prefersReducedMotion();
        const startAt = performance.now();
        const born = Array.from({ length: n }, (_, i) =>
            assemble && !still ? startAt + ASSEMBLE_DELAY + (i - 1) * STAGGER : -Infinity
        );
        const landed = new Array(n).fill(!assemble || still);
        const finishAt = born[n - 2] + DROP;
        let finished = false;

        const draw = (now = performance.now()) => {
            ctx.clearRect(0, 0, width, height);
            for (const t of tassels) drawTassel(t);

            if (!still) boil = Math.floor(now / BOIL_MS) % BOIL_FRAMES;

            // The cord: two scratchy passes through the beads, each with its
            // own wobble, like a line gone over twice.
            ctx.strokeStyle = INK;
            ctx.lineCap = "round";
            const jit = cordJitter[boil];
            for (const [pass, w] of [[0, 1.8], [1, 0.9]]) {
                ctx.lineWidth = w;
                ctx.beginPath();
                ctx.moveTo(pts[0].x, pts[0].y);
                for (let i = 1; i < n - 1; i++) {
                    const mx = (pts[i].x + pts[i + 1].x) / 2;
                    const my = (pts[i].y + pts[i + 1].y) / 2 + jit[i * 2 + pass];
                    ctx.quadraticCurveTo(pts[i].x, pts[i].y + jit[i * 2 + pass] * 0.5, mx, my);
                }
                ctx.lineTo(pts[n - 1].x, pts[n - 1].y);
                ctx.stroke();
            }

            for (let i = 1; i < n - 1; i++) {
                const t = (now - born[i]) / DROP;
                if (t <= 0) continue;
                const a = Math.atan2(pts[i + 1].y - pts[i - 1].y, pts[i + 1].x - pts[i - 1].x);
                if (t >= 1) {
                    drawBead(BEADS[i - 1], pts[i].x, pts[i].y, a, 1, i - 1);
                    continue;
                }
                // Dropping in: falls from above, fades and grows into place.
                if (!landed[i] && t > 0.7) {
                    landed[i] = true;
                    pts[i].py -= 0.6; // its weight tugs the cord down, a little
                }
                ctx.save();
                ctx.globalAlpha = Math.min(1, t * 2.5);
                drawBead(BEADS[i - 1], pts[i].x, pts[i].y - (1 - easeOutBack(t)) * 48, a, 0.55 + 0.45 * Math.min(1, t * 1.3), i - 1);
                ctx.restore();
            }
            drawTack(pinL);
            drawTack(pinR);
        };

        // Settle into its hanging shape before the first paint.
        for (let i = 0; i < 240; i++) step();
        draw();

        if (still || !assemble) doneRef.current?.();
        if (still) return;

        let raf = 0;
        let last = performance.now();
        let acc = 0;
        const loop = (now) => {
            acc += Math.min(now - last, 100);
            last = now;
            while (acc >= 1000 / 60) {
                step();
                acc -= 1000 / 60;
            }
            draw(now);
            if (!finished && now >= finishAt) {
                finished = true;
                if (assemble) doneRef.current?.();
            }
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);

        window.addEventListener("pointermove", onMove, { passive: true });
        canvas.addEventListener("pointerdown", onDown);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onUp);

        // Fonts can arrive after the first frame; the loop repaints anyway.
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("pointermove", onMove);
            canvas.removeEventListener("pointerdown", onDown);
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("pointercancel", onUp);
        };
    }, [width, height, beadSize, assemble]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ width, height, touchAction: "none" }}
            role="img"
            aria-label="Beaded bracelet with keyboard emoticons"
        />
    );
};

export default Bracelet;
