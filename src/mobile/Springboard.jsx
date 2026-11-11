import { Link } from "react-router-dom";
import { mobileApps, locations, profile } from "#constants";
import useMobileStore from "#store/mobile.js";

/* Every icon renders at the same visual size, whatever its source art:
   see `bleed` and `scale` on mobileApps in constants. */
const AppArt = ({ app }) => (
    <img
        src={app.icon}
        alt=""
        loading="lazy"
        className={app.bleed ? "is-bleed" : undefined}
        style={app.scale ? { scale: app.scale } : undefined}
    />
);

/* Home screen: an intro widget, a grid of app icons, and a pinned dock.
   Tapping an app pushes it onto the mobile navigation stack. */
const Springboard = () => {
    const openApp = useMobileStore((s) => s.openApp);

    const launch = (app) => {
        if (app.href) return window.open(app.href, "_blank", "noopener,noreferrer");

        // A project shortcut opens straight onto its page.
        if (app.folder) {
            const folder = locations.work.children.find((c) => c.name === app.folder);
            if (!folder) return;
            return openApp("project", { title: folder.name, data: { folder } });
        }

        if (app.location) {
            const folder = locations[app.location];
            if (!folder) return;
            return openApp("work", { title: app.name, data: { folder } });
        }

        openApp(app.app, { title: app.name });
    };

    const renderIcon = (app) => {
        // The Simple site is a real route, so it gets a real link — long-press,
        // "open in new tab" and middle-click all keep working.
        if (app.route) {
            return (
                <Link key={app.id} to={app.route} className="app-icon">
                    <AppArt app={app} />
                    <span>{app.name}</span>
                </Link>
            );
        }

        return (
            <button key={app.id} type="button" className="app-icon" onClick={() => launch(app)}>
                <AppArt app={app} />
                <span>{app.name}</span>
            </button>
        );
    };

    return (
        <div className="springboard">
            <div className="springboard-top">
                {/* The desktop greets visitors with a typed intro; this is the
                    phone's version of it. Tapping it opens About. */}
                <button
                    type="button"
                    className="ios-widget"
                    onClick={() => openApp("about", { title: "About" })}
                >
                    <img src={profile.photo} alt="" />
                    <span className="widget-text">
                        <span className="widget-title">{profile.greeting}</span>
                        <span className="widget-body">{profile.intro}</span>
                    </span>
                </button>

                {/* Docked apps live only in the dock, as on iOS. */}
                <div className="app-grid">
                    {mobileApps.filter((app) => !app.dock).map(renderIcon)}
                </div>
            </div>

            <div className="ios-dock">
                {mobileApps.filter((app) => app.dock).map(renderIcon)}
            </div>
        </div>
    );
};

export default Springboard;
