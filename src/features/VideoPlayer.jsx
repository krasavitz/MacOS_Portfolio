import { cldVideo, cldVideoPoster, isCloudinaryConfigured } from "#utils/cloudinary.js";

/* A Cloudinary-backed video, or a labelled placeholder when the asset isn't
   configured yet. Shared by the desktop Video window, the mobile viewer, and
   the clean site's project pages. */
const VideoPlayer = ({ item, className = "max-h-full max-w-full" }) => {
    if (!item) return null;

    if (!isCloudinaryConfigured() || !item.videoId) {
        return (
            <div className="video-placeholder">
                <p>Video placeholder</p>
                <p>{item.alt || item.name}</p>
            </div>
        );
    }

    return (
        <video
            src={cldVideo(item.videoId)}
            poster={cldVideoPoster(item.videoId)}
            controls
            muted
            playsInline
            preload="none"
            aria-label={item.alt || item.name}
            className={className}
        />
    );
};

export default VideoPlayer;
