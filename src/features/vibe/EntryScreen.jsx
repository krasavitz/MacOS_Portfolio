import { useEffect, useRef } from "react";
import gsap from "gsap";
import { profile } from "#constants";
import { dur } from "#utils/motion.js";
import "#features/vibe/vibe.css";


/* The splash in front of the site. Browsers only allow sound after the
   visitor interacts with the page, so entering is that interaction: the
   click (or tap, or Enter) that dismisses this screen is the same one that
   starts the background song (BackgroundMusic listens for it), so the music
   is playing the moment they're in.

   The way in is a focus pull: the logo, name, role and button fade away
   the moment you press, then the white melts off the site while the site
   comes into focus from a blur and settles in from a slight zoom. The blur
   is a backdrop-filter on the white cover itself, so it's one layer on the
   GPU however busy the desktop behind it is.

   onReveal fires as the mosaic starts (the site mounts under the white
   cover, so it's ready); onEnter fires once the screen is gone. */

const INTRO_ID = "entry-intro";

const EntryScreen = ({ onReveal, onEnter }) => {
    const ref = useRef(null);
    const innerRef = useRef(null);
    const logoRef = useRef(null);
    const coverRef = useRef(null);
    const buttonRef = useRef(null);
    // A ref, not state: the button click also bubbles to the backdrop, and
    // both fire within one event, before a state update would land.
    const leaving = useRef(false);
    const touch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

    const enter = () => {
        if (leaving.current) return;
        leaving.current = true;
        // Entering mid-intro: jump the intro to its end, then leave from there.
        gsap.getById(INTRO_ID)?.progress(1);

        const logo = logoRef.current;
        const box = logo.getBoundingClientRect();
        const cx = box.left + box.width / 2;
        const cy = box.top + box.height / 2;
        const rest = [...innerRef.current.children].filter((el) => el !== logo);

        const cover = coverRef.current;
        const site = () =>
            [...document.querySelectorAll("#os > *")].filter((el) => !el.matches(".entry-screen, audio"));

        gsap.timeline({ onComplete: onEnter })
            // 1. The text lifts away and the logo shrinks and fades.
            .to(rest, { y: -10, autoAlpha: 0, duration: dur(0.15), ease: "power2.in" }, 0)
            .to(logo, { scale: 0.9, autoAlpha: 0, duration: dur(0.15), ease: "power2.in" }, 0)
            // 2. Mount the site under the cover, fogged: the cover turns into
            //    frosted glass, then clears, white first and the blur after.
            .add(() => onReveal?.(), dur(0.05))
            .set(cover, { "--fog": "28px" }, dur(0.12))
            .to(cover, { backgroundColor: "rgba(255,255,255,0)", duration: dur(0.55), ease: "power2.inOut" }, dur(0.16))
            .to(cover, { "--fog": "0px", duration: dur(0.7), ease: "power2.out" }, dur(0.22))
            // The site settles in from a slight zoom as it comes into focus.
            .add(() => {
                gsap.fromTo(site(), { scale: 1.04 }, {
                    scale: 1,
                    duration: dur(0.9),
                    ease: "power3.out",
                    transformOrigin: `${cx}px ${cy}px`,
                    clearProps: "scale,transform,transformOrigin",
                });
            }, dur(0.16));
    };

    // The opening: the logo turns and settles into place, the name rises
    // letter by letter from behind a clipped edge, then the role and the
    // button follow. Only the content animates: the white cover is solid from
    // the first frame, so the horse wallpaper behind it never flashes through.
    // Enter or Space gets you in from anywhere, even mid-animation.
    const enterRef = useRef(enter);
    useEffect(() => {
        enterRef.current = enter;
    });
    useEffect(() => {
        // Fade in the content only: the white cover is solid from the first
        // frame, so the horse wallpaper behind it never flashes through.
        const inner = innerRef.current;
        const q = gsap.utils.selector(inner);
        gsap.set(inner, { autoAlpha: 1 });
        const intro = gsap
            .timeline({
                id: INTRO_ID,
                defaults: { ease: "power3.out" },
                onComplete: () => buttonRef.current?.focus({ preventScroll: true }),
            })
            // fromTo, not from: explicit end values, so a restarted intro
            // (React runs effects twice in development) can't end up stuck
            // at a half-applied start position.
            .fromTo(q(".entry-logo"), { autoAlpha: 0, scale: 0.7, rotation: -18 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: dur(0.7), ease: "back.out(1.7)" })
            .fromTo(q(".entry-char"), { yPercent: 110 }, { yPercent: 0, duration: dur(0.6), stagger: dur(0.028) }, dur(0.12))
            .fromTo(q(".entry-role"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: dur(0.5) }, dur(0.45))
            .fromTo(buttonRef.current, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: dur(0.5) }, dur(0.6));
        const onKey = (e) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            e.preventDefault();
            enterRef.current();
        };
        window.addEventListener("keydown", onKey);
        return () => {
            intro.revert();
            window.removeEventListener("keydown", onKey);
        };
    }, []);

    return (
        <div ref={ref} className="entry-screen" onClick={enter} role="presentation">
            <div ref={coverRef} className="entry-cover" aria-hidden="true" />

            <div ref={innerRef} className="entry-inner">
                <span ref={logoRef} className="entry-logo" aria-hidden="true" />
                <h1 aria-label={profile.name}>
                    <span className="entry-name" aria-hidden="true">
                        {[...profile.name].map((c, i) => (
                            <span key={i} className="entry-char">
                                {c === " " ? "\u00a0" : c}
                            </span>
                        ))}
                    </span>
                </h1>
                <p className="entry-role">product designer and founder</p>

                <button ref={buttonRef} type="button" className="entry-button" onClick={enter}>
                    {touch ? "tap to enter" : "click to enter"}
                </button>
            </div>
        </div>
    );
};

export default EntryScreen;
