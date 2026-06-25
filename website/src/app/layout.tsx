import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://theagentcompany.fun"),
  title: {
    default: "The Agent Company",
    template: "%s",
  },
  description: "Five autonomous agents. One token. No human hands, on pump.fun.",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "The Agent Company",
    description: "Five autonomous agents. One token. No human hands, on pump.fun.",
    siteName: "The Agent Company",
    type: "website",
    locale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Agent Company",
    description: "Five autonomous agents. One token. No human hands, on pump.fun.",
    site: "@agentcompanyfun",
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
