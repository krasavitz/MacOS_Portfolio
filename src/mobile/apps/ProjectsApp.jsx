import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronRight, FileText, Play, X } from "lucide-react";
import { locations } from "#constants";
import useMobileStore from "#store/mobile.js";
import { cldThumbFromUrl } from "#utils/cloudinary.js";
import Prose from "#features/Prose.jsx";
import VideoPlayer from "#features/VideoPlayer.jsx";

/* Work on a phone. The desktop Finder makes you browse folders and open files
   one at a time; here each project is a single scrolling page instead —
   Work → project, and everything in it is on that page. */

const PLACEHOLDER = "/images/placeholder.svg";
const onImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = PLACEHOLDER;
};

/** Splits a project folder into the parts its page shows. */
const readProject = (folder) => {
    const children = folder.children || [];
    return {
        doc: children.find((c) => c.fileType === "txt"),
        links: children.filter((c) => ["url", "fig"].includes(c.fileType) && c.href),
        media: children.filter((c) => ["img", "video"].includes(c.fileType)),
        pdfs: children.filter((c) => c.fileType === "pdf"),
    };
};

// Square preview: an image's own asset, or a video's poster frame (its icon).
const thumbOf = (item, size) =>
    cldThumbFromUrl(item.fileType === "img" ? item.imageUrl : item.icon, size);

const hostOf = (href) => href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/* ---------- index ---------- */

const PREVIEWS = 4;

const ProjectCard = ({ folder, onOpen }) => {
    const { doc, media } = readProject(folder);
    const shown = media.slice(0, PREVIEWS);
    const extra = media.length - shown.length;

    return (
        <li>
            <button type="button" className="project-card" onClick={onOpen}>
                <span className="project-card-head">
                    <span className="row-text">
                        <span className="project-card-title">{folder.name}</span>
                        {doc?.subtitle && <span className="row-sub">{doc.subtitle}</span>}
                    </span>
                    <ChevronRight size={18} className="row-chevron" />
                </span>

                {shown.length > 0 && (
                    <span className="project-card-strip">
                        {shown.map((item, i) => (
                            <span key={`${item.id}-${item.name}`} className="project-thumb">
                                <img src={thumbOf(item, 240)} alt="" loading="lazy" decoding="async" onError={onImgError} />
                                {i === shown.length - 1 && extra > 0 && <span className="more">+{extra}</span>}
                            </span>
                        ))}
                    </span>
                )}
            </button>
        </li>
    );
};

export const ProjectsApp = () => {
    const openApp = useMobileStore((s) => s.openApp);
    const all = locations.work.children.filter((c) => c.kind === "folder");
    const groups = [
        { label: "selected work", items: all.filter((c) => c.category !== "university") },
        { label: "university", items: all.filter((c) => c.category === "university") },
    ].filter((g) => g.items.length);

    return (
        <div className="ios-projects">
            {groups.map(({ label, items }) => (
                <section key={label}>
                    <h3 className="ios-section">{label}</h3>
                    <ul>
                        {items.map((folder) => (
                            <ProjectCard
                                key={folder.id}
                                folder={folder}
                                onOpen={() => openApp("project", { title: folder.name, data: { folder } })}
                            />
                        ))}
                    </ul>
                </section>
            ))}

            {/* The plain site, kept within reach but not on the home screen:
                the phone layout already does its job, so it's a quiet link
                at the end of the work list. */}
            <Link to="/simple" className="simple-hint">
                prefer a plain page? simple view →
            </Link>
        </div>
    );
};

/* ---------- viewer ---------- */

/* Full-screen, swipeable view of a project's images and videos. Native
   scroll-snap does the swiping, so it moves exactly like the phone's own
   photo viewer. It takes a history entry of its own, so the back gesture
   closes it rather than the whole project page. Portalled to <body>: the
   sheet it opens from is transformed, which would otherwise trap a fixed
   element inside it and leave the home bar drawn on top. */
