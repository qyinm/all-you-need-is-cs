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
    "The lab is a generic LIFO stack—map push/pop to “operands held while you wait for operators” as you read the infix and postfix algorithms in the text; §3.4.2 steps through a concrete RPN eval.",
  ],
  "3-4-2": [
    "Postfix (Reverse Polish) expressions can be evaluated with a single operand stack: scan left-to-right, push numbers, and on each operator apply it to the top stack values.",
    "Use Next token in the lab to replay a short postfix example; each step matches the textbook’s one-stack evaluation pattern.",
  ],
  "3-5": [
    "The mazing problem (classic rat-in-a-maze / DFS on a grid): keep a trial path on a stack, mark visited cells — the usual formulation uses maze[][] where 0 is open and 1 is blocked plus mark[][] so each grid cell is tried at most once.",
    "The companion lab freezes a common four-way tie-break — try moves in order right, then down, then left, then up. Horowitz §3.5 tells the same story; richer variants scan eight compass directions and store (row, col, dir) on each stack frame.",
  ],
  "3-6": [
    "When multiple stacks or queues share one array, you can grow pointers from both ends or partition the array carefully to avoid overflow.",
    "The lab shows two stacks in one vector: left stack grows upward in index, right stack downward until tops meet—that is Horowitz’s classic two-stack picture; queues with two ends use related bookkeeping.",
  ],
};

const LINKED_LIST: Record<string, string[]> = {
  "4-1": [
    "Chapter 4 contrasts sequential allocation (fixed stride, cheap indexed access, expensive arbitrary insert/delete) with linked allocation (nodes anywhere in memory, each with a link to the next).",
    "Classic walkthroughs simulate a chain with parallel data[] and link[] plus first. Inserting “between FAT and HAT” uses four updates: allocate a node, set its data, point its link at the successor, then point the predecessor’s link at the new node—swapping the last two steps breaks the list (common exam question).",
    "Deleting needs the predecessor: use prev/cur (or trail), splitting the head case from interior deletes. The list lab below practices singly linked rewiring.",
  ],
  "4-2": [
    "In C, listNode holds data fields and listPointer link; trail (or the node before x) matters because deleting the head differs from deleting an interior cell.",
    "Insert/delete signatures use listPointer *first when the caller’s head must change; alternatively delete can return the new head for call-by-value call sites.",
  ],
  "4-3": [
    "Instead of stack[N][MAX], linked storage uses an array of tops top[i], each the head of a chain. Linked queues keep front[i] and rear[i]; empty means both NULL (a common textbook pattern).",
    "The lab demonstrates multiple stacks and queues side by side with push/pop and enqueue/dequeue.",
  ],
  "4-4": [
    "Polynomials use polyNode lists with coef, expon, and link; keeping terms sorted by exponent makes padd a single merge-style pass. attach grows the result at the rear by updating a rear pointer.",
    "erase walks the list and frees nodes. The same chapter pattern also mentions recycling nodes through an avail list (get_node/ret_node, cerase) so teardown can be O(1)-ish for circular polynomial lists.",
    "The polynomial visualization is wired to this section (§4.4).",
  ],
  "4-5": [
    "Circular lists use a last pointer: insertFront(last, node) and length walk the ring. The same material also gives invert(lead) with lead/middle/trail pointers reversing links in one pass, and concatenate(ptr1, ptr2) splicing the end of the first list to the second (mutating the first list).",
    "Circular polynomials reuse nodes via get_node/ret_node, cerase, and an avail list. The generic singly linked lab still helps with chain rewiring intuition.",
  ],
  "4-6": [
    "Equivalence relations (reflexive, symmetric, transitive) partition a finite set. A standard worked example uses S = {0,…,11}, sample pairs, and Program 4.22 with seq[], out[], and a stack—O(n+m) for n elements and m pairs.",
    "The lab steps through the same nine pairs as a chalkboard-style trace; when all are merged, classes match {0,2,4,7,11}, {1,3,5}, {6,8,9,10}. (Some outlines place this after §4.8; URLs keep id 4-6.)",
  ],
  "4-7": [
    "Not every chapter table of contents foregrounds sparse matrices; Horowitz-style texts often tuck linked sparse forms near §4.7 (orthogonal lists or triples).",
    "The sparse-matrix lab illustrates nonzero-focused storage.",
  ],
  "4-8": [
    "Singly linked and singly circular lists force a walk from the head to find a predecessor or to delete an arbitrary node you only hold by address. Doubly linked nodes add llink and rlink so neighbors update symmetrically.",
    "The usual dinsert/ddelete patterns in figures for doubly linked lists rewire both directions. Toggle doubly mode in the lab to mirror those updates.",
    "Some printed outlines list §4.8 before §4.6; this app keeps stable § labels while ordering the sidebar for a clearer teaching sequence (see topic outline).",
  ],
};

