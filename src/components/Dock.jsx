import { useRef } from 'react';
import { dockApps, locations } from "#constants/index.js";
import { Tooltip } from "react-tooltip";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import useWindowStore from "#store/window.js";
import useLocationStore from "#store/location.js";

const Dock = () => {
  const { openWindow, closeWindow, focusWindow, windows, nextZIndex } = useWindowStore();
  const { path, setActiveLocation } = useLocationStore();
  const dockRef = useRef(null);

  useGSAP(() => {
    const dock = dockRef.current;
    if(!dock) return;

    const icons = dock.querySelectorAll('.dock-icon');

    const animateIcons = (mouseX) => {
      const { left } = dock.getBoundingClientRect();

      icons.forEach((icon) => {
        const {left: iconLeft, width } = icon.getBoundingClientRect();
        const center = iconLeft - left + width / 2;
        const distance = Math.abs(mouseX - center);

        const intensity = Math.exp(-(distance ** 2.5) / 20000);

        gsap.to(icon, {
          scale: 1 + 0.25 * intensity,
          y: -15 * intensity,
          duration: 0.2,
          ease: "power1.out",
        });
    });
  };

  const handleMouseMove = (e) => {
    const { left } = dock.getBoundingClientRect();

    animateIcons(e.clientX - left);
  };

  const resetIcons = () => icons.forEach((icon) => 
    gsap.to(icon, {
      scale: 1,
      y: 0,
      duration: 0.3,
      ease: "power1.out",
    })
  );

  dock.addEventListener('mousemove', handleMouseMove);
  dock.addEventListener('mouseleave', resetIcons);

  return () => {
    dock.removeEventListener('mousemove', handleMouseMove);
    dock.removeEventListener('mouseleave', resetIcons);
  };
}, []);


  // Work and Archive share the Finder window. Which one it's showing is the
  // root of its breadcrumb, so browsing into a Work subfolder still counts
  // as Work.
  const finderShows = (location) =>
    windows.finder.isOpen && path[0]?.id === locations[location]?.id;

  // An app is "running" when its window is open, or for Work/Archive, when
  // the Finder is showing their folder.
  const isRunning = ({ id, location }) =>
    location ? finderShows(location) : !!windows[id]?.isOpen;

  const toggleApp = (app) => {
    if(!app.canOpen) return;

    // Apps backed by a location (Work, Archive) point the shared Finder at
    // their folder. Already showing it: close if in front, else bring forward.
    if(app.location) {
      const target = locations[app.location];
      if(!target) return;

      if(finderShows(app.location)) {
        if(windows.finder.zIndex === nextZIndex - 1) return closeWindow('finder');
        return focusWindow('finder');
      }

      setActiveLocation(target);
      return openWindow('finder');
    }

    const window = windows[app.id];

    if(!window) {
      console.error(`Window not found for app: ${app.id}`);
      return;
    }

    // Open but buried under another window: bring it forward rather than
    // closing something the visitor can't see. Only the front window toggles shut.
    if(window.isOpen) {
      if(window.zIndex === nextZIndex - 1) closeWindow(app.id);
      else focusWindow(app.id);
    } else {
      openWindow(app.id);
    }

  };

  return (
    <>
    <section id="dock">
      <div ref={dockRef} className="dock-container">
        {dockApps.map(({ id, name, icon, canOpen, location }) => (
          <div key={id} className="relative flex justify-center">
            <button 
              type="button" 
              className="dock-icon" 
              aria-label={name} 
              data-tooltip-id="dock-tooltip"
              data-tooltip-content={name}
              data-tooltip-delay-show={150}
              disabled={!canOpen}
              onClick={() => toggleApp({id, canOpen, location})}
            >
              <img 
                src={`/images/${icon}`}
                alt={name}
                loading="lazy"
                className={canOpen ? "" : "opacity-60"} 
              />
            </button>
            {isRunning({ id, location }) && <span className="dock-dot" aria-hidden="true" />}
          </div>
        ))}
      </div>
    </section>

    <Tooltip id="dock-tooltip" place="top" className="tooltip" />
    </>
  );
};

export default Dock;
