import React from 'react';

const IconTryHackMe = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-shield-terminal">
    <title>TryHackMe</title>
    {/* Shield outline */}
    <path d="M12 22s8-4 8-10V6l-8-3-8 3v6c0 6 8 10 8 10" />
    {/* Minimal ">_" terminal glyph */}
    <polyline points="8 11 10.5 12.5 8 14" />
    <line x1="12" y1="14" x2="16" y2="14" />
  </svg>
);

export default IconTryHackMe;
