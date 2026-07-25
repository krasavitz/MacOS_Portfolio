import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components";
import { bookmarks } from "#constants";
import { PanelLeft, ChevronLeft, ChevronRight, ShieldHalf, Search, Share, Plus, Copy } from "lucide-react";

const Safari = () => {
    return (
    <>
    <div id="window-header">
        <WindowControls target="safari" />

        <PanelLeft className="ml-10 icon"/>

        <div className="flex items-center gap-1 ml-5">
            <ChevronLeft className="icon" />
            <ChevronRight className="icon" />
        </div>

        <div className="flex-1 flex-center gap-3">
            <ShieldHalf className="icon" />

            <div className="search">
                <Search className="icon" />

                <input type="text" placeholder="Search or enter website name" className="flex-1" />
            </div>
        </div>

        <div className="flex items-center gap-5">
            <Share className="icon" />
            <Plus className="icon" />
            <Copy className="icon" />
        </div>
    </div>
    
    <div className="bookmarks">
        <h2>Bookmarks</h2>
        <p className="subtitle">Brands, tools, and sites that shape how I work.</p>

        <div className="bookmark-grid">
            {bookmarks.map(({ id, title, host, note, link, bg }) => (
                <a
                    key={id}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bookmark"
                >
                    <div className="tile" style={{ backgroundColor: bg }}>
                        {title.charAt(0)}
                    </div>
                    <div className="bk-content">
                        <h3>{title}</h3>
                        <p className="host">{host}</p>
                        <p className="note">{note}</p>
                    </div>
                </a>
            ))}
        </div>
    </div>
    </>
 );
};

const SafariWindow = WindowWrapper(Safari, 'safari');

export default SafariWindow;