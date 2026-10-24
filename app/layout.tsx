import type { Metadata } from "next";
import { Cormorant_Garamond, Pinyon_Script, Jost } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Ana & Ion",
  description: "You're invited to our wedding.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ro"
      className={`${fontSerif.variable} ${fontScript.variable} ${fontSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
