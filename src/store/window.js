import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { WINDOW_CONFIG, INITIAL_Z_INDEX } from "#constants/index.js";

const useWindowStore = create(
    immer((set) => ({
     windows: WINDOW_CONFIG,
      nextZIndex: INITIAL_Z_INDEX + 1,

      openWindow: (windowKey, data = null) => set((state) => {
        const win = state.windows[windowKey];
        if(!win) return;
        win.isOpen = true;
        win.zIndex = state.nextZIndex;
        // Always replace: data now outlives a close, so falling back to the old
        // value would reopen Resume on whichever PDF was last viewed.
        win.data = data;
        state.nextZIndex++;
      }),

      // Data is kept until the next open: the window animates out after this,
      // and clearing it here would blank its contents mid-animation.
      closeWindow: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        if(!win) return;
        win.isOpen = false;
      }),

      focusWindow: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        // Already in front: skip the write so a click doesn't re-render it.
        if(!win || win.zIndex === state.nextZIndex - 1) return;
        win.zIndex = state.nextZIndex++;
      }),

      toggleMaximize: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        if(!win) return;
        win.maximized = !win.maximized;
      }),

      /** Closes whichever open window is in front. Returns nothing; no-op if none. */
      closeTopWindow: () => set((state) => {
        const open = Object.values(state.windows).filter((w) => w.isOpen);
        if(!open.length) return;
        const top = open.reduce((a, b) => (b.zIndex > a.zIndex ? b : a));
        top.isOpen = false;
      }),
    })),
);

export default useWindowStore;
