"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import P5Wrapper, { type SketchFunction } from "@/components/viz/P5Wrapper";

type Algorithm = "bubble" | "insertion" | "merge" | "quick";

const ALGO_LABELS: Record<Algorithm, string> = {
  bubble: "Bubble sort",
  insertion: "Insertion sort",
  merge: "Merge sort",
  quick: "Quick sort",
};

interface SortStep {
  type: "compare" | "swap" | "sorted";
  indices: number[];
}

function generateSteps(arr: number[], algo: Algorithm): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];
  const n = a.length;

  if (algo === "bubble") {
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1 - i; j++) {
        steps.push({ type: "compare", indices: [j, j + 1] });
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          steps.push({ type: "swap", indices: [j, j + 1] });
        }
      }
      steps.push({ type: "sorted", indices: [n - 1 - i] });
    }
    steps.push({ type: "sorted", indices: [0] });
    return steps;
  }

  if (algo === "insertion") {
    for (let i = 1; i < n; i++) {
      let j = i;
      while (j > 0) {
        steps.push({ type: "compare", indices: [j - 1, j] });
        if (a[j - 1] > a[j]) {
          [a[j - 1], a[j]] = [a[j], a[j - 1]];
          steps.push({ type: "swap", indices: [j - 1, j] });
          j--;
        } else {
          break;
        }
      }
    }
    for (let k = 0; k < n; k++) {
      steps.push({ type: "sorted", indices: [k] });
    }
    return steps;
  }

  if (algo === "quick") {
    const quickSort = (lo: number, hi: number) => {
      if (lo >= hi) {
        steps.push({ type: "sorted", indices: [lo] });
        return;
      }
      const pivot = a[hi];
      let pi = lo;
      for (let i = lo; i < hi; i++) {
        steps.push({ type: "compare", indices: [i, hi] });
        if (a[i] < pivot) {
          [a[i], a[pi]] = [a[pi], a[i]];
          steps.push({ type: "swap", indices: [i, pi] });
          pi++;
        }
      }
      [a[pi], a[hi]] = [a[hi], a[pi]];
      steps.push({ type: "swap", indices: [pi, hi] });
      steps.push({ type: "sorted", indices: [pi] });
      quickSort(lo, pi - 1);
      quickSort(pi + 1, hi);
    };
    quickSort(0, n - 1);
    return steps;
  }

  if (algo !== "merge") {
    return steps;
  }

  const mergeSort = (lo: number, hi: number) => {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    mergeSort(lo, mid);
    mergeSort(mid + 1, hi);
    const left = a.slice(lo, mid + 1);
    const right = a.slice(mid + 1, hi + 1);
    let i = 0, j = 0, k = lo;
    while (i < left.length && j < right.length) {
      steps.push({ type: "compare", indices: [lo + i, mid + 1 + j] });
      if (left[i] <= right[j]) {
        a[k++] = left[i++];
      } else {
        a[k++] = right[j++];
      }
      steps.push({ type: "swap", indices: [k - 1] });
    }
    while (i < left.length) { a[k++] = left[i++]; steps.push({ type: "swap", indices: [k - 1] }); }
    while (j < right.length) { a[k++] = right[j++]; steps.push({ type: "swap", indices: [k - 1] }); }
    for (let x = lo; x <= hi; x++) steps.push({ type: "sorted", indices: [x] });
  };
  mergeSort(0, n - 1);
  return steps;
}

