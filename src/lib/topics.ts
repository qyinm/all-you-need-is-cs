/**
 * Topic order and titles follow:
 * _Fundamentals of Data Structures in C_, 2nd ed.
 * Ellis Horowitz, Sartaj Sahni, Susan Anderson-Freed (Silicon Press).
 *
 * `outline` lists major **sections** inside each chapter (§x.y), as in the book’s
 * table of contents. Labels follow the text’s numbering; wording is shortened for UI.
 */
export type Complexity = "easy" | "medium" | "hard";

/** One subsection from the book TOC (not a separate route). */
export type BookOutlineItem = {
  /** Section id, e.g. "2-1" — used for anchors on long pages */
  id: string;
  /** e.g. "§2.1" */
  label: string;
  title: string;
};

export type Topic = {
  id: string;
  title: string;
  subtitle: string;
  complexity: Complexity;
  bookChapter: string;
  outline: BookOutlineItem[];
};

export const PHASE1_TOPICS: Topic[] = [
  {
    id: "basic-concepts",
    title: "Basic Concepts",
    subtitle:
      "Algorithm specification, data abstraction, and performance analysis—foundations from Ch. 1 (read-first; no sandbox).",
    complexity: "easy",
    bookChapter: "Ch. 1",
    outline: [
      { id: "1-1", label: "§1.1", title: "Overview; system life cycle" },
      { id: "1-2", label: "§1.2", title: "Algorithm specification" },
      { id: "1-2-2", label: "§1.2.2", title: "Recursive algorithms" },
      { id: "1-3", label: "§1.3", title: "Data abstraction" },
      { id: "1-4", label: "§1.4", title: "Performance analysis" },
      { id: "1-4-1", label: "§1.4.1", title: "Space complexity" },
      { id: "1-4-2", label: "§1.4.2", title: "Time complexity" },
      { id: "1-4-3", label: "§1.4.3", title: "Asymptotic notation" },
      { id: "1-5", label: "§1.5", title: "Performance measurement" },
    ],
  },
  {
    id: "arrays",
    title: "Arrays & Structures",
    subtitle:
      "Sequential storage, indexing, and array representation as in Ch. 2; interactive bars for insert, delete, and access.",
    complexity: "easy",
    bookChapter: "Ch. 2",
    outline: [
      { id: "2-1", label: "§2.1", title: "The array as an abstract data type" },
      { id: "2-2", label: "§2.2", title: "Structures and unions" },
      { id: "2-3", label: "§2.3", title: "The sparse matrix ADT" },
      { id: "2-4", label: "§2.4", title: "Multidimensional array representation" },
      { id: "2-5", label: "§2.5", title: "The string ADT" },
    ],
  },
  {
    id: "stack-queue",
    title: "Stacks & Queues",
    subtitle:
      "LIFO stacks and FIFO queues—Ch. 3—side by side with push/pop and enqueue/dequeue.",
    complexity: "easy",
    bookChapter: "Ch. 3",
    outline: [
      { id: "3-1", label: "§3.1", title: "Introduction" },
      { id: "3-2", label: "§3.2", title: "The stack abstract data type" },
      { id: "3-3", label: "§3.3", title: "The queue abstract data type" },
      { id: "3-4", label: "§3.4", title: "Evaluation of expressions" },
      { id: "3-4-2", label: "§3.4.2", title: "Evaluating postfix expressions" },
      { id: "3-5", label: "§3.5", title: "A mazing problem" },
      { id: "3-6", label: "§3.6", title: "Multiple stacks and queues" },
    ],
  },
  {
    id: "linked-list",
    title: "Linked Lists",
    subtitle:
      "Ch. 4: singly linked lists, C-style chains, linked stacks and queues, polynomials, circular lists and related operations, doubly linked lists, equivalence classes, plus sparse matrices in the usual textbook style (§4.7)—stable section ids and URLs.",
    complexity: "easy",
    bookChapter: "Ch. 4",
    outline: [
      { id: "4-1", label: "§4.1", title: "Singly linked lists" },
      { id: "4-2", label: "§4.2", title: "Representing chains in C" },
      { id: "4-3", label: "§4.3", title: "Linked stacks and queues" },
      { id: "4-4", label: "§4.4", title: "Polynomials" },
      { id: "4-5", label: "§4.5", title: "Additional list operations" },
      { id: "4-8", label: "§4.8", title: "Doubly linked lists" },
      { id: "4-6", label: "§4.6", title: "Equivalence classes" },
      { id: "4-7", label: "§4.7", title: "Sparse matrices (textbook §)" },
    ],
  },
  {
    id: "trees",
    title: "Trees",
    subtitle:
      "Ch. 5 rebuilt from the lecture PDF: tree terminology, binary-tree representations, traversals, threads, heaps, BSTs, selection trees, and union-find.",
    complexity: "medium",
    bookChapter: "Ch. 5",
    outline: [
      { id: "5-1", label: "§5.1", title: "Introduction; terminology; tree representation" },
      { id: "5-2", label: "§5.2", title: "Binary trees" },
      { id: "5-3", label: "§5.3", title: "Binary tree traversals" },
      { id: "5-4", label: "§5.4", title: "Additional binary tree operations" },
      { id: "5-5", label: "§5.5", title: "Threaded binary trees" },
      { id: "5-6", label: "§5.6", title: "Heaps and the heap ADT" },
      { id: "5-7", label: "§5.7", title: "Binary search trees" },
      { id: "5-8", label: "§5.8", title: "Selection trees" },
      { id: "5-9", label: "§5.9", title: "Forests" },
      { id: "5-10", label: "§5.10", title: "Set representation; union–find" },
      { id: "5-11", label: "§5.11", title: "Counting binary trees" },
    ],
  },
  {
    id: "graphs",
    title: "Graphs",
    subtitle:
      "Adjacency-structured graphs and Ch. 6 traversal: BFS, DFS, and Dijkstra-style exploration.",
    complexity: "hard",
    bookChapter: "Ch. 6",
    outline: [
      { id: "6-1", label: "§6.1", title: "The graph abstract data type" },
      { id: "6-2", label: "§6.2", title: "Elementary graph operations" },
      { id: "6-3", label: "§6.3", title: "Connected components" },
      { id: "6-4", label: "§6.4", title: "Minimum-cost spanning trees; shortest paths" },
      { id: "6-5", label: "§6.5", title: "Activity networks (AOV / AOE)" },
    ],
  },
  {
    id: "sorting",
    title: "Sorting",
    subtitle:
      "Internal sorting of Ch. 7—insertion, quick, merge, and heap sort with step-by-step playback where applicable.",
    complexity: "medium",
    bookChapter: "Ch. 7",
    outline: [
      { id: "7-1", label: "§7.1", title: "Searching and list verification" },
      { id: "7-2", label: "§7.2", title: "Insertion sort" },
      { id: "7-3", label: "§7.3", title: "Quick sort" },
      { id: "7-4", label: "§7.4", title: "Merge sort" },
      { id: "7-5", label: "§7.5", title: "Heap sort" },
      { id: "7-6", label: "§7.6", title: "Radix sort" },
      { id: "7-7", label: "§7.7", title: "List and table sorts" },
      { id: "7-8", label: "§7.8", title: "Summary of internal sorting" },
      { id: "7-9", label: "§7.9", title: "External sorting" },
    ],
  },
  {
    id: "hash-table",
    title: "Hashing",
    subtitle:
      "Hash functions, chaining, and table search as in Ch. 8.",
    complexity: "medium",
    bookChapter: "Ch. 8",
    outline: [
      { id: "8-1", label: "§8.1", title: "The symbol table ADT" },
      { id: "8-2", label: "§8.2", title: "Static hashing" },
      { id: "8-3", label: "§8.3", title: "Hash functions" },
      { id: "8-4", label: "§8.4", title: "Overflow handling" },
      { id: "8-5", label: "§8.5", title: "Dynamic hashing" },
    ],
  },
  {
    id: "heap",
    title: "Priority Queues",
    subtitle:
      "Heaps as Ch. 9 priority queues—insert, extract-min/max, and bubble up/down on a complete binary tree.",
    complexity: "medium",
    bookChapter: "Ch. 9",
    outline: [
      { id: "9-1", label: "§9.1", title: "The heap ADT; priority queues" },
      { id: "9-2", label: "§9.2", title: "Insertion and deletion in heaps" },
      { id: "9-3", label: "§9.3", title: "Min–max heaps and deaps" },
      { id: "9-4", label: "§9.4", title: "Leftist trees; binomial heaps" },
      { id: "9-5", label: "§9.5", title: "Fibonacci heaps" },
      { id: "9-6", label: "§9.6", title: "Cost amortization" },
    ],
  },
  {
    id: "binary-search-trees",
    title: "Efficient Binary Search Trees",
    subtitle:
      "BST operations from Ch. 10—search, insert, delete, and path highlighting on ordered keys.",
    complexity: "medium",
    bookChapter: "Ch. 10",
    outline: [
      { id: "10-1", label: "§10.1", title: "Introduction" },
      { id: "10-2", label: "§10.2", title: "Optimal binary search trees" },
      { id: "10-3", label: "§10.3", title: "AVL trees" },
      { id: "10-4", label: "§10.4", title: "2–3 and 2–3–4 trees" },
      { id: "10-5", label: "§10.5", title: "Red-black trees" },
      { id: "10-6", label: "§10.6", title: "B-trees" },
      { id: "10-7", label: "§10.7", title: "Splay trees" },
      { id: "10-8", label: "§10.8", title: "Digital search trees" },
      { id: "10-9", label: "§10.9", title: "Tries" },
    ],
  },
];

