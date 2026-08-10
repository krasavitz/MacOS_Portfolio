import { Link, useParams } from "react-router-dom";
import CleanLayout from "#clean/CleanLayout.jsx";
import { findProject } from "#clean/projects.js";
import { useReveal } from "#clean/useReveal.js";
import Prose from "#features/Prose.jsx";
import VideoPlayer from "#features/VideoPlayer.jsx";

const Media = ({ item }) => {
    if (item.fileType === "img") {
        return (
            <figure>
                <img
                    src={item.imageUrl}
                    alt={item.alt || item.name}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/placeholder.svg";
                    }}
                />
                <figcaption>{item.alt || item.name}</figcaption>
            </figure>
        );
    }

    if (item.fileType === "video") {
        return (
            <figure>
                <VideoPlayer item={item} className="w-full" />
                <figcaption>{item.alt || item.name}</figcaption>
            </figure>
        );
    }

    // PDFs stay links — embedding a viewer would undo the point of this side.
    return (
        <p className="clean-file">
            <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer">
                {item.name} ↗
            </a>
        </p>
    );
};

const CleanProject = () => {
    const { slug } = useParams();
    const project = findProject(slug);
    const ref = useReveal();

    if (!project) {
        return (
            <CleanLayout title="not found">
                <p className="clean-lede">no project by that name.</p>
                <p className="clean-file">
                    <Link to="/simple">← all work</Link>
                </p>
            </CleanLayout>
        );
    }

    return (
        <CleanLayout title={project.name}>
            <article className="clean-project" ref={ref}>
                <header>
                    <h1 className="reveal" style={{ "--i": 0 }}>{project.name}</h1>
                    {project.subtitle && (
                        <p className="clean-sub reveal" style={{ "--i": 1 }}>{project.subtitle}</p>
                    )}
                    {project.link && (
                        <p className="clean-file reveal" style={{ "--i": 2 }}>
                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                                {project.link.replace(/^https?:\/\/(www\.)?/, "")} ↗
                            </a>
                        </p>
                    )}
                </header>

                <Prose paragraphs={project.description} className="clean-prose reveal" />

                {project.media.length > 0 && (
                    <div className="clean-media">
                        {project.media.map((item) => (
                            <div className="reveal" key={`${item.fileType}-${item.id}-${item.name}`}>
                                <Media item={item} />
                            </div>
                        ))}
                    </div>
                )}

                <p className="clean-file">
                    <Link to="/simple">← all work</Link>
                </p>
            </article>
        </CleanLayout>
    );
};

export default CleanProject;
