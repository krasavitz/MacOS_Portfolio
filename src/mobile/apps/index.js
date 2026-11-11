import WorkApp from "#mobile/apps/WorkApp.jsx";
import { ProjectsApp, ProjectApp } from "#mobile/apps/ProjectsApp.jsx";
import DocApp from "#mobile/apps/DocApp.jsx";
import { ImageApp, VideoApp, PdfApp } from "#mobile/apps/MediaApp.jsx";
import {
    SkillsApp,
    ContactApp,
    BookmarksApp,
    GalleryApp,
    AboutApp,
} from "#mobile/apps/SimpleApps.jsx";

/* Maps a stack entry's `id` to the view that renders it. Keys must match the
   `app` field in `mobileApps` and the ids WorkApp pushes for file types. */
const APP_VIEWS = {
    // Work's home: every project as a card. "work" is the plain folder list,
    // still used for Archive.
    projects: ProjectsApp,
    project: ProjectApp,
    work: WorkApp,
    doc: DocApp,
    image: ImageApp,
    video: VideoApp,
    pdf: PdfApp,
    resume: PdfApp,
    skills: SkillsApp,
    contact: ContactApp,
    bookmarks: BookmarksApp,
    gallery: GalleryApp,
    about: AboutApp,
};

export default APP_VIEWS;
