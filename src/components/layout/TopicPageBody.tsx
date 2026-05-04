"use client";

import dynamic from "next/dynamic";
import BasicConceptsProse from "@/components/layout/BasicConceptsProse";
import TopicSection from "@/components/layout/TopicSection";
import type { Topic } from "@/lib/topics";

const ArrayViz = dynamic(() => import("@/components/viz/ArrayViz"), {
  ssr: false,
});
const SortingViz = dynamic(() => import("@/components/viz/SortingViz"), {
  ssr: false,
});
const LinkedListViz = dynamic(
  () => import("@/components/viz/LinkedListViz"),
  { ssr: false }
);
const StackViz = dynamic(() => import("@/components/viz/StackViz"), {
  ssr: false,
});
const QueueViz = dynamic(() => import("@/components/viz/QueueViz"), {
  ssr: false,
});
const HashTableViz = dynamic(() => import("@/components/viz/HashTableViz"), {
  ssr: false,
});
const TreeViz = dynamic(() => import("@/components/viz/TreeViz"), {
  ssr: false,
});
const BSTViz = dynamic(() => import("@/components/viz/BSTViz"), {
  ssr: false,
});
const HeapViz = dynamic(() => import("@/components/viz/HeapViz"), {
  ssr: false,
});
const GraphViz = dynamic(() => import("@/components/viz/GraphViz"), {
  ssr: false,
});

export default function TopicPageBody({ topic }: { topic: Topic }) {
  const { id, title, subtitle, complexity, bookChapter } = topic;

  const inner = (() => {
    switch (id) {
      case "basic-concepts":
        return <BasicConceptsProse />;
      case "arrays":
        return <ArrayViz />;
      case "sorting":
        return <SortingViz />;
      case "linked-list":
        return <LinkedListViz />;
      case "stack-queue":
        return (
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 font-display text-[20px] font-medium text-ink">
                Stack (LIFO)
              </h3>
              <StackViz />
            </div>
            <div>
              <h3 className="mb-4 font-display text-[20px] font-medium text-ink">
                Queue (FIFO)
              </h3>
              <QueueViz />
            </div>
          </div>
        );
      case "hash-table":
        return <HashTableViz />;
      case "trees":
        return <TreeViz />;
      case "binary-search-trees":
        return <BSTViz />;
      case "heap":
        return <HeapViz />;
      case "graphs":
        return <GraphViz />;
      default:
        return null;
    }
  })();

  return (
    <TopicSection
      id={id}
      title={title}
      subtitle={subtitle}
      complexity={complexity}
      bookChapter={bookChapter}
      outline={topic.outline}
    >
      {inner}
    </TopicSection>
  );
}
