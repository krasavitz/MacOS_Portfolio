import Prose from "#features/Prose.jsx";

/* A `.txt` node: optional image, subtitle, then the case-study prose. */
const DocApp = ({ entry }) => {
    const item = entry?.data?.item;
    if (!item) return null;

    return (
        <article className="ios-doc">
            {item.image && (
                <img
                    src={item.image}
                    alt={item.alt || item.name}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/placeholder.svg";
                    }}
                />
            )}

            {item.subtitle && <h3>{item.subtitle}</h3>}

            <Prose paragraphs={item.description} />
        </article>
    );
};

export default DocApp;
