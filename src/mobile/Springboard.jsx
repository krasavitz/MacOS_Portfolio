import { Link } from "react-router-dom";
import { mobileApps, locations } from "#constants";
import useMobileStore from "#store/mobile.js";

/* Home screen: a grid of app icons plus a pinned dock. Tapping an app pushes
   it onto the mobile navigation stack. */
const Springboard = () => {
    const { openApp } = useMobileStore();

    const launch = (app) => {
        if (app.href) return window.open(app.href, "_blank", "noopener,noreferrer");

        if (app.folder) {
            const folder = locations.work.children.find((c) => c.name === app.folder);
            if (!folder) return;
            return openApp("work", { title: folder.name, data: { folder } });
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
                    <img src={app.icon} alt="" loading="lazy" />
                    <span>{app.name}</span>
                </Link>
            );
        }

        return (
            <button key={app.id} type="button" className="app-icon" onClick={() => launch(app)}>
                <img src={app.icon} alt="" loading="lazy" />
                <span>{app.name}</span>
            </button>
        );
    };

    return (
        <div className="springboard">
            {/* Docked apps live only in the dock, as on iOS. */}
            <div className="app-grid">
                {mobileApps.filter((app) => !app.dock).map(renderIcon)}
            </div>

            <div className="ios-dock">
                {mobileApps.filter((app) => app.dock).map(renderIcon)}
            </div>
        </div>
    );
};

export default Springboard;
