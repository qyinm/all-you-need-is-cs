import type { BookOutlineItem, Topic } from "@/lib/topics";

/** Last resort if a section id is missing from the tables below. */
function fallback(topic: Topic, section: BookOutlineItem): string[] {
  return [
    `${section.label} (${section.title}) appears in ${topic.bookChapter} of Horowitz, Sahni, and Anderson-Freed’s text. This page should include section-specific notes—if you see this generic text, the content entry may be missing.`,
    "Compare with the book for full definitions, figures, and exercises; use the lab on this page when one is provided.",
  ];
}

const BASIC_CONCEPTS: Record<string, string[]> = {
  "1-1": [
    "Developing software follows a life cycle: specification, design, implementation, and verification. Data structures enter as soon as we commit to how data is stored and accessed.",
    "This chapter frames later material: we always trade clarity, correctness, and resource use when choosing a representation.",
  ],
  "1-2": [
    "An algorithm is a finite sequence of unambiguous steps that transforms inputs into outputs for a well-stated problem.",
    "Good specifications name inputs and outputs, state preconditions and postconditions, and leave room to compare different implementations fairly.",
  ],
  "1-2-2": [
    "Recursion expresses a problem in terms of smaller instances of the same problem, with base cases that stop the descent.",
    "Each recursive call should make progress toward a base case; otherwise you risk infinite recursion and stack overflow.",
  ],
  "1-3": [
    "Data abstraction separates the allowed operations of an abstract data type (ADT) from the concrete representation that implements them.",
    "Clients reason about behavior through the ADT interface; implementers can swap structures without breaking correct client code.",
  ],
  "1-4": [
    "Performance analysis asks how time and space requirements grow with input size, often before any benchmarking.",
    "Reasoning about worst-, average-, and best-case behavior helps compare algorithms independently of a particular machine.",
  ],
  "1-4-1": [
    "Space complexity counts extra memory beyond the input—recursion depth, temporary arrays, and auxiliary data structures all matter.",
    "Some algorithms trade time for space, or the reverse; the textbook emphasizes asymptotic growth of that footprint.",
  ],
  "1-4-2": [
    "Time complexity counts dominant operations—comparisons, assignments, pointer updates—as a function of problem size.",
    "Tight bounds and asymptotic notation summarize how run time scales when inputs grow large.",
  ],
  "1-4-3": [
    "Big-O, Ω, and Θ describe upper, lower, and tight growth rates; little-o and little-ω refine strict comparisons.",
    "These tools summarize behavior without hiding constants that still matter in small or resource-constrained settings.",
  ],
  "1-5": [
    "Measurement complements analysis: timing real runs can expose caching, system load, and implementation details asymptotics ignore.",
    "Use experiments to validate models and to choose between implementations whose asymptotics match.",
  ],
};

const ARRAYS: Record<string, string[]> = {
  "2-1": [
    "An array ADT exposes linearly ordered elements with random access by index. The textbook contrasts logical operations (create, retrieve, store, length) with how C lays out contiguous memory.",
    "Use the lab to practice insert, delete, and access on a small vector—the same ideas underpin static and dynamic array implementations.",
  ],
  "2-2": [
    "Structures (records) group heterogeneous fields with named components; unions share storage among alternatives when only one interpretation is active.",
    "Arrays of structures appear everywhere in matrix and table code; alignment and padding affect real memory footprints.",
  ],
  "2-3": [
    "Sparse matrices store mostly-zero data efficiently by recording only nonzero positions—often as triples (row, col, value) or linked structures.",
    "Choosing a representation depends on the sparsity pattern and whether you need fast row, column, or random access.",
  ],
  "2-4": [
    "Multidimensional arrays can be stored in row-major or column-major order in a single block; index formulas map logical (i, j, …) to a linear offset.",
    "The choice interacts with cache performance and with how languages define multidimensional indexing.",
  ],
  "2-5": [
    "The string ADT treats sequences of characters with operations such as length, concat, compare, and substring. Implementations range from fixed arrays to dynamic buffers.",
    "C’s null-terminated strings are one representation; the text also motivates more abstract string APIs.",
  ],
};

