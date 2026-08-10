import { useState } from "react";
import { Link } from "react-router-dom";
import CleanLayout from "#clean/CleanLayout.jsx";
import Lightbox from "#clean/Lightbox.jsx";
import { projects } from "#clean/projects.js";
import { useReveal } from "#clean/useReveal.js";
import { socials, profile } from "#constants";

const GROUPS = [
    { key: "selected", label: "selected work" },
    { key: "university", label: "university" },
];

const CleanIndex = () => {
    const ref = useReveal();
    const [shot, setShot] = useState(null);

    // Row order feeds the stagger: each reveal starts --i * 60ms after the last.
    let step = 0;

    return (
        <CleanLayout>
            <div ref={ref}>
                <p className="clean-lede reveal" style={{ "--i": step++ }}>
                    {profile.greeting}. {profile.intro}
                </p>

                {GROUPS.map(({ key, label }) => {
                    const rows = projects.filter((p) => p.category === key);
                    if (!rows.length) return null;

                    return (
                        <section key={key} className="clean-section">
                            <h2 className="reveal" style={{ "--i": step++ }}>{label}</h2>

                            <ul className="clean-index">
                                {rows.map((project) => (
                                    <li key={project.slug} className="reveal" style={{ "--i": step++ }}>
                                        <div className="idx-row">
                                            {/* The link and the thumbs are siblings — a button
                                                inside an anchor would be invalid markup. */}
                                            <Link to={`/simple/${project.slug}`} className="idx-link">
                                                <span className="idx-name">{project.name}</span>
                                                <span className="idx-note">{project.subtitle}</span>
                                            </Link>

                                            {project.thumbs.length > 0 && (
                                                <div className="idx-thumbs">
                                                    {project.thumbs.map((t) => (
                                                        <button
                                                            key={t.id}
                                                            type="button"
                                                            onClick={() => setShot(t)}
                                                            aria-label={`View ${t.alt}`}
                                                        >
                                                            <img
                                                                src={t.thumb}
                                                                alt=""
                                                                loading="lazy"
                                                                decoding="async"
                                                                onError={(e) => {
                                                                    e.currentTarget.onerror = null;
                                                                    e.currentTarget.src = "/images/placeholder.svg";
                                                                }}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    );
                })}

                <section className="clean-section">
                    <h2 className="reveal" style={{ "--i": step++ }}>elsewhere</h2>

                    <ul className="clean-index">
                        {socials.map(({ id, text, link }) => (
                            <li key={id} className="reveal" style={{ "--i": step++ }}>
                                <a href={link} target="_blank" rel="noopener noreferrer" className="idx-link">
                                    <span className="idx-name">{text}</span>
                                    <span className="idx-note">
                                        {link.replace(/^mailto:|^https?:\/\/(www\.)?/, "")}
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            <Lightbox shot={shot} onClose={() => setShot(null)} />
        </CleanLayout>
    );
};

export default CleanIndex;
