"use client";

import { useCallback, useRef, useState } from "react";
import P5Wrapper, { type SketchFunction } from "@/components/viz/P5Wrapper";

export default function BacktrackingViz() {
  // Helper functions (must be defined before useState)
  const createNQueensBoard = (size: number): number[][] => {
    return Array.from({ length: size }, () => Array(size).fill(0));
  };

  const createMazeBoard = (): number[][] => {
    const b = Array.from({ length: 8 }, () => Array(8).fill(0));
    // Simple maze pattern
    const walls = [
      [0, 1], [0, 3], [0, 5], [0, 7],
      [1, 2], [1, 4], [1, 6],
      [2, 1], [2, 3], [2, 5], [2, 7],
      [3, 0], [3, 2], [3, 4], [3, 6],
      [4, 1], [4, 3], [4, 5], [4, 7],
      [5, 2], [5, 4], [5, 6],
      [6, 1], [6, 3], [6, 5], [6, 7],
      [7, 0], [7, 2], [7, 4], [7, 6],
    ];
    for (const [r, c] of walls) b[r][c] = 1;
    return b;
  };

  const [mode, setMode] = useState<"nqueens" | "maze">("nqueens");
  const [n, setN] = useState(4);
  const [board, setBoard] = useState<number[][]>(() => createNQueensBoard(4));
  const [solution, setSolution] = useState<number[][]>([]);
  const [animating, setAnimating] = useState(false);
  const [step, setStep] = useState(0);
  const [solved, setSolved] = useState(false);
  const boardRef = useRef(board);
  const solutionRef = useRef(solution);
  const stepRef = useRef(step);

  boardRef.current = board;
  solutionRef.current = solution;
  stepRef.current = step;

  const sketch: SketchFunction = useCallback((p) => {
    p.setup = () => {
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.textAlign(p.CENTER, p.CENTER);
    };

    p.draw = () => {
      p.background(225, 10, 8);
      const b = boardRef.current;
      const sol = solutionRef.current;
      const s = stepRef.current;

      if (mode === "nqueens") {
        const cellSize = Math.min(p.width, p.height - 60) / n;
        const startX = (p.width - cellSize * n) / 2;
        const startY = 40;

        for (let row = 0; row < n; row++) {
          for (let col = 0; col < n; col++) {
            const x = startX + col * cellSize;
            const y = startY + row * cellSize;

            // Checkerboard pattern
            const isLight = (row + col) % 2 === 0;
            p.fill(isLight ? 0 : 240, 0, isLight ? 95 : 15);
            p.stroke(0, 0, 20);
            p.strokeWeight(1);
            p.rect(x, y, cellSize, cellSize);

            // Queen
            if (b[row][col] === 1) {
              p.fill(260, 70, 80);
              p.noStroke();
              p.ellipse(x + cellSize / 2, y + cellSize / 2, cellSize * 0.7);
              p.fill(0, 0, 100);
              p.textSize(cellSize * 0.4);
              p.text("♛", x + cellSize / 2, y + cellSize / 2);
            }
          }
        }

        // Solution path
        if (solved && sol.length > 0) {
          p.fill(140, 60, 75);
          p.textSize(12);
          p.text("Solution found!", p.width / 2, p.height - 20);
        }
      } else {
        // Maze mode
        const cellSize = Math.min(p.width, p.height - 60) / 8;
        const startX = (p.width - cellSize * 8) / 2;
        const startY = 40;

        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const x = startX + col * cellSize;
            const y = startY + row * cellSize;

            if (b[row][col] === 1) {
              p.fill(0, 0, 10);
              p.stroke(0, 0, 20);
              p.rect(x, y, cellSize, cellSize);
            } else {
              p.fill(0, 0, 95);
              p.stroke(0, 0, 20);
              p.rect(x, y, cellSize, cellSize);
            }
          }
        }

        // Start and end
        p.fill(140, 60, 75);
        p.noStroke();
        p.ellipse(startX + cellSize / 2, startY + cellSize / 2, cellSize * 0.6);
        p.fill(0, 0, 100);
        p.textSize(cellSize * 0.3);
        p.text("S", startX + cellSize / 2, startY + cellSize / 2);

        p.fill(0, 80, 60);
        p.ellipse(startX + 7 * cellSize + cellSize / 2, startY + 7 * cellSize + cellSize / 2, cellSize * 0.6);
        p.fill(0, 0, 100);
        p.text("E", startX + 7 * cellSize + cellSize / 2, startY + 7 * cellSize + cellSize / 2);
      }
    };
  }, [mode, n]);

  const solveNQueens = () => {
    const b = createNQueensBoard(n);
    setBoard(b);
    boardRef.current = b;
    setAnimating(true);
    setSolved(false);

    const isSafe = (row: number, col: number): boolean => {
      for (let i = 0; i < row; i++) {
        if (b[i][col] === 1) return false;
        if (col - (row - i) >= 0 && b[i][col - (row - i)] === 1) return false;
        if (col + (row - i) < n && b[i][col + (row - i)] === 1) return false;
      }
      return true;
    };

    const solve = (row: number): boolean => {
      if (row === n) return true;
      for (let col = 0; col < n; col++) {
        if (isSafe(row, col)) {
          b[row][col] = 1;
          setBoard([...b]);
          boardRef.current = b;
          setStep((prev) => prev + 1);
          stepRef.current = stepRef.current + 1;

          if (solve(row + 1)) return true;

          b[row][col] = 0;
          setBoard([...b]);
          boardRef.current = b;
        }
      }
      return false;
    };

    setTimeout(() => {
      if (solve(0)) {
        setSolved(true);
        setSolution([...b]);
        solutionRef.current = b;
      }
      setAnimating(false);
    }, 100);
  };

  const reset = () => {
    if (mode === "nqueens") {
      setBoard(createNQueensBoard(n));
    } else {
      setBoard(createMazeBoard());
    }
    setSolution([]);
    setStep(0);
    setSolved(false);
    setAnimating(false);
  };

  return (
    <div className="space-y-4">
      <P5Wrapper sketch={sketch} className="min-h-[380px]" />

      <div className="flex flex-wrap items-center gap-2 justify-center">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as "nqueens" | "maze")}
          className="ui-input min-w-[8rem]"
        >
          <option value="nqueens">N-Queens</option>
          <option value="maze">Maze</option>
        </select>
        {mode === "nqueens" && (
          <>
            <label className="ui-label">n =</label>
            <input
              type="number"
              value={n}
              onChange={(e) => setN(Math.max(4, Math.min(8, parseInt(e.target.value) || 4)))}
              className="ui-input w-16"
            />
          </>
        )}
        <button
          type="button"
          onClick={solveNQueens}
          disabled={animating}
          className="ui-btn-primary disabled:opacity-40"
        >
          Solve
        </button>
        <button type="button" onClick={reset} className="ui-btn-secondary">
          Reset
        </button>
      </div>
      <p className="ui-caption text-center">
        {mode === "nqueens" ? `N-Queens (${n}×${n}) · Steps: ${step} · ${solved ? "Solved ✓" : animating ? "Solving..." : "Click to solve"}` : "Maze solver (DFS backtracking)"}
      </p>
    </div>
  );
}