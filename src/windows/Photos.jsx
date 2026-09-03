import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components";
import { gallery } from "#constants";
import useWindowStore from "#store/window.js";
import { mosaicLayout } from "#utils/mosaic.js";

const Photos = () => {
    const { openWindow } = useWindowStore();

    // Every tile is placed explicitly, so the mosaic keeps a flush edge no
    // matter how many photos there are.
    const layout = mosaicLayout(gallery.length);

    // Clicking a thumbnail opens the whole photo in the image window, at its
    // own size — the mosaic only ever shows a cropped preview.
    const openPhoto = ({ id, name, img, alt }) =>
        openWindow("imgfile", { item: { id, name, imageUrl: img, alt } });

    return (
        <div className="flex flex-col h-full">
            <div id="window-header">
                <WindowControls target="photos" />
                <h2>gallery</h2>
            </div>

            <div className="gallery">
                <ul>
                    {gallery.map((photo, i) => {
                        const { column, row, w, h } = layout[i];

                        return (
                            <li
                                key={photo.id}
                                style={{
                                    gridColumn: `${column} / span ${w}`,
                                    gridRow: `${row} / span ${h}`,
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => openPhoto(photo)}
                                    title={photo.name}
                                >
                                    <img
                                        src={photo.img}
                                        alt={photo.alt || `gallery-${photo.id}`}
                                        loading="lazy"
                                        decoding="async"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = "/images/placeholder.svg";
                                        }}
                                    />
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

const PhotosWindow = WindowWrapper(Photos, 'photos');

export default PhotosWindow;
