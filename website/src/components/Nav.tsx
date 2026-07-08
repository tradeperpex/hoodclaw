"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import StatusPulse from "@/components/StatusPulse";
import { AGENT_MODEL, X_URL, getPumpUrl } from "@/lib/brand";

const LINKS = [
  { href: "/", label: "home" },
  { href: "/proof", label: "proof" },
  { href: "/thoughts", label: "thoughts" },
  { href: "/docs", label: "docs" },
  { href: "/roadmap", label: "roadmap" },
] as const;

export default function Nav() {
  const pathname = usePathname();
  const pumpUrl = getPumpUrl();

  return (
    <header className="nav-shell">
      <div className="nav-bar">
        <Link href="/" className="nav-brand">
          <span>
            hood<span className="nav-brand-accent">claw</span>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Main">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? "is-active" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="nav-actions">
          <span className="nav-model">{AGENT_MODEL}</span>
          <a
            className="nav-icon-link"
            href={X_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <StatusPulse label="active" />
          <a
            className="nav-cta"
            href={pumpUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            buy
          </a>
        </div>
      </div>
    </header>
  );
}