const STACK_QUEUE: Record<string, string[]> = {
  "3-1": [
    "Stacks and queues restrict insertion and deletion to ends of a sequence, which yields simple invariants and O(1) time behavior for the core operations.",
    "Both appear as building blocks for parsing, scheduling, graph algorithms, and simulations.",
  ],
  "3-2": [
    "A stack is last-in, first-out (LIFO): push adds at the top, pop removes from the top. The ADT hides whether you use an array or a linked list underneath.",
    "The lab focuses on stack operations—trace how recursion uses an implicit call stack as you read the book.",
  ],
  "3-3": [
    "A queue is first-in, first-out (FIFO): enqueue adds at the rear, dequeue removes from the front. Circular-array implementations avoid shifting elements.",
    "Use the queue lab to see FIFO behavior; compare it mentally with the stack lab’s LIFO discipline.",
  ],
  "3-4": [
    "Evaluating arithmetic expressions involves precedence and associativity. Infix notation needs parentheses or rules; compilers often convert to postfix (RPN) for one-pass evaluation.",
    "Stacks hold operators or intermediate values while you scan tokens—this section ties grammar to concrete algorithms.",
  ],
  "3-4-2": [
    "Postfix (Reverse Polish) expressions can be evaluated with a single operand stack: scan left-to-right, push numbers, and on each operator apply it to the top stack values.",
    "The lab stack mirrors that process; step through postfix traces from the text alongside the visualization.",
  ],
  "3-5": [
    "Maze solving is a classic depth-first pattern: try a move, push state, backtrack on dead ends by popping. A stack (explicit or recursive) records the current path.",
    "Relate the maze discussion to DFS on graphs in a later chapter—the same skeleton appears in many search problems.",
  ],
  "3-6": [
    "When multiple stacks or queues share one array, you can grow pointers from both ends or partition the array carefully to avoid overflow.",
    "The trade-off is simplicity versus utilization; reallocation or linked structures become necessary when fixed partitions are too rigid.",
  ],
};

const LINKED_LIST: Record<string, string[]> = {
  "4-1": [
    "Pointers name storage that lives outside the fixed layout of an array; dynamic allocation lets structures grow and shrink at runtime.",
    "Careful handling of allocation, initialization, and free/return avoids leaks and dangling references.",
  ],
  "4-2": [
    "A singly linked list threads nodes with one next pointer; insert and delete rewrite a few links instead of shifting an entire array.",
    "The lab lets you insert, delete, and search—watch how head updates and edge cases mirror the textbook’s diagrams.",
  ],
  "4-3": [
    "Polynomials can be stored as linked lists of terms (exponent, coefficient), often sorted by exponent for efficient add and multiply.",
    "Sparse polynomials benefit most; dense ones may still favor arrays when degree is small and known.",
  ],
  "4-4": [
    "In a circular list, the tail points back to the head, which simplifies round-robin iterators and certain buffer implementations.",
    "Deletion and traversal need a clear policy to avoid infinite loops—often a sentinel or a counted walk.",
  ],
  "4-5": [
    "Beyond basic insert/delete, lists support concatenate, reverse, split, and multi-list algorithms; complexity hinges on whether you have tail pointers or length metadata.",
    "Many exercises reduce to careful pointer rewiring without special cases if you use dummy head nodes.",
  ],
  "4-6": [
    "Equivalence relations partition a set into disjoint classes; list representations can merge classes when you discover new equivalences.",
    "The text connects this to union/find style structures that reappear with trees in later chapters.",
  ],
  "4-7": [
    "Sparse matrices reappear with linked representations—orthogonal lists link nodes along rows and columns for flexible nonzero storage.",
    "Choosing array-based vs. linked sparse forms depends on fill patterns and whether structure changes dynamically.",
  ],
  "4-8": [
    "Doubly linked nodes carry next and prev pointers, so you can delete an interior node or insert before a node given only its address.",
    "Enable the doubly mode in the lab to see bidirectional links; insertion and deletion mirror the singly list cases with symmetric updates.",
  ],
};

