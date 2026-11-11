import { useEffect } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

import { Terminal, Safari, Resume, Finder, Text, Image, Contact, Photos, Video } from '#windows';
import { Navbar, Welcome, Dock, DesktopIcons } from '#components';
import useWindowStore from "#store/window.js";

gsap.registerPlugin(Draggable);

/* The macOS experience: menu bar, desktop, dock, and every draggable window.
   Rendered only at >=1024px — see useIsDesktop. */
const DesktopShell = () => {
    // Esc closes the front window, so nobody has to aim for the red dot.
    useEffect(() => {
        const onKey = (e) => {
            if (e.key !== "Escape" || e.defaultPrevented) return;
            useWindowStore.getState().closeTopWindow();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <>
            <Navbar />
            <Welcome />
            <DesktopIcons />
            <Dock />

            {/* The area a window may be dragged within: everything below the
                menu bar. Invisible; Draggable only reads its rectangle. */}
            <div id="window-bounds" aria-hidden="true" />

            <Terminal />
            <Safari />
            <Resume />
            <Finder />
            <Text />
            <Image />
            <Contact />
            <Photos />
            <Video />
        </>
    );
};

export default DesktopShell;
