import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components";
import useWindowStore from "#store/window.js";
import { cldVideo, cldVideoPoster, isCloudinaryConfigured } from "#utils/cloudinary.js";

const VideoFile = () => {
    const { windows } = useWindowStore();
    const data = windows['videofile'].data;

    if (!data) return null;

    const { item } = data;
    if (!item) return null;

    const ready = isCloudinaryConfigured() && item.videoId;

    return (
        <>
            <div id="window-header">
                <WindowControls target="videofile" />
                <p>{item.name}</p>
            </div>

            <div className="preview">
                {ready ? (
                    <video
                        src={cldVideo(item.videoId)}
                        poster={cldVideoPoster(item.videoId)}
                        controls
                        muted
                        playsInline
                        preload="none"
                        aria-label={item.alt || item.name}
                        className="max-h-full max-w-full"
                    />
                ) : (
                    <div className="video-placeholder">
                        <p>Video placeholder</p>
                        <p>{item.alt || item.name}</p>
                    </div>
                )}
            </div>
        </>
    );
};

const VideoFileWindow = WindowWrapper(VideoFile, 'videofile');

export default VideoFileWindow;
