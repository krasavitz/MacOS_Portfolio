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

/* First-page preview of a PDF, cropped to a square file tile — the local
   equivalent of the Cloudinary-rendered thumbnails the OpenTI PDFs use.
   Lives here so it shares the worker setup above. Falls back to the generic
   PDF icon if the file can't be rendered. */
export const PdfThumb = ({ file = DEFAULT_PDF, size = 64 }) => {
    const [failed, setFailed] = useState(false);

    if (failed) return <img src="/images/pdf.png" alt="" />;

    return (
        <span className="pdf-thumb" style={{ width: size, height: size }}>
            <Document
                file={file}
                loading={null}
                error={null}
                onLoadError={() => setFailed(true)}
            >
                <Page
                    pageNumber={1}
                    width={Math.round(size * 1.6)}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    onRenderError={() => setFailed(true)}
                />
            </Document>
        </span>
    );
};

export default PdfViewer;
