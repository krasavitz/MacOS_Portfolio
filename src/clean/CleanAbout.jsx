import { Link } from "react-router-dom";
import CleanLayout from "#clean/CleanLayout.jsx";
import { aboutDoc, headshot } from "#clean/projects.js";
import { useReveal } from "#clean/useReveal.js";
import Prose from "#features/Prose.jsx";
import { techStack } from "#constants";

const CleanAbout = () => {
    const ref = useReveal();

    return (
    <CleanLayout title="about">
        <article className="clean-project" ref={ref}>
            <header>
                <h1 className="reveal" style={{ "--i": 0 }}>about</h1>
                {aboutDoc?.subtitle && (
                    <p className="clean-sub reveal" style={{ "--i": 1 }}>{aboutDoc.subtitle}</p>
                )}
            </header>

            <div className="about-body">
                {headshot && (
                    <img
                        className="headshot reveal"
                        style={{ "--i": 2 }}
                        src={headshot.imageUrl}
                        alt={headshot.alt || "Oliver Naumov"}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/images/placeholder.svg";
                        }}
                    />
                )}

                <Prose paragraphs={aboutDoc?.description} className="clean-prose reveal" />
            </div>

            <section className="clean-section">
                <h2 className="reveal">toolkit</h2>

                <ul className="clean-index">
                    {techStack.map(({ category, items }, i) => (
                        <li key={category} className="reveal" style={{ "--i": i }}>
                            <div className="idx-row">
                                <span className="idx-name">{category}</span>
                                <span className="idx-note">{items.join(", ")}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            <p className="clean-file">
                <Link to="/simple">← all work</Link>
            </p>
        </article>
    </CleanLayout>
    );
};

export default CleanAbout;
