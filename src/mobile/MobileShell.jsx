import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import StatusBar from "#mobile/StatusBar.jsx";
import Springboard from "#mobile/Springboard.jsx";
import AppSheet from "#mobile/AppSheet.jsx";
import APP_VIEWS from "#mobile/apps/index.js";
import useMobileStore from "#store/mobile.js";
import { dur } from "#utils/motion.js";

// How far the sheet underneath drifts left while another slides over it, as
// on iOS. It drifts back when the top one is dismissed.
const PARALLAX = -28;

/* The iOS experience: springboard underneath, a stack of full-screen apps on
   top. Rendered below 1024px in place of the macOS desktop.

   Every level of the stack stays mounted, so going back returns to a list
   exactly as it was left, scroll position included. This component owns all
   the motion: an app opened from the home screen zooms up, anything opened
   from inside an app slides in from the right, and going back reverses it. */
const MobileShell = () => {
    const stack = useMobileStore((s) => s.stack);
    const navigateBack = useMobileStore((s) => s.navigateBack);
    const navigateHome = useMobileStore((s) => s.navigateHome);

    const sheets = useRef([]);
    const prevDepth = useRef(stack.length);
    const rewound = useRef(false);

    // Push: animate the new top sheet in.
    useLayoutEffect(() => {
        const depth = stack.length;
        const top = sheets.current[depth - 1];
        const under = sheets.current[depth - 2];

        if (depth > prevDepth.current && top) {
            if (depth === 1) {
                gsap.fromTo(
                    top,
                    { scale: 0.9, opacity: 0 },
                    { scale: 1, opacity: 1, duration: dur(0.34), ease: "power3.out", clearProps: "transform,opacity" }
                );
            } else {
                gsap.fromTo(top, { xPercent: 100 }, { xPercent: 0, duration: dur(0.4), ease: "power3.out" });
                if (under) gsap.to(under, { xPercent: PARALLAX, duration: dur(0.4), ease: "power3.out" });
            }
        }

        prevDepth.current = depth;
    }, [stack.length]);

    // Pop: the browser went back (our back button, the home bar, an edge
    // swipe or a hardware back button all land here). Play the exit, then
    // drop the levels from the store.
    useEffect(() => {
        const onPop = (e) => {
            const { stack: current, popTo } = useMobileStore.getState();
            const depth = current.length;
            const target = e.state?.mobileDepth ?? 0;

            // Forward button into an app that's already been closed: undo it,
            // so history and the stack stay in step.
            if (target > depth) return window.history.go(depth - target);
            if (target === depth) return;

            const top = sheets.current[depth - 1];
            const under = sheets.current[target - 1];
            const done = () => popTo(target);

            if (!top) return done();

            gsap.killTweensOf(sheets.current.filter(Boolean));

            // Jumping several levels (the home bar): only the top sheet
            // animates; the ones between it and the target vanish with it.
            for (let i = target; i < depth - 1; i++) {
                if (sheets.current[i]) sheets.current[i].style.visibility = "hidden";
            }

            if (target === 0) {
                gsap.to(top, { scale: 0.9, opacity: 0, duration: dur(0.24), ease: "power2.in", onComplete: done });
            } else {
                gsap.to(top, { xPercent: 100, duration: dur(0.32), ease: "power2.out", onComplete: done });
                if (under) gsap.to(under, { xPercent: 0, duration: dur(0.32), ease: "power2.out" });
            }
        };

        // A reload keeps the history entries but not the stack: rewind to the
        // home-screen entry so the first back press isn't a dead one.
        // Once only: history.go is async, so a second run (StrictMode re-runs
        // effects in dev) would see the same stale depth and go back too far.
        const stale = (window.history.state?.mobileDepth ?? 0) - useMobileStore.getState().stack.length;
        if (stale > 0 && !rewound.current) {
            rewound.current = true;
            window.history.go(-stale);
        }

        window.addEventListener("popstate", onPop);
        return () => window.removeEventListener("popstate", onPop);
    }, []);

    return (
        <div className="ios-shell">
            <StatusBar />

            {/* display:contents keeps the layout; inert keeps taps and screen
                readers off the home screen while an app covers it. */}
            <div className="contents" inert={stack.length > 0}>
                <Springboard />
            </div>

            {stack.map((entry, i) => {
                const View = APP_VIEWS[entry.id];
                if (!View) return null;

                return (
                    <AppSheet
                        key={`${i}-${entry.id}`}
                        ref={(el) => {
                            sheets.current[i] = el;
                        }}
                        title={entry.title}
                        backLabel={i === 0 ? "Home" : stack[i - 1].title || "Back"}
                        onBack={navigateBack}
                        inert={i < stack.length - 1}
                    >
                        <View entry={entry} />
                    </AppSheet>
                );
            })}

            <button
                type="button"
                className={`home-indicator${stack.length ? "" : " on-light"}`}
                onClick={navigateHome}
                aria-label="Home"
            />
        </div>
    );
};

export default MobileShell;
