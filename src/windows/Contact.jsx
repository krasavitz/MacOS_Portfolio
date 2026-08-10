import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components";
import { socials, profile } from "#constants";

const Contact = () => {
    return (
        <>
            <div id="window-header">
                <WindowControls target="contact" />
                <h2>get in touch</h2>
            </div>

            <div className="p-6">
                <div className="contact-intro">
                    <img src={profile.photo} alt={profile.name} className="contact-photo" />
                    <div>
                        <p className="contact-name">{profile.name}</p>
                        <p className="contact-role">{profile.role}</p>
                    </div>
                </div>

                <h3>lets connect</h3>

                <p className="mt-2 mb-1 text-sm text-zinc-400">
                    reach me here
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
