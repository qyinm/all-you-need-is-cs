"use client";

import { useCallback, useMemo, useState } from "react";

/** Rat-in-a-maze stack demo: four-way neighbor order right → down → left → up. */
const DR = [0, 1, 0, -1];
const DC = [1, 0, -1, 0];
const DIR_LABELS = ["R", "D", "L", "U"] as const;
const DIR_WORDS = ["right", "down", "left", "up"] as const;

/**
 * Path trials mirror mark[][]-style blocking of revisits; eight-direction variants store
 * `(row, col, dir)` per frame on the stack.
 */
const MAZE_LINES = [
  "#############",
  "#S....#.....#",
  "#.###.#.###.#",
  "#...#...#...#",
  "###.#.#.###.#",
  "#...#.#.#...#",
  "#.###.#.#.#.#",
  "#...#...#...#",
  "#.#.#####.#.#",
  "#.#.......#G#",
  "#############",
];

function key(r: number, c: number) {
  return `${r},${c}`;
}

function parseGrid(): {
  grid: string[][];
  start: { r: number; c: number };
  goal: { r: number; c: number };
  rows: number;
  cols: number;
} {
  const grid = MAZE_LINES.map((line) => line.split(""));
  let start = { r: 1, c: 1 };
  let goal = { r: 1, c: 1 };
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === "S") start = { r, c };
      if (grid[r][c] === "G") goal = { r, c };
    }
  }
  return { grid, start, goal, rows: grid.length, cols: grid[0].length };
}

function walkable(ch: string) {
  return ch === "." || ch === "S" || ch === "G";
}

