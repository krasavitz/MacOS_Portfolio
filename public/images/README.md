# Image assets

Two kinds of files live under `/public/images`. Keep them separate.

## UI chrome — do not delete

Files in the root of this directory are part of the desktop interface, not
content: `folder.png`, `txt.png`, `image.png`, `plain.png`, `pdf.png`,
`safari.png`, `finder.png`, `photos.png`, `terminal.png`, `contact.png`,
`trash.png`, `trash-1.png`, `trash-2.png`, `wallpaper.png`, `logo.svg`.

`placeholder.svg` is the labeled stand-in every unfilled content slot points at.

## Content — drop your work here

| Folder | What goes in it |
| --- | --- |
| `work/tchpack/` | Product screenshots (web + iOS, Aria flow), brand system, growth/social content |
| `work/client-sites/` | One screenshot per client site |
| `work/trace/` | Wireframes, prototype screens, style guide, personas, journey maps |
| `work/reflect/` | Prompt view, writing environment, entry history |
| `work/game-dev/` | Construct3 stills, Unity 3D/VR scenes, serious games build |
| `about/` | Portrait, clothing label work, candid/working photos |
| `gallery/` | Anything featured in the Gallery window |

### Naming

Lowercase, hyphenated, descriptive of the content rather than its position:
`aria-tech-pack-flow.png`, not `screenshot-3.png`. The filename is what you'll
be reading in `src/constants/index.js` a year from now.

### Wiring a file up

Every open slot in [`src/constants/index.js`](../../src/constants/index.js) is
marked `PLACEHOLDER` and points at `PLACEHOLDER_IMG`. To fill one, drop the file
in the right folder above and swap that slot's `imageUrl` to its path, e.g.

```js
imageUrl: "/images/work/tchpack/aria-tech-pack-flow.png",
```

Then replace the `alt` text — it currently describes what *should* go there, and
once a real image is in place it needs to describe what's actually shown.
