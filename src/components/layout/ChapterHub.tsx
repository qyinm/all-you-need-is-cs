import Link from "next/link";
import ChapterOutline from "@/components/layout/ChapterOutline";
import type { Topic } from "@/lib/topics";

const complexityLabels: Record<Topic["complexity"], string> = {
  easy: "Beginner",
  medium: "Intermediate",
  hard: "Advanced",
};

export default function ChapterHub({ topic }: { topic: Topic }) {
  const first = topic.outline[0];

  return (
    <section className="scroll-mt-14 border-t border-hairline px-6 py-12 md:py-[88px]">
      <div className="mx-auto w-full max-w-[720px]">
        <div className="mb-12 text-center">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
            <span className="font-mono text-sm font-medium text-ink">{topic.bookChapter}</span>
            <span className="rounded-full bg-surface-soft px-3 py-1 font-mono text-xs font-medium text-charcoal">
              {complexityLabels[topic.complexity]}
            </span>
          </div>
          <h1 className="font-display text-[1.875rem] font-medium leading-[1.2] text-ink md:text-[30px]">
            {topic.title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-[1.5] text-body">{topic.subtitle}</p>
        </div>

        <ChapterOutline items={topic.outline} topicId={topic.id} />

        {first && topic.id !== "basic-concepts" && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={`/topics/${topic.id}/${first.id}`} className="ui-btn-primary">
              Start at {first.label}
            </Link>
          </div>
        )}

        {topic.id === "basic-concepts" && first && (
          <div className="mt-8 space-y-4 border-t border-hairline pt-8 text-left text-base leading-[1.5] text-body">
            <p className="text-ink font-medium">
              Before manipulating structures in code, the text establishes how we specify, abstract,
              and analyze algorithms. This chapter has no canvas—open each § below for a short summary,
              then continue to Arrays (Ch. 2).
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href={`/topics/${topic.id}/${first.id}`} className="ui-btn-primary">
                Read {first.label}
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