const TREES: Record<string, string[]> = {
  "5-1": [
    "A tree generalizes lists to hierarchical data: a root with subtrees, parent/child relationships, depth, height, and ordered vs. unordered variants.",
    "Representations include first-child/next-sibling links, parent arrays, and explicit edge lists—each suits different navigation patterns.",
  ],
  "5-2": [
    "A binary tree restricts nodes to at most two children, labeled left and right. Full, complete, and height-balanced shapes have strict counting properties.",
    "Array storage works for heaps; linked nodes are flexible when the tree is irregular.",
  ],
  "5-3": [
    "Traversals—preorder, inorder, postorder, level-order—visit every node once in a disciplined order. Inorder on a BST visits keys sorted order.",
    "The tree lab animates traversals on a fixed example; compare the visit order with the textbook’s trace tables.",
  ],
  "5-4": [
    "Additional operations include computing size, height, mirroring, copying, and threading for iterators. Many are elegant recursive templates.",
    "Iterative versions use explicit stacks or parent pointers when recursion depth is a concern.",
  ],
  "5-5": [
    "Threaded trees store successor/predecessor hints in null child links to accelerate inorder walks without a stack or recursion.",
    "The bit overhead buys O(1) next-step time after setup; maintenance is trickier on insert and delete.",
  ],
  "5-6": [
    "A heap is a complete binary tree with the heap order property (min-heap or max-heap). It underlies priority queues and heap sort.",
    "The heap lab shows sift-up and sift-down; array indexing maps parent/child positions without explicit pointers.",
  ],
  "5-7": [
    "A binary search tree orders keys so inorder traversal is sorted; search, insert, and delete follow a single path from the root.",
    "Degenerate shapes behave like lists; balanced variants in Ch. 10 restore logarithmic height guarantees.",
  ],
  "5-8": [
    "Selection trees help k-way merging by keeping partial winners in a tree structure—useful in external sorting and multi-stream algorithms.",
    "They illustrate how auxiliary tree structures reduce repeated comparisons.",
  ],
  "5-9": [
    "A forest is a collection of disjoint trees; converting to a single binary tree (left-child/right-sibling) often simplifies algorithms.",
    "Union on forests links roots and is a preview of union/find optimizations.",
  ],
  "5-10": [
    "Set representation with union–find supports merge and query operations; path compression and union by rank keep operations nearly constant amortized.",
    "The text builds intuition before the more formal amortized analysis in later chapters.",
  ],
  "5-11": [
    "Catalan numbers count distinct binary tree shapes with n nodes; related bijections appear in parsing and combinatorics.",
    "The closed form and recurrence give a sandbox for induction-style proofs about tree enumeration.",
  ],
};

const GRAPHS: Record<string, string[]> = {
  "6-1": [
    "A graph ADT consists of vertices and edges, directed or undirected, possibly weighted. Operations include add/remove, adjacency queries, and iteration over neighbors.",
    "Choosing dense vs. sparse representations (matrix vs. adjacency lists) drives both space and time of standard algorithms.",
  ],
  "6-2": [
    "Elementary operations include degree computation, edge existence checks, and subgraph extraction. Breadth-first and depth-first search skeletons appear early.",
    "The graph lab emphasizes how visitation orders differ between BFS layers and DFS recursion stacks.",
  ],
  "6-3": [
    "Connected components partition vertices reachability-wise in undirected graphs; DFS or BFS tags a component id per visit.",
    "For directed graphs, strongly connected components need Kosaraju or Tarjan—strictly richer than undirected connectivity.",
  ],
  "6-4": [
    "Minimum spanning tree algorithms (Kruskal, Prim) greedily add safe edges; shortest path algorithms (Dijkstra, Bellman–Ford) relax edges by increasing cost structure.",
    "The lab traces a simplified exploration—pair the visualization with the text’s proof sketches for correctness.",
  ],
  "6-5": [
    "Activity-on-vertex (AOV) networks topological-sort for precedence; activity-on-edge (AOE) networks support critical path analysis.",
    "Longest paths in DAGs combine topological order with edge relaxations—scheduling builds on these templates.",
  ],
};

