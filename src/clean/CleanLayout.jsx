import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { applyMeta } from "../seo.js";

import "#clean/clean.css";

/* Chrome for the plain-HTML portfolio: a masthead, the page, and a footer that
   points back at the desktop version. Also keeps the head tags (title,
   description, canonical, share preview) in step with the route, since this
   is the side of the site meant to be linked and indexed — see src/seo.js. */
const CleanLayout = ({ children }) => {
    const { pathname } = useLocation();

    useEffect(() => {
        applyMeta(pathname);
    }, [pathname]);

    return (
        <div className="clean">
            <header className="clean-head">
                <Link to="/simple" className="clean-mark">
                    oliver naumov
                </Link>

                <nav>
                    <Link to="/simple/about">about</Link>
                    <a
                        href="/files/Oliver%20Naumov%20Resume%20July%202026.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        résumé
                    </a>
                    <a href="mailto:naumovoliver@gmail.com">email</a>
                </nav>
            </header>

            <main className="clean-main">{children}</main>

            <footer className="clean-foot">
                <Link to="/">↩ desktop version</Link>
                <span>© {new Date().getFullYear()}</span>
            </footer>
        </div>
    );
};

export default CleanLayout;
