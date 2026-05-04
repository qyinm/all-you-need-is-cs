import Link from "next/link";
import type { BookOutlineItem } from "@/lib/topics";

/** Chapter § list — links to `/topics/[topicId]/[sectionId]` when `topicId` is set. */
export default function ChapterOutline({
  items,
  topicId,
}: {
  items: BookOutlineItem[];
  topicId?: string;
}) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Sections in this chapter"
      className="mb-10 border-t border-hairline pt-8 text-left"
    >
      <h2 className="mb-4 font-mono text-xs font-medium uppercase tracking-wide text-mute">
        Sections in this chapter
      </h2>
      <ol className="max-h-[min(400px,55vh)] space-y-2 overflow-y-auto pr-1 font-mono text-sm md:columns-2 md:gap-x-8 [&>li]:break-inside-avoid">
        {items.map((item) => (
          <li key={item.id} className="break-inside-avoid leading-snug">
            {topicId ? (
              <Link
                href={`/topics/${topicId}/${item.id}`}
                className="group flex gap-2 text-body hover:text-ink"
              >
                <span className="shrink-0 tabular-nums text-charcoal group-hover:text-ink">
                  {item.label}
                </span>
                <span className="underline decoration-hairline underline-offset-4 group-hover:decoration-ink">
                  {item.title}
                </span>
              </Link>
            ) : (
              <span className="flex gap-2 text-body">
                <span className="shrink-0 tabular-nums text-charcoal">{item.label}</span>
                <span>{item.title}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs leading-normal text-mute">
        Labels follow the book&apos;s § numbering (2nd ed.); titles are shortened for the UI.
      </p>
    </nav>
  );
}