const TREES: Record<string, string[]> = {
  "5-1": [
    "Chapter 5 starts by contrasting linear structures with tree structures: arrays, stacks, queues, and linked lists move along one dimension, while a tree organizes data hierarchically from a distinguished root.",
    "A tree is a finite nonempty set of nodes with one root; the remaining nodes are partitioned into disjoint subtrees. The lecture uses the usual vocabulary: degree of a node, degree of a tree, leaf, parent, child, sibling, ancestor, descendant, level, and height.",
    "The PDF emphasizes representations before algorithms. General trees can be written in list form where parentheses raise and lower the level, but fixed-size nodes are easier to implement. The left-child/right-sibling representation gives every node two links and shows why every general tree can be rotated into an equivalent degree-two, binary-style representation.",
  ],
  "5-2": [
    "A binary tree is either empty or consists of a root and two disjoint binary trees called the left subtree and right subtree. That empty-tree case, and the left/right order of children, are the main differences from an ordinary tree in this lecture.",
    "The key counting facts are central: level i has at most 2^(i-1) nodes, and a depth-k binary tree has at most 2^k - 1 nodes. In any nonempty binary tree, if n0 is the number of leaves and n2 is the number of degree-two nodes, then n0 = n2 + 1.",
    "A full binary tree of depth k has exactly 2^k - 1 nodes. A complete binary tree fills positions from 1 through n in the corresponding full tree, which enables array storage: parent(i) = floor(i/2), left child = 2i, and right child = 2i + 1 when those indices stay within n. Irregular binary trees use linked nodes with data, leftChild, and rightChild fields.",
  ],
  "5-3": [
    "Traversal is described by the relative order of left subtree (L), node visit (V), and right subtree (R). With left before right, the three standard orders are inorder LVR, preorder VLR, and postorder LRV.",
    "For the PDF's worked tree, the lecture writes examples such as inorder HDIBEAFCG, postorder HIDEBFGCA, preorder ABDHIECFG, and level order ABCDEFGHI. The important habit is to state the visit rule first, then trace the same tree without changing the structure.",
    "Recursive traversal follows a small template: stop at NULL, recurse left or right as required, and print the node at the V position. Iterative inorder simulates recursion with a stack: walk left until NULL, pop and visit the parent, then continue into the right subtree. Level-order traversal uses a queue rather than a stack.",
  ],
  "5-4": [
    "The additional operations in the PDF reuse traversal structure rather than introducing a new data structure. Copying a binary tree allocates a new node for the root, recursively copies the left subtree, and recursively copies the right subtree; NULL children remain NULL.",
    "Testing equality also mirrors the tree shape: two NULL trees are equal, two non-NULL nodes are equal only when their data matches and both left and right subtrees are equal. A node matched against NULL immediately fails.",
    "These functions are useful because they expose the core binary-tree recursion pattern: handle the empty case, do local work, and delegate the same operation to the two subtrees.",
  ],
  "5-5": [
    "A binary tree with n nodes has 2n child links, but only n - 1 of them are real edges, leaving n + 1 NULL links. A threaded binary tree replaces those NULL links with threads to useful inorder neighbors.",
    "The lecture's rule is: if leftChild is NULL, point it to the inorder predecessor; if rightChild is NULL, point it to the inorder successor. Extra tag bits such as leftThread and rightThread distinguish a thread from a real child pointer.",
    "The key operation is insucc: if the right link is a thread, the successor is reached directly; otherwise move to the right child and then as far left as possible. Repeatedly calling insucc performs inorder traversal without recursion or an explicit stack.",
  ],
  "5-6": [
    "The PDF introduces heaps through priority queues: a normal queue is FIFO, but a priority queue removes the item with highest or lowest priority first. Unordered arrays insert in Θ(1) but delete in Θ(n); sorted structures reverse that tradeoff. A heap gives O(log n) insertion and deletion.",
    "A max heap is a complete binary tree that is also a max tree: every node key is no smaller than its children. A min heap is the symmetric version. Because the tree is complete, the implementation uses an array starting at index 1.",
    "Insertion appends the new item at the next leaf and moves it upward while it is larger than its parent in a max heap. Deletion removes the root, places the last element in a temporary variable, repeatedly promotes the larger child downward, and finally stores the temp item. Both operations walk one root-to-leaf path, so their time is O(log2 n).",
  ],
  "5-7": [
    "A binary search tree is a binary tree where each element has a unique key, every key in the left subtree is smaller than the root key, every key in the right subtree is larger, and both subtrees are themselves BSTs.",
    "Search follows one path: compare the target key with the current node, go left if smaller, right if larger, and stop on match or NULL. Insert first performs this search; if the key is absent, the new node is linked at the last comparison point.",
    "Deletion has three cases: remove a leaf, replace a one-child node with its child, or replace a two-child node with either the largest key in the left subtree or the smallest key in the right subtree. Search, insert, and delete are O(h), where h is tree height; sorted insertion can make h = n, which motivates balanced trees such as AVL, 2-3, and red-black trees.",
  ],
  "5-8": [
    "Selection trees solve the k-way merge problem from the lecture example: if eight already ordered sequences must be merged into one ordered sequence, repeatedly scanning all runs costs too many comparisons per output.",
    "A winner tree is a complete binary tree whose leaves represent the current front record of each run, and each internal node stores the smaller winner of its two children. The root therefore identifies the next global minimum.",
    "Initial setup costs O(k). After outputting one record, only the path from that run's leaf to the root must be rebuilt, costing O(log2 k). Merging n total records with k runs therefore costs O(n log2 k) after setup.",
  ],
  "5-9": [
    "This app keeps §5.9 as a stable section even though the attached PDF's contents page jumps from selection trees to §5.10. The closest PDF-backed material is the earlier conversion from general trees to binary trees.",
    "A forest can be viewed as multiple disjoint trees; with the left-child/right-sibling representation, the roots and siblings can be chained using the same two-link node shape used for binary-style trees.",
    "That conversion matters because it lets algorithms written for binary links process ordinary hierarchical data without requiring variable-sized child arrays at every node.",
  ],
  "5-10": [
    "Disjoint sets partition elements 0 through n - 1 into nonoverlapping groups. Find(i) returns the representative set containing i, and Union(i, j) merges two sets.",
    "The lecture represents each set as a tree stored in a parent array. A root has a negative parent value, while a non-root stores the index of its parent. simpleFind follows parent pointers to a root; simpleUnion makes one root point to the other.",
    "The improvement is weighted union: store the negative size at each root and attach the smaller tree under the larger tree. This bounds the height of a weighted-union tree by floor(log2 n) + 1. Collapsing find then compresses every node on the search path directly under the root, making repeated finds much faster.",
  ],
  "5-11": [
    "The current app keeps §5.11 for continuity with the original outline, but the provided PDF ends its Chapter 5 lecture with collapsing find and does not include a counting-binary-trees section.",
    "Use this page as the bridge from the PDF's counting lemmas to the broader textbook topic: level counts, full-tree node counts, and the leaf/internal-node identity are the counting tools that appear explicitly in the slides.",
    "If the full textbook section is added later, this is where Catalan-style counts of distinct binary tree shapes should live; for now, the PDF-backed study target is the earlier property set from §5.2.",
  ],
};

