"use client";

import Link from "next/link";

const PUMP_URL = process.env.NEXT_PUBLIC_MINT_ADDRESS
  ? `https://pump.fun/coin/${process.env.NEXT_PUBLIC_MINT_ADDRESS}`
  : "https://pump.fun";

function ClawMark() {
  return (
    <svg className="brand-mark" width="18" height="20" viewBox="0 0 100 110" fill="none" aria-hidden="true">
      <g fill="currentColor">
        <path d="M30,26 C37,42 37,66 30,72 C23,66 23,42 30,26 Z" transform="rotate(-15 30 50)" />
        <path d="M50,12 C58.5,35 58.5,69 50,75 C41.5,69 41.5,35 50,12 Z" />
        <path d="M70,26 C77,42 77,66 70,72 C63,66 63,42 70,26 Z" transform="rotate(15 70 50)" />
      </g>
      <path d="M19,63 C30,86 70,86 81,63" stroke="currentColor" strokeWidth="7" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export default function HomeHeader() {
  return (
    <header className="home-header">
      <nav className="home-header-nav">
        <Link href="/" className="home-brand" aria-label="OnlyClaw home">
          <span className="home-brand-icon"><ClawMark /></span>
        </Link>
        <span className="home-nav-divider" aria-hidden="true" />
        <Link href="/proof">Proof</Link>
        <Link href="/thoughts">Thoughts</Link>
        <Link href="/chat">Chat</Link>
        <Link href="/roadmap">Roadmap</Link>
        <a href="https://x.com/onlyclawfun" target="_blank" rel="noopener noreferrer">X</a>
        <a href={PUMP_URL} target="_blank" rel="noopener noreferrer">Pump.fun</a>
        <Link href="/docs">Docs</Link>
      </nav>
    </header>
  );
}
