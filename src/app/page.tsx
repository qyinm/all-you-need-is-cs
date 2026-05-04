"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/layout/Hero";
import TopicRoadmap from "@/components/layout/TopicRoadmap";
import TopicSection from "@/components/layout/TopicSection";

// Dynamic imports for visualization components to avoid SSR issues
const ArrayViz = dynamic(() => import("@/components/viz/ArrayViz"), { ssr: false });
const SortingViz = dynamic(() => import("@/components/viz/SortingViz"), { ssr: false });
const LinkedListViz = dynamic(() => import("@/components/viz/LinkedListViz"), { ssr: false });
const StackViz = dynamic(() => import("@/components/viz/StackViz"), { ssr: false });
const QueueViz = dynamic(() => import("@/components/viz/QueueViz"), { ssr: false });
const HashTableViz = dynamic(() => import("@/components/viz/HashTableViz"), { ssr: false });
const TreeViz = dynamic(() => import("@/components/viz/TreeViz"), { ssr: false });
const BSTViz = dynamic(() => import("@/components/viz/BSTViz"), { ssr: false });
const HeapViz = dynamic(() => import("@/components/viz/HeapViz"), { ssr: false });
const GraphViz = dynamic(() => import("@/components/viz/GraphViz"), { ssr: false });
const DPViz = dynamic(() => import("@/components/viz/DPViz"), { ssr: false });
const BacktrackingViz = dynamic(() => import("@/components/viz/BacktrackingViz"), { ssr: false });

const SECTIONS = [
  {
    id: "arrays",
    title: "Arrays & Sorting",
    subtitle: "배열의 구조와 정렬 알고리즘이 동작하는 과정을 시각화합니다.",
    complexity: "easy" as const,
  },
  {
    id: "linked-list",
    title: "Linked List",
    subtitle:
      "단일/이중 연결 리스트의 노드 삽입, 삭제, 탐색 과정을 노드-포인터 애니메이션으로 보여줍니다.",
    complexity: "easy" as const,
  },
  {
    id: "stack-queue",
    title: "Stack & Queue",
    subtitle:
      "LIFO와 FIFO의 push/pop, enqueue/dequeue 동작을 시각적으로 비교합니다.",
    complexity: "easy" as const,
  },
  {
    id: "hash-table",
    title: "Hash Table",
    subtitle: "해시 함수, 충돌 해결(체이닝), 검색 과정을 단계별로 보여줍니다.",
    complexity: "medium" as const,
  },
  {
    id: "trees",
    title: "Trees & BST",
    subtitle:
      "이진 트리와 BST의 삽입, 삭제, 순회 과정을 재귀적 애니메이션으로 표현합니다.",
    complexity: "medium" as const,
  },
  {
    id: "heap",
    title: "Heap",
    subtitle:
      "Min/Max Heap의 bubble-up과 bubble-down 과정을 완전 이진 트리 위에서 시각화합니다.",
    complexity: "medium" as const,
  },
  {
    id: "graphs",
    title: "Graph Traversal",
    subtitle: "그래프의 BFS, DFS, Dijkstra 탐색 과정을 노드-간선 애니메이션으로 보여줍니다.",
    complexity: "hard" as const,
  },
  {
    id: "dp",
    title: "Dynamic Programming",
    subtitle:
      "피보나치, 배낭 문제, N-Queens 백트래킹을 재귀 트리와 DP 테이블로 시각화합니다.",
    complexity: "hard" as const,
  },
];

export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleTopicClick = useCallback((topicId: string) => {
    const el = document.getElementById(topicId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { threshold: 0.3, rootMargin: "-40% 0px -40% 0px" }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col">
      <Hero />

      {/* Roadmap section */}
      <section className="sticky top-0 z-20 bg-surface/80 backdrop-blur-xl border-b border-white/[0.04] py-6">
        <div className="max-w-[1300px] mx-auto px-6">
          <TopicRoadmap
            activeSection={activeSection}
            onTopicClick={handleTopicClick}
          />
        </div>
      </section>

      {/* Topic sections with actual visualizations */}
      <TopicSection
        id="arrays"
        title="Arrays & Sorting"
        subtitle="배열의 구조와 정렬 알고리즘이 동작하는 과정을 시각화합니다."
        complexity="easy"
      >
        <ArrayViz />
      </TopicSection>

      <TopicSection
        id="linked-list"
        title="Linked List"
        subtitle="단일/이중 연결 리스트의 노드 삽입, 삭제, 탐색 과정을 노드-포인터 애니메이션으로 보여줍니다."
        complexity="easy"
      >
        <LinkedListViz />
      </TopicSection>

      <TopicSection
        id="stack-queue"
        title="Stack & Queue"
        subtitle="LIFO와 FIFO의 push/pop, enqueue/dequeue 동작을 시각적으로 비교합니다."
        complexity="easy"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-zinc-200 mb-4">Stack (LIFO)</h3>
            <StackViz />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-200 mb-4">Queue (FIFO)</h3>
            <QueueViz />
          </div>
        </div>
      </TopicSection>

      <TopicSection
        id="hash-table"
        title="Hash Table"
        subtitle="해시 함수, 충돌 해결(체이닝), 검색 과정을 단계별로 보여줍니다."
        complexity="medium"
      >
        <HashTableViz />
      </TopicSection>

      <TopicSection
        id="trees"
        title="Trees & BST"
        subtitle="이진 트리와 BST의 삽입, 삭제, 순회 과정을 재귀적 애니메이션으로 표현합니다."
        complexity="medium"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-zinc-200 mb-4">Binary Tree</h3>
            <TreeViz />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-200 mb-4">Binary Search Tree</h3>
            <BSTViz />
          </div>
        </div>
      </TopicSection>

      <TopicSection
        id="heap"
        title="Heap"
        subtitle="Min/Max Heap의 bubble-up과 bubble-down 과정을 완전 이진 트리 위에서 시각화합니다."
        complexity="medium"
      >
        <HeapViz />
      </TopicSection>

      <TopicSection
        id="graphs"
        title="Graph Traversal"
        subtitle="그래프의 BFS, DFS, Dijkstra 탐색 과정을 노드-간선 애니메이션으로 보여줍니다."
        complexity="hard"
      >
        <GraphViz />
      </TopicSection>

      <TopicSection
        id="dp"
        title="Dynamic Programming"
        subtitle="피보나치, 배낭 문제, N-Queens 백트래킹을 재귀 트리와 DP 테이블로 시각화합니다."
        complexity="hard"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-zinc-200 mb-4">Fibonacci (Memoization)</h3>
            <DPViz />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-200 mb-4">N-Queens & Maze (Backtracking)</h3>
            <BacktrackingViz />
          </div>
        </div>
      </TopicSection>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-white/[0.04]">
        <p className="text-zinc-600 text-sm font-mono">
          All You Need is CS · Phase 1 · Built with Next.js & p5.js
        </p>
      </footer>
    </div>
  );
}