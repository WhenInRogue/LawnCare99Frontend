import React from "react";

const BrandMark = ({
  orientation = "stacked",
  showTagline = false,
  tagline = "Inventory System",
}) => {
  const baseClass = `brand-mark brand-${orientation}`;

  return (
    <div className={baseClass}>
      <div className="brand-icon" aria-hidden="true">
        <svg viewBox="0 0 64 64" role="img" focusable="false">
          <defs>
            <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a8ff78" />
              <stop offset="100%" stopColor="#0ec254" />
            </linearGradient>
          </defs>
          <path
            d="M61 15C50 2 26 2 10 14 1 21-2 36 7 46s28 11 39 3c5-4 9-9 11-15 .6-1.8-.3-3.7-2-4.4-6-2.5-14-7.2-18-15 6.6 8.3 15.5 11.8 22.7 12.7 1.8.2 3 .1 3.3-1.4C63.4 22.7 63.3 18.2 61 15Z"
            fill="url(#leafGradient)"
          />
          <path
            d="M35 7c8 12 18 17 25 18"
            fill="none"
            stroke="#f4fff3"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="brand-text">
        <span className="brand-number">99</span>
        <span className="brand-name">Lawncare</span>
        {showTagline && <span className="brand-tagline">{tagline}</span>}
      </div>
    </div>
  );
};

export default BrandMark;
