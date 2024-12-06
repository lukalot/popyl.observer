import React, { useState } from 'react';

export default function SiteTitle() {
  const [copied, setCopied] = useState(false);
  const url = 'https://polyp.observer';

  const handleClick = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div 
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 1)', 
        border: '1px solid rgba(235, 235, 255, 0.125)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '14px',
        zIndex: 1000,
        cursor: 'pointer',
      }}>
      {copied ? 'url copied!' : 'polyp.observer'}
    </div>
  );
};