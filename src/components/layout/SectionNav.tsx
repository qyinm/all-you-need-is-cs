import Link from "next/link";
import type { BookOutlineItem } from "@/lib/topics";

export default function SectionNav({
  topicId,
  prev,
  next,
}: {
  topicId: string;
  prev?: BookOutlineItem;
  next?: BookOutlineItem;
}) {
  return (
    <nav
      aria-label="Previous and next section"
      className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-8 font-mono text-sm"
    >
      {prev ? (
        <Link
          href={`/topics/${topicId}/${prev.id}`}
          className="text-ink underline decoration-hairline underline-offset-4 hover:decoration-ink"
        >
          ← {prev.label} {prev.title}
        </Link>
      ) : (
        <span className="text-mute">←</span>
      )}
      {next ? (
        <Link
          href={`/topics/${topicId}/${next.id}`}
          className="text-right text-ink underline decoration-hairline underline-offset-4 hover:decoration-ink"
        >
          {next.label} {next.title} →
        </Link>
      ) : (
        <span className="text-mute">→</span>
      )}
    </nav>
  );
}
