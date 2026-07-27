import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

// Any PDF in the portfolio falls back to the résumé when no file is given.
export const DEFAULT_PDF = "files/Oliver%20Naumov%20Resume%20July%202026.pdf";

/* Renders every page of a PDF, each fitted to the container width so a résumé
   and a large client-site export both size correctly. Shared by the desktop
   Resume window and the mobile Resume app. */
const PdfViewer = ({ file = DEFAULT_PDF, className = "resume-container", padding = 32 }) => {
    const [numPages, setNumPages] = useState(null);
    const containerRef = useRef(null);
    const [pageWidth, setPageWidth] = useState(600);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const update = () => {
            const w = el.clientWidth;
            if (w > 0) setPageWidth(Math.max(w - padding, 120));
        };

        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, [padding]);

    return (
        <div className={className} ref={containerRef}>
            <Document file={file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
                {Array.from({ length: numPages || 1 }, (_, i) => (
                    <Page
                        key={i}
                        pageNumber={i + 1}
                        width={pageWidth}
                        renderTextLayer
                        renderAnnotationLayer
                    />
                ))}
            </Document>
        </div>
    );
};

export default PdfViewer;
