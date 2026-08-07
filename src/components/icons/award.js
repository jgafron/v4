import React from 'react';

const IconAward = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-award">
    <title>Award</title>
    {/* Medal circle */}
    <circle cx="12" cy="8" r="4" />
    {/* Ribbons */}
    <path d="M8.5 12l-1.5 8 5-3 5 3-1.5-8" />
  </svg>
);

export default IconAward;
