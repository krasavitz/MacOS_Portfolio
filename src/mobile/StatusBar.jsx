import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Wifi, BatteryMedium, SignalHigh } from "lucide-react";

/* The mobile menu bar. Deliberately the desktop's bar rather than a plain iOS
   status bar ([Navbar.jsx](../components/Navbar.jsx)): same translucent black
   chrome, same mark and wordmark on the left, clock on the right. The carrier/wifi/
   battery glyphs stay, since the shell around it is still iOS.

   The clock ticks — unlike the desktop's, which is rendered once at mount. */
const StatusBar = () => {
    const [now, setNow] = useState(() => dayjs());

    useEffect(() => {
        const id = setInterval(() => setNow(dayjs()), 15000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="status-bar">
            <div className="status-identity">
                <img src="/images/oliver-logo.svg" alt="" />
                <p>Oliver's Portfolio</p>
            </div>

            <div className="status-icons">
                <time>{now.format("h:mm")}</time>
                <SignalHigh size={16} />
                <Wifi size={15} />
                <BatteryMedium size={18} />
            </div>
        </div>
    );
};

export default StatusBar;
