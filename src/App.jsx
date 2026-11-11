import DesktopShell from '#shells/DesktopShell.jsx';
import MobileShell from '#mobile/MobileShell.jsx';
import { useIsDesktop } from '#hooks/useViewport.js';
import { Wallpaper } from '#components';
import { useEffect } from 'react';
import { applyMeta } from './seo.js';

/* One of two OS experiences depending on viewport width. The desktop shell
   assumes a mouse and draggable windows; below 1024px it would be unusable, so
   phones and tablets get the springboard instead. */
const App = () => {
  const isDesktop = useIsDesktop();

  // Coming back from /simple, put the home page's head tags back.
  useEffect(() => applyMeta('/'), []);

  return (
    <main id="os">
      <Wallpaper />

      {isDesktop ? <DesktopShell /> : <MobileShell />}
    </main>
  );
};

export default App;
