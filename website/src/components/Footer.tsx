const X_URL = "https://x.com/theagentco";

const PUMP_URL = process.env.NEXT_PUBLIC_MINT_ADDRESS
  ? `https://pump.fun/coin/${process.env.NEXT_PUBLIC_MINT_ADDRESS}`
  : "https://pump.fun";

export default function Footer() {
  return (
    <footer className="site-foot">
      <span className="site-foot-brand">the agent company</span>
      <a href={X_URL} target="_blank" rel="noopener noreferrer">x ↗</a>
      <a href={PUMP_URL} target="_blank" rel="noopener noreferrer">buy ↗</a>
    </footer>
  );
}
