import dayjs from 'dayjs';

import { navLinks, navIcons, locations } from '#constants';
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
                <img src="/images/logo.svg" alt="logo" />
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
                <ul>
                    {navIcons.map(({ id, img}) => (
                        <li key={id}>
                            <img src={img} className="icon-hover" alt={`icon-${id} `} />
                        </li>
                    ))}
                </ul>

                <time>{dayjs().format("ddd MMM D h:mm A")}</time>
            </div>
        </nav>
    );
};

export default Navbar;