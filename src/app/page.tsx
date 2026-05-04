import Hero from "@/components/layout/Hero";
import TopicIndex from "@/components/layout/TopicIndex";
import { PHASE1_TOPICS } from "@/lib/topics";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <TopicIndex topics={PHASE1_TOPICS} />
      <footer className="border-t border-hairline px-6 py-8 text-center">
        <p className="font-mono text-xs leading-[1.33] text-body">
          All You Need is CS · Phase 1 · Built with Next.js &amp; p5.js
        </p>
      </footer>
    </div>
  );
}
