import type { BookOutlineItem } from "@/lib/topics";

/** In-chapter §x.y list from the textbook TOC (reference; not separate routes). */
export default function ChapterOutline({ items }: { items: BookOutlineItem[] }) {
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
          <li key={item.id} className="flex gap-2 text-body leading-snug">
            <span className="shrink-0 tabular-nums text-charcoal">{item.label}</span>
            <span>{item.title}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs leading-normal text-mute">
        Labels follow the book&apos;s § numbering (2nd ed.); titles are shortened for the UI.
      </p>
    </nav>
  );
}
