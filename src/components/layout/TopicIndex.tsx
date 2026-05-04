import Link from "next/link";
import type { Topic } from "@/lib/topics";

const complexityLabels: Record<Topic["complexity"], string> = {
  easy: "Beginner",
  medium: "Intermediate",
  hard: "Advanced",
};

export default function TopicIndex({ topics }: { topics: Topic[] }) {
  return (
    <section
      id="topics"
      className="scroll-mt-6 border-t border-hairline px-6 py-12 md:py-[88px]"
    >
      <div className="mx-auto max-w-[960px]">
        <div className="mb-12 text-center">
          <p className="mb-2 font-mono text-sm font-medium text-charcoal">
            Fundamentals of Data Structures in C · 2e
          </p>
          <h2 className="font-display text-[1.875rem] font-medium leading-[1.2] text-ink">
            Chapters 1–10 (interactive)
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base leading-normal text-body">
            Topics follow Horowitz, Sahni &amp; Anderson-Freed—each card is the matching
            chapter lab. Ch. 11–12 are not interactive yet.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <li key={topic.id}>
              <Link
                href={`/topics/${topic.id}`}
                className="group flex h-full flex-col rounded-[12px] border border-hairline bg-canvas p-8 transition-colors hover:bg-surface-soft"
              >
                <div className="mb-4 flex items-center justify-between gap-2">
                  <span className="truncate font-mono text-xs font-medium text-ink">
                    {topic.bookChapter}
                  </span>
                  <span className="shrink-0 rounded-full bg-surface-soft px-3 py-1 font-mono text-[10px] font-medium text-charcoal">
                    {complexityLabels[topic.complexity]}
                  </span>
                </div>
                <h3 className="text-[20px] font-medium leading-snug text-ink">
                  {topic.title}
                </h3>
                <p className="mt-2 line-clamp-2 flex-1 text-sm leading-[1.43] text-body">
                  {topic.subtitle}
                </p>
                <p className="mt-3 font-mono text-[11px] text-mute">
                  {topic.outline.length} sections
                </p>
                <span className="mt-6 inline-flex items-center gap-1 font-mono text-xs font-medium text-ink underline decoration-hairline underline-offset-4 group-hover:decoration-ink">
                  Open
                  <span aria-hidden>→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-16 max-w-xl mx-auto text-center font-mono text-xs text-body leading-relaxed">
          Textbook Ch. 11 (multiway search trees) &amp; Ch. 12 (digital search structures)—no
          modules here yet. Unrelated tracks (OS, networks, …) stay out of scope for this map.
        </p>
      </div>
    </section>
  );
}
