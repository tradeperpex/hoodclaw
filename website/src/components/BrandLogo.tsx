"use client";

import { useId } from "react";

export default function BrandLogo({ size = 22 }: { size?: number }) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="brand-logo"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFC15E" />
          <stop offset="38%" stopColor="#FFC15E" />
          <stop offset="54%" stopColor="#FF7A29" />
          <stop offset="68%" stopColor="#E8590C" />
          <stop offset="82%" stopColor="#C2410C" />
          <stop offset="100%" stopColor="#D97757" />
        </linearGradient>
      </defs>
      <rect x="16" y="20" width="68" height="62" rx="10" fill={`url(#${gradientId})`} />
      <rect
        x="16"
        y="20"
        width="68"
        height="62"
        rx="10"
        fill="none"
        stroke="rgba(26, 16, 8, 0.08)"
        strokeWidth="0.6"
      />
      <g
        transform="translate(38 38)"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
      >
        <path d="M2 8V4a2 2 0 0 1 2-2h4" />
        <path d="M16 2h4a2 2 0 0 1 2 2v4" />
        <path d="M22 16v4a2 2 0 0 1-2 2h-4" />
        <path d="M8 22H4a2 2 0 0 1-2-2v-4" />
        <circle cx="12" cy="12" r="2.4" fill="#ffffff" stroke="none" />
      </g>
    </svg>
  );
}
