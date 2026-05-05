"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import P5Wrapper, { type SketchFunction } from "@/components/viz/P5Wrapper";

type HeapMode = "minmax" | "deap" | "leftist" | "binomial" | "fibonacci";
type P5Like = Parameters<SketchFunction>[0];
type Point = { x: number; y: number };
type HeapAnimation =
  | {
      type: "insert" | "delete";
      value: number;
      fromIdx: number;
      toIdx: number;
      start: number;
      duration: number;
    }
  | null;

const MODES: Record<
  HeapMode,
  {
    label: string;
    summary: string;
    operations: string[];
  }
> = {
  minmax: {
    label: "Min-max heap",
    summary: "Double-ended priority queue with alternating min and max levels.",
    operations: ["Insert", "Delete Min", "Delete Max", "Reset"],
  },
  deap: {
    label: "Deap",
    summary: "Empty root with min heap on the left and max heap on the right.",
    operations: ["Insert", "Delete Min", "Delete Max", "Reset"],
  },
  leftist: {
    label: "Leftist tree",
    summary: "Mergeable priority queue where combine follows short right paths.",
    operations: ["Tree A", "Tree B", "Combine", "Delete Min"],
  },
  binomial: {
    label: "Binomial heap",
    summary: "Root list of heap-ordered trees; delete-min consolidates equal degrees.",
    operations: ["Root list", "Insert", "Combine", "Delete Min"],
  },
  fibonacci: {
    label: "Fibonacci heap",
    summary: "Lazy mergeable heap with decrease-key and cascading cuts.",
    operations: ["Root list", "Decrease Key", "Cut", "Consolidate"],
  },
};

const SECTION_TO_MODE: Record<string, HeapMode> = {
  "9-1": "minmax",
  "9-1-1": "minmax",
  "9-1-2": "minmax",
  "9-1-3": "minmax",
  "9-2": "deap",
  "9-2-1": "deap",
  "9-2-2": "deap",
  "9-2-3": "deap",
  "9-3": "leftist",
  "9-4": "binomial",
  "9-4-1": "binomial",
  "9-4-2": "binomial",
  "9-4-3": "binomial",
  "9-4-4": "binomial",
  "9-4-5": "binomial",
  "9-4-6": "binomial",
  "9-5": "fibonacci",
  "9-5-1": "fibonacci",
  "9-5-2": "fibonacci",
  "9-5-3": "fibonacci",
  "9-5-4": "fibonacci",
  "9-5-5": "fibonacci",
  "9-5-6": "fibonacci",
};

const MINMAX_SAMPLE = [7, 70, 40, 30, 9, 10, 15, 45, 50, 30, 20, 12];
const DEAP_SAMPLE = [5, 45, 10, 8, 25, 40, 15, 19, 9, 30, 20];
const MOVE_MS = 650;

