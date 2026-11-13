import { useEffect, useRef } from "react";
import {
    HORSE_FRAMES,
    HORSE_WIDTH as W,
    HORSE_HEIGHT as H,
    HORSE_FRAME_MS,
    HORSE_DOT_RADIUS,
} from "#components/horseFrames.js";
import { prefersReducedMotion } from "#utils/motion.js";

/* The desktop/springboard background: the galloping dot-matrix horse in iPod
   colours, redrawn
   live on a canvas from the GIF's traced frames (see horseFrames.js) so the
   dots can react to the visitor.

   Interaction: the dots sit on an invisible springy field. Moving the pointer
   over the horse pushes the field away from it, so the dots part around the
   cursor and wobble back into place when it leaves. A click or tap sends a
   burst through the field. The field (not the dots) carries the physics
   because the dots themselves change from frame to frame as the horse runs —
   a dot that appears simply inherits whatever displacement is under it.

   Fixed behind every shell and never takes pointer events itself; it listens
   on the window, so it still reacts when the pointer is over the desktop. */

// Field resolution, in the GIF's pixel space.
const CELL = 10;
const COLS = Math.ceil(W / CELL) + 1;
const ROWS = Math.ceil(H / CELL) + 1;

const HOVER_RADIUS = 95; // how far from the pointer dots get pushed
const HOVER_PUSH = 30; // max displacement at the pointer, px
const BURST_RADIUS = 170;
const BURST_KICK = 15; // initial velocity at the centre of a click burst
const STIFFNESS = 0.09; // spring back toward rest/target
const DAMPING = 0.82; // velocity kept per tick (lower = settles faster)

/* The dots run through the iPod nano colours, left to right across the
   horse, and the band slowly drifts so the colours flow through it as it
   gallops. Same family as the app icons (scripts/app-icons.mjs). */
const IPOD = ["#ff4f9a", "#9b5cf0", "#3b8cff", "#3fbf4a", "#ffc21a", "#ff7a1a", "#e8243c"].map((hex) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
]);
const COLOUR_SPAN = 420; // px of horse per full trip through the palette
const COLOUR_DRIFT = 1 / 24000; // one full cycle every 24 s

// Colour at position u along the palette, looping, blended between stops.
const ipodColour = (u) => {
    const pos = (((u % 1) + 1) % 1) * IPOD.length;
    const i = Math.floor(pos);
    const f = pos - i;
    const [r1, g1, b1] = IPOD[i];
    const [r2, g2, b2] = IPOD[(i + 1) % IPOD.length];
    return `rgb(${Math.round(r1 + (r2 - r1) * f)},${Math.round(g1 + (g2 - g1) * f)},${Math.round(b1 + (b2 - b1) * f)})`;
};

