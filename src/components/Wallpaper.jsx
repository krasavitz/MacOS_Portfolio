/* The desktop/springboard background. A video rather than a CSS background
   image, since `background-image` cannot take a video source — it is fixed
   behind every shell and never takes pointer events, so it behaves like one.
   The scrim is a sibling above the video, reproducing the dark gradient the
   old background-image baked in: windows, desktop text and the status bar are
   all tuned against a darkened wallpaper. */
const Wallpaper = () => (
    <div className="wallpaper" aria-hidden="true">
        <video
            src="/images/wallpaper.mp4"
            autoPlay
            loop
            muted
            // iOS refuses to autoplay inline without this and goes fullscreen.
            playsInline
            // Nothing to show before the first frame decodes; the wrapper's
            // background colour covers that gap.
            preload="auto"
            tabIndex={-1}
        />

        <div className="wallpaper-scrim" />
    </div>
);

export default Wallpaper;
