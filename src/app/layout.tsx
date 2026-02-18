// Next.js
import type { Metadata } from "next";


// Global css
import "./globals.css";

// Fonts
import { Inter, Barlow } from "next/font/google";
const interFont = Inter({ subsets: ["latin"]});
const barlowFont = Barlow({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable:"--font-barlow", // adding this allows its use in tailwind classes
})

// Metadata
export const metadata: Metadata = {
  title: "Side Hustle",
  description: "Welcome to your local marketplace. Whether you want to buy, sell or trade items, come and see what's available.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interFont.className} ${barlowFont.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
