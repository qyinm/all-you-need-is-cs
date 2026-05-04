export type Complexity = "easy" | "medium" | "hard";

export type Topic = {
  id: string;
  title: string;
  subtitle: string;
  complexity: Complexity;
};

export const PHASE1_TOPICS: Topic[] = [
  {
    id: "arrays",
    title: "Arrays & Sorting",
    subtitle:
      "배열의 구조와 정렬 알고리즘이 동작하는 과정을 시각화합니다.",
    complexity: "easy",
  },
  {
    id: "linked-list",
    title: "Linked List",
    subtitle:
      "단일/이중 연결 리스트의 노드 삽입, 삭제, 탐색 과정을 노드-포인터 애니메이션으로 보여줍니다.",
    complexity: "easy",
  },
  {
    id: "stack-queue",
    title: "Stack & Queue",
    subtitle:
      "LIFO와 FIFO의 push/pop, enqueue/dequeue 동작을 시각적으로 비교합니다.",
    complexity: "easy",
  },
  {
    id: "hash-table",
    title: "Hash Table",
    subtitle:
      "해시 함수, 충돌 해결(체이닝), 검색 과정을 단계별로 보여줍니다.",
    complexity: "medium",
  },
  {
    id: "trees",
    title: "Trees & BST",
    subtitle:
      "이진 트리와 BST의 삽입, 삭제, 순회 과정을 재귀적 애니메이션으로 표현합니다.",
    complexity: "medium",
  },
  {
    id: "heap",
    title: "Heap",
    subtitle:
      "Min/Max Heap의 bubble-up과 bubble-down 과정을 완전 이진 트리 위에서 시각화합니다.",
    complexity: "medium",
  },
  {
    id: "graphs",
    title: "Graph Traversal",
    subtitle:
      "그래프의 BFS, DFS, Dijkstra 탐색 과정을 노드-간선 애니메이션으로 보여줍니다.",
    complexity: "hard",
  },
  {
    id: "dp",
    title: "Dynamic Programming",
    subtitle:
      "피보나치, 배낭 문제, N-Queens 백트래킹을 재귀 트리와 DP 테이블로 시각화합니다.",
    complexity: "hard",
  },
];

export function getTopic(id: string): Topic | undefined {
  return PHASE1_TOPICS.find((t) => t.id === id);
}
