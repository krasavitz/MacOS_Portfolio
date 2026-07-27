import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ChevronLeft } from "lucide-react";

/* Full-screen app container with an iOS nav bar. Opens with the same
   scale/fade as a desktop window ([WindowWrapper.jsx](../hoc/WindowWrapper.jsx)). */
const AppSheet = ({ title, onBack, children }) => {
    const ref = useRef(null);

    useGSAP(() => {
        if (!ref.current) return;
        gsap.fromTo(
            ref.current,
            { scale: 0.94, opacity: 0, y: 24 },
            { scale: 1, opacity: 1, y: 0, duration: 0.32, ease: "power3.out" }
        );
    }, []);

    return (
        <section className="app-sheet" ref={ref}>
            <header className="app-nav">
                <button type="button" onClick={onBack} className="app-back">
                    <ChevronLeft size={22} />
                    <span>Back</span>
                </button>

                <h2>{title}</h2>
            </header>

            <div className="app-body">{children}</div>
        </section>
    );
};

export default AppSheet;
