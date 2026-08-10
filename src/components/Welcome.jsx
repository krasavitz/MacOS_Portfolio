import { useRef } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { useGSAP } from '@gsap/react';
import { profile } from '#constants';

gsap.registerPlugin(TextPlugin);

/* The desktop intro, written as a note rather than a shell session. The first
   line is typed out character by character; the rest fade in under it. */
const SEQUENCE = [
    { kind: 'type', text: profile.greeting },
    { kind: 'out', text: profile.intro },
    { kind: 'hint', text: 'click around' },
];

const CHAR_DURATION = 0.045;
const LINE_GAP = 0.25;

const Welcome = () => {
    const rootRef = useRef(null);

    useGSAP(() => {
        const root = rootRef.current;
        if (!root) return;

        const lines = gsap.utils.toArray('.boot-line', root);
        const cursor = root.querySelector('.boot-cursor');
        const tl = gsap.timeline();

        lines.forEach((line, i) => {
            const step = SEQUENCE[i];
            const body = line.querySelector('.boot-text');

            tl.set(line, { visibility: 'visible' }, `+=${LINE_GAP}`);

            if (step.kind === 'type') {
                tl.to(body, {
                    duration: step.text.length * CHAR_DURATION,
                    ease: 'none',
                    text: { value: step.text, delimiter: '' },
                });
            } else {
                tl.fromTo(body, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.35 });
            }
        });

        // Cursor parks at the end of the sequence and blinks forever.
        tl.set(cursor, { visibility: 'visible' }).to(cursor, {
            opacity: 0,
            duration: 0.5,
            ease: 'steps(1)',
            repeat: -1,
            yoyo: true,
        });

        return () => tl.kill();
    }, []);

    return (
        <section id="welcome">
            <div ref={rootRef} className="boot">
                {SEQUENCE.map((step, i) => (
                    <p
                        key={i}
                        className={`boot-line ${step.kind === 'type' ? 'is-lead' : ''} ${
                            step.kind === 'hint' ? 'is-hint' : ''
                        }`}
                    >
                        <span className={`boot-text ${step.muted ? 'is-muted' : ''}`}>
                            {step.kind === 'type' ? '' : step.text}
                        </span>
                        {step.kind === 'type' && <span className="boot-cursor" />}
                    </p>
                ))}
            </div>
        </section>
    );
};

export default Welcome;
