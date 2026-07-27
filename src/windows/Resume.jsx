import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components";
import { Download } from "lucide-react";
import PdfViewer, { DEFAULT_PDF } from "#features/PdfViewer.jsx";
import useWindowStore from "#store/window.js";

const Resume = () => {
    const { windows } = useWindowStore();
    const item = windows['resume'].data?.item;

    // Default to the résumé; any PDF file (e.g. an OpenTI client site) passes its own.
    const fileSrc = item?.pdfUrl || DEFAULT_PDF;
    const title = item?.name || "Resume.pdf";

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

        <PdfViewer file={fileSrc} />
    </div>
    )
};

const ResumeWindow = WindowWrapper(Resume, 'resume');
export default ResumeWindow;
