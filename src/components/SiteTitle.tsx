import React, { useState } from 'react';
import styled from '@emotion/styled';

const TitleContainer = styled.div`
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 1);
  border: 1px solid rgba(235, 235, 255, 0.125);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 14px;
  z-index: 1000;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 600px) {
    display: none;
  }
`;

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
    <TitleContainer onClick={handleClick}>
      {copied ? 'url copied!' : 'polyp.observer'}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    </TitleContainer>
  );
}