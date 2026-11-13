import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

import { navLinks, locations } from '#constants';
import useWindowStore from '#store/window';
import useLocationStore from '#store/location.js';
import SoundToggle from '#features/vibe/SoundToggle.jsx';

/* Ticks on the minute, so the menu-bar clock doesn't freeze at page load. */
const useClock = () => {
    const [now, setNow] = useState(() => dayjs());

    useEffect(() => {
        const id = setInterval(() => setNow(dayjs()), 15000);
        return () => clearInterval(id);
    }, []);

    return now;
};

const Navbar = () => {
    const openWindow = useWindowStore((s) => s.openWindow);
    const setActiveLocation = useLocationStore((s) => s.setActiveLocation);
    const now = useClock();

    const handleNav = ({ type, location }) => {
        if (location && locations[location]) setActiveLocation(locations[location]);
        openWindow(type);
    };

    return (
        <nav>
            <div>
                <img src="/images/oliver-logo.svg" alt="" />
                <p className="font-bold">Oliver's Portfolio</p>

                <ul>
                    {navLinks.map(({ id, name, type, location }) => (
                        <li key={id}>
                            <button type="button" onClick={() => handleNav({ type, location })}>
                                {name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                {/* Escape hatch to the plain, linkable version of the portfolio. */}
                <SoundToggle />

                <Link to="/simple" className="simple-link">Simple view</Link>

                <time dateTime={now.toISOString()}>{now.format("ddd MMM D h:mm A")}</time>
            </div>
        </nav>
    );
};

export default Navbar;