export default function SortingViz({
  initialAlgorithm = "bubble",
  lockAlgorithm = false,
}: {
  initialAlgorithm?: Algorithm;
  lockAlgorithm?: boolean;
} = {}) {
  const size = 30;
  const [array, setArray] = useState(() =>
    Array.from({ length: size }, () => Math.floor(Math.random() * 90 + 5))
  );
  const [algo, setAlgo] = useState<Algorithm>(initialAlgorithm);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const arrRef = useRef(array);
  const stepRef = useRef({ current: steps, idx: stepIdx, done: false });
  const highlightRef = useRef<Map<number, string>>(new Map());

  arrRef.current = array;

  useEffect(() => {
    setAlgo(initialAlgorithm);
  }, [initialAlgorithm]);

  const startSorting = () => {
    const s = generateSteps([...array], algo);
    setSteps(s);
    setStepIdx(0);
    setDone(false);
    stepRef.current = { current: s, idx: 0, done: false };
  };

  const stepForward = useCallback(() => {
    const ref = stepRef.current;
    if (ref.idx >= ref.current.length) {
      setDone(true);
      setPlaying(false);
      ref.done = true;
      return;
    }
    const step = ref.current[ref.idx];
    const map = new Map(highlightRef.current);

    // Clear previous highlights
    map.clear();
    for (const idx of step.indices) {
      if (step.type === "compare") map.set(idx, "#eab308");
      else if (step.type === "swap") map.set(idx, "#22c55e");
      else if (step.type === "sorted") map.set(idx, "#a78bfa");
    }

    // Apply swap to array
    if (step.type === "swap" && step.indices.length === 2) {
      const newArr = [...arrRef.current];
      [newArr[step.indices[0]], newArr[step.indices[1]]] = [newArr[step.indices[1]], newArr[step.indices[0]]];
      arrRef.current = newArr;
      setArray(newArr);
    }

    highlightRef.current = map;
    ref.idx++;
    setStepIdx(ref.idx);
  }, []);

  // Auto-play
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const togglePlay = () => {
    if (playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setPlaying(false);
    } else {
      startSorting();
      setPlaying(true);
    }
  };

  // Step forward on interval
  const playRef = useRef(playing);
  playRef.current = playing;

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        if (!playRef.current) { clearInterval(intervalRef.current!); return; }
        stepForward();
      }, 80);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, stepForward]);

  const sketch: SketchFunction = useCallback((p) => {
    p.setup = () => {
      p.colorMode(p.HSB, 360, 100, 100, 100);
    };

    p.draw = () => {
      p.background(225, 10, 8);
      const arr = arrRef.current;
      const highlights = highlightRef.current;
      const barW = (p.width - 40) / arr.length;
      const maxVal = 100;

      arr.forEach((val, i) => {
        const barH = p.map(val, 0, maxVal, 5, p.height * 0.7);
        const x = 20 + i * barW;
        const y = p.height * 0.85 - barH;

        let hue = 255; let sat = 60; let bri = 75;

        if (highlights.has(i)) {
          const color = highlights.get(i)!;
          if (color === "#eab308") { hue = 45; sat = 90; bri = 95; }
          else if (color === "#22c55e") { hue = 140; sat = 70; bri = 80; }
          else if (color === "#a78bfa") { hue = 260; sat = 50; bri = 85; }
        }

        p.fill(hue, sat, bri);
        p.noStroke();
        p.rect(x, y, barW - 1.5, barH, 1);
      });
    };
  }, []);

  return (
    <div className="space-y-4">
      <P5Wrapper sketch={sketch} className="min-h-[320px]" />

      <div className="flex flex-wrap items-center gap-2 justify-center">
        {lockAlgorithm ? (
          <span className="min-w-[8rem] text-center font-mono text-sm text-ink">
            {ALGO_LABELS[algo]}
          </span>
        ) : (
          <select
            value={algo}
            onChange={(e) => setAlgo(e.target.value as Algorithm)}
            className="ui-input min-w-[8rem]"
          >
            <option value="bubble">Bubble sort</option>
            <option value="insertion">Insertion sort</option>
            <option value="merge">Merge sort</option>
            <option value="quick">Quick sort</option>
          </select>
        )}
        <button
          onClick={togglePlay}
          className="ui-btn-primary"
        >
          {playing ? "⏸ Pause" : "▶ Play"}
        </button>
        <button
          onClick={stepForward}
          disabled={playing || done}
          className="ui-btn-secondary disabled:opacity-40"
        >
          Step →
        </button>
        <button
          onClick={() => {
            const newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 90 + 5));
            setArray(newArr);
            arrRef.current = newArr;
            setStepIdx(-1);
            setDone(false);
            setPlaying(false);
            highlightRef.current.clear();
          }}
          className="ui-btn-secondary"
        >
          🎲 Reset
        </button>
      </div>
      <p className="ui-caption text-center">
        Step: {done ? "Done ✓" : stepIdx >= 0 ? stepIdx : "—"} / {steps.length || "—"} · Elements: {size}
      </p>
    </div>
  );
}