export default function HeapStructuresConceptViz({ sectionId }: { sectionId: string }) {
  const mode = useMemo(() => SECTION_TO_MODE[sectionId] ?? "minmax", [sectionId]);
  const active = MODES[mode];
  const [frame, setFrame] = useState(0);
  const [values, setValues] = useState(() =>
    mode === "deap" ? normalizeDeap(DEAP_SAMPLE) : buildMinMaxHeap(MINMAX_SAMPLE)
  );
  const [extracted, setExtracted] = useState<number[]>([]);
  const [animating, setAnimating] = useState(false);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState(() => `${MODES[mode].label} ready.`);
  const modeRef = useRef(mode);
  const frameRef = useRef(frame);
  const valuesRef = useRef(values);
  const extractedRef = useRef(extracted);
  const statusRef = useRef(status);
  const animRef = useRef<HeapAnimation>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    frameRef.current = frame;
  }, [frame]);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  useEffect(() => {
    extractedRef.current = extracted;
  }, [extracted]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const sketch: SketchFunction = useCallback((p) => {
    p.setup = () => {
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.textAlign(p.CENTER, p.CENTER);
      p.textFont("monospace");
    };

    p.draw = () => {
      p.background(0, 0, 100);
      drawHeapScene(
        p,
        modeRef.current,
        valuesRef.current,
        frameRef.current,
        statusRef.current,
        animRef.current,
        extractedRef.current
      );
    };
  }, []);

  const reset = () => {
    const next = mode === "deap" ? normalizeDeap(DEAP_SAMPLE) : buildMinMaxHeap(MINMAX_SAMPLE);
    setValues(next);
    setExtracted([]);
    animRef.current = null;
    setAnimating(false);
    setStatus(`${active.label} reset.`);
  };

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const insertValue = async () => {
    const parsed = Number.parseInt(input, 10);
    if (Number.isNaN(parsed) || animating) return;
    setAnimating(true);
    const current = valuesRef.current;
    const appended = [...current, parsed];
    setValues(appended);
    setInput("");
    animRef.current = {
      type: "insert",
      value: parsed,
      fromIdx: appended.length - 1,
      toIdx: 0,
      start: Date.now(),
      duration: MOVE_MS,
    };
    setStatus(`Inserted ${parsed}; bubbling through the alternating min/max levels.`);
    await wait(MOVE_MS);
    if (!mountedRef.current) return;
    const next = modeRef.current === "deap" ? normalizeDeap(appended) : minMaxInsert(current, parsed);
    setValues(next);
    valuesRef.current = next;
    animRef.current = null;
    setAnimating(false);
    setStatus(
      modeRef.current === "minmax"
        ? `Inserted ${parsed}; root is min ${next[0]}, max is ${minMaxMax(next)}.`
        : `Inserted ${parsed}; min and max sides were repartitioned.`
    );
  };

  const deleteExtreme = async (kind: "min" | "max") => {
    if (animating) return;
    const current = valuesRef.current;
    if (current.length === 0) return;
    setAnimating(true);
    const index =
      modeRef.current === "minmax"
        ? kind === "min"
          ? 0
          : minMaxMaxIndex(current)
        : kind === "min"
          ? current.indexOf(Math.min(...current))
          : current.indexOf(Math.max(...current));
    const extreme = current[index];
    animRef.current = {
      type: "delete",
      value: extreme,
      fromIdx: index,
      toIdx: -1,
      start: Date.now(),
      duration: MOVE_MS,
    };
    setStatus(`Deleting ${kind}: ${extreme}. The node moves out before the heap repairs.`);
    await wait(MOVE_MS);
    if (!mountedRef.current) return;
    const remaining = current.filter((_, i) => i !== index);
    const next = modeRef.current === "deap" ? normalizeDeap(remaining) : buildMinMaxHeap(remaining);
    setValues(next);
    valuesRef.current = next;
    setExtracted((out) => [...out.slice(-5), extreme]);
    animRef.current = null;
    setAnimating(false);
    setStatus(
      modeRef.current === "minmax"
        ? `Deleted ${kind}: ${extreme}. Remaining min ${next[0] ?? "-"}, max ${next.length ? minMaxMax(next) : "-"}.`
        : `Deleted ${kind}: ${extreme}. Min/max sides were repaired.`
    );
  };

  const selectFrame = (index: number) => {
    setFrame(index);
    setStatus(`${active.operations[index]} selected.`);
  };

  return (
    <div className="space-y-5">
      <P5Wrapper sketch={sketch} className="min-h-[380px]" />

      {mode === "minmax" || mode === "deap" ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <input
              type="number"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") insertValue();
              }}
              placeholder="Value"
              className="ui-input w-24"
            />
            <button type="button" onClick={insertValue} disabled={animating} className="ui-btn-primary">
              Insert
            </button>
            <button type="button" onClick={() => deleteExtreme("min")} disabled={animating} className="ui-btn-secondary">
              Delete Min
            </button>
            <button type="button" onClick={() => deleteExtreme("max")} disabled={animating} className="ui-btn-secondary">
              {mode === "minmax" ? "Delete Max (max level)" : "Delete Max"}
            </button>
            <button type="button" onClick={reset} disabled={animating} className="ui-btn-secondary">
              Reset
            </button>
          </div>
          <p className="ui-caption text-center">
            Size: {values.length} · Min: {values.length ? Math.min(...values) : "-"} · Max:{" "}
            {values.length ? Math.max(...values) : "-"} · {status}
          </p>
          {mode === "minmax" ? (
            <p className="ui-caption text-center">
              This is not a normal min heap: min levels and max levels alternate, so delete-max removes the larger
              root child.
            </p>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {active.operations.map((operation, index) => (
            <button
              key={operation}
              type="button"
              onClick={() => selectFrame(index)}
              className={index === frame ? "ui-btn-primary" : "ui-btn-secondary"}
            >
              {operation}
            </button>
          ))}
          <button
            type="button"
            onClick={() => selectFrame((frame + 1) % active.operations.length)}
            className="ui-btn-secondary"
          >
            Next
          </button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-hairline p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-display text-[20px] font-medium leading-[1.4] text-ink">
              {active.label}
            </h3>
            <span className="rounded-full bg-surface-soft px-3 py-1 font-mono text-xs text-charcoal">
              Ch. 9
            </span>
          </div>
          <p className="text-sm leading-[1.43] text-body">{active.summary}</p>
        </div>

        <div className="rounded-lg border border-hairline p-4">
          <h4 className="mb-3 font-mono text-xs font-medium uppercase text-mute">Operations</h4>
          <div className="space-y-2">
            {active.operations.map((operation, index) => (
              <div
                key={operation}
                className={`flex items-center justify-between gap-3 border-b border-hairline py-2 last:border-b-0 ${
                  index === frame ? "text-ink" : "text-charcoal"
                }`}
              >
                <span className="text-sm font-medium">{operation}</span>
                <span className="font-mono text-xs">{operationCost(mode, operation)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function operationCost(mode: HeapMode, operation: string) {
  if (mode === "binomial" && (operation === "Insert" || operation === "Combine")) return "O(1) amortized";
  if (mode === "fibonacci" && (operation === "Insert" || operation === "Decrease Key" || operation === "Cut")) return "O(1) amortized";
  if (operation === "Reset" || operation === "Tree A" || operation === "Tree B" || operation === "Root list") return "view";
  return "O(log n)";
}

function drawHeapScene(
  p: P5Like,
  mode: HeapMode,
  values: number[],
  frame: number,
  status: string,
  anim: HeapAnimation,
  extracted: number[]
) {
  drawTitle(p, MODES[mode].label, status);
  if (mode === "minmax") drawMinMaxHeap(p, values, anim, extracted);
  if (mode === "deap") drawDeap(p, values, anim, extracted);
  if (mode === "leftist") drawLeftist(p, frame);
  if (mode === "binomial") drawBinomial(p, frame);
  if (mode === "fibonacci") drawFibonacci(p, frame);
}

function drawTitle(p: P5Like, title: string, subtitle: string) {
  p.noStroke();
  p.fill(0, 0, 8);
  p.textSize(15);
  p.text(title, p.width / 2, 26);
  p.fill(0, 0, 48);
  p.textSize(11);
  p.text(subtitle, p.width / 2, 46);
}

function drawMinMaxHeap(p: P5Like, values: number[], anim: HeapAnimation, extracted: number[]) {
  drawCompleteTree(p, values, 92, (level) => level % 2 === 0, anim);
  drawMinMaxAnnotations(p, values, anim);
  drawExtractedRow(p, extracted);
  drawPill(p, p.width / 2, 320, "Not a min heap: levels alternate min, max, min; delete-max targets the max level.");
}

function drawDeap(p: P5Like, values: number[], anim: HeapAnimation, extracted: number[]) {
  drawNode(p, p.width / 2, 86, "empty", true, false);
  const leftValues = values.filter((_, index) => index % 2 === 0);
  const rightValues = values.filter((_, index) => index % 2 === 1);
  drawSubHeap(p, leftValues, p.width / 2 - 150, 170, "min side");
  drawSubHeap(p, rightValues, p.width / 2 + 150, 170, "max side");
  drawLine(p, p.width / 2, 108, p.width / 2 - 150, 146, false);
  drawLine(p, p.width / 2, 108, p.width / 2 + 150, 146, false);
  if (anim) drawMovingNode(p, anim, p.width / 2, 92, p.width * 0.28);
  drawExtractedRow(p, extracted);
  drawPill(p, p.width / 2, 320, "Partner check: min-side value <= corresponding max-side value.");
}

function drawSubHeap(p: P5Like, values: number[], x: number, y: number, label: string) {
  p.noStroke();
  p.fill(0, 0, 48);
  p.textSize(11);
  p.text(label, x, y - 54);
  drawCompleteTreeAt(p, values.slice(0, 7), x, y, 74, () => false);
}

function drawLeftist(p: P5Like, frame: number) {
  const shift = frame >= 2 ? 0 : -110;
  const nodes = [
    { x: p.width / 2 + shift, y: 100, label: frame === 3 ? "5" : "2" },
    { x: p.width / 2 - 90 + shift, y: 180, label: "7" },
    { x: p.width / 2 + 90 + shift, y: 180, label: frame >= 2 ? "5" : "11" },
    { x: p.width / 2 + 145 + shift, y: 260, label: "18" },
  ];
  drawTreeFromPoints(p, nodes, [
    [0, 1],
    [0, 2],
    [2, 3],
  ]);
  if (frame < 2) {
    const b = [
      { x: p.width / 2 + 190, y: 120, label: "5" },
      { x: p.width / 2 + 135, y: 205, label: "8" },
      { x: p.width / 2 + 245, y: 205, label: "50" },
    ];
    drawTreeFromPoints(p, b, [
      [0, 1],
      [0, 2],
    ]);
  }
  drawPill(p, p.width / 2, 320, frame >= 2 ? "combine follows right paths, then swaps children to restore leftist property" : "choose Tree A or Tree B before combine");
}

function drawBinomial(p: P5Like, frame: number) {
  const roots = frame >= 2 ? ["3", "8"] : frame === 1 ? ["3", "8", "12"] : ["3", "8", "18"];
  roots.forEach((root, index) => {
    const x = p.width / 2 - 150 + index * 150;
    drawNode(p, x, 112, root, index === 0, false);
    drawNode(p, x - 45, 200, String(Number(root) + 7), false, false);
    drawNode(p, x + 45, 200, String(Number(root) + 14), false, false);
    drawLine(p, x, 134, x - 45, 178, false);
    drawLine(p, x, 134, x + 45, 178, false);
    if (index > 0) drawLine(p, x - 105, 112, x - 45, 112, false, true);
  });
  drawPill(p, p.width / 2, 320, frame === 3 ? "delete-min removes the smallest root, then consolidates equal degrees" : "root list operations are cheap until consolidation");
}

function drawFibonacci(p: P5Like, frame: number) {
  const roots = ["6", "12", frame >= 1 ? "4" : "18", "24"];
  roots.forEach((root, index) => {
    const x = p.width / 2 - 210 + index * 140;
    drawNode(p, x, 118, root, index === 2, frame >= 2 && index === 2);
    if (index > 0) drawLine(p, x - 95, 118, x - 45, 118, false, true);
    if (index === 1) {
      drawNode(p, x, 210, frame >= 1 ? "15->4" : "15", false, frame >= 1);
      drawLine(p, x, 140, x, 188, false);
    }
  });
  drawPill(p, p.width / 2, 320, frame === 1 ? "decrease-key may violate parent order" : frame === 2 ? "cut moves the node to the root list and may mark parent" : frame === 3 ? "delete-min consolidates roots by degree" : "lazy root list keeps insert/combine cheap");
}

function drawCompleteTree(
  p: P5Like,
  values: number[],
  y0: number,
  minLevel: (level: number) => boolean,
  anim: HeapAnimation
) {
  drawCompleteTreeAt(p, values, p.width / 2, y0, p.width * 0.28, minLevel, anim);
}

function drawCompleteTreeAt(
  p: P5Like,
  values: number[],
  rootX: number,
  rootY: number,
  gap: number,
  minLevel: (level: number) => boolean,
  anim: HeapAnimation = null
) {
  const positions = values.map((value, index) => ({ value, ...completeTreePoint(index, rootX, rootY, gap) }));
  const skipped = anim ? new Set([anim.fromIdx]) : new Set<number>();
  positions.forEach((item, index) => {
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    if (positions[left]) drawLine(p, item.x, item.y + 22, positions[left].x, positions[left].y - 22, false);
    if (positions[right]) drawLine(p, item.x, item.y + 22, positions[right].x, positions[right].y - 22, false);
  });
  positions.forEach((item, index) => {
    if (!skipped.has(index)) drawNode(p, item.x, item.y, String(item.value), minLevel(item.level), false);
  });
  if (anim) drawMovingNode(p, anim, rootX, rootY, gap);
}

function drawMinMaxAnnotations(p: P5Like, values: number[], anim: HeapAnimation) {
  if (values.length === 0) return;
  const rootX = p.width / 2;
  const rootY = 92;
  const gap = p.width * 0.28;
  const root = completeTreePoint(0, rootX, rootY, gap);
  p.noStroke();
  p.fill(0, 0, 36);
  p.textSize(10);
  p.text("min level", root.x - 70, root.y);
  if (values.length <= 1) return;
  const maxIndex = minMaxMaxIndex(values);
  const maxPoint = completeTreePoint(maxIndex, rootX, rootY, gap);
  if (!anim || anim.fromIdx !== maxIndex) drawNode(p, maxPoint.x, maxPoint.y, String(values[maxIndex]), false, true);
  p.noStroke();
  p.fill(0, 0, 36);
  p.textSize(10);
  p.text("max level", rootX + 112, root.y + 70);
  p.text("delete max", maxPoint.x, maxPoint.y - 34);
}

function drawTreeFromPoints(
  p: P5Like,
  nodes: Array<{ x: number; y: number; label: string }>,
  edges: Array<[number, number]>
) {
  edges.forEach(([from, to]) => drawLine(p, nodes[from].x, nodes[from].y + 22, nodes[to].x, nodes[to].y - 22, false));
  nodes.forEach((node, index) => drawNode(p, node.x, node.y, node.label, index === 0, false));
}

function drawNode(p: P5Like, x: number, y: number, label: string, dark: boolean, accent: boolean) {
  p.stroke(accent ? 0 : 0, 0, accent ? 0 : 72);
  p.strokeWeight(accent ? 3 : 1.5);
  p.fill(dark ? 0 : 0, 0, dark ? 0 : 100);
  p.circle(x, y, 46);
  p.noStroke();
  p.fill(dark ? 100 : 0, 0, dark ? 100 : 10);
  p.textSize(label.length > 4 ? 9 : 12);
  p.text(label, x, y);
}

function drawLine(p: P5Like, x1: number, y1: number, x2: number, y2: number, red: boolean, dashed = false) {
  p.stroke(red ? 0 : 0, red ? 75 : 0, red ? 55 : 78);
  p.strokeWeight(red ? 3 : 1.5);
  if (!dashed) {
    p.line(x1, y1, x2, y2);
    return;
  }
  for (let i = 0; i < 10; i += 2) {
    p.line(p.lerp(x1, x2, i / 10), p.lerp(y1, y2, i / 10), p.lerp(x1, x2, (i + 1) / 10), p.lerp(y1, y2, (i + 1) / 10));
  }
}

function drawPill(p: P5Like, x: number, y: number, label: string) {
  p.rectMode(p.CENTER);
  p.noStroke();
  p.fill(0, 0, 97);
  p.rect(x, y, Math.min(p.width - 48, label.length * 7 + 34), 34, 17);
  p.fill(0, 0, 35);
  p.textSize(11);
  p.text(label, x, y);
}

function completeTreePoint(index: number, rootX: number, rootY: number, gap: number): Point & { level: number } {
  const level = Math.floor(Math.log2(index + 1));
  const first = 2 ** level - 1;
  const offset = index - first;
  const count = 2 ** level;
  return {
    level,
    x: rootX + (offset - (count - 1) / 2) * (gap / Math.max(1, level)),
    y: rootY + level * 70,
  };
}

function outputPoint(p: P5Like, index: number): Point {
  return { x: p.width / 2 - 105 + index * 42, y: p.height - 48 };
}

function drawMovingNode(p: P5Like, anim: Exclude<HeapAnimation, null>, rootX: number, rootY: number, gap: number) {
  const from = completeTreePoint(anim.fromIdx, rootX, rootY, gap);
  const to = anim.toIdx >= 0 ? completeTreePoint(anim.toIdx, rootX, rootY, gap) : outputPoint(p, 2);
  const t = Math.min(1, (Date.now() - anim.start) / anim.duration);
  const eased = 1 - (1 - t) * (1 - t);
  drawNode(p, p.lerp(from.x, to.x, eased), p.lerp(from.y, to.y, eased), String(anim.value), true, true);
}

function drawExtractedRow(p: P5Like, extracted: number[]) {
  p.noStroke();
  p.fill(0, 0, 48);
  p.textSize(11);
  p.text("Extracted", p.width / 2, p.height - 82);
  extracted.slice(-6).forEach((value, index) => {
    const point = outputPoint(p, index);
    drawNode(p, point.x, point.y, String(value), true, false);
  });
}

function isMinLevelIndex(index: number) {
  return Math.floor(Math.log2(index + 1)) % 2 === 0;
}

function grandparent(index: number) {
  if (index < 3) return -1;
  return Math.floor((Math.floor((index - 1) / 2) - 1) / 2);
}

function bubbleUpMin(heap: number[], index: number) {
  let i = index;
  while (grandparent(i) >= 0 && heap[i] < heap[grandparent(i)]) {
    const gp = grandparent(i);
    [heap[i], heap[gp]] = [heap[gp], heap[i]];
    i = gp;
  }
}

function bubbleUpMax(heap: number[], index: number) {
  let i = index;
  while (grandparent(i) >= 0 && heap[i] > heap[grandparent(i)]) {
    const gp = grandparent(i);
    [heap[i], heap[gp]] = [heap[gp], heap[i]];
    i = gp;
  }
}

function minMaxInsert(current: number[], value: number): number[] {
  const heap = [...current, value];
  let i = heap.length - 1;
  if (i === 0) return heap;
  const parent = Math.floor((i - 1) / 2);
  if (isMinLevelIndex(i)) {
    if (heap[i] > heap[parent]) {
      [heap[i], heap[parent]] = [heap[parent], heap[i]];
      i = parent;
      bubbleUpMax(heap, i);
    } else {
      bubbleUpMin(heap, i);
    }
  } else if (heap[i] < heap[parent]) {
    [heap[i], heap[parent]] = [heap[parent], heap[i]];
    i = parent;
    bubbleUpMin(heap, i);
  } else {
    bubbleUpMax(heap, i);
  }
  return heap;
}

function buildMinMaxHeap(values: number[]) {
  return values.reduce<number[]>((heap, value) => minMaxInsert(heap, value), []);
}

function minMaxMaxIndex(heap: number[]) {
  if (heap.length <= 1) return 0;
  if (heap.length === 2) return 1;
  return heap[1] >= heap[2] ? 1 : 2;
}

function minMaxMax(heap: number[]) {
  return heap[minMaxMaxIndex(heap)];
}

function normalizeDeap(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const half = Math.ceil(sorted.length / 2);
  const minSide = sorted.slice(0, half);
  const maxSide = sorted.slice(half).reverse();
  const out: number[] = [];
  for (let i = 0; i < half; i++) {
    if (minSide[i] !== undefined) out.push(minSide[i]);
    if (maxSide[i] !== undefined) out.push(maxSide[i]);
  }
  return out;
}
