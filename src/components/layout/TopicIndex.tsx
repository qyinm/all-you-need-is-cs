import Link from "next/link";
import type { Topic } from "@/lib/topics";

const complexityStyles: Record<
  Topic["complexity"],
  string
> = {
  easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  hard: "bg-red-500/10 text-red-400 border-red-500/20",
};

const complexityLabels: Record<Topic["complexity"], string> = {
  easy: "Beginner",
  medium: "Intermediate",
  hard: "Advanced",
};

export default function TopicIndex({ topics }: { topics: Topic[] }) {
  return (
    <section
      id="topics"
      className="scroll-mt-6 border-b border-white/[0.04] py-16 px-6"
    >
      <div className="max-w-[1300px] mx-auto">
        <div className="mb-10 text-center">
          <p className="font-mono text-sm text-purple-400/80 mb-2">
            Phase 1 · Data Structures &amp; Algorithms
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-100">
            Choose a topic
          </h2>
          <p className="mt-2 text-zinc-500 text-sm max-w-lg mx-auto">
            Each card opens a dedicated page with that visualization.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {topics.map((topic) => (
            <li key={topic.id}>
              <Link
                href={`/topics/${topic.id}`}
                className="group block h-full rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:border-purple-500/30 hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs text-zinc-500 truncate">
                    {topic.id.replace("-", "_")}.
                  </span>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-mono border ${complexityStyles[topic.complexity]}`}
                  >
                    {complexityLabels[topic.complexity]}
                  </span>
                </div>
                <h3 className="font-semibold text-zinc-100 group-hover:text-purple-300 transition-colors">
                  {topic.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-500 line-clamp-2">
                  {topic.subtitle}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-mono text-purple-400/90 group-hover:text-purple-300">
                  Open
                  <span aria-hidden>→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-center text-zinc-600 text-xs font-mono">
          Phase 2–3 · OS / Networks / DB / Papers — coming soon
        </p>
      </div>
    </section>
  );
}
