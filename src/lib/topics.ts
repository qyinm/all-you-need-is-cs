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
      "Visualize how arrays work and how sorting algorithms transform elements step by step.",
    complexity: "easy",
  },
  {
    id: "linked-list",
    title: "Linked List",
    subtitle:
      "Watch singly and doubly linked lists with node–pointer animations for insert, delete, and search.",
    complexity: "easy",
  },
  {
    id: "stack-queue",
    title: "Stack & Queue",
    subtitle:
      "Compare LIFO and FIFO side by side with push/pop and enqueue/dequeue.",
    complexity: "easy",
  },
  {
    id: "hash-table",
    title: "Hash Table",
    subtitle:
      "Step through hash functions, chaining for collisions, and lookups.",
    complexity: "medium",
  },
  {
    id: "trees",
    title: "Trees & BST",
    subtitle:
      "Binary trees and BSTs: insert, delete, and traversals shown with recursive-style animation.",
    complexity: "medium",
  },
  {
    id: "heap",
    title: "Heap",
    subtitle:
      "Min/max heaps on a complete binary tree with bubble-up and bubble-down.",
    complexity: "medium",
  },
  {
    id: "graphs",
    title: "Graph Traversal",
    subtitle:
      "BFS, DFS, and Dijkstra on a graph with node–edge highlighting.",
    complexity: "hard",
  },
  {
    id: "dp",
    title: "Dynamic Programming",
    subtitle:
      "Fibonacci, knapsack-style recursion, and N-Queens backtracking via call trees and DP tables.",
    complexity: "hard",
  },
];

export function getTopic(id: string): Topic | undefined {
  return PHASE1_TOPICS.find((t) => t.id === id);
}
