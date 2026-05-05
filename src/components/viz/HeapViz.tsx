"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import P5Wrapper, { type SketchFunction } from "@/components/viz/P5Wrapper";

const MAX_HEAP_SAMPLE = [100, 90, 60, 70, 50, 15, 55, 20];
const MIN_HEAP_SAMPLE = [10, 20, 15, 40, 70, 60, 55, 100];

export default function HeapViz() {
  const [heap, setHeap] = useState<number[]>(MAX_HEAP_SAMPLE);
  const [isMax, setIsMax] = useState(true);
  const [animating, setAnimating] = useState<"up" | "down" | null>(null);
  const [insertVal, setInsertVal] = useState("");
  const heapRef = useRef(heap);
  const animRef = useRef({ type: null as string | null, idx: -1, progress: 0 });

  useEffect(() => {
    heapRef.current = heap;
  }, [heap]);

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
        const ly = y + 72;
        p.stroke(0, 0, 82);
        p.strokeWeight(1.5);
        p.line(x, y + 22, lx, ly - 22);
        drawHeap(arr, left, lx, ly, level + 1, maxW);
      }
      if (right < arr.length) {
        const rx = x + gap;
        const ry = y + 72;
        p.stroke(0, 0, 82);
        p.strokeWeight(1.5);
        p.line(x, y + 22, rx, ry - 22);
        drawHeap(arr, right, rx, ry, level + 1, maxW);
      }

      const isAnim = animRef.current.idx === idx && animRef.current.type !== null;
      const scale = isAnim ? 1 + 0.1 * p.sin(p.frameCount * 0.4) : 1;

      p.push();
      p.translate(x, y);
      p.scale(scale);
      p.fill(0, 0, isAnim ? 0 : 100);
      p.stroke(0, 0, isAnim ? 0 : 72);
      p.strokeWeight(1.5);
      p.ellipse(0, 0, 44, 44);
      p.fill(0, 0, isAnim ? 100 : 0);
      p.textSize(14);
      p.text(arr[idx], 0, 0);
      p.pop();
    };

    p.draw = () => {
      p.background(0, 0, 98);
      if (heapRef.current.length === 0) {
        p.fill(0, 0, 45);
        p.textSize(13);
        p.text("Empty heap", p.width / 2, p.height / 2);
        return;
      }
      drawHeap(heapRef.current, 0, p.width / 2, 44, 0, p.width * 0.5);
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
        animRef.current = { type: null, idx: -1, progress: 0 };
      }
    }, 400);
  };

  const resetHeap = (nextIsMax = isMax) => {
    const nextHeap = nextIsMax ? MAX_HEAP_SAMPLE : MIN_HEAP_SAMPLE;
    setHeap(nextHeap);
    heapRef.current = nextHeap;
    animRef.current = { type: null, idx: -1, progress: 0 };
    setAnimating(null);
  };

  const toggleHeapKind = (checked: boolean) => {
    setIsMax(checked);
    resetHeap(checked);
  };

  return (
    <div className="space-y-4">
      <P5Wrapper sketch={sketch} className="min-h-[360px]" />

      <div className="flex flex-wrap items-center gap-2 justify-center">
        <input
          type="number"
          placeholder="Value"
          value={insertVal}
          onChange={(e) => setInsertVal(e.target.value)}
          className="ui-input w-20"
        />
        <button
          type="button"
          onClick={insert}
          disabled={animating !== null}
          className="ui-btn-primary disabled:opacity-40"
        >
          Insert
        </button>
        <button
          type="button"
          onClick={extract}
          disabled={animating !== null || heap.length === 0}
          className="ui-btn-secondary disabled:opacity-40"
        >
          Extract {isMax ? "Max" : "Min"}
        </button>
        <label className="ui-label flex cursor-pointer items-center gap-1.5">
          <input
            type="checkbox"
            checked={isMax}
            onChange={(e) => toggleHeapKind(e.target.checked)}
            className="accent-[var(--color-primary)]"
          />
          Max Heap
        </label>
        <button
          type="button"
          onClick={() => resetHeap()}
          className="ui-btn-secondary"
        >
          Reset
        </button>
      </div>
      <p className="ui-caption text-center">
        {isMax ? "Max" : "Min"} Heap · Size: {heap.length} · Root: {heap[0] ?? "—"}
      </p>
    </div>
  );
}
