import { useRef } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(TextPlugin);

/* Each line of the boot sequence. `type` lines are typed out character by
   character (as if at a prompt); `out` lines are revealed whole, like command
   output. `delay` is the pause before the line starts. */
const SEQUENCE = [
    { kind: 'out', text: 'Last login: welcome to my portfolio', muted: true },
    { kind: 'type', text: 'whoami' },
    { kind: 'out', text: 'designer · founder · builder' },
    { kind: 'type', text: 'cat about.txt' },
    {
        kind: 'out',
        text: 'I build products, the brand around them, and the growth that gets people through the door.',
        muted: true,
    },
    { kind: 'hint', text: 'click an icon or open the dock to look around' },
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
                <div className="boot-header">
                    <span className="boot-path">~/oliver-naumov</span>
                    <span className="boot-rule" />
                </div>

                {SEQUENCE.map((step, i) => (
                    <p
                        key={i}
                        className={`boot-line ${step.kind === 'hint' ? 'is-hint' : ''}`}
                    >
                        {step.kind === 'type' && <span className="boot-prompt">$</span>}
                        <span className={`boot-text ${step.muted ? 'is-muted' : ''}`}>
                            {step.kind === 'type' ? '' : step.text}
                        </span>
                        {i === SEQUENCE.length - 1 && <span className="boot-cursor" />}
                    </p>
                ))}
            </div>
        </section>
    );
};

export default Welcome;
