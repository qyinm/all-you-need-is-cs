import type { BookOutlineItem, Topic } from "@/lib/topics";

function fallback(topic: Topic, section: BookOutlineItem): string[] {
  return [
    `${section.label} covers ${section.title.trim().replace(/\.$/, "")} in ${topic.bookChapter} (${topic.title}) of Horowitz, Sahni, and Anderson-Freed.`,
    "Pair this summary with the textbook for definitions and proofs; use the lab when one is available to watch operations unfold.",
  ];
}

/** Richer copy for Ch. 1 — read-first chapter, no sandbox. */
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

export function getSectionProse(topic: Topic, section: BookOutlineItem): string[] {
  if (topic.id === "basic-concepts") {
    return BASIC_CONCEPTS[section.id] ?? fallback(topic, section);
  }
  return fallback(topic, section);
}
