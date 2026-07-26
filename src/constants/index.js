// ---------------------------------------------------------------------------
// ASSETS
// Content images/video are served from Cloudinary (cloud name in
// src/utils/cloudinary.js). Slots store a Cloudinary public ID and call
// assetUrl() / videoId, which build an optimized URL (auto format + quality).
//
// This account uses Cloudinary "dynamic folders", so a public ID is the flat
// asset name only — NOT the folder path shown in the Media Library. Example:
// an asset filed under Tchpack/ is still "TchpackBlack_x9dkhs", not
// "Tchpack/TchpackBlack_x9dkhs".
//
// Any slot still pointing at PLACEHOLDER_IMG has no asset yet. Search this
// file for "PLACEHOLDER" to find every open slot.
// ---------------------------------------------------------------------------
import { cldImage, cldPdf, cldVideoPoster, isCloudinaryConfigured } from "#utils/cloudinary.js";

const PLACEHOLDER_IMG = "/images/placeholder.svg";

// Given a Cloudinary public ID, return its optimized URL — or the placeholder
// if no ID is set yet, or if the cloud name in src/utils/cloudinary.js is still
// the default. Lets every unfilled slot degrade gracefully to the placeholder.
const assetUrl = (publicId) =>
  publicId && isCloudinaryConfigured() ? cldImage(publicId) : PLACEHOLDER_IMG;

