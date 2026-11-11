import { ChevronLeft } from "lucide-react";

/* Full-screen app container with an iOS nav bar. Purely presentational: the
   push/pop animations are run by MobileShell, which sees the whole stack and
   can move the sheet underneath in step with the one on top.

   The back button names where it goes, as iOS does ("Work", not "Back"). */
const AppSheet = ({ ref, title, backLabel, onBack, inert, children }) => (
    <section className="app-sheet" ref={ref} inert={inert} aria-hidden={inert || undefined}>
        <header className="app-nav">
            <button type="button" onClick={onBack} className="app-back">
                <ChevronLeft size={24} strokeWidth={2.25} />
                <span>{backLabel}</span>
            </button>

            <h2>{title}</h2>
        </header>

        <div className="app-body">{children}</div>
    </section>
);

export default AppSheet;
