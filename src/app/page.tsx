"use client";

import { useCallback, useEffect, useState } from "react";
import Hero from "@/components/layout/Hero";
import TopicRoadmap from "@/components/layout/TopicRoadmap";
import TopicSection from "@/components/layout/TopicSection";

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

      {/* Topic sections — placeholder UI until viz components are built */}
      {SECTIONS.map((section) => (
        <TopicSection
          key={section.id}
          id={section.id}
          title={section.title}
          subtitle={section.subtitle}
          complexity={section.complexity}
        >
          <div className="bg-surface border border-white/[0.04] rounded-lg p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mb-6">
              <span className="text-3xl font-mono text-purple-400">
                {section.complexity === "easy"
                  ? "◈"
                  : section.complexity === "medium"
                    ? "◇"
                    : "◆"}
              </span>
            </div>
            <p className="text-zinc-500 font-mono text-sm">
              Interactive visualization coming soon...
            </p>
            <p className="text-zinc-600 text-xs mt-2">
              {section.id.replace("-", "_")}.tsx
            </p>
          </div>
        </TopicSection>
      ))}

      {/* Footer */}
      <footer className="py-12 text-center border-t border-white/[0.04]">
        <p className="text-zinc-600 text-sm font-mono">
          All You Need is CS · Phase 1 · Built with Next.js & p5.js
        </p>
      </footer>
    </div>
  );
}