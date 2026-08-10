import { WindowControls } from "#components";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { locations, profile } from "#constants";
import useLocationStore from "#store/location.js";
import clsx from "clsx";
import useWindowStore from "#store/window.js";
import { cldThumbFromUrl } from "#utils/cloudinary.js";
import { PdfThumb, DEFAULT_PDF } from "#features/PdfViewer.jsx";

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

    const renderGrid = (items) => (
        <ul className="file-grid">
            {items.map((item) => {
                const isImg = item.fileType === "img";
                const isPdf = item.fileType === "pdf";
                const isVideo = item.fileType === "video";
                // Images, PDFs, and videos show a square preview thumbnail —
                // PDFs render their first page, videos their poster frame.
                const iconSrc = isImg
                    ? cldThumbFromUrl(item.imageUrl)
                    : (isPdf || isVideo)
                    ? cldThumbFromUrl(item.icon)
                    : item.icon;
                // Only a real rendered preview gets the filled, rounded tile.
                // Local fallback art (pdf.png, image.png) is transparent, so
                // the tile's background would show as a box around it.
                const thumb =
                    (isImg || isPdf || isVideo) && iconSrc?.includes("res.cloudinary.com");
                // A PDF with no pre-rendered Cloudinary preview (the résumé,
                // which ships in /public) gets its first page rendered here
                // instead of the generic PDF icon.
                const localPdf = isPdf && !thumb;
                return (
                    <li key={item.id} onClick={() => openItem(item)} >
                        {localPdf ? (
                            <PdfThumb file={item.pdfUrl || DEFAULT_PDF} />
                        ) : (
                        <img
                            src={iconSrc}
                            alt={item.name}
                            className={thumb ? "file-thumb" : undefined}
                            loading="lazy"
                            onError={thumb ? (e) => {
                                e.currentTarget.onerror = null;
                                // Falling back to transparent art, so drop the tile with it.
                                e.currentTarget.classList.remove("file-thumb");
                                e.currentTarget.src = isPdf ? "/images/pdf.png" : "/images/image.png";
                            } : undefined}
                        />
                        )}
                        <p>{item.name}</p>
                    </li>
                );
            })}
        </ul>
    );

    // Work splits into professional projects and a labelled University group
    // below it. Every other folder is one flat grid.
    const children = activeLocation.children;
    const isWorkRoot = activeLocation.type === "work" && path.length === 1;
    const university = isWorkRoot
        ? children.filter((c) => c.category === "university")
        : [];
    const primary = isWorkRoot
        ? children.filter((c) => c.category !== "university")
        : children;

    return (
      <div className="flex flex-col h-full">
        <div id="window-header">
            <WindowControls target="finder" />
            <Search className="icon" />
        </div>

        <div className="bg-[#1c1c1e] flex flex-1 min-h-0">
            <div className="sidebar">
                {renderList("favorites", Object.values(locations), true)}
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

            {activeLocation.type === "about" ? (
                // About isn't browsed like a folder — it's a profile card:
                // portrait on top, bio below.
                <div className="about-pane">
                    <div className="about-head">
                        <img className="about-photo" src={profile.photo} alt={profile.name} />
                        <div>
                            <h2>{profile.name}</h2>
                            <p className="about-role">{profile.role}</p>
                        </div>
                    </div>

                    <dl className="about-meta">
                        {profile.facts.map(({ label, value }) => (
                            <div key={label}>
                                <dt>{label}</dt>
                                <dd>{value}</dd>
                            </div>
                        ))}
                    </dl>

                    <div className="about-bio">
                        {profile.bio.map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="content">
                    {renderGrid(primary)}

                    {university.length > 0 && (
                        <>
                            <h4 className="group-label">university</h4>
                            {renderGrid(university)}
                        </>
                    )}
                </div>
            )}
            </div>
        </div>
      </div>
    );
};


const FinderWindow = WindowWrapper(Finder, 'finder');

export default FinderWindow;