const navLinks = [
    {
      id: 1,
      name: "Work",
      type: "finder",
      location: "work",
    },
    {
      id: 2,
      name: "About",
      type: "finder",
      location: "about",
    },
    {
      id: 3,
      name: "Contact",
      type: "contact",
    },
    {
      id: 4,
      name: "Resume",
      type: "resume",
    },
  ];

  const navIcons = [
    {
      id: 1,
      img: "/icons/wifi.svg",
    },
    {
      id: 2,
      img: "/icons/search.svg",
    },
    {
      id: 3,
      img: "/icons/user.svg",
    },
    {
      id: 4,
      img: "/icons/mode.svg",
    },
  ];

  const dockApps = [
    {
      id: "finder",
      name: "Work",
      icon: "finder.png",
      canOpen: true,
    },
    {
      id: "safari",
      name: "Bookmarks",
      icon: "safari.png",
      canOpen: true,
    },
    {
      id: "photos",
      name: "Gallery",
      icon: "photos.png",
      canOpen: true,
    },
    {
      id: "contact",
      name: "Contact",
      icon: "contact.png",
      canOpen: true,
    },
    {
      id: "terminal",
      name: "Skills",
      icon: "terminal.png",
      canOpen: true,
    },
    {
      id: "trash",
      name: "Archive",
      icon: "trash.png",
      canOpen: false,
    },
  ];

  // Safari / "Bookmarks" window — brands, tools, and sites that shape the work.
  const bookmarks = [
    {
      id: 1,
      title: "Are.na",
      host: "are.na",
      note: "Research & collecting.",
      link: "https://www.are.na/",
      bg: "#000000",
    },
    {
      id: 2,
      title: "Archive",
      host: "archivepdf.net",
      note: "Design PDF library.",
      link: "https://www.archivepdf.net/",
      bg: "#D6001C",
    },
    {
      id: 3,
      title: "Envato Elements",
      host: "elements.envato.com",
      note: "Assets & templates.",
      link: "https://elements.envato.com/",
      bg: "#82B541",
    },
    {
      id: 4,
      title: "Internet Archive",
      host: "archive.org",
      note: "The internet's library.",
      link: "https://archive.org/",
      bg: "#2E2E2E",
    },
    {
      id: 5,
      title: "Eyecannndy",
      host: "eyecannndy.com",
      note: "Visual technique reference.",
      link: "https://eyecannndy.com/",
      bg: "#6E56CF",
    },
  ];

  const techStack = [
    {
      category: "Design",
      items: [
        "Adobe CC",
        "Figma",
        "Webflow",
        "UI prototyping",
        "UX research",
        "User flows",
        "Wireframing",
      ],
    },
    {
      category: "Development",
      items: ["HTML", "CSS", "JavaScript", "React", "Supabase", "Git"],
    },
    {
      category: "Growth & Brand",
      items: [
        "Content strategy",
        "Paid campaigns",
        "Creator partnerships",
        "Brand identity",
        "Social",
      ],
    },
    {
      category: "AI",
      items: [
        "AI-assisted design",
        "Prompt engineering",
        "Workflow automation",
        "Generative tooling",
      ],
    },
  ];

  const socials = [
    {
      id: 1,
      text: "Email",
      icon: "/icons/mail.svg",
      bg: "#f4656b",
      link: "mailto:naumovoliver@gmail.com",
    },
    {
      id: 2,
      text: "Tchpack",
      icon: "/icons/world.svg",
      bg: "#8E7EAE",
      // TODO: confirm the public Tchpack URL
      link: "https://tchpack.com",
    },
    {
      id: 3,
      text: "Github",
      icon: "/icons/github.svg",
      bg: "#ff866b",
      link: "https://github.com/krasavitz",
    },
    {
      id: 4,
      text: "LinkedIn",
      icon: "/icons/linkedin.svg",
      bg: "#05b6f6",
      link: "https://www.linkedin.com/in/oliver-naumov/",
    },
  ];

  const gallery = [
    {
      id: 1,
      img: assetUrl("kurilaptop_zzsl09"),
      alt: "KuriTech — brand and product on laptop",
    },
    {
      id: 2,
      img: assetUrl("66ada536451b28ec91f96a0c_K_URI_grp7br"),
      alt: "KuriTech — brand identity",
    },
    {
      id: 3,
      img: assetUrl("moulton_lx9f4h"),
      alt: "Client work — Moulton",
    },
    {
      id: 4,
      img: assetUrl("661b0af90e5f306f0b0346d1_rwf_ti3dnq"),
      alt: "KuriTech — brand application",
    },
  ];

  // Shortcuts sitting directly on the desktop (top-right, macOS style).
  // A shortcut opens exactly one of: `href` (new tab), `windowKey` (an app
  // window), or `folder` (a Work subfolder name, opened in Finder). `folder`
  // is a name rather than a reference because WORK_LOCATION is defined below.
  const desktopShortcuts = [
    {
      id: "tchpack",
      name: "tchpack.com",
      icon: cldImage("400x400bb-75_trzm1s", { width: 128 }),
      href: "https://tchpack.com",
    },
    {
      id: "openti",
      name: "OpenTI",
      // version = upload timestamp of the current logo; bump on re-upload.
      icon: cldImage("openti_app_logo_lvmecw", { width: 128, version: 1785082962 }),
      folder: "OpenTI",
    },
  ];

  export {
    navLinks,
    navIcons,
    dockApps,
    desktopShortcuts,
    bookmarks,
    techStack,
    socials,
    gallery,
  };

  const WORK_LOCATION = {
    id: 1,
    type: "work",
    name: "Work",
    icon: "/icons/work.svg",
    kind: "folder",
    children: [
      // ▶ Tchpack — flagship case study
      {
        id: 5,
        name: "Tchpack",
        icon: "/images/folder.png",
        kind: "folder",
        children: [
          {
            id: 1,
            name: "Tchpack.txt",
            icon: "/images/txt.png",
            kind: "file",
            fileType: "txt",
            subtitle: "AI platform for fashion brands — zero to $20K+ MRR",
            description: [
              "OVERVIEW",
              "Tchpack is an AI platform for fashion brands. I co-founded it and built it with one other person, and together we took it from zero to over $20K in monthly recurring revenue.",
              "I owned most of the design and growth: the product across web and iOS, the brand from scratch, and every growth channel we ran.",
              "The opportunity: independent designers and small labels lose weeks translating an idea into a manufacturable tech pack. The work is technical, unforgiving, and gatekept by people who already know the language of production. Get a measurement or a callout wrong and you eat the sample cost.",
              "Tchpack collapses that gap. You describe the garment; the platform gets you to something a factory can actually quote and cut.",
              "ROLE",
              "Two people built this company. I designed the whole product across web and iOS: user flows, interface, prototypes, and the UX for Aria — our AI assistant that turns a rough idea into a production-ready tech pack, runs research, and sources manufacturers.",
              "I built the brand from scratch: editorial and restrained, positioned to sit next to names like Figma, SSENSE, and Cursor rather than the usual SaaS-dashboard look the category defaults to.",
              "I ran growth solo — organic short-form video, creator deals, paid social, and email. And I worked with my co-founder to ship AI features end to end: the Aria assistant, vector automation, and manufacturer sourcing.",
              "PROCESS",
              "DESIGN — Mapped the flows first, because the hard part was never the screens; it was deciding how much the AI should do before handing control back. Aria had to feel like a collaborator that shows its work, not a black box that spits out a PDF. Prototyped across web and iOS, then designed the interface around those flows.",
              "BRAND — Built the identity from nothing: editorial, restrained, typography-led. The category is full of tools that look like inventory software. Fashion brands buy from things that look like they belong in fashion, so the brand was positioned to sit next to Figma, SSENSE, and Cursor.",
              "GROWTH — Ran it solo across four channels. Organic short-form video did the discovery work, creator deals bought credibility with the exact audience we needed, paid social scaled what already worked organically, and email carried the conversion.",
              "AI — Shipped features end to end with my co-founder: the Aria assistant, vector automation for flats and callouts, and manufacturer sourcing.",
              "OUTCOME",
              "Zero to launch, then zero to $20K+ in monthly recurring revenue with a two-person team. Product shipped across web and iOS. Brand built from scratch. Every growth channel run in-house.",
            ],
          },
          {
            id: 8,
            name: "tchpack.com",
            icon: cldImage("400x400bb-75_trzm1s", { width: 128 }),
            kind: "file",
            fileType: "url",
            // TODO: confirm the public Tchpack URL
            href: "https://tchpack.com",
          },
        ],
      },

      // ▶ OpenTI — agency client work
      {
        id: 6,
        name: "OpenTI",
        icon: "/images/folder.png",
        kind: "folder",
        children: [
          {
            id: 1,
            name: "OpenTI.txt",
            icon: "/images/txt.png",
            kind: "file",
            fileType: "txt",
            subtitle: "UI/UX Designer & Web Developer",
            description: [
              "Designed and built responsive, conversion-focused websites for clients across a range of industries.",
              "I owned each project from first brief to launch, working directly with business owners to turn their goals into clean, accessible interfaces.",
              "Every design decision tied back to two things: the brand, and a real business gain.",
            ],
          },
          {
            id: 2,
            name: "OpenTI — Logo",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: assetUrl("OpenTI_airnwt"),
            alt: "OpenTI — logo mark",
          },
          {
            id: 3,
            name: "Moulton",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: assetUrl("Moulton_Styles_v3lceu"),
            alt: "Moulton — client work",
          },
          {
            id: 4,
            name: "OpenTI — Reel 1",
            icon: cldVideoPoster("openti-1_bqdssy", { width: 128 }),
            kind: "file",
            fileType: "video",
            videoId: "openti-1_bqdssy",
            alt: "OpenTI — agency showreel 1",
          },
          {
            id: 5,
            name: "OpenTI — Reel 2",
            icon: cldVideoPoster("openti-2_nvohmq", { width: 128 }),
            kind: "file",
            fileType: "video",
            videoId: "openti-2_nvohmq",
            alt: "OpenTI — agency showreel 2",
          },
          {
            id: 6,
            name: "Nitravision — Home.pdf",
            icon: cldImage("nitravision-home-full_xv1wlq", { width: 256 }),
            kind: "file",
            fileType: "pdf",
            pdfUrl: cldPdf("nitravision-home-full_xv1wlq"),
            alt: "Nitravision — home page",
          },
          {
            id: 7,
            name: "Nitravision — About.pdf",
            icon: cldImage("nitravision-about-full_mtt0ia", { width: 256 }),
            kind: "file",
            fileType: "pdf",
            pdfUrl: cldPdf("nitravision-about-full_mtt0ia"),
            alt: "Nitravision — about page",
          },
          {
            id: 8,
            name: "Nitravision — Projects.pdf",
            icon: cldImage("nitravision-projects-full_bxcbcj", { width: 256 }),
            kind: "file",
            fileType: "pdf",
            pdfUrl: cldPdf("nitravision-projects-full_bxcbcj"),
            alt: "Nitravision — projects page",
          },
          {
            id: 9,
            name: "Nitravision — Project.pdf",
            icon: cldImage("nitrivision-project-full_ryyspc", { width: 256 }),
            kind: "file",
            fileType: "pdf",
            pdfUrl: cldPdf("nitrivision-project-full_ryyspc"),
            alt: "Nitravision — project detail page",
          },
          {
            id: 10,
            name: "Nitravision — Contact.pdf",
            icon: cldImage("nitravision-contact-full_fdgmwy", { width: 256 }),
            kind: "file",
            fileType: "pdf",
            pdfUrl: cldPdf("nitravision-contact-full_fdgmwy"),
            alt: "Nitravision — contact page",
          },
          {
            id: 11,
            name: "Strength House.pdf",
            icon: cldImage("landing-page-2-full_uouj4d", { width: 256 }),
            kind: "file",
            fileType: "pdf",
            pdfUrl: cldPdf("landing-page-2-full_uouj4d"),
            alt: "Strength House — client website",
          },
          {
            id: 12,
            name: "Lendbull.pdf",
            icon: cldImage("lendbull_sh5ll4", { width: 256 }),
            kind: "file",
            fileType: "pdf",
            pdfUrl: cldPdf("lendbull_sh5ll4"),
            alt: "Lendbull — client website",
          },
          {
            id: 13,
            name: "KuriTech — Laptop",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: assetUrl("kurilaptop_zzsl09"),
            alt: "KuriTech — brand and product on laptop",
          },
          {
            id: 14,
            name: "KuriTech — Logo",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: assetUrl("66ada536451b28ec91f96a0c_K_URI_grp7br"),
            alt: "KuriTech — brand identity",
          },
          {
            id: 15,
            name: "KuriTech — Application",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: assetUrl("661b0af90e5f306f0b0346d1_rwf_ti3dnq"),
            alt: "KuriTech — brand application",
          },
          {
            id: 16,
            name: "KuriTech — Showcase 1",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: assetUrl("66a994b52db398d413c621f7_kuri-show_-copy_ynzglf"),
            alt: "KuriTech — product showcase",
          },
          {
            id: 17,
            name: "KuriTech — Showcase 2",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: assetUrl("66a99547613c0c93c93646b1_kurishow2--_rzdmgr"),
            alt: "KuriTech — product showcase",
          },
          {
            id: 18,
            name: "KuriTech — Brand",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: assetUrl("66a9945d5ece388fc958185a_Luritech-_blnzpb"),
            alt: "KuriTech — brand system",
          },
          {
            id: 19,
            name: "KuriTech — Demo",
            icon: cldVideoPoster("kuritech_udujec", { width: 256 }),
            kind: "file",
            fileType: "video",
            videoId: "kuritech_udujec",
            alt: "KuriTech — product demo video",
          },
        ],
      },

      // ▶ Trace — academic, CINF 302
      {
        id: 7,
        name: "Trace",
        icon: "/images/folder.png",
        kind: "folder",
        category: "university",
        children: [
          {
            id: 1,
            name: "Trace.txt",
            icon: "/images/txt.png",
            kind: "file",
            fileType: "txt",
            subtitle: "Digital privacy management — CINF 302, SUNY Albany",
            description: [
              "CONTEXT — Trace is a conceptual startup for personal digital privacy management, designed as a real-world-simulation client project for User Interface Design (CINF 302) at SUNY Albany.",
              "PROBLEM — No platform existed for managing your entire digital footprint across services. Everything on the market solved one fragment: a password manager here, a data-broker removal tool there. Nothing gave you the whole picture in one place.",
              "ROLE — Full UX/UI. Brand identity, user personas, journey maps, the visual system and style guide, wireframes, and prototypes — built out with a rapid prototyping methodology.",
              "IMPACT — Demonstrated an end-to-end UX/UI process, taking a concept through to a cohesive product and brand.",
            ],
          },
          {
            id: 3,
            name: "sketch.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: assetUrl("Trace_sketch_nkyqdt"),
            alt: "Trace — hand-drawn wireframe sketch",
          },
          {
            id: 4,
            name: "style-tile.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: assetUrl("Trace_style_tile_and_UX_final_dq7bal"),
            alt: "Trace — style tile and UX system",
          },
          {
            id: 5,
            name: "logo.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: assetUrl("tracelogo-removebg-preview_uicfla"),
            alt: "Trace — logo mark",
          },
        ],
      },

      // ▶ Reflect — academic, CINF 362
      {
        id: 8,
        name: "Reflect",
        icon: "/images/folder.png",
        kind: "folder",
        category: "university",
        children: [
          {
            id: 1,
            name: "Reflect.txt",
            icon: "/images/txt.png",
            kind: "file",
            fileType: "txt",
            subtitle: "Guided journaling platform — CINF 362, SUNY Albany",
            description: [
              "CONTEXT — Reflect is a digital journaling platform built for a client-based web development course (CINF 362) at SUNY Albany, focused on daily guided reflection.",
              "PROBLEM — Making self-reflection accessible. The barrier to starting a journaling habit is high and the barrier to maintaining one is higher, so the work was in providing meaningful prompts, balancing structure against flexibility, and keeping the writing environment free of distraction.",
              "ROLE — Full-stack. Development, UX design, database architecture, frontend implementation, and the content strategy behind the daily prompts.",
              "IMPACT — Shipped a fully functional platform, demonstrated full-stack range, and it was received well at the course presentation.",
            ],
          },
          {
            id: 2,
            name: "wireframe.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: assetUrl("Reflect_Wireframe_qqmamh"),
            alt: "Reflect — app screen wireframe",
          },
          {
            id: 3,
            name: "style-tile.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: assetUrl("style_tile_aojcjf"),
            alt: "Reflect — style tile",
          },
          {
            id: 4,
            name: "logo.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: assetUrl("REFLECT_LOGO_ipfogo"),
            alt: "Reflect — logo",
          },
        ],
      },

      // ▶ Game dev — narrative, not a case study
      {
        id: 9,
        name: "Game Dev & Design",
        icon: "/images/folder.png",
        kind: "folder",
        category: "university",
        children: [
          {
            id: 1,
            name: "Game Dev & Design.txt",
            icon: "/images/txt.png",
            kind: "file",
            fileType: "txt",
            subtitle: "Game development minor — SUNY Albany",
            description: [
              "During my time at SUNY Albany, I dove into the world of game development through a minor that opened my eyes to the endless possibilities of interactive experiences. What started as a curiosity evolved into a fascinating journey through different game engines, design philosophies, and development approaches.",
              "My foundation began with Construct3, where I learned to think like a game designer while creating my first playable projects. The visual programming environment helped me grasp core gaming concepts without getting lost in complex code. This hands-on experience proved invaluable as I moved into more advanced development.",
              "The real turning point came in Game Development II, where I immersed myself in Unity. This is where theory met practice — from crafting 3D environments to experimenting with VR and AR technologies. What excited me most was seeing how each element — story, art, sound, code, and UI/UX — came together to create compelling interactive experiences. Working with these emerging technologies showed me just how rapidly the gaming industry is evolving.",
              "Serious Games was particularly eye-opening. It challenged my perception of what games could be, showing me their potential as powerful tools for education and social impact. Learning how to balance entertainment with educational objectives taught me valuable lessons about purposeful design that I carry into all my projects today.",
              "These courses did more than teach me technical skills — they shaped how I approach problem-solving and user experience design across all my work. Whether I'm developing a website, designing an app, or creating a game, I find myself drawing from these experiences to create more engaging and meaningful interactions.",
            ],
          },
          {
            id: 2,
            name: "Grand Slam Galore — Elevator Pitch Overview",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: assetUrl("GrandSlamGalore_Elevator_Pitch_Overview_gqbgtr"),
            alt: "Grand Slam Galore — elevator pitch overview",
          },
          {
            id: 3,
            name: "Grand Slam Galore — Gameplay Loops",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: assetUrl("GrandSlamGalore_Gameplay_Loops_ztxznw"),
            alt: "Grand Slam Galore — gameplay loops",
          },
          {
            id: 4,
            name: "Grand Slam Galore — Unity Scene",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: assetUrl("GrandSlamGalore_Unity_Scene_tighfd"),
            alt: "Grand Slam Galore — Unity scene",
          },
          {
            id: 5,
            name: "Grand Slam Galore — VR Game",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: assetUrl("GrandSlamGalore_VR_Game_v8s9t3"),
            alt: "Grand Slam Galore — VR game",
          },
          {
            id: 6,
            name: "Grand Slam Galore — Code",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: assetUrl("GrandSlamGalore_Code_uycv9l"),
            alt: "Grand Slam Galore — code",
          },
          {
            id: 7,
            name: "Eternal Night — In-Game Picture",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: assetUrl("EternalNight_In-Game_Picture_juhlow"),
            alt: "Eternal Night — in-game picture",
          },
          {
            id: 8,
            name: "Construct3 — System Code",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: assetUrl("Construct3_System_Code_u1dwco"),
            alt: "Construct3 — system code",
          },
        ],
      },

      // ▶ Makerspace — hands-on / fabrication internship
      {
        id: 10,
        name: "Makerspace",
        icon: "/images/folder.png",
        kind: "folder",
        category: "university",
        children: [
          {
            id: 1,
            name: "Makerspace.txt",
            icon: "/images/txt.png",
            kind: "file",
            fileType: "txt",
            subtitle: "Makerspace internship, SUNY Albany",
            description: [
              "This is college work, but I like having it here. I interned at the campus makerspace, which mostly meant building things and helping other people build theirs.",
              "I got to try a bit of everything like soldering and PCB work, working with drones, 3D printing, some sewing and rug tufting. A lot of the job was keeping the machines running so the next person could use them. As well as assisting students and faculty with their projects, which was a lot of fun.",
              "I put it in because I like making things with my hands, and honestly a lot of how I approach problems comes from that.",
            ],
          },
          ...[
            { name: "Soldering 1", id: "soldering_1_dqqltp" },
            { name: "Soldering 2", id: "soldering_2_gsilhd" },
            { name: "Soldering 3", id: "soldering_3_mrxiog" },
            { name: "Soldering 4", id: "soldering_4_gsfj3w" },
            { name: "Rover", id: "rover_la7dlb" },
            { name: "VR Session", id: "vr_ju5ude" },
            { name: "Turing Tumble", id: "turing_tumble_ojkfto" },
            { name: "Tinkering", id: "tinker_ltbgj1" },
            { name: "Button Maker", id: "button_a8bxzs" },
            { name: "Keychain", id: "keychain_vxhpta" },
            { name: "Sewn Keychain", id: "sewn_keychain_va2k9h" },
            { name: "Pencil Case 1", id: "pencil_case_1_zdyxke" },
            { name: "Pencil Case 2", id: "pencil_case_2_n5r3hf" },
            { name: "Makerspace — Photo 01", id: "IMG_5135_wem1xx" },
            { name: "Makerspace — Photo 02", id: "IMG_5045_nxk4nk" },
            { name: "Makerspace — Photo 03", id: "70349033557__A8B390A9-B921-48AA-8503-908ABD94808A_fleyv7" },
            { name: "Makerspace — Photo 04", id: "IMG_4982_xoirci" },
            { name: "Makerspace — Photo 05", id: "IMG_4966_vh6wkb" },
            { name: "Makerspace — Photo 06", id: "IMG_4555_g6uzix" },
            { name: "Makerspace — Photo 07", id: "IMG_4557_bknccw" },
            { name: "Makerspace — Photo 08", id: "IMG_4445_gxqlam" },
            { name: "Makerspace — Photo 09", id: "IMG_4480_rvxnta" },
            { name: "Makerspace — Photo 10", id: "thumbnail_IMG_0411_kg4acl" },
            { name: "Makerspace — Photo 11", id: "thumbnail_IMG_4268_z3oyt9" },
          ].map((a, i) => ({
            id: 100 + i,
            name: a.name,
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: assetUrl(a.id),
            alt: a.name,
          })),
          ...[
            { name: "Makerspace — Clip 1", id: "20230418_062110000_iOS_pey8jq" },
            { name: "Makerspace — Clip 2", id: "IMG_4446_yumpjs" },
            { name: "Makerspace — Clip 3", id: "IMG_4443_u74smv" },
          ].map((a, i) => ({
            id: 200 + i,
            name: a.name,
            icon: cldVideoPoster(a.id, { width: 128 }),
            kind: "file",
            fileType: "video",
            videoId: a.id,
            alt: a.name,
          })),
        ],
      },
    ],
  };

  const ABOUT_LOCATION = {
    id: 2,
    type: "about",
    name: "About me",
    icon: "/icons/info.svg",
    kind: "folder",
    children: [
      // PLACEHOLDER — portrait / personal photos not yet supplied.
      {
        id: 1,
        name: "me.png",
        icon: "/images/image.png",
        kind: "file",
        fileType: "img",
        imageUrl: assetUrl("Screenshot_2026-06-08_at_3.11.10_PM_je6ima"),
        alt: "Portrait of Oliver",
      },
      {
        id: 4,
        name: "about-me.txt",
        icon: "/images/txt.png",
        kind: "file",
        fileType: "txt",
        subtitle: "Designer and founder",
        image: assetUrl("Screenshot_2026-06-08_at_3.11.10_PM_je6ima"),
        description: [
          "I'm Oliver Naumov. I build products, the brand around them, and the growth that gets people through the door.",
          "I got into all of this by launching my own clothing label first. That's where I learned that a product and the story around it aren't separate jobs — and it's why I still don't design one without the other.",
          "Most recently I co-founded Tchpack, an AI platform for fashion brands, and took it from zero to $20K+ MRR with one other person — owning the product design, the brand, and every growth channel.",
          "B.S. Informatics, Interactive User Experience, from SUNY Albany, with minors in Cybersecurity and Game Design & Development. Dean's List three times, and a CURCE Grant recipient.",
          "Before this I worked as an IT Specialist II, running full IT support for an entire agency building — hardware, software, and network. I solved complex problems independently and delivered ahead of deadline.",
        ],
      },
    ],
  };

  const RESUME_LOCATION = {
    id: 3,
    type: "resume",
    name: "Resume",
    icon: "/icons/file.svg",
    kind: "folder",
    children: [
      {
        id: 1,
        name: "Resume.pdf",
        icon: "/images/pdf.png",
        kind: "file",
        fileType: "pdf",
      },
    ],
  };

  const TRASH_LOCATION = {
    id: 4,
    type: "trash",
    name: "Archive",
    icon: "/icons/trash.svg",
    kind: "folder",
    children: [],
  };

  export const locations = {
    work: WORK_LOCATION,
    about: ABOUT_LOCATION,
    resume: RESUME_LOCATION,
    trash: TRASH_LOCATION,
  };

  const INITIAL_Z_INDEX = 1000;

  const WINDOW_CONFIG = {
    finder: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    contact: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    resume: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    safari: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    photos: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    terminal: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    txtfile: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    imgfile: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    videofile: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
  };

  export { INITIAL_Z_INDEX, WINDOW_CONFIG };
