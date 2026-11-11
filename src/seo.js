import { profile, socials } from "#constants";
import { projects, aboutDoc } from "#clean/projects.js";

/* Search and link-preview metadata for every page, in one place. Read by
   CleanLayout (to update the head on client-side navigation) and by
   scripts/prerender.mjs (to bake the same tags into each page's static HTML
   and to write sitemap.xml). Change a title or description here and both
   follow. */

export const SITE_URL = "https://olivernaumov.xyz";
export const SITE_NAME = "Oliver Naumov";
export const DEFAULT_IMAGE = `${SITE_URL}/og.png`;

const HOME = {
    title: "Oliver Naumov, Product Designer and Founder",
    description:
        "Oliver Naumov is a product designer and founder in New York. Co-founder of Tchpack, an AI platform for fashion brands. Apps, websites, brand and growth.",
};

// Case-study prose opens with uppercase section labels ("OVERVIEW"); the
// first real sentence is the useful summary.
const isHeading = (text) => text.length < 40 && text === text.toUpperCase() && /[A-Z]/.test(text);

const clip = (text, max = 158) => {
    const clean = text.replace(/\s+/g, " ").trim();
    if (clean.length <= max) return clean;
    return `${clean.slice(0, max - 1).replace(/[\s,.;:]+\S*$/, "")}…`;
};

const firstSentence = (paragraphs = []) => paragraphs.find((p) => !isHeading(p)) || "";

// A Cloudinary image fitted (padded, never cropped) to the 1200×630 link-preview shape.
const shareCrop = (url) =>
    url?.includes("res.cloudinary.com")
        ? url.replace(/\/upload\/[^/]+\//, "/upload/c_pad,b_auto,f_jpg,q_auto,w_1200,h_630/")
        : DEFAULT_IMAGE;

/** Title, description, canonical URL and share image for a path. */
export const routeMeta = (pathname = "/") => {
    const path = pathname.replace(/\/+$/, "") || "/";

    if (path === "/simple") {
        return {
            path,
            title: "Work, Oliver Naumov",
            description: clip(
                `Selected work by Oliver Naumov: ${projects.map((p) => p.name).join(", ")}. Product design, brand and UX.`
            ),
            image: DEFAULT_IMAGE,
        };
    }

    if (path === "/simple/about") {
        return {
            path,
            title: "About, Oliver Naumov",
            description: clip(firstSentence(aboutDoc?.description) || profile.bio[0]),
            image: DEFAULT_IMAGE,
        };
    }

    const slug = path.match(/^\/simple\/([^/]+)$/)?.[1];
    const project = slug && projects.find((p) => p.slug === slug);
    if (project) {
        const lead = firstSentence(project.description);
        const cover = project.media.find((m) => m.fileType === "img");
        return {
            path,
            title: `${project.name}, Oliver Naumov`,
            description: clip([project.subtitle, lead].filter(Boolean).join(". ")),
            image: shareCrop(cover?.imageUrl),
        };
    }

    return { path: "/", ...HOME, image: DEFAULT_IMAGE };
};

/** Every page worth indexing; also the list scripts/prerender.mjs renders. */
export const indexablePaths = () => [
    "/",
    "/simple",
    "/simple/about",
    ...projects.map((p) => `/simple/${p.slug}`),
];

/** schema.org Person, so search engines know who the site is about. */
export const personSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: SITE_URL,
    image: profile.photo,
    jobTitle: "Product Designer",
    worksFor: { "@type": "Organization", name: "Tchpack", url: "https://tchpack.com" },
    address: { "@type": "PostalAddress", addressLocality: "New York", addressRegion: "NY", addressCountry: "US" },
    sameAs: socials.map((s) => s.link).filter((l) => /^https?:/.test(l) && !l.includes("tchpack.com")),
});

/* Client-side: rewrite the head tags in place on navigation, so the title,
   description, canonical and share tags always match the page being shown.
   Updates the tags the static HTML already ships (see index.html) rather
   than adding duplicates. */
const upsert = (selector, create, attr, value) => {
    let el = document.head.querySelector(selector);
    if (!el) {
        el = create();
        document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
};

const metaTag = (attr, key) => () => {
    const el = document.createElement("meta");
    el.setAttribute(attr, key);
    return el;
};

export const applyMeta = (pathname) => {
    if (typeof document === "undefined") return;
    const { path, title, description, image } = routeMeta(pathname);
    const url = `${SITE_URL}${path === "/" ? "/" : path}`;

    document.title = title;
    upsert('meta[name="description"]', metaTag("name", "description"), "content", description);
    upsert('link[rel="canonical"]', () => Object.assign(document.createElement("link"), { rel: "canonical" }), "href", url);
    upsert('meta[property="og:title"]', metaTag("property", "og:title"), "content", title);
    upsert('meta[property="og:description"]', metaTag("property", "og:description"), "content", description);
    upsert('meta[property="og:url"]', metaTag("property", "og:url"), "content", url);
    upsert('meta[property="og:image"]', metaTag("property", "og:image"), "content", image);
    upsert('meta[name="twitter:title"]', metaTag("name", "twitter:title"), "content", title);
    upsert('meta[name="twitter:description"]', metaTag("name", "twitter:description"), "content", description);
    upsert('meta[name="twitter:image"]', metaTag("name", "twitter:image"), "content", image);
};
