import { useState, useRef, useEffect } from "react";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components";
import { Download } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import useWindowStore from "#store/window.js";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const Resume = () => {
    const { windows } = useWindowStore();
    const item = windows['resume'].data?.item;

    // Default to the résumé; any PDF file (e.g. an OpenTI client site) passes its own.
    const fileSrc = item?.pdfUrl || "files/Oliver%20Naumov%20Resume%20July%202026.pdf";
    const title = item?.name || "Resume.pdf";

    const [numPages, setNumPages] = useState(null);

    // Fit each page to the container width so any PDF (résumé or a large
    // client-site export) sizes correctly regardless of its source dimensions.
    const containerRef = useRef(null);
    const [pageWidth, setPageWidth] = useState(600);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const update = () => {
            const w = el.clientWidth;
            if (w > 0) setPageWidth(w - 32); // account for the container's p-4
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    return (
    <div className="flex flex-col h-full">
        <div id="window-header">
            <WindowControls target="resume" />
            <h2>{title}</h2>

            <a href={fileSrc}
            download className="cursor-pointer"
            title={`Download ${title}`}
            >
                <Download className="icon" />
            </a>
        </div>

        <div className="resume-container" ref={containerRef}>
            <Document
                file={fileSrc}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
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
    </div>
    )
};

const ResumeWindow = WindowWrapper(Resume, 'resume');
export default ResumeWindow;