const GRAPHS: Record<string, string[]> = {
  "6-1": [
    "Chapter 6 opens with Euler's Koenigsberg bridge problem, then turns it into graph terminology: vertices, edges, directed edges, paths, cycles, connected components, strongly connected components, degree, in-degree, and out-degree.",
    "The representation choice is the practical point of §6.1. An adjacency matrix answers edge-existence queries immediately but costs n^2 space and usually n^2 scans; adjacency lists store only present edges and make sparse graph work closer to O(n + e).",
    "The text also introduces inverse adjacency lists, orthogonal lists for digraphs, adjacency multilists for undirected graphs where one edge node can live in two vertex lists, and weighted networks where matrix entries or list nodes carry cost.",
  ],
  "6-2": [
    "DFS and BFS are the two traversal patterns in this section. DFS marks a start vertex, recursively follows an unvisited adjacent vertex, and backs up when it reaches a dead end; BFS marks the start vertex, then expands outward by queue layers.",
    "With adjacency lists, each undirected edge contributes two list nodes, so DFS/BFS over a connected component costs O(e) for traversal plus O(n) for outer bookkeeping. With an adjacency matrix, checking each possible neighbor pushes traversal toward O(n^2).",
    "Repeated DFS or BFS calls over still-unvisited vertices produce all connected components. When the graph is connected, the traversed edges form a DFS or BFS spanning tree; the non-tree edges are back edges, and adding one back edge to the tree creates a cycle.",
    "The same section introduces minimum-cost spanning trees through Kruskal's algorithm: consider edges in nondecreasing weight order, accept an edge only if it connects two different components, and use union-find to make the cycle test efficient.",
  ],
  "6-3": [
    "Shortest-path problems in §6.3 use directed weighted graphs, with path length defined as the sum of edge weights. The first target is single-source shortest paths with positive weights.",
    "The textbook presents Dijkstra's method as SHORTEST_PATH: maintain a set S of vertices whose shortest distances are finalized, choose the outside vertex with minimum DIST, then relax outgoing costs through that vertex. With a cost adjacency matrix the running time is O(n^2).",
    "For all-pairs shortest paths, ALL_COSTS is the Floyd-style dynamic program. A(k)(i,j) stores the best i-to-j cost using no intermediate vertex with index greater than k, giving the recurrence min(A(i,j), A(i,k) + A(k,j)) and O(n^3) time.",
    "Transitive closure asks only whether a path exists. A+ records positive-length reachability, while A* is the reflexive transitive closure with the diagonal set to one. The same triple-loop idea works with boolean or/and instead of numeric min/plus.",
  ],
  "6-4": [
    "An AOV network puts activities on vertices and precedence constraints on directed edges. A feasible AOV network must be acyclic; topological order lists each activity after all of its predecessors.",
    "TOPOLOGICAL_ORDER stores each vertex's predecessor count in the head node and uses adjacency lists for outgoing edges. Vertices whose count drops to zero are pushed onto a stack; each output vertex decrements its successors. The whole algorithm is O(n + e).",
    "An AOE network puts activities on edges and events on vertices. Critical path analysis computes earliest event times in topological order, then latest event times in reverse topological order; activities with equal earliest and latest start times are critical.",
    "The book's project-network point is operational: the minimum project duration is the longest start-to-finish path, and only speeding activities that lie on every critical path can reduce that duration.",
  ],
  "6-5": [
    "The final graph section switches from one shortest path to listing simple source-to-destination paths in nondecreasing length. This is useful when the shortest path must also satisfy extra constraints that are hard to encode in edge weights.",
    "The M_SHORTEST sketch starts with the shortest path, partitions the remaining path space by which edge of that path is first excluded while later suffix edges are required, and keeps candidate paths with their include/exclude constraints.",
    "Each iteration prints the currently shortest candidate, partitions the corresponding constrained set, and inserts the new shortest constrained paths into Q. The number of simple paths can grow factorially, so the text analyzes the cost of producing the first m paths rather than all paths.",
    "Using repeated shortest-path computations gives O(mn^3) time for the first m paths in the book's informal analysis; a heap for Q keeps candidate selection from dominating that bound.",
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
