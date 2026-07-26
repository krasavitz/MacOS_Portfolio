import { desktopShortcuts, locations } from '#constants';
import useWindowStore from '#store/window.js';
import useLocationStore from '#store/location.js';

/* Shortcuts on the desktop itself. A shortcut links out (`href`), opens an app
   window (`windowKey`), or opens a Work subfolder in Finder (`folder`).
   Single click opens — matching the dock rather than real Finder. */
const DesktopIcons = () => {
    const { openWindow } = useWindowStore();
    const { setActiveLocation } = useLocationStore();

    const openShortcut = (shortcut) => {
        if (shortcut.href) return window.open(shortcut.href, '_blank', 'noopener,noreferrer');

        if (shortcut.folder) {
            const folder = locations.work.children.find((c) => c.name === shortcut.folder);
            if (!folder) return;
            setActiveLocation(folder);
            return openWindow('finder');
        }

        if (shortcut.windowKey) openWindow(shortcut.windowKey);
    };

    return (
        <section id="desktop-icons">
            {desktopShortcuts.map((shortcut) => (
                <button
                    key={shortcut.id}
                    type="button"
                    className="desktop-icon"
                    onClick={() => openShortcut(shortcut)}
                    aria-label={`Open ${shortcut.name}`}
                >
                    <img src={shortcut.icon} alt="" loading="lazy" />
                    <span>{shortcut.name}</span>
                </button>
            ))}
        </section>
    );
};

export default DesktopIcons;