export function getTopic(id: string): Topic | undefined {
  return PHASE1_TOPICS.find((t) => t.id === id);
}

/** Resolve one § within a chapter. */
export function getTopicSection(
  topicId: string,
  sectionId: string
): { topic: Topic; section: BookOutlineItem } | undefined {
  const topic = getTopic(topicId);
  if (!topic) return undefined;
  const section = topic.outline.find((s) => s.id === sectionId);
  if (!section) return undefined;
  return { topic, section };
}

/** Prev / next § within the same chapter (no cross-chapter link). */
export function getAdjacentSections(
  topicId: string,
  sectionId: string
): { prev?: BookOutlineItem; next?: BookOutlineItem } {
  const topic = getTopic(topicId);
  if (!topic) return {};
  const idx = topic.outline.findIndex((s) => s.id === sectionId);
  if (idx < 0) return {};
  return {
    prev: idx > 0 ? topic.outline[idx - 1] : undefined,
    next: idx < topic.outline.length - 1 ? topic.outline[idx + 1] : undefined,
  };
}

/** All /topics/[topicId]/[sectionId] pairs for static generation. */
export function getAllTopicSectionParams(): { topicId: string; sectionId: string }[] {
  const out: { topicId: string; sectionId: string }[] = [];
  for (const t of PHASE1_TOPICS) {
    for (const s of t.outline) {
      out.push({ topicId: t.id, sectionId: s.id });
    }
  }
  return out;
}
