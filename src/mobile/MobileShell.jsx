import StatusBar from "#mobile/StatusBar.jsx";
import Springboard from "#mobile/Springboard.jsx";
import AppSheet from "#mobile/AppSheet.jsx";
import APP_VIEWS from "#mobile/apps/index.js";
import useMobileStore from "#store/mobile.js";

/* The iOS experience: springboard underneath, a stack of full-screen apps on
   top. Rendered below 1024px in place of the macOS desktop. */
const MobileShell = () => {
    const { stack, back, goHome } = useMobileStore();
    const top = stack[stack.length - 1];
    const View = top ? APP_VIEWS[top.id] : null;

    return (
        <div className="ios-shell">
            <StatusBar />

            <Springboard />

            {top && View && (
                // Keyed on depth so each push re-runs the sheet's open animation.
                <AppSheet key={stack.length} title={top.title} onBack={back}>
                    <View entry={top} />
                </AppSheet>
            )}

            <button
                type="button"
                className="home-indicator"
                onClick={goHome}
                aria-label="Home"
            />
        </div>
    );
};

export default MobileShell;
