'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  href?: string;
  className?: string;
}

export function BrandLogo({
  size = 'md',
  showTagline = false,
  href = '/',
  className = '',
}: BrandLogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  const textSizes = {
    sm: 'text-base tracking-tight',
    md: 'text-xl tracking-tight',
    lg: 'text-2xl tracking-tight',
  };

  const Content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Original geometric payment-flow icon */}
      <div
        className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1A211B] to-[#131814] border border-[#303A31] shadow-xs group-hover:border-brand-primary/50 transition-colors ${iconSizes[size]}`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-brand-primary"
        >
          {/* Outer payment ring */}
          <circle
            cx="16"
            cy="16"
            r="12"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 2"
            className="opacity-40"
          />
          {/* Dynamic convergent flow chevron */}
          <path
            d="M10 16L15 11L20 16"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 21L16 17L20 21"
            stroke="#63D5A1"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Central settlement node */}
          <circle cx="16" cy="14" r="2" fill="currentColor" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight text-[#F4F7F1] dark:text-[#F4F7F1] light:text-[#192219] ${textSizes[size]}`}>
            ONE<span className="text-brand-primary dark:text-brand-primary light:text-brand-primary-light">PAY</span>
          </span>
          <span className="text-[9px] px-1.5 py-0.2 rounded-md font-bold uppercase tracking-wider bg-brand-primary/15 text-brand-primary dark:text-brand-primary light:text-brand-primary-light border border-brand-primary/30">
            ENTERPRISE
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] tracking-wide text-[#A0ACA1] dark:text-[#A0ACA1] light:text-[#687568] -mt-0.5">
            All Your Payments. One Clear View.
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group flex items-center focus:outline-none">
        {Content}
      </Link>
    );
  }

  return Content;
}

