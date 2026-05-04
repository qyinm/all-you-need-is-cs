import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "All You Need is CS — Visual Computer Science",
  description:
    "Interactive chapter labs aligned with Horowitz, Sahni & Anderson-Freed—Fundamentals of Data Structures in C (2nd ed.).",
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
      "Chapter-shaped visualizations for Fundamentals of Data Structures in C.",
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
      className={`${nunito.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink font-sans">
        {children}
      </body>
    </html>
  );
}
