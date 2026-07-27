import { useEffect, useState } from "react";

// Below this width the app swaps the macOS desktop for the iOS-style
// springboard. 1024px keeps iPad portrait (820px) on the touch experience.
const DESKTOP_QUERY = "(min-width: 1024px)";

/** True when the viewport is wide enough for the draggable-window desktop. */
export const useIsDesktop = () => {
    const [isDesktop, setIsDesktop] = useState(
        () => typeof window !== "undefined" && window.matchMedia(DESKTOP_QUERY).matches
    );

    useEffect(() => {
        const mq = window.matchMedia(DESKTOP_QUERY);
        const onChange = (e) => setIsDesktop(e.matches);

        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    return isDesktop;
};
