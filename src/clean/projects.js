import { locations } from "#constants";
import { slugify } from "#utils/slug.js";
import { cldThumbFromUrl } from "#utils/cloudinary.js";

// Small square previews shown inline on the index. Videos already carry a
// poster frame as their icon, so they thumbnail for free.
const MAX_THUMBS = 5;

const toThumbs = (children) => {
    const previewable = children.filter((c) =>
        // A url node has no artwork of its own beyond its favicon-style icon,
        // but it keeps a project like Tchpack — all prose, no images — from
        // showing an empty strip.
        ["img", "video"].includes(c.fileType) || (c.fileType === "url" && c.icon)
    );

    return previewable.slice(0, MAX_THUMBS).map((m) => ({
        id: `${m.fileType}-${m.id}-${m.name}`,
        name: m.name,
        alt: m.alt || m.name,
        thumb: m.fileType === "img" ? cldThumbFromUrl(m.imageUrl, 160) : m.icon,
        full: m.fileType === "img" ? m.imageUrl : m.icon,
    }));
};

/* The clean site is a second view onto the same content tree the Finder uses,
   so projects are derived from locations.work rather than duplicated. Adding a
   folder to WORK_LOCATION gives it a page at /simple/<slug> for free. */

const toProject = (folder) => {
    const children = folder.children || [];
    const doc = children.find((c) => c.fileType === "txt");
    const media = children.filter((c) => ["img", "video", "pdf"].includes(c.fileType));

    return {
        thumbs: toThumbs(children),
        slug: slugify(folder.name),
        name: folder.name,
        category: folder.category || "selected",
        subtitle: doc?.subtitle || "",
        description: doc?.description || [],
        link: children.find((c) => c.fileType === "url")?.href || null,
        media,
    };
};

export const projects = (locations.work.children || []).map(toProject);

export const findProject = (slug) => projects.find((p) => p.slug === slug);

export const aboutDoc = (locations.about.children || []).find(
    (c) => c.fileType === "txt"
);

/* The headshot lives in the About folder as an image node; the clean site
   shows it beside the intro rather than as a file to open. */
export const headshot = (locations.about.children || []).find(
    (c) => c.fileType === "img"
);
