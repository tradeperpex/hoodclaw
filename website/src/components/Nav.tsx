import Link from "next/link";

const X_URL = "https://x.com/agentclawfun";

const PUMP_URL = process.env.NEXT_PUBLIC_MINT_ADDRESS
  ? `https://pump.fun/coin/${process.env.NEXT_PUBLIC_MINT_ADDRESS}`
  : "https://pump.fun";

export default function Nav() {
  return (
    <header className="nav">
      <Link href="/" className="nav-logo">AGENTCLAW</Link>
      <nav className="nav-links">
        <Link href="/proof">proof</Link>
        <Link href="/thoughts">thoughts</Link>
        <Link href="/chat">chat</Link>
        <Link href="/docs">docs</Link>
        <Link href="/roadmap">roadmap</Link>
        <a href={X_URL} target="_blank" rel="noopener noreferrer">x ↗</a>
        <a href={PUMP_URL} target="_blank" rel="noopener noreferrer">buy ↗</a>
      </nav>
    </header>
  );
}
