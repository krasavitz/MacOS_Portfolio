import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components";
import useWindowStore from "#store/window.js";
import Prose from "#features/Prose.jsx";

const TextFile = () => {
    const { windows } = useWindowStore();
    const data = windows['txtfile'].data;

    if (!data) return null;

    const { item } = data;

    if (!item) return null;

    return (
        <>
            <div id="window-header">
                <WindowControls target="txtfile" />
                <h2>{item.name}</h2>
            </div>

            <div className="txt-file">
                {item.image && (
                    <img
                        src={item.image}
                        alt={item.alt || item.name}
                        className="txt-file-image"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/images/placeholder.svg";
                        }}
                    />
                )}

                {item.subtitle && (
                    <h3 className="txt-file-subtitle">{item.subtitle}</h3>
                )}

                <Prose paragraphs={item.description} className="prose-body" />
            </div>
        </>
    );
};

const TextFileWindow = WindowWrapper(TextFile, 'txtfile');

export default TextFileWindow;
