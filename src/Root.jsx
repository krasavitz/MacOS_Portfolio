import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import App from "./App.jsx";
import CleanIndex from "#clean/CleanIndex.jsx";
import CleanProject from "#clean/CleanProject.jsx";
import CleanAbout from "#clean/CleanAbout.jsx";

/* Two sites, one bundle: the OS experience at /, and the plain, linkable
   portfolio at /simple. Project slugs come from the same content tree the
   Finder reads — see #clean/projects.js. */
const Root = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/simple" element={<CleanIndex />} />
            <Route path="/simple/about" element={<CleanAbout />} />
            <Route path="/simple/:slug" element={<CleanProject />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
);

export default Root;
