import { useRef, useLayoutEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import useWindowStore from "#store/window.js";
import { dur } from "#utils/motion.js";

/* Presses on these never start a drag, so links, buttons and text inside a
   window behave normally — only the title bar moves the window. */
const isClickable = (target) =>
    !target.closest?.("#window-header") ||
    !!target.closest("button, a, input, textarea, select, #window-controls");

const WindowWrapper = (Component, windowKey) => {
    const Wrapped = (props) => {
        // Select just this window, so opening one window doesn't re-render all nine.
        const { isOpen, zIndex, maximized } = useWindowStore((s) => s.windows[windowKey]);
        const focusWindow = useWindowStore((s) => s.focusWindow);
        const toggleMaximize = useWindowStore((s) => s.toggleMaximize);

        const ref = useRef(null);
        const dragRef = useRef(null);
        const wasOpen = useRef(false);
        const restoreAt = useRef({ x: 0, y: 0 });

        // Open: scale up from slightly below. Close: shrink and fade, *then*
        // hide — previously the window vanished on the same frame.
        // yPercent rather than y, because y is where Draggable keeps the
        // window's dragged position and animating it would snap it back.
        useLayoutEffect(() => {
            const el = ref.current;
            if (!el) return;

            if (isOpen) {
                el.style.display = "flex";
                gsap.fromTo(
                    el,
                    { scale: 0.94, opacity: 0, yPercent: 3 },
                    { scale: 1, opacity: 1, yPercent: 0, duration: dur(0.32), ease: "power3.out", overwrite: "auto" }
                );
            } else if (wasOpen.current) {
                gsap.to(el, {
                    scale: 0.96,
                    opacity: 0,
                    yPercent: 2,
                    duration: dur(0.18),
                    ease: "power2.in",
                    overwrite: "auto",
                    onComplete: () => {
                        el.style.display = "none";
                    },
                });
            } else {
                el.style.display = "none";
            }

            wasOpen.current = isOpen;
        }, [isOpen]);

        useGSAP(() => {
            const el = ref.current;
            if (!el) return;

            // zIndexBoost:false — let the store own z-index. Otherwise Draggable
            // boosts a pressed window above newly opened ones, so files open behind.
            // Bounds keep the title bar from being dragged under the menu bar or
            // off the screen, where it could never be grabbed again. They're
            // applied on press, not passed to create(): Draggable snaps the
            // element into its bounds immediately, and at mount the window is
            // display:none, so it measured as 0×0 and got shoved down.
            const [instance] = Draggable.create(el, {
                zIndexBoost: false,
                onPress() {
                    this.applyBounds("#window-bounds");
                },
                edgeResistance: 0.8,
                dragClickables: false,
                clickableTest: isClickable,
                cursor: "default",
                activeCursor: "grabbing",
            });
            dragRef.current = instance;

            return () => instance.kill();
        }, []);

        // Maximize fills the space between the menu bar and the dock. The
        // dragged offset is parked and restored, so un-maximizing puts the
        // window back exactly where it was.
        useLayoutEffect(() => {
            const el = ref.current;
            const drag = dragRef.current;
            if (!el) return;

            if (maximized) {
                restoreAt.current = { x: gsap.getProperty(el, "x"), y: gsap.getProperty(el, "y") };
                gsap.set(el, { x: 0, y: 0 });
                drag?.disable();
            } else {
                gsap.set(el, restoreAt.current);
                drag?.enable();
            }
        }, [maximized]);

        const onDoubleClick = (e) => {
            if (e.target.closest("#window-header") && !e.target.closest("button, a, input, #window-controls"))
                toggleMaximize(windowKey);
        };

        return (
            <section
                id={windowKey}
                ref={ref}
                style={{ zIndex }}
                className={`os-window absolute${maximized ? " is-max" : ""}`}
                // Capture phase: any press anywhere in the window raises it,
                // including on links and buttons that don't start a drag.
                onPointerDownCapture={() => focusWindow(windowKey)}
                onDoubleClick={onDoubleClick}
            >
                <Component {...props} />
            </section>
        );
    };

    Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`;

    return Wrapped;
};

export default WindowWrapper;
