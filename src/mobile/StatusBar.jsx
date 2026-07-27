import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Wifi, BatteryMedium, SignalHigh } from "lucide-react";

/* iOS status bar. The clock ticks — unlike the desktop menu bar's, which is
   rendered once at mount ([Navbar.jsx](../components/Navbar.jsx)). */
const StatusBar = () => {
    const [now, setNow] = useState(() => dayjs());

    useEffect(() => {
        const id = setInterval(() => setNow(dayjs()), 15000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="status-bar">
            <time>{now.format("h:mm")}</time>

            <div className="status-icons">
                <SignalHigh size={16} />
                <Wifi size={15} />
                <BatteryMedium size={18} />
            </div>
        </div>
    );
};

export default StatusBar;