const SORTING: Record<string, string[]> = {
  "7-1": [
    "Before sorting, verifying whether a list is sorted or locating an element ties linear scan patterns to comparison counts.",
    "The array lab illustrates sequential access patterns; merge the intuition with binary search when data is sorted and random-access.",
  ],
  "7-2": [
    "Insertion sort maintains a sorted prefix and inserts each next element by shifting—or swapping—leftward until order holds. It is simple and adaptive: nearly sorted inputs run fast.",
    "The locked visualization highlights comparisons and swaps as the algorithm walks the array.",
  ],
  "7-3": [
    "Quicksort partitions around a pivot so smaller keys go left, larger go right, then recurses. Average time is Θ(n log n), but pivot choice matters for worst-case.",
    "Watch how partitioning rearranges elements stepwise; contrast stability and memory use with merge sort.",
  ],
  "7-4": [
    "Merge sort divides the range in half, recursively sorts, then merges two sorted runs with a linear-time combine. It is stable and Θ(n log n) worst case but needs Θ(n) extra space for typical array merges.",
    "The step player emphasizes merge combine comparisons; link that with the list-merging ideas from earlier chapters.",
  ],
  "7-5": [
    "Heap sort builds a max-heap, repeatedly extracts the root to the sorted suffix, and sifts down—achieving Θ(n log n) in place with no auxiliary array for merging.",
    "The heap visualization echoes the tree chapter; compare in-place behavior with merge sort’s scratch space.",
  ],
  "7-6": [
    "Radix sort processes digits or character positions with stable bucket passes; when the alphabet size is modest, linear-time sorts emerge under the right models.",
    "Contrast counting-based passes with comparison lower bounds for general sorting.",
  ],
  "7-7": [
    "List and table sorts address linked storage and key-indexed structures where random swaps are expensive or unavailable.",
    "Techniques include pointer rewiring merges, address-calculation sorts, and adaptations of classic algorithms to non-array sequences.",
  ],
  "7-8": [
    "The chapter summary contrasts algorithms by stability, adaptivity, space, and typical vs. worst-case time—use it as a checklist when picking a sort in practice.",
    "No single winner exists: problem size, memory hierarchy, and input distribution drive the choice.",
  ],
  "7-9": [
    "External sorting handles data too large for memory: multiway merge passes, buffer management, and replacement selection shape run lengths on disk.",
    "Theory from internal sorting still informs merge patterns, but I/O cost dominates the engineering story.",
  ],
};

const HASH_TABLE: Record<string, string[]> = {
  "8-1": [
    "The symbol table ADT maps keys to values with search, insert, and delete—the same logical interface appears in compilers, interpreters, and databases.",
    "Abstracting the interface lets you swap hashing, trees, or skip lists without changing client code.",
  ],
  "8-2": [
    "Static hashing fixes the bucket count; a hash function maps keys to buckets, ideally spreading keys uniformly before collisions arise.",
    "Load factor governs expected probes; resizing becomes necessary when tables grow far beyond their design point.",
  ],
  "8-3": [
    "Good hash functions resemble pseudorandom permutations on keys: they amplify small input differences and avoid patterns that cluster buckets.",
    "Practical mixes include multiplicative schemes, polynomial rolling hashes, and cryptographic hashes when stronger properties are needed.",
  ],
  "8-4": [
    "Overflow handling uses chaining (lists in buckets) or open addressing (probing sequences). Each family has different cache behavior and deletion semantics.",
    "The hashing lab visualizes collision resolution—compare separate chaining with linear probing while you read the proofs.",
  ],
  "8-5": [
    "Dynamic hashing grows or shrinks buckets online—extendible hashing splits buckets using a directory; linear hashing avoids a central directory at the cost of more overflow handling.",
    "These structures target databases and file systems where table size is unpredictable.",
  ],
};