const Wallpaper = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx) return;

        const still = prefersReducedMotion();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Displacement field: offset (ox, oy) and velocity (vx, vy) per cell.
        const ox = new Float32Array(COLS * ROWS);
        const oy = new Float32Array(COLS * ROWS);
        const vx = new Float32Array(COLS * ROWS);
        const vy = new Float32Array(COLS * ROWS);

        // Pointer in GIF space; `active` while it's over the page.
        const pointer = { x: 0, y: 0, active: false };

        const toLocal = (e) => {
            const r = canvas.getBoundingClientRect();
            if (!r.width) return null;
            return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
        };

        const onMove = (e) => {
            const p = toLocal(e);
            if (!p) return;
            pointer.x = p.x;
            pointer.y = p.y;
            pointer.active = true;
        };

        const onLeave = () => {
            pointer.active = false;
        };

        // Touch has no hover: once the finger lifts, let the dots settle.
        const onUp = (e) => {
            if (e.pointerType !== "mouse") pointer.active = false;
        };

        const onDown = (e) => {
            const p = toLocal(e);
            if (!p) return;
            for (let j = 0; j < ROWS; j++) {
                for (let i = 0; i < COLS; i++) {
                    const dx = i * CELL - p.x;
                    const dy = j * CELL - p.y;
                    const d = Math.hypot(dx, dy);
                    if (d > BURST_RADIUS || d < 0.001) continue;
                    const k = BURST_KICK * (1 - d / BURST_RADIUS) ** 1.5;
                    vx[j * COLS + i] += (dx / d) * k;
                    vy[j * COLS + i] += (dy / d) * k;
                }
            }
        };

        const step = () => {
            for (let j = 0; j < ROWS; j++) {
                for (let i = 0; i < COLS; i++) {
                    const c = j * COLS + i;
                    let tx = 0;
                    let ty = 0;

                    if (pointer.active) {
                        const dx = i * CELL - pointer.x;
                        const dy = j * CELL - pointer.y;
                        const d = Math.hypot(dx, dy);
                        if (d < HOVER_RADIUS && d > 0.001) {
                            const k = HOVER_PUSH * (1 - d / HOVER_RADIUS) ** 2;
                            tx = (dx / d) * k;
                            ty = (dy / d) * k;
                        }
                    }

                    vx[c] = (vx[c] + (tx - ox[c]) * STIFFNESS) * DAMPING;
                    vy[c] = (vy[c] + (ty - oy[c]) * STIFFNESS) * DAMPING;
                    ox[c] += vx[c];
                    oy[c] += vy[c];
                }
            }
        };

        // Bilinear sample of the field at a dot's position.
        const sample = (x, y, out) => {
            const fx = Math.min(Math.max(x / CELL, 0), COLS - 1.001);
            const fy = Math.min(Math.max(y / CELL, 0), ROWS - 1.001);
            const i = fx | 0;
            const j = fy | 0;
            const u = fx - i;
            const v = fy - j;
            const a = j * COLS + i;
            const b = a + 1;
            const c = a + COLS;
            const d = c + 1;
            out.x = (ox[a] * (1 - u) + ox[b] * u) * (1 - v) + (ox[c] * (1 - u) + ox[d] * u) * v;
            out.y = (oy[a] * (1 - u) + oy[b] * u) * (1 - v) + (oy[c] * (1 - u) + oy[d] * u) * v;
        };

        const off = { x: 0, y: 0 };
        const draw = (frame, time) => {
            ctx.clearRect(0, 0, W, H);
            const drift = time * COLOUR_DRIFT;
            const dots = HORSE_FRAMES[frame];
            for (let k = 0; k < dots.length; k += 2) {
                const x = dots[k];
                const y = dots[k + 1];
                sample(x, y, off);
                // Pushed dots shrink a little, so the parting reads as the
                // dots pulling apart rather than just sliding.
                const shift = Math.hypot(off.x, off.y);
                const r = HORSE_DOT_RADIUS * (1 - Math.min(0.4, shift / 70));
                ctx.fillStyle = ipodColour(x / COLOUR_SPAN - drift);
                ctx.beginPath();
                ctx.arc(x + off.x, y + off.y, r, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        if (still) {
            draw(0, 0);
            return;
        }

        let raf = 0;
        const start = performance.now();
        let last = start;
        let acc = 0;
        const TICK = 1000 / 60; // physics at a fixed 60 Hz, whatever the display rate

        const loop = (now) => {
            acc += Math.min(now - last, 100);
            last = now;
            while (acc >= TICK) {
                step();
                acc -= TICK;
            }
            // rAF's timestamp can be a hair earlier than the performance.now()
            // taken at start, so clamp: a negative index has no frame.
            const elapsed = Math.max(0, now - start);
            draw(Math.floor(elapsed / HORSE_FRAME_MS) % HORSE_FRAMES.length, elapsed);
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);

        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerdown", onDown, { passive: true });
        window.addEventListener("pointerup", onUp, { passive: true });
        window.addEventListener("pointercancel", onLeave, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);
        window.addEventListener("blur", onLeave);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerdown", onDown);
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("pointercancel", onLeave);
            document.documentElement.removeEventListener("pointerleave", onLeave);
            window.removeEventListener("blur", onLeave);
        };
    }, []);

    return (
        <div className="wallpaper" aria-hidden="true">
            <canvas ref={canvasRef} width={W} height={H} />
        </div>
    );
};

export default Wallpaper;
