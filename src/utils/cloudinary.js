// ---------------------------------------------------------------------------
// Cloudinary URL builder
//
// Assets live in Cloudinary, not the repo. Store a public ID in the content
// data (e.g. "tchpack/aria-flow") and let these helpers build the URL, so
// resizing / format / quality are decided here in one place instead of being
// baked into hundreds of hand-written URLs.
//
// The public ID is the path Cloudinary shows for an asset, minus the file
// extension: for
//   https://res.cloudinary.com/oliver/image/upload/v1720/tchpack/aria-flow.png
// the public ID is "tchpack/aria-flow".
// ---------------------------------------------------------------------------

// TODO: set this to your Cloudinary cloud name (shown in every asset URL and
// at cloudinary.com/console). Nothing loads from Cloudinary until it's set.
export const CLOUDINARY_CLOUD_NAME = "igvftt7h";

const BASE = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}`;

// f_auto = serve AVIF/WebP when the browser supports it; q_auto = let Cloudinary
// pick a visually-lossless quality; c_limit = never upscale past the width.
const defaultImageTransforms = "f_auto,q_auto,c_limit";
const defaultVideoTransforms = "f_auto,q_auto";

/**
 * Build an optimized image URL.
 * @param {string} publicId e.g. "tchpack/brand-system"
 * @param {{ width?: number, extra?: string }} [opts]
 */
export const cldImage = (publicId, { width = 1600, extra = "" } = {}) => {
  if (!publicId) return "";
  const t = [defaultImageTransforms, `w_${width}`, extra]
    .filter(Boolean)
    .join(",");
  return `${BASE}/image/upload/${t}/${publicId}`;
};

/**
 * Build an optimized (muted-ready) video URL.
 * @param {string} publicId e.g. "tchpack/aria-demo"
 * @param {{ width?: number, extra?: string }} [opts]
 */
export const cldVideo = (publicId, { width = 1280, extra = "" } = {}) => {
  if (!publicId) return "";
  const t = [defaultVideoTransforms, `w_${width}`, extra]
    .filter(Boolean)
    .join(",");
  return `${BASE}/video/upload/${t}/${publicId}.mp4`;
};

/**
 * Build a URL to the original PDF for a public ID.
 * NOTE: Cloudinary blocks PDF delivery by default — enable
 * "Allow delivery of PDF and ZIP files" in Settings → Security, or this 401s.
 */
export const cldPdf = (publicId) =>
  publicId ? `${BASE}/image/upload/${publicId}.pdf` : "";

/** A poster (still frame) generated from a video, for the <video poster> attr. */
export const cldVideoPoster = (publicId, { width = 1280 } = {}) => {
  if (!publicId) return "";
  return `${BASE}/video/upload/f_auto,q_auto,w_${width},so_0/${publicId}.jpg`;
};

/**
 * Turn a full Cloudinary image URL into a small square thumbnail URL, by
 * rewriting its transform segment. Used for file icons that should show the
 * actual image instead of a generic placeholder. Non-Cloudinary URLs (e.g. the
 * local placeholder) are returned unchanged.
 */
export const cldThumbFromUrl = (url, size = 128) => {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  return url.replace(
    /\/upload\/[^/]+\//,
    `/upload/c_fill,g_auto,f_auto,q_auto,w_${size},h_${size}/`
  );
};

export const isCloudinaryConfigured = () =>
  CLOUDINARY_CLOUD_NAME !== "YOUR_CLOUD_NAME" && Boolean(CLOUDINARY_CLOUD_NAME);
