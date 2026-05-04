import Link from "next/link";
import type { ReactNode } from "react";

export default function TopicPageShell({
  topicTitle,
  topicId,
  sectionSubtitle,
  children,
}: {
  topicTitle: string;
  /** Set on chapter hub and section pages for breadcrumb link target. */
  topicId?: string;
  /** Section page only, e.g. "§5.3 · Binary tree traversals". */
  sectionSubtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 h-14 border-b border-hairline bg-canvas">
        <div className="mx-auto flex h-full max-w-[960px] items-center justify-between gap-4 px-6">
          <Link
            href="/#topics"
            className="text-sm font-medium text-ink underline decoration-hairline underline-offset-4"
          >
            ← Home
          </Link>
          <span className="max-w-[min(100%,28rem)] truncate text-right text-sm text-body">
            {sectionSubtitle && topicId ? (
              <>
                <Link
                  href={`/topics/${topicId}`}
                  className="font-medium text-ink underline decoration-hairline underline-offset-4 hover:decoration-ink"
                >
                  {topicTitle}
                </Link>
                <span className="text-mute"> · </span>
                <span className="font-medium text-body">{sectionSubtitle}</span>
              </>
            ) : (
              <span className="font-medium text-body">{topicTitle}</span>
            )}
          </span>
        </div>
      </header>
      {children}
      <footer className="mt-auto border-t border-hairline px-6 py-8 text-center">
        <p className="font-mono text-xs leading-[1.33] text-body">
          All You Need is CS · Horowitz / Sahni / Anderson-Freed · Next.js &amp; p5.js
        </p>
      </footer>
    </div>
  );
}
