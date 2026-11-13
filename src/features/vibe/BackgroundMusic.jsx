import { useEffect, useRef } from "react";
import useSound from "#store/sound.js";

/* The site's background song. It tries to start as soon as the page opens;
   browsers block sound until the visitor interacts, so if that's refused it
   starts on their first click, tap or key press instead. It fades in, loops,
   and obeys the speaker button (SoundToggle). Renders nothing visible.

   To change the song, drop a file in public/music/ and update SONG. */

const SONG = "/music/" + encodeURIComponent("yves tumor - limerence (instrumental).mp3");
const VOLUME = 0.45;
const FADE_MS = 2500;

const BackgroundMusic = () => {
    const audioRef = useRef(null);
    const firstRun = useRef(true);
    const muted = useSound((s) => s.muted);
    const setPlaying = useSound((s) => s.setPlaying);

    // Start (or wait for the first interaction), once.
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        let fade = 0;
        const fadeIn = () => {
            cancelAnimationFrame(fade);
            const from = performance.now();
            const tick = (now) => {
                // rAF can stamp a hair before `from`; clamp so volume never goes negative.
                const t = Math.min(1, Math.max(0, (now - from) / FADE_MS));
                audio.volume = VOLUME * t;
                if (t < 1) fade = requestAnimationFrame(tick);
            };
            audio.volume = 0;
            fade = requestAnimationFrame(tick);
        };

        const events = ["pointerdown", "keydown", "touchstart"];
        const removeUnlock = () => events.forEach((ev) => window.removeEventListener(ev, unlock, true));

        const start = () => {
            if (useSound.getState().muted) return Promise.resolve(false);
            return audio
                .play()
                .then(() => {
                    fadeIn();
                    removeUnlock();
                    return true;
                })
                .catch(() => false);
        };

        // Capture phase, so it runs even if a click is handled further down.
        function unlock() {
            start();
        }

        const onPlay = () => setPlaying(true);
        const onPause = () => setPlaying(false);
        audio.addEventListener("play", onPlay);
        audio.addEventListener("pause", onPause);

        start().then((ok) => {
            if (!ok) events.forEach((ev) => window.addEventListener(ev, unlock, { capture: true, passive: true }));
        });

        return () => {
            cancelAnimationFrame(fade);
            removeUnlock();
            audio.removeEventListener("play", onPlay);
            audio.removeEventListener("pause", onPause);
            audio.pause();
        };
    }, [setPlaying]);

    // Follow the speaker button. Skips the initial render: starting is the
    // effect above's job, and doing it here too would skip the fade-in.
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (firstRun.current) {
            firstRun.current = false;
            return;
        }
        if (muted) {
            audio.pause();
        } else if (audio.paused) {
            audio.volume = VOLUME;
            audio.play().catch(() => {});
        }
    }, [muted]);

    return <audio ref={audioRef} src={SONG} loop preload="auto" />;
};

export default BackgroundMusic;
