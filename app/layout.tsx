import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Pinyon_Script,
  Jost,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";

const fontSerif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
});

const fontScript = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

const fontSans = Jost({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
});

const fontDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

const siteUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// A generic fallback only: the real, per-wedding title/description/OG image
// come from content/*.json via app/demo/page.tsx's generateMetadata, which
// overrides every field here for that route.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Wedding Invitation",
  description: "A digital wedding invitation.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ro"
      className={`${fontSerif.variable} ${fontScript.variable} ${fontSans.variable} ${fontDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
