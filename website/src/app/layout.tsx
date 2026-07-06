import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { BRAND_NAME, BRAND_TAGLINE, SITE_URL, X_HANDLE } from "@/lib/brand";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: BRAND_NAME,
    template: `%s · ${BRAND_NAME}`,
  },
  description: BRAND_TAGLINE,
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: BRAND_NAME,
    description: BRAND_TAGLINE,
    siteName: BRAND_NAME,
    type: "website",
    locale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND_NAME,
    description: BRAND_TAGLINE,
    site: X_HANDLE,
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
