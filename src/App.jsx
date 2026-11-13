import DesktopShell from '#shells/DesktopShell.jsx';
import MobileShell from '#mobile/MobileShell.jsx';
import { useIsDesktop } from '#hooks/useViewport.js';
import { Wallpaper } from '#components';
import BackgroundMusic from '#features/vibe/BackgroundMusic.jsx';
import EntryScreen from '#features/vibe/EntryScreen.jsx';
import { useEffect, useState } from 'react';
import { applyMeta } from './seo.js';

/* One of two OS experiences depending on viewport width. The desktop shell
   assumes a mouse and draggable windows; below 1024px it would be unusable, so
   phones and tablets get the springboard instead. */
const App = () => {
  const isDesktop = useIsDesktop();

  // The entry screen's click is what lets the song play (see EntryScreen).
  // Skip it if this page has already been interacted with — e.g. coming
  // back from /simple — since sound is allowed by then.
  // 'entry' (splash only) → 'reveal' (site mounted, splash opening over it)
  // → 'in' (splash gone).
  const [phase, setPhase] = useState(() =>
    typeof navigator !== 'undefined' && navigator.userActivation?.hasBeenActive ? 'in' : 'entry'
  );

  // Coming back from /simple, put the home page's head tags back.
  useEffect(() => applyMeta('/'), []);

  return (
    <main id="os">
      <Wallpaper />

      {/* The shells mount as the splash opens, so the intro animations (the
          bracelet assembling) play when the visitor actually sees them. */}
      {phase !== 'entry' && (isDesktop ? <DesktopShell /> : <MobileShell />)}
      {phase !== 'in' && (
        <EntryScreen onReveal={() => setPhase('reveal')} onEnter={() => setPhase('in')} />
      )}

      <BackgroundMusic />
    </main>
  );
};

export default App;