const MediaViewer = ({ items, start, onClose }) => {
    const track = useRef(null);
    const [index, setIndex] = useState(start);

    useLayoutEffect(() => {
        const el = track.current;
        if (el) el.scrollLeft = start * el.clientWidth;
    }, [start]);

    // Push once only: StrictMode re-runs effects in dev, and a second entry
    // would make the first back press after closing a dead one.
    const pushed = useRef(false);

    useEffect(() => {
        if (!pushed.current) {
            pushed.current = true;
            window.history.pushState({ ...window.history.state, viewer: true }, "");
        }
        window.addEventListener("popstate", onClose);
        return () => window.removeEventListener("popstate", onClose);
    }, [onClose]);

    const onScroll = (e) => {
        const el = e.currentTarget;
        setIndex(Math.round(el.scrollLeft / el.clientWidth));
    };

    return createPortal(
        <div className="media-viewer" role="dialog" aria-label="Project media">
            <header>
                <span className="count">
                    {index + 1} / {items.length}
                </span>
                <button type="button" aria-label="Close" onClick={() => window.history.back()}>
                    <X size={22} />
                </button>
            </header>

            <div className="track" ref={track} onScroll={onScroll}>
                {items.map((item) => (
                    <figure key={`${item.id}-${item.name}`}>
                        {item.fileType === "video" ? (
                            <VideoPlayer item={item} className="max-w-full max-h-full" />
                        ) : (
                            <img src={item.imageUrl} alt={item.alt || item.name} loading="lazy" decoding="async" onError={onImgError} />
                        )}
                        <figcaption>{item.alt || item.name}</figcaption>
                    </figure>
                ))}
            </div>
        </div>,
        document.body
    );
};

/* ---------- project page ---------- */

export const ProjectApp = ({ entry }) => {
    const openApp = useMobileStore((s) => s.openApp);
    const [viewing, setViewing] = useState(null);
    // Stable, so the viewer's history listener isn't re-bound on every render.
    const closeViewer = useCallback(() => setViewing(null), []);
    const folder = entry?.data?.folder;
    if (!folder) return null;

    const { doc, links, media, pdfs } = readProject(folder);

    return (
        <article className="ios-project">
            <header>
                <h1>{folder.name}</h1>
                {doc?.subtitle && <p className="sub">{doc.subtitle}</p>}

                {links.length > 0 && (
                    <div className="links">
                        {links.map((link) => (
                            <a key={link.id} href={link.href} target="_blank" rel="noopener noreferrer" className="ios-pill">
                                {link.fileType === "fig" ? link.name : hostOf(link.href)}
                                <ArrowUpRight size={15} />
                            </a>
                        ))}
                    </div>
                )}
            </header>

            {media.length > 0 && (
                <section>
                    <h3 className="ios-section">
                        gallery <span>{media.length}</span>
                    </h3>
                    <ul className="project-grid">
                        {media.map((item, i) => (
                            <li key={`${item.id}-${item.name}`}>
                                <button type="button" onClick={() => setViewing(i)} aria-label={`View ${item.alt || item.name}`}>
                                    <img src={thumbOf(item, 480)} alt="" loading="lazy" decoding="async" onError={onImgError} />
                                    {item.fileType === "video" && (
                                        <span className="play">
                                            <Play size={16} fill="currentColor" />
                                        </span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {pdfs.length > 0 && (
                <section>
                    <h3 className="ios-section">
                        documents <span>{pdfs.length}</span>
                    </h3>
                    <ul className="ios-list ios-group">
                        {pdfs.map((item) => (
                            <li key={`${item.id}-${item.name}`}>
                                <button type="button" onClick={() => openApp("pdf", { title: item.name, data: { item } })}>
                                    <span className="doc-icon">
                                        <FileText size={18} />
                                    </span>
                                    <span className="row-text">
                                        <span className="row-title">{item.name.replace(/\.pdf$/i, "")}</span>
                                        <span className="row-sub">PDF</span>
                                    </span>
                                    <ChevronRight size={18} className="row-chevron" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {doc?.description?.length > 0 && (
                <section>
                    <h3 className="ios-section">about the project</h3>
                    <Prose paragraphs={doc.description} className="project-prose" />
                </section>
            )}

            {viewing !== null && <MediaViewer items={media} start={viewing} onClose={closeViewer} />}
        </article>
    );
};