const HEAP_CH: Record<string, string[]> = {
  "9-1": [
    "A priority queue orders items by priority: insert and delete-min (or delete-max) dominate. Heaps implement these in logarithmic time on a complete binary tree.",
    "This chapter generalizes the heap preview from trees and sorting into a fuller ADT discussion.",
  ],
  "9-2": [
    "Insertion appends at the next leaf position and bubbles up; deletion swaps root with last leaf, removes the leaf, and sifts down.",
    "The lab duplicates those mechanics; rehearsal here pays off for understanding heap sort and graph algorithms using priority queues.",
  ],
  "9-3": [
    "Min–max heaps support both min- and max-queries; deaps double-ended heaps refine the idea for symmetric access patterns.",
    "They trade implementation complexity for improved bounds on specific operation mixes.",
  ],
  "9-4": [
    "Leftist and binomial heaps offer merge-friendly mergeable heaps with structural invariants beyond the binary array heap.",
    "Amortized bounds often shine when unions of heaps happen frequently.",
  ],
  "9-5": [
    "Fibonacci heaps achieve excellent amortized bounds for decrease-key, which improves theoretical performance of algorithms such as Dijkstra with many relaxations.",
    "Implementation intricacy limits day-to-day use but informs what priority-queue operations can asymptotically achieve.",
  ],
  "9-6": [
    "Amortized analysis aggregates costs over sequences—aggregate, accounting, and potential methods explain why cheap operations can subsidize rare expensive ones.",
    "Fibonacci heap proofs are a flagship example; connect back to union/find analysis in trees.",
  ],
};

const BST_ADV: Record<string, string[]> = {
  "10-1": [
    "Balanced search trees keep height O(log n) so searches and updates stay logarithmic. The chapter surveys several historical and practical designs.",
    "Compare structural rotation ideas across AVL, red-black, and splay variants.",
  ],
  "10-2": [
    "Optimal BSTs minimize expected search cost given key frequencies (and dummy probabilities for misses); dynamic programming fills optimal subtree tables.",
    "The construction differs from self-adjusting online trees—here the distribution is known up front.",
  ],
  "10-3": [
    "AVL trees enforce a balance factor on every node (−1, 0, 1) using rotations after insert or delete. Height stays 1.44 log n in the worst case.",
    "Trace single and double rotations on paper alongside the BST lab’s shape (conceptual, not AVL-specific in code).",
  ],
  "10-4": [
    "2–3 and 2–3–4 trees generalize BST nodes to 2, 3, or 4 children with one, two, or three keys; split and promote rules keep leaves level.",
    "They foreshadow B-trees and red-black equivalence proofs.",
  ],
  "10-5": [
    "Red-black trees encode 2–3–4 invariants in a binary tree with coloring rules; rotations plus recoloring restore balance in O(1) amortized pointer updates per level walked.",
    "Standard library map/set implementations often use red-black balancing.",
  ],
  "10-6": [
    "B-trees widen nodes to thousands of keys, minimizing disk seeks; branching factor tracks block size and cache lines.",
    "Database indexes rely on B+ tree variants that link leaves for range scans.",
  ],
  "10-7": [
    "Splay trees move accessed nodes to the root via rotations without storing extra balance bits; amortized access is logarithmic under the access sequence model.",
    "They excel when queries exhibit locality of reference.",
  ],
  "10-8": [
    "Digital search trees branch on bit or character position in keys, not on full key comparison at every node.",
    "Height tracks key length rather than cardinality alone; interplay with trie structures is tight.",
  ],
  "10-9": [
    "Tries store shared prefixes as overlapping paths; compressed tries collapse unary chains to save space.",
    "Useful for dictionaries, autocomplete, and IP routing—often paired with edge-label compression tricks.",
  ],
};

/** Every phase-1 topic id → section id → paragraphs (English UI). */
const BY_TOPIC: Record<string, Record<string, string[]>> = {
  "basic-concepts": BASIC_CONCEPTS,
  arrays: ARRAYS,
  "stack-queue": STACK_QUEUE,
  "linked-list": LINKED_LIST,
  trees: TREES,
  graphs: GRAPHS,
  sorting: SORTING,
  "hash-table": HASH_TABLE,
  heap: HEAP_CH,
  "binary-search-trees": BST_ADV,
};

export function getSectionProse(topic: Topic, section: BookOutlineItem): string[] {
  const block = BY_TOPIC[topic.id]?.[section.id];
  if (block?.length) return block;
  return fallback(topic, section);
}
