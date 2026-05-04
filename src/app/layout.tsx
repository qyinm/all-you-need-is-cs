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
    "자료구조와 알고리즘을 시각적으로 이해하세요. 인터랙티브 애니메이션으로 컴퓨터 사이언스의 핵심 개념을 탐험할 수 있습니다.",
  keywords: [
    "computer science",
    "data structures",
    "algorithms",
    "visualization",
    "education",
    "자료구조",
    "알고리즘",
    "시각화",
  ],
  openGraph: {
    title: "All You Need is CS",
    description:
      "자료구조와 알고리즘을 시각적으로 이해하세요. 인터랙티브 애니메이션으로 CS를 탐험하세요.",
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
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}