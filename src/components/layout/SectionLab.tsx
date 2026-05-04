"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const ArrayViz = dynamic(() => import("@/components/viz/ArrayViz"), { ssr: false });
const SortingViz = dynamic(() => import("@/components/viz/SortingViz"), { ssr: false });
const LinkedListViz = dynamic(() => import("@/components/viz/LinkedListViz"), {
  ssr: false,
});
const StackViz = dynamic(() => import("@/components/viz/StackViz"), { ssr: false });
const QueueViz = dynamic(() => import("@/components/viz/QueueViz"), { ssr: false });
const HashTableViz = dynamic(() => import("@/components/viz/HashTableViz"), {
  ssr: false,
});
const TreeViz = dynamic(() => import("@/components/viz/TreeViz"), { ssr: false });
const BSTViz = dynamic(() => import("@/components/viz/BSTViz"), { ssr: false });
const HeapViz = dynamic(() => import("@/components/viz/HeapViz"), { ssr: false });
const GraphViz = dynamic(() => import("@/components/viz/GraphViz"), { ssr: false });

function StackQueuePair() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <h3 className="mb-4 font-display text-[20px] font-medium text-ink">Stack (LIFO)</h3>
        <StackViz />
      </div>
      <div>
        <h3 className="mb-4 font-display text-[20px] font-medium text-ink">Queue (FIFO)</h3>
        <QueueViz />
      </div>
    </div>
  );
}

function labNode(topicId: string, sectionId: string): ReactNode | null {
  switch (topicId) {
    case "basic-concepts":
      return null;
    case "arrays":
      return <ArrayViz />;
    case "stack-queue":
      if (sectionId === "3-2" || sectionId === "3-4-2" || sectionId === "3-5") {
        return <StackViz />;
      }
      if (sectionId === "3-3") {
        return <QueueViz />;
      }
      return <StackQueuePair />;
    case "linked-list":
      return <LinkedListViz initialDoubly={sectionId === "4-8"} />;
    case "trees":
      if (sectionId === "5-6") return <HeapViz />;
      if (sectionId === "5-7") return <BSTViz />;
      return <TreeViz />;
    case "graphs":
      return <GraphViz />;
    case "sorting":
      if (sectionId === "7-1") return <ArrayViz />;
      if (sectionId === "7-2") {
        return <SortingViz initialAlgorithm="insertion" lockAlgorithm />;
      }
      if (sectionId === "7-3") {
        return <SortingViz initialAlgorithm="quick" lockAlgorithm />;
      }
      if (sectionId === "7-4") {
        return <SortingViz initialAlgorithm="merge" lockAlgorithm />;
      }
      if (sectionId === "7-5") return <HeapViz />;
      return null;
    case "hash-table":
      return <HashTableViz />;
    case "heap":
      return <HeapViz />;
    case "binary-search-trees":
      return <BSTViz />;
    default:
      return null;
  }
}

export default function SectionLab({
  topicId,
  sectionId,
}: {
  topicId: string;
  sectionId: string;
}) {
  const node = labNode(topicId, sectionId);
  if (node) return <div className="ui-terminal-panel">{node}</div>;
  if (topicId === "basic-concepts") return null;
  return (
    <p className="border-t border-hairline pt-8 text-center text-sm text-mute">
      No interactive visualization for this section—continue with the textbook or adjacent § links.
    </p>
  );
}
