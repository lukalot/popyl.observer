import React, { useEffect, useState } from 'react';

export const FPSCounter: React.FC = () => {
  const [fps, setFps] = useState(0);
  
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let frameId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      // Update FPS every second
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      frameId = requestAnimationFrame(measureFPS);
    };

    frameId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      backgroundColor: 'rgba(0, 0, 0, 1)',
      border: '1px solid rgba(235, 235, 255, 0.125)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontFamily: 'monospace',
      fontSize: '14px',
      zIndex: 1000,
    }}>
      {fps} FPS
    </div>
  );
}; 