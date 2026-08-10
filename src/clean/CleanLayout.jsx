import { useEffect } from "react";
import { Link } from "react-router-dom";

import "#clean/clean.css";

/* Chrome for the plain-HTML portfolio: a masthead, the page, and a footer that
   points back at the desktop version. Also owns the document title, since this
   is the side of the site meant to be linked and indexed. */
const CleanLayout = ({ title, children }) => {
    useEffect(() => {
        document.title = title
            ? `${title}, oliver naumov`
            : "oliver naumov, designer";
    }, [title]);

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
