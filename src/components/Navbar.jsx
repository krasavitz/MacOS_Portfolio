import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

import { navLinks, locations } from '#constants';
import useWindowStore from '#store/window';
import useLocationStore from '#store/location.js';

const Navbar = () => {
    const { openWindow } = useWindowStore();
    const { setActiveLocation } = useLocationStore();

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
                    <li key={id} onClick={() => handleNav({ type, location })}>
                        <p>{name}</p>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                {/* Escape hatch to the plain, linkable version of the portfolio. */}
                <Link to="/simple" className="simple-link">Simple view</Link>

                <time>{dayjs().format("ddd MMM D h:mm A")}</time>
            </div>
        </nav>
    );
};

export default Navbar;