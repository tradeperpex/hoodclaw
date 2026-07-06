import Link from "next/link";
import { BRAND_NAME, X_URL, getPumpUrl } from "@/lib/brand";

export default function Footer() {
  const pumpUrl = getPumpUrl();

  return (
    <footer className="site-foot">
      <div className="site-foot-links">
        <Link className="is-active" href="/">
          home
        </Link>
        <Link href="/proof">proof</Link>
        <Link href="/thoughts">thoughts</Link>
        <Link href="/docs">docs</Link>
        <a href={X_URL} target="_blank" rel="noopener noreferrer">
          x
        </a>
        <a href={pumpUrl} target="_blank" rel="noopener noreferrer">
          buy
        </a>
      </div>
      <p className="site-foot-note">{BRAND_NAME}</p>
    </footer>
  );
}
