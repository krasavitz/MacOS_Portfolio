import { useEffect } from "react";
import { X } from "lucide-react";

/* Full-bleed view of a thumbnail. Closes on Escape, backdrop click, or the
   button — no library, since it only ever shows one image. */
const Lightbox = ({ shot, onClose }) => {
    useEffect(() => {
        if (!shot) return;

        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [shot, onClose]);

    if (!shot) return null;

    return (
        <div className="lightbox" onClick={onClose} role="presentation">
            <button type="button" className="lightbox-close" aria-label="Close">
                <X size={20} />
            </button>

            <figure onClick={(e) => e.stopPropagation()}>
                <img src={shot.full} alt={shot.alt} />
                <figcaption>{shot.alt}</figcaption>
            </figure>
        </div>
    );
};

export default Lightbox;
