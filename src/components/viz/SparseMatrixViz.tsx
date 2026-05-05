"use client";

import { useCallback, useMemo, useState } from "react";

const N = 8;

type Cell = { r: number; c: number; v: number };

export default function SparseMatrixViz() {
  const [cells, setCells] = useState<Map<string, number>>(() => {
    const m = new Map<string, number>();
    m.set("1-2", 4);
    m.set("2-5", -1);
    m.set("4-1", 7);
    m.set("5-6", 3);
    return m;
  });

  const triples = useMemo(() => {
    const list: Cell[] = [];
    cells.forEach((v, k) => {
      const [r, c] = k.split("-").map(Number);
      list.push({ r, c, v });
    });
    list.sort((a, b) => (a.r !== b.r ? a.r - b.r : a.c - b.c));
    return list;
  }, [cells]);

  const toggle = useCallback((r: number, c: number) => {
    const key = `${r}-${c}`;
    setCells((prev) => {
      const next = new Map(prev);
      if (next.has(key)) next.delete(key);
      else next.set(key, Math.floor(Math.random() * 18) - 9 || 1);
      return next;
    });
  }, []);

  return (
    <div className="space-y-6">
      <p className="text-center text-sm text-body">
        Click a cell to add or remove a nonzero. The list on the right is the sparse triplet
        representation (row, column, value)—the textbook&apos;s typical ADT for sparse
        matrices.
      </p>

      <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-center">
        <div
          className="inline-grid gap-0.5 rounded-lg border border-hairline bg-canvas p-2"
          style={{ gridTemplateColumns: `repeat(${N}, 2rem)` }}
        >
          {Array.from({ length: N }, (_, r) =>
            Array.from({ length: N }, (_, c) => {
              const key = `${r}-${c}`;
              const v = cells.get(key);
              const on = v !== undefined;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggle(r, c)}
                  title={`(${r},${c})`}
                  className={`flex h-8 w-8 items-center justify-center rounded-sm border text-[10px] font-mono ${
                    on
                      ? "border-ink bg-surface-soft text-ink"
                      : "border-hairline bg-canvas text-mute hover:bg-surface-soft"
                  }`}
                >
                  {on ? v : ""}
                </button>
              );
            })
          ).flat()}
        </div>

        <div className="w-full max-w-sm rounded-lg border border-hairline bg-canvas p-4">
          <h3 className="mb-3 font-mono text-xs font-medium uppercase tracking-wide text-mute">
            Triples (row, col, val)
          </h3>
          {triples.length === 0 ? (
            <p className="text-sm text-mute">No nonzero entries—click the grid.</p>
          ) : (
            <ul className="space-y-1.5 font-mono text-sm">
              {triples.map((t) => (
                <li key={`${t.r}-${t.c}`} className="flex justify-between gap-4 text-body">
                  <span className="text-charcoal">
                    ({t.r},{t.c})
                  </span>
                  <span className="text-ink">{t.v}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 border-t border-hairline pt-3 font-mono text-[11px] text-mute">
            Nonzeros: {triples.length} / {N * N}
          </p>
        </div>
      </div>

      <p className="ui-caption text-center">
        Contrast O(n²) dense storage with O(t) triples when t ≪ n².
      </p>
    </div>
  );
}
