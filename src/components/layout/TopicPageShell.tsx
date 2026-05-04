import Link from "next/link";
import type { ReactNode } from "react";

export default function TopicPageShell({
  topicTitle,
  children,
}: {
  topicTitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-[1300px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <Link
            href="/#topics"
            className="font-mono text-sm text-zinc-400 hover:text-purple-300 transition-colors"
          >
            ← 홈
          </Link>
          <span className="font-mono text-xs text-zinc-600 truncate text-right">
            {topicTitle}
          </span>
        </div>
      </header>
      {children}
      <footer className="mt-auto py-12 text-center border-t border-white/[0.04]">
        <p className="text-zinc-600 text-sm font-mono">
          All You Need is CS · Phase 1 · Built with Next.js &amp; p5.js
        </p>
      </footer>
    </div>
  );
}
