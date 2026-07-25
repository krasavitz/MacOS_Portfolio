import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components";
import { gallery } from "#constants";

const Photos = () => {
    return (
        <>
            <div id="window-header">
                <WindowControls target="photos" />
                <h2>Gallery</h2>
            </div>

            <div className="bg-[#1c1c1e]">
                <div className="gallery">
                    <ul>
                        {gallery.map(({ id, img, alt }) => (
                            <li key={id}>
                                <img
                                    src={img}
                                    alt={alt || `gallery-${id}`}
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = "/images/placeholder.svg";
                                    }}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

const PhotosWindow = WindowWrapper(Photos, 'photos');

export default PhotosWindow;
