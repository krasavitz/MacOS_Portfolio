import { Download } from "lucide-react";
import VideoPlayer from "#features/VideoPlayer.jsx";
import PdfViewer, { DEFAULT_PDF } from "#features/PdfViewer.jsx";

/* The three single-asset viewers. They share a container, so they share a file. */

export const ImageApp = ({ entry }) => {
    const item = entry?.data?.item;
    if (!item) return null;

    return (
        <div className="ios-media">
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
        </div>
    );
};

export const VideoApp = ({ entry }) => {
    const item = entry?.data?.item;
    if (!item) return null;

    return (
        <div className="ios-media">
            <VideoPlayer item={item} className="w-full rounded-xl" />
        </div>
    );
};

export const PdfApp = ({ entry }) => {
    const item = entry?.data?.item;
    const file = item?.pdfUrl || DEFAULT_PDF;

    return (
        <div className="ios-pdf">
            <a href={file} download className="ios-download">
                <Download size={16} />
                <span>Download {item?.name || "Resume.pdf"}</span>
            </a>

            <PdfViewer file={file} className="ios-pdf-pages" padding={24} />
        </div>
    );
};
