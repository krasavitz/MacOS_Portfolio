import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

import { Terminal, Safari, Resume, Finder, Text, Image, Contact, Photos, Video } from '#windows';
import { Navbar, Welcome, Dock, DesktopIcons } from '#components';

gsap.registerPlugin(Draggable);

/* The macOS experience: menu bar, desktop, dock, and every draggable window.
   Rendered only at >=1024px — see useIsDesktop. */
const DesktopShell = () => (
    <>
        <Navbar />
        <Welcome />
        <DesktopIcons />
        <Dock />

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

export default DesktopShell;
