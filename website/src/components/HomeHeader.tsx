"use client";

import Link from "next/link";

const PUMP_URL = process.env.NEXT_PUBLIC_MINT_ADDRESS
  ? `https://pump.fun/coin/${process.env.NEXT_PUBLIC_MINT_ADDRESS}`
  : "https://pump.fun";

function ClawMark() {
  return (
    <svg className="brand-mark" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 4.5C6 9 7.5 12 8.5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 3.5C12 8.5 12 12.5 12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 4.5C18 9 16.5 12 15.5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 14.5C7 19 17 19 19 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function HomeHeader() {
  return (
    <>
      <Link href="/" className="home-brand" aria-label="OnlyClaw home">
        <span className="home-brand-icon"><ClawMark /></span>
        <span className="home-brand-name">OnlyClaw</span>
      </Link>
      <header className="home-header">
        <nav className="home-header-nav">
          <Link href="/proof">Proof</Link>
          <Link href="/thoughts">Thoughts</Link>
          <Link href="/chat">Chat</Link>
          <Link href="/roadmap">Roadmap</Link>
          <a href="https://x.com/onlyclawfun" target="_blank" rel="noopener noreferrer">X</a>
          <a href={PUMP_URL} target="_blank" rel="noopener noreferrer">Pump.fun</a>
          <Link href="/docs">Docs</Link>
        </nav>
      </header>
    </>
  );
}
