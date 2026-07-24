import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components";
import { Download } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const Resume = () => {
    return (
    <div className="flex flex-col h-full">
        <div id="window-header">
            <WindowControls target="resume" />
            <h2>Resume.pdf</h2>

            <a href="files/resume.pdf" 
            download className="cursor-pointer" 
            title="Download Resume"
            >
                <Download className="icon" />
            </a>
        </div>
        
        <div className="resume-container">
            <Document file="files/resume.pdf">
                <Page pageNumber={1} scale={1.2} renderTextLayer renderAnnotationLayer/>
            </Document>
        </div>
    </div>
    )
};

const ResumeWindow = WindowWrapper(Resume, 'resume');
export default ResumeWindow;