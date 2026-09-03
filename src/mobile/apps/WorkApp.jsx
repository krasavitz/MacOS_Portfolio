import { ChevronRight, ArrowUpRight } from "lucide-react";
import { locations } from "#constants";
import useMobileStore from "#store/mobile.js";
import { cldThumbFromUrl } from "#utils/cloudinary.js";

/* The row icon, matching the desktop Finder ([Finder.jsx](../../windows/Finder.jsx)):
   images, PDFs and videos show a real preview — an image's own asset, a PDF's
   first page, a video's poster frame — and everything else its file-type art.
   `item.icon` alone is the generic art for those three, so a row rendered
   straight from it shows a page glyph where a thumbnail belongs. */
const rowThumb = (item) => {
    const { fileType } = item;
    if (fileType === "img") return cldThumbFromUrl(item.imageUrl, 96);
    if (fileType === "pdf" || fileType === "video") return cldThumbFromUrl(item.icon, 96);
    return item.icon;
};

/* Finder as an iOS grouped list. Drilling into a folder pushes another
   WorkApp onto the mobile stack, so the sheet's Back button is the only
   navigation needed — no separate breadcrumb. */
const WorkApp = ({ entry }) => {
    const { openApp } = useMobileStore();
    const folder = entry?.data?.folder || locations.work;
    const children = folder.children || [];

    const openItem = (item) => {
        if (item.kind === "folder")
            return openApp("work", { title: item.name, data: { folder: item } });

        if (["url", "fig"].includes(item.fileType) && item.href)
            return window.open(item.href, "_blank", "noopener,noreferrer");

        const view = { txt: "doc", img: "image", video: "video", pdf: "pdf" }[item.fileType];
        if (view) openApp(view, { title: item.name, data: { item } });
    };

    if (!children.length) {
        return <p className="ios-empty">Nothing in here yet.</p>;
    }

    return (
        <ul className="ios-list">
            {children.map((item) => (
                <li key={`${item.kind}-${item.id}-${item.name}`}>
                    <button type="button" onClick={() => openItem(item)}>
                        <img
                            src={rowThumb(item)}
                            alt=""
                            loading="lazy"
                            // A preview that 404s falls back to the file-type
                            // art rather than leaving a broken-image glyph.
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = item.icon;
                            }}
                        />

                        <span className="row-text">
                            <span className="row-title">{item.name}</span>
                            {item.subtitle && <span className="row-sub">{item.subtitle}</span>}
                        </span>

                        {item.fileType === "url" ? (
                            <ArrowUpRight size={18} className="row-chevron" />
                        ) : (
                            <ChevronRight size={18} className="row-chevron" />
                        )}
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default WorkApp;
