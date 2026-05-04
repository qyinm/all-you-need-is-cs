import Hero from "@/components/layout/Hero";
import TopicIndex from "@/components/layout/TopicIndex";
import { PHASE1_TOPICS } from "@/lib/topics";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <TopicIndex topics={PHASE1_TOPICS} />
      <footer className="py-12 text-center border-t border-white/[0.04]">
        <p className="text-zinc-600 text-sm font-mono">
          All You Need is CS · Phase 1 · Built with Next.js &amp; p5.js
        </p>
      </footer>
    </div>
  );
}
