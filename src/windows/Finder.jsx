import { WindowControls } from "#components";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { locations } from "#constants";
import useLocationStore from "#store/location.js";
import clsx from "clsx";
import useWindowStore from "#store/window.js";
import { cldThumbFromUrl } from "#utils/cloudinary.js";

const Finder = () => {
    const { openWindow } = useWindowStore();
    const { activeLocation, setActiveLocation, path, openFolder, goBack, goToCrumb } = useLocationStore();

    const openItem = (item) => {
        if(item.fileType === 'pdf') return openWindow('resume', { item });
        if(item.kind === 'folder') return openFolder(item);
        if(['fig', 'url'].includes(item.fileType) && item.href)
            return window.open(item.href, "_blank");

        openWindow (`${item.fileType}file`, { item });
    }

    const renderList = (name, items, system = false) => (
        <div>
                    <h3>{name}</h3>

        <ul>
            {items.map((item) => (
        <li
            key={item.id}
            onClick={() => setActiveLocation(item)}
            className={clsx(
                activeLocation?.id === item.id && "active"
            )}
        >
            <img src={item.icon} className={clsx("w-4", system && "sys-icon")} alt={item.name}/>
            <p className="text-sm font-medium truncate">{item.name}</p>
        </li>
    ))}
    </ul>
    </div>
    );

    return (
      <div className="flex flex-col h-full">
        <div id="window-header">
            <WindowControls target="finder" />
            <Search className="icon" />
        </div>

        <div className="bg-[#1c1c1e] flex flex-1 min-h-0">
            <div className="sidebar">
                {renderList("Favorites", Object.values(locations), true)}
                {renderList("Work", locations.work.children.filter((c) => c.category !== "university"))}
                {renderList("University", locations.work.children.filter((c) => c.category === "university"))}
            </div>
            <div className="content-pane">
            <div className="breadcrumb">
                <button
                    type="button"
                    className="nav-btn"
                    onClick={goBack}
                    disabled={path.length <= 1}
                    aria-label="Back"
                >
                    <ChevronLeft className="icon" />
                </button>
                <button type="button" className="nav-btn" disabled aria-label="Forward">
                    <ChevronRight className="icon" />
                </button>
                <div className="crumbs">
                    {path.map((crumb, i) => (
                        <span key={`${crumb.id}-${i}`} className="flex items-center">
                            {i > 0 && <span className="sep">/</span>}
                            <button
                                type="button"
                                className={clsx("crumb", i === path.length - 1 && "current")}
                                onClick={() => goToCrumb(i)}
                                disabled={i === path.length - 1}
                            >
                                {crumb.name}
                            </button>
                        </span>
                    ))}
                </div>
            </div>
            <ul className="content">
            {activeLocation.children.map((item) => {
                const isImg = item.fileType === "img";
                const isPdf = item.fileType === "pdf";
                const isVideo = item.fileType === "video";
                // Images, PDFs, and videos show a square preview thumbnail —
                // PDFs render their first page, videos their poster frame.
                const thumb = isImg || isPdf || isVideo;
                const iconSrc = isImg
                    ? cldThumbFromUrl(item.imageUrl)
                    : (isPdf || isVideo)
                    ? cldThumbFromUrl(item.icon)
                    : item.icon;
                return (
                    <li key={item.id} onClick={() => openItem(item)} >
                        <img
                            src={iconSrc}
                            alt={item.name}
                            className={thumb ? "file-thumb" : undefined}
                            loading="lazy"
                            onError={thumb ? (e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = isPdf ? "/images/pdf.png" : "/images/image.png";
                            } : undefined}
                        />
                        <p>{item.name}</p>
                    </li>
                );
            })}
        </ul>
        </div>
        </div>
      </div>
    );
};


const FinderWindow = WindowWrapper(Finder, 'finder');

export default FinderWindow;