/* Renders a `.txt` node's description array as paragraphs. Case-study prose
   lives in constants as a flat string[] with bare uppercase section headers
   ("OVERVIEW", "ROLE"); those are rendered as headings rather than body copy. */

const isHeading = (text) =>
    text.length < 40 && text === text.toUpperCase() && /[A-Z]/.test(text);

const Prose = ({ paragraphs, className = "" }) => {
    if (!Array.isArray(paragraphs)) return null;

    return (
        <div className={className}>
            {paragraphs.map((paragraph, i) =>
                isHeading(paragraph) ? (
                    <h4 key={i} className="prose-heading">{paragraph}</h4>
                ) : (
                    <p key={i}>{paragraph}</p>
                )
            )}
        </div>
    );
};

export default Prose;
