import { useRef } from 'react';
import { dockApps, locations } from "#constants/index.js";
import { Tooltip } from "react-tooltip";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import useWindowStore from "#store/window.js";
import useLocationStore from "#store/location.js";

const Dock = () => {
  const { openWindow, closeWindow, focusWindow, windows, nextZIndex } = useWindowStore();
  const { activeLocation, setActiveLocation } = useLocationStore();
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


  // An app is "running" when its window is open. Archive has no window of its
  // own, so it counts as running while the Finder is showing it.
  const isRunning = ({ id, location }) =>
    location
      ? windows.finder.isOpen && activeLocation?.id === locations[location]?.id
      : !!windows[id]?.isOpen &&
        // Work and Archive share the Finder; only one of them lights up.
        !(id === "finder" && activeLocation?.type === "trash");

  const toggleApp = (app) => {
    if(!app.canOpen) return;

    // Apps backed by a location (Archive) point the Finder at it instead of
    // owning a window. Clicking again while it's already showing closes it.
    if(app.location) {
      const target = locations[app.location];
      if(!target) return;

      if(windows.finder.isOpen && activeLocation?.id === target.id) {
        return closeWindow('finder');
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
