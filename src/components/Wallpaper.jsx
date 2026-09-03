import { useEffect, useRef, useState } from "react";

/* The desktop/springboard background. A video rather than a CSS background
   image, since `background-image` cannot take a video source — it is fixed
   behind every shell and never takes pointer events, so it behaves like one.
   The scrim is a sibling above the video, reproducing the dark gradient the
   old background-image baked in: windows, desktop text and the status bar are
   all tuned against a darkened wallpaper. */
const Wallpaper = () => {
    const video = useRef(null);
    // iOS refuses to autoplay video in Low Power Mode (and Low Data Mode), and
    // paints a play button over it. The layer takes no pointer events, so that
    // button can never be pressed — the wallpaper would be stuck behind a
    // control nobody can reach. Fall back to the poster frame instead: a still
    // wallpaper reads as intentional, a dead play button does not.
    const [still, setStill] = useState(false);

    useEffect(() => {
        const el = video.current;
        if (!el) return;

        // React applies `muted` as a DOM property, so it never appears as an
        // attribute in the markup — and iOS decides whether a video may
        // autoplay by reading the attribute, which can happen before React has
        // set the property. Without this, Safari treats the wallpaper as an
        // unmuted video and refuses to start it. Belt and braces: property,
        // default, and attribute.
        el.defaultMuted = true;
        el.muted = true;
        el.setAttribute("muted", "");

        const attempt = el.play();
        // Older browsers return undefined rather than a promise.
        if (attempt?.catch) attempt.catch(() => setStill(true));

        // Autoplay can also be interrupted after it starts (Low Power Mode
        // switched on mid-visit, or the tab is backgrounded on a throttled
        // device); `playing` clears the fallback if it recovers.
        const onPlaying = () => setStill(false);
        el.addEventListener("playing", onPlaying);
        return () => el.removeEventListener("playing", onPlaying);
    }, []);

    return (
        <div className="wallpaper" aria-hidden="true">
            <video
                ref={video}
                src="/images/wallpaper.mp4"
                poster="/images/wallpaper-poster.jpg"
                autoPlay
                loop
                muted
                // iOS refuses to autoplay inline without this and goes fullscreen.
                playsInline
                preload="auto"
                tabIndex={-1}
                hidden={still}
            />

            {still && <img src="/images/wallpaper-poster.jpg" alt="" />}

            <div className="wallpaper-scrim" />
        </div>
    );
};

export default Wallpaper;
