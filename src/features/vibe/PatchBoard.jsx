import { useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";
import "#features/vibe/vibe.css";

/* The Archive: the embroidered patches (scripts/patches.mjs) scattered on a
   board instead of sitting in a file grid. Drag one anywhere inside the
   board; it lifts above the others while held. A click (or tap) without a
   drag opens it, the same as any other file.

   SPOTS places the patches in order: left/top as percentages of the board
   (so the scatter scales with the window), width as a share of the board's
   width, and a tilt. Patches past the end of SPOTS wrap around. */

const SPOTS = [
    { left: 3, top: 4, w: 0.19, rot: -8 }, // crest
    { left: 25, top: 3, w: 0.17, rot: 7 }, // checker
    { left: 45, top: 9, w: 0.17, rot: -5 }, // zebra star
    { left: 66, top: 4, w: 0.3, rot: 6 }, // wings
    { left: 4, top: 58, w: 0.34, rot: 4 }, // ribbon
    { left: 40, top: 46, w: 0.19, rot: -9 }, // badge
    { left: 61, top: 64, w: 0.34, rot: -3 }, // name tape
    { left: 69, top: 25, w: 0.19, rot: 5 }, // bandana
];

// Phone: a tall, narrow board, so bigger patches in a looser column.
const PHONE_SPOTS = [
    { left: 5, top: 3, w: 0.34, rot: -8 },
    { left: 56, top: 4, w: 0.3, rot: 7 },
    { left: 60, top: 23, w: 0.3, rot: -5 },
    { left: 3, top: 27, w: 0.5, rot: 6 },
    { left: 8, top: 44, w: 0.6, rot: 4 },
    { left: 58, top: 55, w: 0.32, rot: -9 },
    { left: 5, top: 67, w: 0.55, rot: -3 },
    { left: 54, top: 76, w: 0.32, rot: 3 },
];

const PatchBoard = ({ items, onOpen, phone = false }) => {
    const root = useRef(null);
    const spots = phone ? PHONE_SPOTS : SPOTS;

    useGSAP(
        () => {
            const board = root.current;
            const els = gsap.utils.toArray(".board-patch", board);
            let top = els.length;

            const drags = els.map((el, i) => {
                el.style.zIndex = String(i + 1);
                gsap.set(el, { rotation: Number(el.dataset.rot) || 0 });
                const [d] = Draggable.create(el, {
                    bounds: board,
                    zIndexBoost: false,
                    minimumMovement: 4,
                    onPress() {
                        el.style.zIndex = String(++top);
                        gsap.to(el, { scale: 1.08, duration: 0.15, ease: "power2.out" });
                        el.classList.add("is-lifted");
                    },
                    onRelease() {
                        gsap.to(el, { scale: 1, duration: 0.35, ease: "back.out(2.5)" });
                        el.classList.remove("is-lifted");
                    },
                    // Only fires when the press wasn't a drag.
                    onClick() {
                        onOpen?.(items[i]);
                    },
                });
                return d;
            });

            return () => drags.forEach((d) => d.kill());
        },
        { scope: root, dependencies: [items] }
    );

    return (
        <div ref={root} className={`patch-board${phone ? " is-phone" : ""}`}>
            {items.map((item, i) => {
                const spot = spots[i % spots.length];
                return (
                    <img
                        key={item.id}
                        className="board-patch"
                        src={item.imageUrl}
                        alt={item.alt || item.name}
                        title={item.name}
                        draggable={false}
                        data-rot={spot.rot}
                        style={{ left: `${spot.left}%`, top: `${spot.top}%`, width: `${spot.w * 100}%` }}
                    />
                );
            })}
        </div>
    );
};

export default PatchBoard;
