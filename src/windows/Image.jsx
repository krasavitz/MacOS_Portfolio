import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components";
import useWindowStore from "#store/window.js";

const ImageFile = () => {
    const { windows } = useWindowStore();
    const data = windows['imgfile'].data;

    if (!data) return null;

    const { item } = data;

    if (!item) return null;

    return (
        <>
            <div id="window-header">
                <WindowControls target="imgfile" />
                <p>{item.name}</p>
            </div>

            <div className="preview">
                <img
                    src={item.imageUrl}
                    alt={item.alt || item.name}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/placeholder.svg";
                    }}
                />
            </div>
        </>
    );
};

const ImageFileWindow = WindowWrapper(ImageFile, 'imgfile');

export default ImageFileWindow;
