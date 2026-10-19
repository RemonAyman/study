import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Lenis from 'lenis';
import './index.css';
import App from './App.jsx';

// تهيئة التمرير الفائق السلاسة (Lenis Smooth Scrolling)
function Root() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Root />);
