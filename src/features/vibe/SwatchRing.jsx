import { useEffect, useRef, useState } from "react";
import "#features/vibe/vibe.css";

/* A desktop object, top left: a designer's swatch book. Fabric swatches with
   pinked (zigzag) edges hang from a silver binder ring through their
   eyelets, stacked. It's one control: hover and the stack fans open a
   little, so you can see it's a pile; click (or Enter) and the front swatch
   swings up and over the ring to the back, revealing the next fabric. A tag
   beside it names the fabric in front.

   The fabrics are real photos (public/images/textures, sources in
   SOURCES.md there); checker is the site's own tile. Listed back to front. */

const SWATCHES = [
    { name: "navy paisley", spec: "bandana cotton · 120 gsm", fill: "url(/images/textures/paisley-navy.jpg) 0 0 / 150px" },
    { name: "red paisley", spec: "bandana cotton · 120 gsm", fill: "url(/images/textures/paisley-red.jpg) 0 0 / 150px" },
    { name: "checker", spec: "cotton canvas · 12 oz", fill: "url(/images/patterns/checker.svg) 0 0 / 18px" },
    { name: "zebra", spec: "printed calf hair", fill: "url(/images/textures/zebra.jpg) 0 0 / 130px" },
    { name: "woodland camo", spec: "ripstop · 200 gsm", fill: "url(/images/textures/camo.jpg) 0 0 / 130px" },
    { name: "denim", spec: "selvedge · 14 oz", fill: "url(/images/textures/denim.jpg) 0 0 / 120px" },
    { name: "leopard", spec: "printed faux fur", fill: "url(/images/textures/leopard.jpg) 0 0 / 120px" },
];

// Pinking-shear edge: a zigzag all the way round a W × H rectangle, as a
// clip-path polygon in pixels.
const W = 76;
const H = 108;
const pinked = (() => {
    const t = 4; // tooth depth
    const step = 7;
    const pts = [];
    for (let x = 0; x <= W; x += step) pts.push([x, x % (step * 2) ? t : 0]);
    for (let y = step; y <= H; y += step) pts.push([W - (y % (step * 2) ? t : 0), y]);
    for (let x = W - step; x >= 0; x -= step) pts.push([x, H - (x % (step * 2) ? t : 0)]);
    for (let y = H - step; y > 0; y -= step) pts.push([y % (step * 2) ? t : 0, y]);
    return `polygon(${pts.map(([x, y]) => `${x}px ${y}px`).join(", ")})`;
})();

// Flick timing (ms): swinging up and over, then settling at the back.
const SWING = 260;
const SETTLE = 320;

const SwatchRing = () => {
    // Stack order, back to front: the last index is the swatch in front.
    const [order, setOrder] = useState(() => SWATCHES.map((_, i) => i));
    const [peek, setPeek] = useState(false);
    // The swatch mid-flick and which half of the flick it's in.
    const [flick, setFlick] = useState(null);
    const timers = useRef([]);
    useEffect(() => () => timers.current.forEach(clearTimeout), []);

    const front = order[order.length - 1];

    const flip = () => {
        if (flick) return;
        const i = front;
        setFlick({ i, phase: "up" });
        timers.current = [
            setTimeout(() => {
                setOrder((o) => [i, ...o.filter((k) => k !== i)]);
                setFlick({ i, phase: "down" });
            }, SWING),
            setTimeout(() => setFlick(null), SWING + SETTLE),
        ];
    };

    const n = SWATCHES.length;
    const { name, spec } = SWATCHES[front];

    return (
        <section className={`swatch-ring${peek ? " is-peek" : ""}`} aria-label="Fabric swatch book">
            {/* Inner layer carries the size (scale): the intro's settle-in zoom
                sets an inline scale on top-level desktop pieces, which would
                otherwise override it for a second and make the ring jump. */}
            <div className="swatch-body">
                <button
                    type="button"
                    className="swatch-book"
                    onClick={flip}
                    onMouseEnter={() => setPeek(true)}
                    onMouseLeave={() => setPeek(false)}
                    aria-label={`${name}, ${spec}. Next fabric`}
                >
                    {SWATCHES.map((s, i) => {
                        const depth = order.indexOf(i);
                        // 0 = front, n - 1 = back.
                        const back = n - 1 - depth;
                        const up = flick?.i === i && flick.phase === "up";
                        return (
                            <span
                                key={s.name}
                                className={`swatch${up ? " is-swinging" : ""}`}
                                style={{
                                    "--back": back,
                                    // Stays in front while it swings up, then drops behind.
                                    zIndex: up ? n + 1 : depth + 1,
                                }}
                            >
                                <span className="swatch-face" style={{ background: s.fill, clipPath: pinked }}>
                                    <span className="swatch-eyelet" />
                                </span>
                            </span>
                        );
                    })}

                    {/* The binder ring, drawn over the swatches' eyelets. */}
                    <svg className="swatch-hoop" viewBox="0 0 40 40" aria-hidden="true">
                        <defs>
                            <linearGradient id="hoop-metal" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0" stopColor="#f4f4f6" />
                                <stop offset="0.45" stopColor="#9a9ca4" />
                                <stop offset="0.7" stopColor="#e2e3e8" />
                                <stop offset="1" stopColor="#6d7079" />
                            </linearGradient>
                        </defs>
                        <circle cx="20" cy="20" r="14" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="4.6" transform="translate(0.6 1.2)" />
                        <circle cx="20" cy="20" r="14" fill="none" stroke="url(#hoop-metal)" strokeWidth="3.6" />
                        <rect x="17" y="4" width="6" height="3.4" rx="1" fill="#7c7f88" />
                    </svg>
                </button>

                {/* The label for the swatch in front. */}
                <p className="swatch-tag" aria-hidden="true">
                    <span className="swatch-tag-no">no. {String(front + 1).padStart(2, "0")}</span>
                    <span className="swatch-tag-name">{name}</span>
                    <span className="swatch-tag-spec">{spec}</span>
                </p>
            </div>
        </section>
    );
};

export default SwatchRing;
