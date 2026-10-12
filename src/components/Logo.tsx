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
  size = 40,
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
        viewBox="0 0 520 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200"
      >
        {/* Outer Wheel Ring */}
        <circle cx="260" cy="260" r="220" stroke={color} strokeWidth="26" />
        
        {/* Inner Segmented Ring */}
        <circle cx="260" cy="260" r="176" stroke={color} strokeWidth="14" />

        {/* 8 Outer Spokes */}
        <line x1="260" y1="40" x2="260" y2="84" stroke={color} strokeWidth="20" strokeLinecap="round" />
        <line x1="260" y1="436" x2="260" y2="480" stroke={color} strokeWidth="20" strokeLinecap="round" />
        <line x1="40" y1="260" x2="84" y2="260" stroke={color} strokeWidth="20" strokeLinecap="round" />
        <line x1="436" y1="260" x2="480" y2="260" stroke={color} strokeWidth="20" strokeLinecap="round" />
        <line x1="104" y1="104" x2="135" y2="135" stroke={color} strokeWidth="20" strokeLinecap="round" />
        <line x1="385" y1="385" x2="416" y2="416" stroke={color} strokeWidth="20" strokeLinecap="round" />
        <line x1="104" y1="416" x2="135" y2="385" stroke={color} strokeWidth="20" strokeLinecap="round" />
        <line x1="385" y1="135" x2="416" y2="104" stroke={color} strokeWidth="20" strokeLinecap="round" />

        {/* Central Stylized Aerodynamic 'T' Emblem */}
        {/* Left Wing Upper */}
        <path d="M165 180 H245 L235 208 H165 Z" fill={color} />
        {/* Right Wing Upper */}
        <path d="M265 180 H355 L335 208 H275 Z" fill={color} />
        {/* Left Wing Lower */}
        <path d="M165 220 H240 L230 248 H165 Z" fill={color} />
        {/* Right Wing Lower */}
        <path d="M270 220 H355 L335 248 H278 Z" fill={color} />

        {/* Left Center Pillar */}
        <path d="M228 258 H254 V360 C254 368 248 374 240 374 C232 374 228 366 228 358 Z" fill={color} />
        {/* Right Center Pillar */}
        <path d="M266 258 H292 L280 366 C278 372 272 376 266 376 Z" fill={color} />
      </svg>

      {withText && (
        <span className={`font-black tracking-wider text-xl uppercase ${textColor}`}>
          TITEN<span className="text-emerald-600">FIN</span>
        </span>
      )}
    </div>
  );
};
