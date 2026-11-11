import useWindowStore from "#store/window.js";

/* Traffic lights. Glyphs appear when the cluster is hovered, as on macOS.
   Minimize has no dock-thumbnail state to go to, so it hides the window the
   same way close does; the dock icon reopens it. */
const WindowControls = ({ target }) => {
    const closeWindow = useWindowStore((s) => s.closeWindow);
    const toggleMaximize = useWindowStore((s) => s.toggleMaximize);

    return (
        <div id="window-controls">
            <button type="button" className="close" aria-label="Close window" onClick={() => closeWindow(target)}>
                <span aria-hidden="true">×</span>
            </button>
            <button type="button" className="minimize" aria-label="Minimize window" onClick={() => closeWindow(target)}>
                <span aria-hidden="true">−</span>
            </button>
            <button type="button" className="maximize" aria-label="Maximize window" onClick={() => toggleMaximize(target)}>
                <span aria-hidden="true">+</span>
            </button>
        </div>
    );
};

export default WindowControls;
