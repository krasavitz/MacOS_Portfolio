import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components";
import { socials } from "#constants";

const Contact = () => {
    return (
        <>
            <div id="window-header">
                <WindowControls target="contact" />
                <h2>Get in touch</h2>
            </div>

            <div className="p-6">
                <h3>Let's connect</h3>

                <p className="mt-3 max-w-md text-sm text-zinc-400">
                    Reach me here:
                    <br />
                </p>

                <ul className="mt-5">
                    {socials.map(({ id, text, icon, bg, link }) => (
                        <li key={id} style={{ backgroundColor: bg }}>
                            <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col"
                            >
                                <img src={icon} alt={text} className="w-8" />
                                <p>{text}</p>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

const ContactWindow = WindowWrapper(Contact, 'contact');

export default ContactWindow;
