"use client";

import { useMemo, useState } from "react";

/** Worked example pairs on {0,…,11}. Final classes: {0,2,4,7,11}, {1,3,5}, {6,8,9,10}. */
const PAIRS: [number, number][] = [
  [0, 4],
  [3, 1],
  [6, 10],
  [8, 9],
  [7, 4],
  [6, 8],
  [3, 5],
  [2, 11],
  [11, 0],
];

const N = 12;

function find(parent: number[], i: number): number {
  if (parent[i] === i) return i;
  return find(parent, parent[i]);
}

function union(parent: number[], a: number, b: number) {
  const ra = find(parent, a);
  const rb = find(parent, b);
  if (ra !== rb) parent[rb] = ra;
}

export default function EquivalenceClassViz() {
  const [step, setStep] = useState(0);

  const summary = useMemo(() => {
    const p = Array.from({ length: N }, (_, i) => i);
    const applied = Math.min(step, PAIRS.length);
    for (let s = 0; s < applied; s++) {
      union(p, PAIRS[s][0], PAIRS[s][1]);
    }
    const buckets = new Map<number, number[]>();
    for (let i = 0; i < N; i++) {
      const r = find(p, i);
      if (!buckets.has(r)) buckets.set(r, []);
      buckets.get(r)!.push(i);
    }
    for (const arr of buckets.values()) arr.sort((a, b) => a - b);
    return [...buckets.values()].sort((a, b) => a[0] - b[0]);
  }, [step]);

  const reset = () => setStep(0);
  const next = () => setStep((s) => Math.min(PAIRS.length, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const lastPair =
    step > 0 && step <= PAIRS.length ? PAIRS[step - 1] : null;

  return (
    <div className="space-y-5">
      <p className="text-center text-sm text-body">
        Equivalence classes sample: <span className="font-mono">S = {"{0,…,11}"}</span>, merge on each pair{" "}
        <span className="font-mono">⟨i,j⟩</span>. Many texts use Program 4.22 with <span className="font-mono">seq[]</span>,{" "}
        <span className="font-mono">out[]</span>, and a stack; this lab shows the same unions with a parent forest (all
        nine pairs ⇒ the three final classes).
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" className="ui-btn-secondary" onClick={prev} disabled={step === 0}>
          ← Back
        </button>
        <button type="button" className="ui-btn-primary" onClick={next} disabled={step >= PAIRS.length}>
          Next pair →
        </button>
        <button type="button" className="ui-btn-secondary" onClick={reset}>
          Reset
        </button>
      </div>

      <p className="text-center font-mono text-sm text-ink">
        Pairs merged: {step} / {PAIRS.length}
        {lastPair && (
          <>
            {" "}
            · last{" "}
            <span className="text-body">
              ⟨{lastPair[0]},{lastPair[1]}⟩
            </span>
          </>
        )}
        {step >= PAIRS.length && <span className="text-body"> · done</span>}
      </p>

      <div className="mx-auto max-w-xl rounded-lg border border-hairline bg-canvas p-4">
        <h3 className="mb-3 font-mono text-xs font-medium uppercase tracking-wide text-mute">
          Equivalence classes (connected components)
        </h3>
        <div className="flex flex-wrap gap-2">
          {summary.map((group) => (
            <span
              key={group.join("-")}
              className="rounded-full border border-hairline bg-surface-soft px-3 py-1 font-mono text-xs text-body"
            >
              {"{"}
              {group.join(", ")}
              {"}"}
            </span>
          ))}
        </div>
      </div>

      <p className="ui-caption text-center">
        Without path compression this is a teaching trace only; the second phase of the classic stack-based procedure
        matches these groupings for the fixed pair list.
      </p>
    </div>
  );
}
