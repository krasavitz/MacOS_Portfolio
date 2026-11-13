import { useCallback, useRef, useState } from 'react';
import gsap from 'gsap';
import { profile } from '#constants';
import Bracelet from '#features/vibe/Bracelet.jsx';
import { dur } from '#utils/motion.js';

/* The desktop intro, in two pieces:
   - the beaded OLIVER bracelet, centred under the horse, which takes shape
     bead by bead on load;
   - a sticky note in the bottom-left that pops on once the bracelet has
     formed. Folded, it's just the greeting; click it to read the one-line
     intro, and again to fold it back.
   The greeting is also a visually hidden heading, for screen readers and
   search engines. */
const Welcome = () => {
    const noteRef = useRef(null);
    const [open, setOpen] = useState(false);

    const reveal = useCallback(() => {
        if (!noteRef.current) return;
        gsap.fromTo(
            noteRef.current,
            { autoAlpha: 0, y: 14, rotation: -9, scale: 0.92 },
            { autoAlpha: 1, y: 0, rotation: -3, scale: 1, duration: dur(0.55), ease: 'back.out(1.8)' }
        );
    }, []);

    return (
        <section id="welcome">
            <h1 className="sr-only">{profile.greeting}</h1>

            <Bracelet width={400} height={84} beadSize={27} onAssembled={reveal} className="boot-bracelet" />

            <button
                ref={noteRef}
                type="button"
                className={`sticky-note${open ? ' is-open' : ''}`}
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
            >
                <span className="note-tape" aria-hidden="true" />
                <span className="note-title">{profile.greeting}</span>
                {/* Always rendered; unfolds via CSS (grid rows 0fr → 1fr). */}
                <span className="note-body" aria-hidden={!open}>
                    <span className="note-text">{profile.intro}</span>
                </span>
                <span className="note-hint">{open ? 'click to fold' : 'click me →'}</span>
            </button>
        </section>
    );
};

export default Welcome;
