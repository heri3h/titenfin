'use client';

import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  withText?: boolean;
  textColor?: string;
  color?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 36,
  className = '',
  withText = false,
  textColor = 'text-slate-900',
  color = '#059669', // Emerald-600
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200"
      >
        {/* Outer Coin Circle */}
        <circle cx="250" cy="250" r="210" stroke={color} strokeWidth="36" />
        
        {/* Top Horizontal Bar */}
        <rect x="130" y="130" width="240" height="42" rx="10" fill={color} />
        
        {/* Middle Crossbar 1 */}
        <rect x="148" y="200" width="204" height="34" rx="8" fill={color} />
        
        {/* Middle Crossbar 2 */}
        <rect x="148" y="260" width="204" height="34" rx="8" fill={color} />
        
        {/* Vertical Stem */}
        <rect x="226" y="130" width="48" height="230" rx="10" fill={color} />
      </svg>

      {withText && (
        <span className={`font-bold tracking-tight text-xl ${textColor}`}>
          Titen<span className="text-emerald-600">Fin</span>
        </span>
      )}
    </div>
  );
};
