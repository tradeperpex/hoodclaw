import { LOGO_BG, LOGO_CLAW, LOGO_CLAW_MID, LOGO_RADIUS } from "@/lib/logo-mark";

export default function BrandLogo({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className="brand-logo"
    >
      <rect width="100" height="100" rx={LOGO_RADIUS} fill={LOGO_BG} />
      <path
        d="M28 74 L40 30"
        stroke={LOGO_CLAW}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M50 78 L50 26"
        stroke={LOGO_CLAW_MID}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M72 74 L60 30"
        stroke={LOGO_CLAW}
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );
}
