/* The desktop/springboard background: an animated dot-matrix horse on white.
   Fixed behind every shell and never takes pointer events.

   The GIF is 800×600 with pure-white edges, so it's shown at (up to) its own
   size, centred on a matching white field, rather than stretched to cover the
   viewport — scaling it up would blur the dots and crop the horse.

   The previous video wallpaper (wallpaper.mp4 + wallpaper-poster.jpg) is still
   in /public/images if you want it back. */
const Wallpaper = () => (
    <div className="wallpaper" aria-hidden="true">
        <img src="/images/wallpaper2.gif" alt="" decoding="async" />
    </div>
);

export default Wallpaper;
