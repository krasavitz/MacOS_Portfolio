import { Volume2, VolumeX } from "lucide-react";
import useSound from "#store/sound.js";

/* Speaker button for the background song. Used in the desktop menu bar and
   the mobile status bar. */
const SoundToggle = ({ size = 16, className = "" }) => {
    const muted = useSound((s) => s.muted);
    const toggleMuted = useSound((s) => s.toggleMuted);

    return (
        <button
            type="button"
            className={`sound-toggle ${className}`}
            onClick={toggleMuted}
            aria-pressed={!muted}
            aria-label={muted ? "Play background music" : "Mute background music"}
            title={muted ? "Play music" : "Mute music"}
        >
            {muted ? <VolumeX size={size} /> : <Volume2 size={size} />}
        </button>
    );
};

export default SoundToggle;
