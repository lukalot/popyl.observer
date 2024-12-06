import React from 'react';

interface RestartButtonProps {
  onRestart: () => void;
}

export const RestartButton: React.FC<RestartButtonProps> = ({ onRestart }) => {
  return (
    <button
      onClick={onRestart}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: 'max(350px, 50%)',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 1)',
        border: '1px solid rgba(235, 235, 255, 0.125)',
        color: 'white',
        padding: '8px 11px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '14px',
        cursor: 'pointer',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48px',
        height: '32px',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = 'rgba(40, 40, 40, 1)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 1)';
      }}
    >
      <div style={{ 
        width: '20px', 
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </div>
    </button>
  );
}; 