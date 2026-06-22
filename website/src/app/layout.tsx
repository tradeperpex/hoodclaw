import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://theagentclaw.fun"),
  title: {
    default: "AgentClaw",
    template: "%s",
  },
  description: "One autonomous agent. One token. No human hands, on pump.fun.",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "AgentClaw",
    description: "One autonomous agent. One token. No human hands, on pump.fun.",
    siteName: "AgentClaw",
    type: "website",
    locale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentClaw",
    description: "One autonomous agent. One token. No human hands, on pump.fun.",
    site: "@agentclawfun",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <SmoothScroll>
          <main className="main">{children}</main>
        </SmoothScroll>
        <Footer />
      </body>
    </html>
  );
}
