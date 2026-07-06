import { LOGO_BAR, LOGO_BG, LOGO_BAR_RADIUS, LOGO_RADIUS } from "@/lib/logo-mark";

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
      <rect x="38" y="26" width="24" height="48" rx={LOGO_BAR_RADIUS} fill={LOGO_BAR} />
    </svg>
  );
}
