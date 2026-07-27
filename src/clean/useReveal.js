import { useEffect, useRef } from "react";

/* Adds `.is-in` to every `.reveal` inside the container once it scrolls into
   view, which is what the CSS transitions key off. Elements already on screen
   animate immediately, staggered by their `--i` index. Honors
   prefers-reduced-motion by revealing everything at once. */
export const useReveal = () => {
    const ref = useRef(null);

    useEffect(() => {
        const root = ref.current;
        if (!root) return;

        const items = root.querySelectorAll(".reveal");
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduced) {
            items.forEach((el) => el.classList.add("is-in"));
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-in");
                    io.unobserve(entry.target);
                });
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
        );

        items.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    return ref;
};
