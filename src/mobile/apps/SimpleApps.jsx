import { techStack, socials, bookmarks, gallery, locations } from "#constants";
import Prose from "#features/Prose.jsx";

/* The apps that are a thin map over constants, laid out for touch:
   stacked cards and two-column media instead of the desktop's fixed grids. */

/* The same content as the desktop skills window ([Terminal.jsx](../../windows/Terminal.jsx)):
   its hero and numbered categories, stacked for a phone rather than gridded. */
export const SkillsApp = () => (
    <div className="ios-cards">
        <header className="ios-hero">
            <p className="eyebrow">toolkit</p>
            <h2>skills ive picked up</h2>
        </header>

        {techStack.map(({ category, items }, i) => (
            <section key={category} className="ios-card">
                <div className="card-top">
                    <span className="index">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{category}</h3>
                </div>

                <ul className="tag-list">
                    {items.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </section>
        ))}
    </div>
);

export const ContactApp = () => (
    <div className="ios-cards">
        <p className="ios-lede">
            designer. the fastest way to reach me is email, the rest are below.
        </p>

        <ul className="social-list">
            {socials.map(({ id, text, icon, bg, link }) => (
                <li key={id}>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                        <span className="social-icon" style={{ backgroundColor: bg }}>
                            <img src={icon} alt="" />
                        </span>
                        <span>{text}</span>
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

export const BookmarksApp = () => (
    <div className="ios-cards">
        <p className="ios-lede">Brands, tools, and sites that shape how I work.</p>

        <ul className="bookmark-list">
            {bookmarks.map(({ id, title, host, note, link, bg }) => (
                <li key={id}>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                        <span className="tile" style={{ backgroundColor: bg }}>
                            {title.charAt(0)}
                        </span>
                        <span className="row-text">
                            <span className="row-title">{title}</span>
                            <span className="row-sub">{host}, {note}</span>
                        </span>
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

export const GalleryApp = () => (
    <ul className="ios-gallery">
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
);

export const AboutApp = () => {
    const doc = locations.about.children.find((c) => c.fileType === "txt");
    if (!doc) return null;

    return (
        <article className="ios-doc">
            {doc.image && <img src={doc.image} alt={doc.alt || doc.name} loading="lazy" />}
            {doc.subtitle && <h3>{doc.subtitle}</h3>}
            <Prose paragraphs={doc.description} />
        </article>
    );
};
