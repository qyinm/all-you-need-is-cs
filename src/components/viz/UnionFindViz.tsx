"use client";

import { useCallback, useMemo, useState } from "react";

const N = 8;

function findRoot(parent: number[], i: number): number {
  let p = i;
  while (parent[p] !== p) {
    p = parent[p];
  }
  return p;
}

export default function UnionFindViz() {
  const [parent, setParent] = useState<number[]>(() =>
    Array.from({ length: N }, (_, i) => i)
  );

  const clusters = useMemo(() => {
    const m = new Map<number, number[]>();
    for (let i = 0; i < N; i++) {
      const root = findRoot(parent, i);
      if (!m.has(root)) m.set(root, []);
      m.get(root)!.push(i);
    }
    for (const arr of m.values()) arr.sort((a, b) => a - b);
    return m;
  }, [parent]);

  const unite = useCallback((a: number, b: number) => {
    setParent((prev) => {
      const p = [...prev];
      const ra = findRoot(p, a);
      const rb = findRoot(p, b);
      if (ra === rb) return prev;
      p[rb] = ra;
      return p;
    });
  }, []);

  const reset = () =>
    setParent(Array.from({ length: N }, (_, i) => i));

  return (
    <div className="space-y-6">
      <p className="text-center text-sm text-body">
        Disjoint sets: each element points to a parent until the representative (self-loop). Union
        attaches one root under another—§5.10 preview; path compression can flatten on find.
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" onClick={reset} className="ui-btn-secondary">
          Reset (all separate)
        </button>
        <button type="button" onClick={() => unite(0, 1)} className="ui-btn-secondary-sm">
          Union 0–1
        </button>
        <button type="button" onClick={() => unite(2, 3)} className="ui-btn-secondary-sm">
          Union 2–3
        </button>
        <button type="button" onClick={() => unite(1, 3)} className="ui-btn-secondary-sm">
          Union 1–3
        </button>
        <button type="button" onClick={() => unite(4, 5)} className="ui-btn-secondary-sm">
          Union 4–5
        </button>
        <button type="button" onClick={() => unite(6, 7)} className="ui-btn-secondary-sm">
          Union 6–7
        </button>
        <button type="button" onClick={() => unite(0, 6)} className="ui-btn-secondary-sm">
          Union 0–6
        </button>
      </div>

      <div className="mx-auto max-w-2xl overflow-x-auto rounded-lg border border-hairline bg-surface-soft p-4">
        <h3 className="mb-3 font-mono text-xs font-medium uppercase tracking-wide text-mute">
          parent[i] (tree edges i → parent[i])
        </h3>
        <div className="flex flex-wrap justify-center gap-2 font-mono text-xs sm:text-sm">
          {parent.map((pr, i) => (
            <div
              key={i}
              className="flex min-w-[3.5rem] flex-col items-center rounded border border-hairline bg-canvas px-2 py-1.5"
            >
              <span className="text-mute">i={i}</span>
              <span className="text-ink">→ {pr}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-center font-mono text-xs uppercase tracking-wide text-mute">
          Components
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[...clusters.entries()].map(([root, members]) => (
            <span
              key={root}
              className="rounded-full border border-hairline bg-canvas px-3 py-1 font-mono text-xs text-body"
            >
              root {root}: {members.join(", ")}
            </span>
          ))}
        </div>
      </div>

      <p className="ui-caption text-center">
        Quick union: attach roots only; repeated unions merge whole sets. Rank/size heuristics
        keep trees shallow in the full algorithm.
      </p>
    </div>
  );
}
