"use client";

import { useCallback, useState } from "react";

const CAP = 10;
/** Indices 0..leftTop belong to stack A (left); rightTop..CAP-1 belong to stack B (right). */
type State = {
  cells: (number | null)[];
  leftTop: number;
  rightTop: number;
};

const emptyCells = (): (number | null)[] => Array.from({ length: CAP }, () => null);

export default function DualStackArrayViz() {
  const [s, setS] = useState<State>({
    cells: emptyCells(),
    leftTop: -1,
    rightTop: CAP,
  });

  const pushLeft = useCallback(() => {
    setS((prev) => {
      if (prev.leftTop + 1 >= prev.rightTop) return prev;
      const cells = [...prev.cells];
      const nt = prev.leftTop + 1;
      cells[nt] = Math.floor(Math.random() * 90) + 10;
      return { cells, leftTop: nt, rightTop: prev.rightTop };
    });
  }, []);

  const popLeft = useCallback(() => {
    setS((prev) => {
      if (prev.leftTop < 0) return prev;
      const cells = [...prev.cells];
      cells[prev.leftTop] = null;
      return { cells, leftTop: prev.leftTop - 1, rightTop: prev.rightTop };
    });
  }, []);

  const pushRight = useCallback(() => {
    setS((prev) => {
      if (prev.leftTop >= prev.rightTop - 1) return prev;
      const cells = [...prev.cells];
      const nt = prev.rightTop - 1;
      cells[nt] = Math.floor(Math.random() * 90) + 10;
      return { cells, leftTop: prev.leftTop, rightTop: nt };
    });
  }, []);

  const popRight = useCallback(() => {
    setS((prev) => {
      if (prev.rightTop > CAP - 1) return prev;
      const cells = [...prev.cells];
      cells[prev.rightTop] = null;
      return { cells, leftTop: prev.leftTop, rightTop: prev.rightTop + 1 };
    });
  }, []);

  const reset = useCallback(() => {
    setS({ cells: emptyCells(), leftTop: -1, rightTop: CAP });
  }, []);

  const collision = s.leftTop + 1 >= s.rightTop;

  return (
    <div className="space-y-5">
      <p className="text-center text-sm text-body">
        §3.6 — two stacks in one array: stack A grows index-up from the left, stack B grows index-down
        from the right until the tops meet (overflow).
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-xs text-mute">Stack A (left)</span>
          <div className="flex gap-1">
            <button type="button" className="ui-btn-primary" onClick={pushLeft} disabled={collision}>
              push A
            </button>
            <button type="button" className="ui-btn-secondary" onClick={popLeft}>
              pop A
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-xs text-mute">Stack B (right)</span>
          <div className="flex gap-1">
            <button type="button" className="ui-btn-primary" onClick={pushRight} disabled={collision}>
              push B
            </button>
            <button type="button" className="ui-btn-secondary" onClick={popRight}>
              pop B
            </button>
          </div>
        </div>
        <button type="button" className="ui-btn-secondary" onClick={reset}>
          Clear
        </button>
      </div>

      {collision && (
        <p className="text-center font-mono text-sm text-ink">Overflow: tops would collide — pop one side first.</p>
      )}

      <div className="overflow-x-auto">
        <div className="mx-auto flex w-max gap-1">
          {s.cells.map((v, i) => {
            const inA = i <= s.leftTop;
            const inB = i >= s.rightTop;
            const free = !inA && !inB && i > s.leftTop && i < s.rightTop;
            return (
              <div key={i} className="flex w-11 flex-col items-center">
                <div
                  className={`flex h-12 w-full items-center justify-center border font-mono text-xs ${
                    inA
                      ? "border-ink bg-surface-soft text-ink"
                      : inB
                        ? "border-charcoal bg-surface-soft text-ink"
                        : free
                          ? "border-hairline border-dashed bg-canvas text-mute"
                          : "border-hairline bg-canvas text-mute"
                  }`}
                >
                  {v ?? "·"}
                </div>
                <span className="mt-1 font-mono text-[10px] text-mute">{i}</span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center font-mono text-xs text-body">
        leftTop = {s.leftTop} · rightTop = {s.rightTop} · free slots = {s.rightTop - s.leftTop - 1}
      </p>

      <p className="ui-caption text-center">
        Horowitz-style two stacks in one vector; symmetric queues or M stacks use similar partitioning
        ideas with more bookkeeping.
      </p>
    </div>
  );
}
