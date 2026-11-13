import { create } from "zustand";

/* Background music on/off, shared by the player (features/vibe/
   BackgroundMusic.jsx) and the speaker buttons in the menu bar and the
   mobile status bar. The choice is remembered per browser, so a visitor who
   muted it isn't greeted by it again. */

const KEY = "bg-music-muted";

const readMuted = () => {
    try {
        return localStorage.getItem(KEY) === "1";
    } catch {
        return false;
    }
};

const useSound = create((set, get) => ({
    muted: readMuted(),
    // True once audio is actually playing (browsers block it until the
    // visitor first clicks, taps or presses a key).
    playing: false,

    toggleMuted: () => {
        const muted = !get().muted;
        set({ muted });
        try {
            localStorage.setItem(KEY, muted ? "1" : "0");
        } catch {
            /* storage unavailable: the choice just lasts this visit */
        }
    },

    setPlaying: (playing) => set({ playing }),
}));

export default useSound;
