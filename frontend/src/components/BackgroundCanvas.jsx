import React, { useEffect, useRef } from 'react';

const BackgroundCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    // Dynamically load Wonder.js
    const loadWonder = () => {
      const script = document.createElement('script');
      script.src = '.../Wonder.js'; // Replace with the actual path to Wonder.js
      script.async = true;
      script.onload = () => {
        new window.Wonder({
          el: '#wonder',
          dotsNumber: 100,
          lineMaxLength: 300,
          dotsAlpha: 0.5,
          speed: 1.5,
          clickWithDotsNumber: 5,
        });
      };
      document.body.appendChild(script);
    };

    loadWonder();

    return () => {
      // Cleanup dynamically added script
      const script = document.querySelector('script[src=".../Wonder.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div
      id="wonder"
      style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        zIndex: -1,
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default BackgroundCanvas;
