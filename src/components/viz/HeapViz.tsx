"use client";

import { useCallback, useRef, useState } from "react";
import P5Wrapper, { type SketchFunction } from "@/components/viz/P5Wrapper";

interface HeapNode {
  value: number;
  index: number;
}

export default function HeapViz() {
  const [heap, setHeap] = useState<number[]>([10, 20, 30, 40, 50, 60, 70]);
  const [isMax, setIsMax] = useState(true);
  const [animating, setAnimating] = useState<"up" | "down" | null>(null);
  const [animIdx, setAnimIdx] = useState(-1);
  const [insertVal, setInsertVal] = useState("");
  const heapRef = useRef(heap);
  const animRef = useRef({ type: null as string | null, idx: -1, progress: 0 });

  heapRef.current = heap;

  const sketch: SketchFunction = useCallback((p) => {
    p.setup = () => {
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.textAlign(p.CENTER, p.CENTER);
    };

    const drawHeap = (arr: number[], idx: number, x: number, y: number, level: number, maxW: number) => {
      if (idx >= arr.length) return;
      const gap = maxW / (2 ** (level + 1));
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;

      if (left < arr.length) {
        const lx = x - gap;
        const ly = y + 70;
        p.stroke(0, 0, 25);
        p.strokeWeight(2);
        p.line(x, y + 22, lx, ly - 22);
        drawHeap(arr, left, lx, ly, level + 1, maxW);
      }
      if (right < arr.length) {
        const rx = x + gap;
        const ry = y + 70;
        p.stroke(0, 0, 25);
        p.strokeWeight(2);
        p.line(x, y + 22, rx, ry - 22);
        drawHeap(arr, right, rx, ry, level + 1, maxW);
      }

      const isAnim = animRef.current.idx === idx && animRef.current.type !== null;
      const scale = isAnim ? 1 + 0.1 * p.sin(p.frameCount * 0.4) : 1;

      p.push();
      p.translate(x, y);
      p.scale(scale);
      p.fill(isAnim ? 45 : 260, isAnim ? 85 : 25, isAnim ? 90 : 16);
      p.stroke(isAnim ? 50 : 260, isAnim ? 90 : 50, isAnim ? 100 : 50);
      p.strokeWeight(2);
      p.ellipse(0, 0, 44, 44);
      p.fill(0, 0, isAnim ? 15 : 90);
      p.textSize(14);
      p.text(arr[idx], 0, 0);
      p.pop();
    };

    p.draw = () => {
      p.background(225, 10, 8);
      if (heapRef.current.length === 0) {
        p.fill(0, 0, 25);
        p.textSize(13);
        p.text("Empty heap", p.width / 2, p.height / 2);
        return;
      }
      drawHeap(heapRef.current, 0, p.width / 2, 40, 0, p.width * 0.7);
    };
  }, []);

  const bubbleUp = (arr: number[], idx: number): number[][] => {
    const steps: number[][] = [];
    const a = [...arr];
    let i = idx;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if ((isMax && a[i] > a[parent]) || (!isMax && a[i] < a[parent])) {
        [a[i], a[parent]] = [a[parent], a[i]];
        steps.push([...a]);
        i = parent;
      } else break;
    }
    return steps;
  };

  const bubbleDown = (arr: number[]): number[][] => {
    const steps: number[][] = [];
    const a = [...arr];
    let i = 0;
    const n = a.length;
    while (true) {
      let extreme = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < n && ((isMax && a[left] > a[extreme]) || (!isMax && a[left] < a[extreme]))) extreme = left;
      if (right < n && ((isMax && a[right] > a[extreme]) || (!isMax && a[right] < a[extreme]))) extreme = right;

      if (extreme !== i) {
        [a[i], a[extreme]] = [a[extreme], a[i]];
        steps.push([...a]);
        i = extreme;
      } else break;
    }
    return steps;
  };

  const insert = () => {
    const val = parseInt(insertVal);
    if (isNaN(val)) return;
    const newHeap = [...heap, val];
    setHeap(newHeap);
    setAnimating("up");
    setAnimIdx(newHeap.length - 1);
    animRef.current = { type: "up", idx: newHeap.length - 1, progress: 0 };

    const steps = bubbleUp(newHeap, newHeap.length - 1);
    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setHeap(steps[stepIdx]);
        heapRef.current = steps[stepIdx];
        stepIdx++;
      } else {
        clearInterval(interval);
        setAnimating(null);
        setAnimIdx(-1);
        animRef.current = { type: null, idx: -1, progress: 0 };
      }
    }, 400);
    setInsertVal("");
  };

  const extract = () => {
    if (heap.length <= 1) {
      setHeap([]);
      return;
    }
    const newHeap = [heap[heap.length - 1], ...heap.slice(1, -1)];
    setHeap(newHeap);
    setAnimating("down");
    setAnimIdx(0);
    animRef.current = { type: "down", idx: 0, progress: 0 };

    const steps = bubbleDown(newHeap);
    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setHeap(steps[stepIdx]);
        heapRef.current = steps[stepIdx];
        stepIdx++;
      } else {
        clearInterval(interval);
        setAnimating(null);
        setAnimIdx(-1);
        animRef.current = { type: null, idx: -1, progress: 0 };
      }
    }, 400);
  };

  return (
    <div className="space-y-4">
      <P5Wrapper sketch={sketch} className="min-h-[400px]" />

      <div className="flex flex-wrap items-center gap-2 justify-center">
        <input
          type="number"
          placeholder="Value"
          value={insertVal}
          onChange={(e) => setInsertVal(e.target.value)}
          className="w-20 px-2 py-1.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-mono"
        />
        <button
          onClick={insert}
          disabled={animating !== null}
          className="px-4 py-1.5 rounded bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 text-sm font-mono transition-colors disabled:opacity-40"
        >
          Insert
        </button>
        <button
          onClick={extract}
          disabled={animating !== null || heap.length === 0}
          className="px-4 py-1.5 rounded bg-red-600/20 border border-red-500/30 text-red-300 hover:bg-red-600/30 text-sm font-mono transition-colors disabled:opacity-40"
        >
          Extract {isMax ? "Max" : "Min"}
        </button>
        <label className="flex items-center gap-1.5 text-zinc-400 text-xs font-mono cursor-pointer">
          <input type="checkbox" checked={isMax} onChange={(e) => setIsMax(e.target.checked)} className="accent-purple-500" />
          Max Heap
        </label>
        <button
          onClick={() => setHeap([10, 20, 30, 40, 50, 60, 70])}
          className="px-3 py-1.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 hover:bg-zinc-700 text-sm font-mono transition-colors"
        >
          🎲 Reset
        </button>
      </div>
      <p className="text-center text-zinc-500 text-xs font-mono">
        {isMax ? "Max" : "Min"} Heap · Size: {heap.length} · Root: {heap[0] ?? "—"}
      </p>
    </div>
  );
}