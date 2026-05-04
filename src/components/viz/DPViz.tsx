"use client";

import { useCallback, useRef, useState } from "react";
import P5Wrapper, { type SketchFunction } from "@/components/viz/P5Wrapper";

interface DPNode {
  n: number;
  result: number | null;
  children: DPNode[];
  x: number;
  y: number;
}

export default function DPViz() {
  const [n, setN] = useState(6);
  const [tree, setTree] = useState<DPNode | null>(null);
  const [memo, setMemo] = useState<Map<number, number>>(new Map());
  const [highlight, setHighlight] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const treeRef = useRef(tree);
  const memoRef = useRef(memo);
  const highlightRef = useRef<number | null>(null);

  treeRef.current = tree;
  memoRef.current = memo;

  const sketch: SketchFunction = useCallback((p) => {
    p.setup = () => {
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.textAlign(p.CENTER, p.CENTER);
    };

    const drawDPNode = (node: DPNode | null, x: number, y: number, level: number, maxW: number) => {
      if (!node) return;
      const gap = maxW / (2 ** (level + 1));
      const isHl = highlightRef.current === node.n;
      const hasMemo = memoRef.current.has(node.n);

      if (node.children.length > 0) {
        if (node.children[0]) {
          const lx = x - gap;
          const ly = y + 60;
          p.stroke(0, 0, 25);
          p.strokeWeight(1.5);
          p.line(x, y + 20, lx, ly - 20);
          drawDPNode(node.children[0], lx, ly, level + 1, maxW);
        }
        if (node.children[1]) {
          const rx = x + gap;
          const ry = y + 60;
          p.stroke(0, 0, 25);
          p.strokeWeight(1.5);
          p.line(x, y + 20, rx, ry - 20);
          drawDPNode(node.children[1], rx, ry, level + 1, maxW);
        }
      }

      p.push();
      if (isHl) {
        const s = 1 + 0.12 * p.sin(p.frameCount * 0.35);
        p.translate(x, y);
        p.scale(s);
        p.fill(45, 85, 90);
        p.stroke(50, 90, 100);
        p.ellipse(0, 0, 40, 40);
        p.fill(0, 0, 15);
        p.textSize(12);
        p.text("fib(" + node.n + ")", 0, 0);
      } else if (hasMemo) {
        p.fill(140, 60, 75);
        p.stroke(150, 60, 55);
        p.ellipse(x, y, 38, 38);
        p.fill(0, 0, 100);
        p.textSize(12);
        p.text("fib(" + node.n + ")", x, y);
      } else {
        p.fill(260, 25, 16);
        p.stroke(260, 50, 50);
        p.ellipse(x, y, 38, 38);
        p.fill(0, 0, 90);
        p.textSize(12);
        p.text("fib(" + node.n + ")", x, y);
      }
      p.pop();
    };

    p.draw = () => {
      p.background(225, 10, 8);
      if (!treeRef.current) {
        p.fill(0, 0, 25);
        p.textSize(13);
        p.text("Click 'Generate' to build recursion tree", p.width / 2, p.height / 2);
        return;
      }

      drawDPNode(treeRef.current, p.width / 2, 40, 0, p.width * 0.7);

      // Memo table
      p.fill(0, 0, 35);
      p.textSize(11);
      p.text("Memo: [" + Array.from(memoRef.current.entries()).map(([k, v]) => `${k}:${v}`).join(", ") + "]", p.width / 2, p.height - 30);
    };
  }, []);

  const buildTree = (num: number): DPNode => {
    const build = (n: number, depth: number): DPNode => {
      if (n <= 1) return { n, result: n, children: [], x: 0, y: 0 };
      const left = build(n - 1, depth + 1);
      const right = build(n - 2, depth + 1);
      return { n, result: null, children: [left, right], x: 0, y: 0 };
    };
    return build(num, 0);
  };

  const animateDP = () => {
    const t = buildTree(n);
    setTree(t);
    treeRef.current = t;
    const m = new Map<number, number>();
    setMemo(m);
    memoRef.current = m;
    setAnimating(true);

    const fib = (n: number): number => {
      if (n <= 1) return n;
      if (m.has(n)) return m.get(n)!;
      setHighlight(n);
      highlightRef.current = n;
      const result = fib(n - 1) + fib(n - 2);
      m.set(n, result);
      setMemo(new Map(m));
      memoRef.current = m;
      return result;
    };

    setTimeout(() => {
      fib(n);
      setHighlight(null);
      highlightRef.current = null;
      setAnimating(false);
    }, 100);
  };

  return (
    <div className="space-y-4">
      <P5Wrapper sketch={sketch} className="min-h-[380px]" />

      <div className="flex flex-wrap items-center gap-2 justify-center">
        <label className="ui-label">n =</label>
        <input
          type="number"
          value={n}
          onChange={(e) => setN(Math.max(0, Math.min(8, parseInt(e.target.value) || 0)))}
          className="ui-input w-20"
        />
        <button
          type="button"
          onClick={animateDP}
          disabled={animating}
          className="ui-btn-primary disabled:opacity-40"
        >
          Generate & Animate
        </button>
      </div>
      <p className="ui-caption text-center">
        Fibonacci(n) with memoization · {memo.size > 0 ? `fib(${n}) = ${memo.get(n) ?? "—"}` : "Click to start"}
      </p>
    </div>
  );
}