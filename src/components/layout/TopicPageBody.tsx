"use client";

import dynamic from "next/dynamic";
import TopicSection from "@/components/layout/TopicSection";
import type { Topic } from "@/lib/topics";

const ArrayViz = dynamic(() => import("@/components/viz/ArrayViz"), {
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
const DPViz = dynamic(() => import("@/components/viz/DPViz"), {
  ssr: false,
});
const BacktrackingViz = dynamic(
  () => import("@/components/viz/BacktrackingViz"),
  { ssr: false }
);

export default function TopicPageBody({ topic }: { topic: Topic }) {
  const { id, title, subtitle, complexity } = topic;

  const inner = (() => {
    switch (id) {
      case "arrays":
        return <ArrayViz />;
      case "linked-list":
        return <LinkedListViz />;
      case "stack-queue":
        return (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-zinc-200 mb-4">
                Stack (LIFO)
              </h3>
              <StackViz />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-200 mb-4">
                Queue (FIFO)
              </h3>
              <QueueViz />
            </div>
          </div>
        );
      case "hash-table":
        return <HashTableViz />;
      case "trees":
        return (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-zinc-200 mb-4">
                Binary Tree
              </h3>
              <TreeViz />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-200 mb-4">
                Binary Search Tree
              </h3>
              <BSTViz />
            </div>
          </div>
        );
      case "heap":
        return <HeapViz />;
      case "graphs":
        return <GraphViz />;
      case "dp":
        return (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-zinc-200 mb-4">
                Fibonacci (Memoization)
              </h3>
              <DPViz />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-200 mb-4">
                N-Queens &amp; Maze (Backtracking)
              </h3>
              <BacktrackingViz />
            </div>
          </div>
        );
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
    >
      {inner}
    </TopicSection>
  );
}
