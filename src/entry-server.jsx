/* eslint-disable react-refresh/only-export-components --
   build-time only (scripts/prerender.mjs); never hot-reloaded in the browser. */
import { renderToString } from "react-dom/server";
import { StaticRouter, Routes, Route } from "react-router-dom";

import CleanIndex from "#clean/CleanIndex.jsx";
import CleanProject from "#clean/CleanProject.jsx";
import CleanAbout from "#clean/CleanAbout.jsx";

/* Build-time renderer for the plain site, used only by scripts/prerender.mjs.
   It turns each /simple page into real HTML so search engines (and link
   previews) see the content without running JavaScript. The browser still
   mounts the app normally on top — see main.jsx.

   Only the /simple routes live here: the OS desktop at / is an interactive
   shell with nothing meaningful to pre-render. Keep this route list in step
   with the /simple routes in Root.jsx. */
export const render = (url) =>
    renderToString(
        <StaticRouter location={url}>
            <Routes>
                <Route path="/simple" element={<CleanIndex />} />
                <Route path="/simple/about" element={<CleanAbout />} />
                <Route path="/simple/:slug" element={<CleanProject />} />
            </Routes>
        </StaticRouter>
    );

export { routeMeta, indexablePaths, personSchema, SITE_URL } from "./seo.js";
