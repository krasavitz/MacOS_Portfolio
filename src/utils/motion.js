/* Shared motion helpers so every animation honours the OS "reduce motion"
   setting the same way: durations collapse to zero, so state still changes
   (windows still open, sheets still close) but nothing slides or scales. */

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

export const prefersReducedMotion = () =>
    typeof window !== "undefined" && window.matchMedia(REDUCE_QUERY).matches;

/** A duration in seconds, or 0 when the visitor asked for reduced motion. */
export const dur = (seconds) => (prefersReducedMotion() ? 0 : seconds);