export default function MazeStackViz() {
  const { grid, start, goal, rows, cols } = useMemo(() => parseGrid(), []);

  const [stack, setStack] = useState<{ r: number; c: number }[]>(() => [{ ...start }]);
  const [visited, setVisited] = useState<Set<string>>(() => new Set([key(start.r, start.c)]));
  const [done, setDone] = useState<"running" | "found" | "no_path">("running");
  const [lastNote, setLastNote] = useState<string>(
    "Rat in a maze — stack holds the trial path from S. Try neighbors right→down→left→up; if none, pop (backtrack). This demo uses four directions; eight-way versions keep (row,col,dir) on the stack."
  );

  const reset = useCallback(() => {
    setStack([{ ...start }]);
    setVisited(new Set([key(start.r, start.c)]));
    setDone("running");
    setLastNote(
      "Reset. Step traces R→D→L→U. Eight-way stacks resume from a stored direction at each cell."
    );
  }, [start]);

  const stepOnce = useCallback(() => {
    if (done !== "running") return;

    const cur = stack[stack.length - 1];
    if (!cur) {
      setDone("no_path");
      setLastNote("Stack empty.");
      return;
    }
    if ((cur.r === goal.r && cur.c === goal.c) || grid[cur.r][cur.c] === "G") {
      setDone("found");
      setLastNote("Reached G. Stack bottom→top is one S→G route.");
      return;
    }

    for (let d = 0; d < 4; d++) {
      const nr = cur.r + DR[d];
      const nc = cur.c + DC[d];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      const ch = grid[nr][nc];
      if (!walkable(ch)) continue;
      const k = key(nr, nc);
      if (visited.has(k)) continue;

      setVisited((v) => new Set(v).add(k));
      setStack((s) => [...s, { r: nr, c: nc }]);
      setLastNote(
        `Push (${nr},${nc}) — move ${DIR_WORDS[d]} (${DIR_LABELS[d]}); next tries follow R→D→L→U.`
      );
      return;
    }

    if (stack.length <= 1) {
      setDone("no_path");
      setLastNote("No untried move from start — maze blocked for this rule.");
      return;
    }

    const popped = stack[stack.length - 1];
    setStack((s) => s.slice(0, -1));
    setLastNote(
      `Pop (${popped.r},${popped.c}) — dead end; backtrack toward last choice point.`
    );
  }, [done, grid, goal, rows, cols, stack, visited]);

  const playToEnd = useCallback(() => {
    let st = [...stack];
    let vis = new Set(visited);
    let status: "running" | "found" | "no_path" = done;
    if (status !== "running") return;

    for (let guard = 0; guard < 5000 && status === "running"; guard++) {
      const cur = st[st.length - 1];
      if (!cur) {
        status = "no_path";
        break;
      }
      if ((cur.r === goal.r && cur.c === goal.c) || grid[cur.r][cur.c] === "G") {
        status = "found";
        break;
      }

      let moved = false;
      for (let d = 0; d < 4; d++) {
        const nr = cur.r + DR[d];
        const nc = cur.c + DC[d];
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        const ch = grid[nr][nc];
        if (!walkable(ch)) continue;
        const k = key(nr, nc);
        if (vis.has(k)) continue;
        vis.add(k);
        st = [...st, { r: nr, c: nc }];
        moved = true;
        break;
      }
      if (moved) continue;
      if (st.length <= 1) {
        status = "no_path";
        break;
      }
      st = st.slice(0, -1);
    }

    setStack(st);
    setVisited(vis);
    setDone(status);
    if (status === "found") setLastNote("Play to end: reached G.");
    else if (status === "no_path") setLastNote("Play to end: search exhausted.");
  }, [done, grid, goal, rows, cols, stack, visited]);

  const onStack = useMemo(() => new Set(stack.map((p) => key(p.r, p.c))), [stack]);

  function cellMarker(r: number, c: number, ch: string): string {
    const k = key(r, c);
    const wall = ch === "#";
    if (wall) return "";
    const isStart = ch === "S";
    const isGoal = ch === "G";
    if (isStart) return "S";
    if (isGoal) return "G";
    const onPath = onStack.has(k);
    const wasHere = visited.has(k);
    if (onPath) return "•";
    if (wasHere) return "×";
    if (done === "no_path" && walkable(ch)) return "×";
    return "";
  }

  function cellClassName(r: number, c: number, ch: string): string {
    const k = key(r, c);
    const wall = ch === "#";
    const isStart = ch === "S";
    const isGoal = ch === "G";
    const onPath = onStack.has(k);
    const wasHere = visited.has(k);
    const isBacktracked = wasHere && !onPath && !wall;
    const neverReached =
      done === "no_path" && !wall && !wasHere && walkable(ch) && !isStart && !isGoal;

    let cellClass = "border border-hairline text-ink";
    if (wall) {
      cellClass = "border border-hairline bg-charcoal text-canvas";
    } else if (onPath) {
      cellClass = "border border-hairline bg-surface-soft text-ink";
    } else if (isBacktracked || neverReached) {
      cellClass = "border border-hairline bg-canvas text-mute";
    } else {
      cellClass = "border border-hairline bg-canvas text-body";
    }
    return cellClass;
  }

  return (
    <div className="space-y-5">
      <p className="text-center text-sm text-body">
        Rat in a maze (Horowitz §3.5 style): iterative depth-first walk with a path stack and blocked revisits (“mark”
        cells the way <span className="font-mono">mark[][]</span> does for 0/1 mazes). This demo fixes the tie-break{" "}
        <span className="font-medium text-ink">right → down → left → up</span>; broader formulations scan eight compass
        directions and store <span className="font-mono">(row, col, dir)</span> on the stack.
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          className="ui-btn-primary"
          onClick={stepOnce}
          disabled={done !== "running"}
        >
          Step once
        </button>
        <button
          type="button"
          className="ui-btn-secondary"
          onClick={playToEnd}
          disabled={done !== "running"}
        >
          Play to end
        </button>
        <button type="button" className="ui-btn-secondary" onClick={reset}>
          Reset
        </button>
      </div>

      {done === "found" && (
        <p className="text-center font-mono text-sm text-ink">Reached goal G.</p>
      )}
      {done === "no_path" && (
        <p className="text-center font-mono text-sm text-ink">No path found (under this visit rule).</p>
      )}

      <p className="text-center text-sm text-body" aria-live="polite">
        {lastNote}
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
        <div className="flex justify-center md:justify-end">
          <div
            className="inline-grid gap-px rounded-lg border border-hairline bg-hairline p-2"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1.25rem))`,
            }}
          >
            {grid.map((row, r) =>
              row.map((ch, c) => {
                const k = key(r, c);
                return (
                  <div
                    key={k}
                    title={`(${r},${c})`}
                    className={`flex aspect-square items-center justify-center text-[9px] font-mono leading-none sm:text-[10px] ${cellClassName(r, c, ch)}`}
                  >
                    {cellMarker(r, c, ch)}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="w-full rounded-lg border border-hairline bg-canvas p-3 md:max-w-none">
          <h3 className="mb-2 font-mono text-xs font-medium uppercase tracking-wide text-mute">
            Stack (bottom → top)
          </h3>
          {stack.length === 0 ? (
            <p className="font-mono text-xs text-mute">(empty)</p>
          ) : (
            <ol className="max-h-52 space-y-1 overflow-y-auto font-mono text-xs">
              {stack.map((p, i) => (
                <li key={`${i}-${p.r}-${p.c}`} className="text-body">
                  <span className="text-mute">#{i + 1} </span>({p.r},{p.c})
                  {i === stack.length - 1 && <span className="text-mute"> ← top</span>}
                </li>
              ))}
            </ol>
          )}
          <p className="mt-3 border-t border-hairline pt-2 font-mono text-[10px] text-mute">
            Move order: {DIR_LABELS.join(" → ")} (right/down/left/up)
          </p>
        </div>
      </div>

      <p className="ui-caption text-center">
        Cells: <span className="font-mono">•</span> on the current stack path; <span className="font-mono">×</span> on
        cells you entered and later left while backtracking. If the search exhausts without reaching{" "}
        <span className="font-mono">G</span>, still-unvisited open cells also show{" "}
        <span className="font-mono">×</span>. After a successful run, untouched corridors stay blank.{" "}
        <span className="font-mono">S</span>/<span className="font-mono">G</span> stay fixed. Usual encoding:{" "}
        <span className="font-mono">maze[row][col]</span> with 0 = open / 1 = wall; visit flags in{" "}
        <span className="font-mono">mark[][]</span>. Tie-break here is four-way until you add eight-way{" "}
        <span className="font-mono">offsets move[8]</span> and per-frame direction on the stack.
      </p>
    </div>
  );
}
