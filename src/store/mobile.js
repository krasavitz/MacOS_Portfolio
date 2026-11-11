import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

/* Navigation for the iOS-style shell. Unlike the desktop's free-floating
   windows, mobile is a stack: the springboard pushes an app, and an app can
   push a viewer over itself (a file opened from Work).

   Every push is also a browser history entry, so the phone's own back
   gestures (iOS edge swipe, Android back button) step back through the app
   instead of leaving the site. The UI never pops the stack directly: it asks
   the browser to go back, and MobileShell pops on the resulting `popstate`
   once the exit animation has played. */

// Spread the existing state so react-router's own keys (idx, key, usr) are
// kept — it reads them on popstate, and dropping them confuses its history.
const pushDepth = (depth) =>
    window.history.pushState({ ...window.history.state, mobileDepth: depth }, "");

const useMobileStore = create(
    immer((set, get) => ({
        // [{ id, title, data }] — last entry is what's on screen.
        stack: [],

        openApp: (id, { title = "", data = null } = {}) => {
            set((state) => {
                state.stack.push({ id, title, data });
            });
            pushDepth(get().stack.length);
        },

        /** Back one level, via browser history. */
        navigateBack: () => {
            if (get().stack.length) window.history.back();
        },

        /** All the way to the springboard, via browser history. */
        navigateHome: () => {
            const depth = get().stack.length;
            if (depth) window.history.go(-depth);
        },

        /** Drops everything above `depth`. Called by MobileShell, not the UI. */
        popTo: (depth) =>
            set((state) => {
                state.stack.length = Math.max(0, Math.min(depth, state.stack.length));
            }),
    }))
);

export default useMobileStore;
