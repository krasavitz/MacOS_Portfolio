import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

/* Navigation for the iOS-style shell. Unlike the desktop's free-floating
   windows, mobile is a stack: the springboard pushes an app, and an app can
   push a viewer over itself (a file opened from Work). Back pops one level. */
const useMobileStore = create(
    immer((set) => ({
        // [{ id, title, data }] — last entry is what's on screen.
        stack: [],

        openApp: (id, { title = "", data = null } = {}) =>
            set((state) => {
                state.stack.push({ id, title, data });
            }),

        back: () =>
            set((state) => {
                state.stack.pop();
            }),

        goHome: () =>
            set((state) => {
                state.stack = [];
            }),
    }))
);

export default useMobileStore;
