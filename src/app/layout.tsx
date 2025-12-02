import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { fonts } from "./font";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atom Gen",
  description: "Experience Generative UI with Atom Gen - Powered by Thesys C1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fonts.map((font) => font.variable).join(" ")}>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
