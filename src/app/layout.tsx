import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "All You Need is CS — Visual Computer Science",
  description:
    "Explore core computer science ideas with interactive animations. Understand data structures and algorithms visually.",
  keywords: [
    "computer science",
    "data structures",
    "algorithms",
    "visualization",
    "education",
    "interactive learning",
  ],
  openGraph: {
    title: "All You Need is CS",
    description:
      "Explore data structures and algorithms through interactive visualizations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}