"use client";

import { useMemo, useState } from "react";

const ROWS = 3;
const COLS = 4;

function valueAt(i: number, j: number) {
  return i * COLS + j + 1;
}

function linearIndex(order: "row" | "col", i: number, j: number) {
  return order === "row" ? i * COLS + j : j * ROWS + i;
}

export default function MultidimArrayViz() {
  const [order, setOrder] = useState<"row" | "col">("row");
  const [selected, setSelected] = useState<{ i: number; j: number } | null>(null);

  const traversal = useMemo(() => {
    const cells: { i: number; j: number; k: number }[] = [];
    if (order === "row") {
      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          cells.push({ i, j, k: i * COLS + j });
        }
      }
    } else {
      for (let j = 0; j < COLS; j++) {
        for (let i = 0; i < ROWS; i++) {
          cells.push({ i, j, k: j * ROWS + i });
        }
      }
    }
    return cells;
  }, [order]);

  const selK = selected
    ? linearIndex(order, selected.i, selected.j)
    : null;
  const selKOther = selected
    ? (order === "row"
        ? selected.j * ROWS + selected.i
        : selected.i * COLS + selected.j)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setOrder("row")}
          className={order === "row" ? "ui-btn-primary" : "ui-btn-secondary"}
        >
          Row-major (C default)
        </button>
        <button
          type="button"
          onClick={() => setOrder("col")}
          className={order === "col" ? "ui-btn-primary" : "ui-btn-secondary"}
        >
          Column-major (Fortran)
        </button>
      </div>

      <p className="text-center font-mono text-xs leading-relaxed text-body md:text-sm">
        {order === "row" ? (
          <>
            <span className="text-ink">k = i × {COLS} + j</span>
            <span className="text-mute"> · traverse row by row</span>
          </>
        ) : (
          <>
            <span className="text-ink">k = j × {ROWS} + i</span>
            <span className="text-mute"> · traverse column by column</span>
          </>
        )}
      </p>

      <div className="flex justify-center">
        <div
          className="inline-grid gap-1 rounded-lg border border-hairline bg-canvas p-3"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(3.5rem, 1fr))` }}
        >
          {Array.from({ length: ROWS }, (_, i) =>
            Array.from({ length: COLS }, (_, j) => {
              const on = selected?.i === i && selected?.j === j;
              return (
                <button
                  key={`${i}-${j}`}
                  type="button"
                  onClick={() => setSelected({ i, j })}
                  className={`flex min-h-[3.5rem] flex-col items-center justify-center rounded-md border px-2 py-2 font-mono text-sm transition-colors ${
                    on
                      ? "border-ink bg-surface-soft text-ink"
                      : "border-hairline bg-canvas text-body hover:bg-surface-soft"
                  }`}
                >
                  <span className="text-[11px] text-mute">
                    ({i},{j})
                  </span>
                  <span className="font-medium text-ink">{valueAt(i, j)}</span>
                </button>
              );
            })
          ).flat()}
        </div>
      </div>

      {selected && (
        <p className="text-center text-sm text-body">
          At ({selected.i},{selected.j}):{" "}
          <span className="font-mono font-medium text-ink">
            {order === "row" ? "row-major" : "column-major"} k = {selK}
          </span>
          <span className="text-mute"> · other layout would use k = {selKOther}</span>
        </p>
      )}

      <div>
        <p className="mb-2 text-center font-mono text-xs uppercase tracking-wide text-mute">
          Linear storage (traversal order)
        </p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {traversal.map(({ i, j, k }) => (
            <div
              key={`${order}-${k}`}
              className="flex min-w-[2.75rem] flex-col items-center rounded border border-hairline bg-surface-soft px-2 py-1.5 font-mono"
            >
              <span className="text-[10px] text-mute">k={k}</span>
              <span className="text-sm text-ink">{valueAt(i, j)}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="ui-caption text-center">
        {ROWS}×{COLS} logical matrix; same cells, two different linearizations (cache and SIMD
        layouts often assume one convention).
      </p>
    </div>
  );
}
