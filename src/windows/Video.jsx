import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components";
import useWindowStore from "#store/window.js";
import VideoPlayer from "#features/VideoPlayer.jsx";

const VideoFile = () => {
    const { windows } = useWindowStore();
    const data = windows['videofile'].data;

    if (!data) return null;

    const { item } = data;
    if (!item) return null;

    return (
        <>
            <div id="window-header">
                <WindowControls target="videofile" />
                <p>{item.name}</p>
            </div>

            <div className="preview">
                <VideoPlayer item={item} />
            </div>
        </>
    );
};

const VideoFileWindow = WindowWrapper(VideoFile, 'videofile');

export default VideoFileWindow;
