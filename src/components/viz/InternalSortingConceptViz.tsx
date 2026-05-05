"use client";

import { useMemo, useState } from "react";

const SEARCH_KEYS = [3, 7, 12, 18, 21, 27, 31, 36, 44, 52, 59, 63, 70, 78, 84];
const INSERTION_CASES = {
  worst: {
    label: "Worst case",
    values: [5, 4, 3, 2, 1],
  },
  loo: {
    label: "One LOO record",
    values: [2, 3, 4, 5, 1],
  },
};

type InsertionCase = keyof typeof INSERTION_CASES;

type InsertFrame = {
  values: (number | null)[];
  sortedThrough: number;
  current: number | null;
  shifted: number[];
  inserted: number | null;
  message: string;
};

type MergePhase = "all" | "divide" | "merge";

type QuickFrame = {
  values: number[];
  low: number;
  high: number;
  i: number;
  j: number | null;
  pivot: number;
  pivotIndex: number;
  fixed: number[];
  activeRange: [number, number] | null;
  message: string;
};

const QUICK_SAMPLE = [24, 9, 29, 14, 19, 27, 3, 11, 8, 21];

function binaryTrace(target: number) {
  let low = 0;
  let high = SEARCH_KEYS.length - 1;
  const checked: number[] = [];

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    checked.push(mid);
    if (SEARCH_KEYS[mid] === target) break;
    if (target < SEARCH_KEYS[mid]) high = mid - 1;
    else low = mid + 1;
  }

  return checked;
}

function sequentialTrace(target: number) {
  const checked: number[] = [];
  for (let index = SEARCH_KEYS.length - 1; index >= 0; index--) {
    checked.push(index);
    if (SEARCH_KEYS[index] === target) break;
  }
  return checked;
}

function SearchPanel() {
  const [target, setTarget] = useState(52);
  const sequential = useMemo(() => sequentialTrace(target), [target]);
  const binary = useMemo(() => binaryTrace(target), [target]);
  const sequentialSet = new Set(sequential);
  const binarySet = new Set(binary);

  return (
    <div className="space-y-5">
      <p className="text-center text-sm leading-[1.43] text-body">
        Ordered files make logarithmic search possible. Compare the book&apos;s backward sequential
        scan with binary search on the same ordered keys.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <label className="ui-label">Target</label>
        <select
          value={target}
          onChange={(event) => setTarget(Number(event.target.value))}
          className="ui-input min-w-[6rem]"
        >
          {SEARCH_KEYS.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SearchRow title="SEQSRCH" checked={sequentialSet} note={`${sequential.length} comparisons`} />
        <SearchRow title="BINSRCH" checked={binarySet} note={`${binary.length} comparisons`} />
      </div>

      <p className="ui-caption text-center">
        Fibonacci search uses the same ordered-file idea but chooses split points from Fibonacci
        offsets to avoid division.
      </p>
    </div>
  );
}

function SearchRow({
  title,
  checked,
  note,
}: {
  title: string;
  checked: Set<number>;
  note: string;
}) {
  return (
    <div className="rounded-lg border border-hairline p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="font-mono text-xs font-medium uppercase tracking-wide text-mute">{title}</h4>
        <span className="font-mono text-xs text-charcoal">{note}</span>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {SEARCH_KEYS.map((key, index) => (
          <span
            key={`${title}-${key}`}
            className={`rounded border px-2 py-2 text-center font-mono text-xs ${
              checked.has(index)
                ? "border-hairline-strong bg-surface-soft text-ink"
                : "border-hairline text-mute"
            }`}
          >
            {key}
          </span>
        ))}
      </div>
    </div>
  );
}

function insertionFrames(input: number[]): InsertFrame[] {
  const values = [...input];
  const frames: InsertFrame[] = [
    {
      values: [...values],
      sortedThrough: 0,
      current: null,
      shifted: [],
      inserted: null,
      message: "R1 is the initial ordered prefix; R0 is a dummy key smaller than every real key.",
    },
  ];

  for (let i = 1; i < values.length; i++) {
    const temp = values[i];
    let j = i - 1;
    const shifted: number[] = [];

    frames.push({
      values: [...values],
      sortedThrough: i - 1,
      current: i,
      shifted: [],
      inserted: null,
      message: `T = R${i + 1} = ${temp}. Compare T with the ordered prefix R1..R${i}.`,
    });

    while (j >= 0 && temp < values[j]) {
      values[j + 1] = values[j];
      shifted.push(j + 1);
      frames.push({
        values: [...values],
        sortedThrough: i,
        current: j,
        shifted: [...shifted],
        inserted: null,
        message: `${values[j]} shifts one position right because T = ${temp} is smaller.`,
      });
      j--;
    }

    values[j + 1] = temp;
    frames.push({
      values: [...values],
      sortedThrough: i,
      current: null,
      shifted: [],
      inserted: j + 1,
      message: `Insert T = ${temp} at R${j + 2}; the prefix R1..R${i + 1} is ordered.`,
    });
  }

  return frames;
}

function InsertionPanel() {
  const [caseName, setCaseName] = useState<InsertionCase>("loo");
  const [step, setStep] = useState(0);
  const selected = INSERTION_CASES[caseName];
  const frames = useMemo(() => insertionFrames(selected.values), [selected.values]);
  const frame = frames[Math.min(step, frames.length - 1)];

  const resetToCase = (nextCase: InsertionCase) => {
    setCaseName(nextCase);
    setStep(0);
  };

  return (
    <div className="space-y-5">
      <p className="text-center text-sm leading-[1.43] text-body">
        INSORT keeps an ordered prefix and inserts the next record into that prefix. The dummy
        record R0 has key -infinity, so INSERT can stop without a separate left-bound test.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {(Object.keys(INSERTION_CASES) as InsertionCase[]).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => resetToCase(name)}
            className={caseName === name ? "ui-btn-primary" : "ui-btn-secondary"}
          >
            {INSERTION_CASES[name].label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-hairline p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h4 className="font-mono text-xs font-medium uppercase tracking-wide text-mute">
            INSERT / INSORT trace
          </h4>
          <span className="font-mono text-xs text-charcoal">
            Step {step + 1} / {frames.length}
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2">
          <RecordCell label="R0" value="-inf" tone="dummy" />
          {frame.values.map((value, index) => (
            <RecordCell
              key={`${index}-${value ?? "gap"}`}
              label={`R${index + 1}`}
              value={value === null ? "" : String(value)}
              tone={
                frame.inserted === index
                  ? "inserted"
                  : frame.shifted.includes(index)
                    ? "shifted"
                    : frame.current === index
                      ? "current"
                      : index <= frame.sortedThrough
                        ? "sorted"
                        : "plain"
              }
            />
          ))}
        </div>

        <p className="mt-4 min-h-10 text-center text-sm leading-[1.43] text-body">
          {frame.message}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setStep((current) => Math.max(0, current - 1))}
          disabled={step === 0}
          className="ui-btn-secondary"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => setStep((current) => Math.min(frames.length - 1, current + 1))}
          disabled={step >= frames.length - 1}
          className="ui-btn-primary"
        >
          Next
        </button>
        <button type="button" onClick={() => setStep(0)} className="ui-btn-secondary">
          Reset
        </button>
      </div>

      <div className="grid gap-3 border-t border-hairline pt-4 md:grid-cols-3">
        <Fact label="Worst case" value="1 + 2 + ... + n shifts, O(n^2)" />
        <Fact label="Nearly sorted" value="Only LOO records trigger long inserts" />
        <Fact label="Stable" value="Equal keys stay in input order" />
      </div>
    </div>
  );
}

function RecordCell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "dummy" | "sorted" | "current" | "shifted" | "inserted" | "plain";
}) {
  const toneClass = {
    dummy: "border-hairline bg-surface-soft text-mute",
    sorted: "border-hairline-strong bg-surface-soft text-ink",
    current: "border-hairline-strong bg-canvas text-ink",
    shifted: "border-hairline-strong bg-surface-soft text-charcoal",
    inserted: "border-ink bg-ink text-white",
    plain: "border-hairline bg-canvas text-body",
  }[tone];

  return (
    <div className={`min-h-20 rounded-lg border px-2 py-3 text-center ${toneClass}`}>
      <div className="font-mono text-[11px] text-current opacity-70">{label}</div>
      <div className="mt-2 font-mono text-lg font-medium">{value}</div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-hairline p-3">
      <div className="font-mono text-xs font-medium uppercase tracking-wide text-mute">{label}</div>
      <p className="mt-2 text-sm leading-[1.43] text-body">{value}</p>
    </div>
  );
}

function quickFrames(input: number[]): QuickFrame[] {
  const values = [...input];
  const frames: QuickFrame[] = [];
  const fixed = new Set<number>();

  const pushFrame = (
    low: number,
    high: number,
    i: number,
    j: number | null,
    pivotIndex: number,
    message: string
  ) => {
    frames.push({
      values: [...values],
      low,
      high,
      i,
      j,
      pivot: values[pivotIndex],
      pivotIndex,
      fixed: [...fixed],
      activeRange: low < high ? [low, high] : null,
      message,
    });
  };

  const partition = (low: number, high: number) => {
    const pivot = values[high];
    let i = low - 1;
    pushFrame(low, high, i, null, high, `Choose pivot ${pivot} at high = ${high}.`);

    for (let j = low; j <= high - 1; j++) {
      pushFrame(low, high, i, j, high, `Compare arr[${j}] = ${values[j]} with pivot ${pivot}.`);
      if (values[j] < pivot) {
        i++;
        [values[i], values[j]] = [values[j], values[i]];
        pushFrame(
          low,
          high,
          i,
          j,
          high,
          `${values[i]} is smaller than pivot; expand the left partition and swap.`
        );
      }
    }

    [values[i + 1], values[high]] = [values[high], values[i + 1]];
    fixed.add(i + 1);
    pushFrame(
      low,
      high,
      i + 1,
      null,
      i + 1,
      `Move pivot into index ${i + 1}; it is now in its final sorted position.`
    );
    return i + 1;
  };

  const sort = (low: number, high: number) => {
    if (low > high) return;
    if (low === high) {
      fixed.add(low);
      pushFrame(low, high, low, null, low, `Base case at index ${low}; one element is already sorted.`);
      return;
    }

    const pivotIndex = partition(low, high);
    sort(low, pivotIndex - 1);
    sort(pivotIndex + 1, high);
  };

  sort(0, values.length - 1);
  return frames;
}

function QuickSortPanel() {
  const frames = useMemo(() => quickFrames(QUICK_SAMPLE), []);
  const [step, setStep] = useState(0);
  const frame = frames[Math.min(step, frames.length - 1)];

  return (
    <div className="space-y-5">
      <p className="text-center text-sm leading-[1.43] text-body">
        Lomuto partition chooses the last element as pivot, scans left to right with j, and keeps i
        as the boundary of elements smaller than the pivot.
      </p>

      <div className="rounded-lg border border-hairline p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h4 className="font-mono text-xs font-medium uppercase tracking-wide text-mute">
            QuickSort partition trace
          </h4>
          <span className="font-mono text-xs text-charcoal">
            Step {step + 1} / {frames.length}
          </span>
        </div>

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-hairline bg-surface-soft px-3 py-2 font-mono text-xs text-charcoal">
          <span>Active subfile: {formatRange(frame.activeRange)}</span>
          <span>Initial data: [{QUICK_SAMPLE.join(", ")}]</span>
        </div>

        <div className="grid grid-cols-5 gap-2 md:grid-cols-10">
          {frame.values.map((value, index) => (
            <QuickCell key={`${index}-${value}`} value={value} index={index} frame={frame} />
          ))}
        </div>

        <div className="mt-4 grid gap-2 border-t border-hairline pt-4 font-mono text-xs text-charcoal md:grid-cols-5">
          <span>low: {frame.low}</span>
          <span>high: {frame.high}</span>
          <span>i: {frame.i}</span>
          <span>j: {frame.j ?? "-"}</span>
          <span>pivot: {frame.pivot}</span>
        </div>

        <p className="mt-4 min-h-10 text-center text-sm leading-[1.43] text-body">
          {frame.message}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setStep((current) => Math.max(0, current - 1))}
          disabled={step === 0}
          className="ui-btn-secondary"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => setStep((current) => Math.min(frames.length - 1, current + 1))}
          disabled={step >= frames.length - 1}
          className="ui-btn-primary"
        >
          Next
        </button>
        <button type="button" onClick={() => setStep(0)} className="ui-btn-secondary">
          Reset
        </button>
      </div>

      <div className="grid gap-3 border-t border-hairline pt-4 md:grid-cols-3">
        <Fact label="Pivot" value="This lab uses the last element as pivot" />
        <Fact label="Partition" value="Left side < pivot; right side >= pivot" />
        <Fact label="Recursion" value="Sort low..pi-1 and pi+1..high" />
      </div>
    </div>
  );
}

function QuickCell({
  value,
  index,
  frame,
}: {
  value: number;
  index: number;
  frame: QuickFrame;
}) {
  const inRange =
    frame.activeRange !== null && index >= frame.activeRange[0] && index <= frame.activeRange[1];
  const isPivot = index === frame.pivotIndex;
  const isJ = index === frame.j;
  const isBoundary = index === frame.i;
  const isFixed = frame.fixed.includes(index);
  const isRangeStart = frame.activeRange?.[0] === index;
  const isRangeEnd = frame.activeRange?.[1] === index;

  const tone = isFixed
    ? "border-ink bg-ink text-white"
    : isPivot
      ? "border-ink bg-surface-soft text-ink"
      : isJ || isBoundary
        ? "border-hairline-strong bg-surface-soft text-ink"
        : inRange
          ? "border-hairline-strong bg-canvas text-ink"
          : "border-hairline bg-canvas text-mute";
  const rangeOutline = inRange
    ? `ring-2 ring-ink ring-offset-2 ring-offset-canvas ${
        isRangeStart ? "rounded-l-lg" : ""
      } ${isRangeEnd ? "rounded-r-lg" : ""}`
    : "";

  return (
    <div className={`min-h-24 rounded-lg border px-2 py-3 text-center ${tone} ${rangeOutline}`}>
      <div className="font-mono text-[11px] opacity-70">arr[{index}]</div>
      <div className="mt-2 font-mono text-xl font-medium">{value}</div>
      <div className="mt-2 min-h-4 font-mono text-[11px] opacity-75">
        {isPivot ? "pivot" : isJ ? "j" : isBoundary ? "i" : isFixed ? "fixed" : ""}
      </div>
    </div>
  );
}

function formatRange(range: [number, number] | null) {
  if (!range) return "base case";
  return `arr[${range[0]}..${range[1]}]`;
}

function MergeSortPanel() {
  const [phase, setPhase] = useState<MergePhase>("all");
  const showDivide = phase === "all" || phase === "divide";
  const showMerge = phase === "all" || phase === "merge";

  return (
    <div className="space-y-5">
      <p className="text-center text-sm leading-[1.43] text-body">
        Two-way merge sort divides the file into two subfiles, recursively sorts both halves, then
        merges adjacent sorted runs back into one sorted file.
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {[
          ["all", "Full trace"],
          ["divide", "Divide"],
          ["merge", "Merge"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setPhase(value as MergePhase)}
            className={phase === value ? "ui-btn-primary" : "ui-btn-secondary"}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mx-auto w-full max-w-[680px]">
        <svg
          className="block h-auto w-full"
          viewBox="0 0 680 430"
          role="img"
          aria-label="Merge sort divide and conquer diagram"
        >
          <defs>
            <marker
              id="merge-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8 Z" fill="var(--color-ink)" />
            </marker>
          </defs>

          <SvgLabel x={94} y={42} text="Unsorted" />
          <SvgRun x={178} y={20} values={[70, 30, 50, 10]} />

          <g opacity={showDivide ? 1 : 0.18}>
            <DiagramLine x1={270} y1={64} x2={176} y2={110} />
            <DiagramLine x1={270} y1={64} x2={410} y2={110} />
            <SvgRun x={116} y={112} values={[70, 30]} />
            <SvgRun x={410} y={112} values={[50, 10]} />

            <DiagramLine x1={158} y1={156} x2={94} y2={205} />
            <DiagramLine x1={158} y1={156} x2={224} y2={205} />
            <DiagramLine x1={452} y1={156} x2={386} y2={205} />
            <DiagramLine x1={452} y1={156} x2={514} y2={205} />
            <SvgRun x={78} y={208} values={[70]} />
            <SvgRun x={208} y={208} values={[30]} />
            <SvgRun x={370} y={208} values={[50]} />
            <SvgRun x={498} y={208} values={[10]} />
          </g>

          <g opacity={showMerge ? 1 : 0.18}>
            <DiagramLine x1={100} y1={252} x2={158} y2={298} />
            <DiagramLine x1={230} y1={252} x2={158} y2={298} />
            <DiagramLine x1={392} y1={252} x2={452} y2={298} />
            <DiagramLine x1={520} y1={252} x2={452} y2={298} />
            <SvgRun x={116} y={300} values={[30, 70]} sorted />
            <SvgRun x={410} y={300} values={[10, 50]} sorted />

            <DiagramLine x1={158} y1={344} x2={270} y2={382} />
            <DiagramLine x1={452} y1={344} x2={270} y2={382} />
          </g>

          <SvgLabel x={112} y={406} text="Sorted" />
          <SvgRun x={178} y={382} values={[10, 30, 50, 70]} sorted strong />

          <g className="hidden md:block">
            <path d="M600 80 h20 v130 h-20" fill="none" stroke="var(--color-ink)" strokeDasharray="4 4" />
            <SvgLabel x={634} y={152} text="Divide" anchor="start" />
            <path d="M600 248 h20 v130 h-20" fill="none" stroke="var(--color-ink)" strokeDasharray="4 4" />
            <SvgLabel x={634} y={306} text="Conquer" anchor="start" />
            <SvgLabel x={634} y={330} text="and merge" anchor="start" />
          </g>
        </svg>
      </div>

      <div className="grid gap-3 border-t border-hairline pt-4 md:grid-cols-3">
        <Fact label="MERGE" value="Combines two sorted subfiles in linear time" />
        <Fact label="Passes" value="Run sizes double: 1, 2, 4, ..." />
        <Fact label="Cost" value="O(n log n), stable, needs auxiliary storage" />
      </div>
    </div>
  );
}

function DiagramLine({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="var(--color-ink)"
      strokeWidth="1.5"
      markerEnd="url(#merge-arrow)"
    />
  );
}

function SvgLabel({
  x,
  y,
  text,
  anchor = "end",
}: {
  x: number;
  y: number;
  text: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="middle"
      fill="var(--color-charcoal)"
      fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      fontSize="14"
    >
      {text}
    </text>
  );
}

function SvgRun({
  x,
  y,
  values,
  sorted = false,
  strong = false,
}: {
  x: number;
  y: number;
  values: number[];
  sorted?: boolean;
  strong?: boolean;
}) {
  const cell = 46;
  const height = 38;
  const fill = strong ? "var(--color-ink)" : sorted ? "var(--color-surface-soft)" : "var(--color-canvas)";
  const stroke = sorted ? "var(--color-hairline-strong)" : "var(--color-charcoal)";
  const textFill = strong ? "var(--color-on-primary)" : "var(--color-ink)";

  return (
    <g>
      {values.map((value, index) => (
        <g key={`${x}-${y}-${index}-${value}`} transform={`translate(${x + index * cell} ${y})`}>
          <rect width={cell} height={height} fill={fill} stroke={stroke} strokeWidth="1" />
          <text
            x={cell / 2}
            y={height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={textFill}
            fontFamily="var(--font-geist-mono), ui-monospace, monospace"
            fontSize="18"
          >
            {value}
          </text>
        </g>
      ))}
    </g>
  );
}

function LowerBoundPanel() {
  return (
    <div className="space-y-5">
      <p className="text-center text-sm leading-[1.43] text-body">
        A comparison sort can be represented as a decision tree. To sort n distinct records, the tree
        needs at least one leaf for each of the n! input permutations.
      </p>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          ["n", "3", "4", "5", "10"],
          ["n!", "6", "24", "120", "3,628,800"],
          ["ceil(log2 n!)", "3", "5", "7", "22"],
        ].map((row) => (
          <div key={row[0]} className="rounded-lg border border-hairline p-4">
            <h4 className="mb-3 font-mono text-xs font-medium uppercase tracking-wide text-mute">
              {row[0]}
            </h4>
            <div className="space-y-2 font-mono text-sm text-ink">
              {row.slice(1).map((item, index) => (
                <div key={`${row[0]}-${item}`} className="flex justify-between gap-4">
                  <span className="text-mute">{index === 0 ? "3" : index === 1 ? "4" : index === 2 ? "5" : "10"}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-hairline bg-surface-soft p-4 text-center font-mono text-sm text-ink">
        leaves &gt;= n! and leaves &lt;= 2^(height - 1), so height &gt;= log2(n!) + 1
      </div>

      <p className="ui-caption text-center">
        This is why comparison sorting cannot beat Omega(n log n) in the worst case.
      </p>
    </div>
  );
}

function DefinitionsPanel() {
  return (
    <div className="space-y-5">
      <p className="text-center text-sm leading-[1.43] text-body">
        §7.2 defines sorting before introducing more algorithms. A sort permutes records so their
        keys are nondecreasing; if equal keys preserve input order, the method is stable.
      </p>

      <div className="grid gap-3 md:grid-cols-3">
        <Fact label="Record" value="Each record Ri has a key Ki used for ordering" />
        <Fact label="Stable" value="Equal keys keep their original relative order" />
        <Fact label="Location" value="Internal sorts fit in memory; external sorts use storage blocks" />
      </div>

      <div className="rounded-lg border border-hairline bg-surface-soft p-4">
        <div className="grid gap-2 font-mono text-sm md:grid-cols-5">
          {[
            ["7.1", "searching"],
            ["7.3", "insertion"],
            ["7.4", "quick"],
            ["7.6", "merge"],
            ["7.11", "external"],
          ].map(([section, item]) => (
            <div key={item} className="rounded-md border border-hairline bg-white px-3 py-2 text-center">
              <span className="text-mute">{section}</span>
              <span className="ml-2 text-ink">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PracticalPanel() {
  const [mode, setMode] = useState<"list" | "table">("list");

  return (
    <div className="space-y-5">
      <p className="text-center text-sm leading-[1.43] text-body">
        §7.9 focuses on large records: avoid moving full records during sorting, then rearrange once
        if physical order is required.
      </p>

      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setMode("list")}
          className={mode === "list" ? "ui-btn-primary" : "ui-btn-secondary"}
        >
          List sort
        </button>
        <button
          type="button"
          onClick={() => setMode("table")}
          className={mode === "table" ? "ui-btn-primary" : "ui-btn-secondary"}
        >
          Table sort
        </button>
      </div>

      {mode === "list" ? <ListSortPanel /> : <TableSortPanel />}
    </div>
  );
}

function ListSortPanel() {
  const rows = [
    ["R1", "35", "4"],
    ["R2", "18", "5"],
    ["R3", "12", "6"],
    ["R4", "42", "0"],
    ["R5", "26", "1"],
    ["R6", "14", "2"],
  ];

  return (
    <div className="rounded-lg border border-hairline p-4">
      <h4 className="mb-3 font-mono text-xs font-medium uppercase tracking-wide text-mute">
        Sorted linked order: P = R3
      </h4>
      <div className="grid gap-2 font-mono text-sm">
        {rows.map(([record, key, link]) => (
          <div key={record} className="grid grid-cols-3 rounded border border-hairline px-3 py-2">
            <span className="text-ink">{record}</span>
            <span className="text-charcoal">key {key}</span>
            <span className="text-mute">link {link}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 ui-caption">
        Follow links R3 &gt; R6 &gt; R2 &gt; R5 &gt; R1 &gt; R4 to read the sorted keys.
      </p>
    </div>
  );
}

function TableSortPanel() {
  const cycles = [
    ["Cycle 1", "R1 -> R3 -> R8 -> R6 -> R1"],
    ["Cycle 2", "R4 -> R5 -> R7 -> R4"],
  ];

  return (
    <div className="rounded-lg border border-hairline p-4">
      <h4 className="mb-3 font-mono text-xs font-medium uppercase tracking-wide text-mute">
        Permutation cycles
      </h4>
      <div className="space-y-2">
        {cycles.map(([title, cycle]) => (
          <div key={title} className="rounded border border-hairline bg-surface-soft px-3 py-2">
            <span className="font-mono text-xs text-mute">{title}</span>
            <p className="mt-1 font-mono text-sm text-ink">{cycle}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 ui-caption">
        TABLE follows each nontrivial cycle once and moves records into final physical positions.
      </p>
    </div>
  );
}

function SummaryPanel() {
  return (
    <div className="space-y-5">
      <p className="text-center text-sm leading-[1.43] text-body">
        §7.10 compares the internal sorting methods rather than introducing another algorithm.
        The practical answer is a composite strategy, not one universal winner.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {[
          ["Insertion sort", "Best for small n and nearly ordered inputs; O(n^2) worst case."],
          ["Quick sort", "Best average behavior in the chapter; O(n^2) worst case."],
          ["Merge sort", "Strong worst-case behavior; needs auxiliary storage."],
          ["Heap sort", "O(n log n) with constant extra storage; more overhead than quicksort."],
          ["Radix sort", "Depends on key size and radix rather than comparison lower bounds."],
          ["Composite", "Use insertion for tiny subfiles, quicksort for medium ranges, merge sort for large stable worst-case needs."],
        ].map(([label, value]) => (
          <Fact key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  );
}

function ExternalSortPanel({ sectionId }: { sectionId: string }) {
  const variant =
    sectionId === "7-11-2"
      ? "k-way"
      : sectionId === "7-11-3"
        ? "buffers"
        : sectionId === "7-11-4"
          ? "runs"
          : sectionId === "7-11-5"
            ? "optimal"
            : "intro";

  const copy = {
    intro: [
      "External merge sort first creates sorted runs with an internal sort.",
      "Then it repeatedly merges runs from disk until one sorted file remains.",
      "The dominant cost is the number of passes over blocks on external storage.",
    ],
    "k-way": [
      "k-way merging combines k runs at once to reduce the number of passes.",
      "A 4-way merge on 16 runs needs fewer levels than repeated 2-way merging.",
      "Large k needs more buffers, so I/O savings eventually meet memory limits.",
    ],
    buffers: [
      "Parallel operation needs floating input buffers and two output buffers.",
      "The next buffer should be assigned to the run that will exhaust first.",
      "The goal is to overlap disk input, disk output, and CPU merging.",
    ],
    runs: [
      "Run generation tries to make initial runs longer than memory-sized chunks.",
      "Longer runs reduce the number of later merge passes.",
      "This is an I/O optimization, not a new internal comparison sort.",
    ],
    optimal: [
      "When run lengths differ, merge order matters.",
      "Merging smaller runs first reduces total record movement.",
      "The idea is the same shape as optimal merge patterns.",
    ],
  }[variant];

  return (
    <div className="space-y-5">
      <p className="text-center text-sm leading-[1.43] text-body">
        External sorting is used when the file cannot fit in main memory. The visual model below
        keeps the focus on runs, passes, and I/O buffers.
      </p>

      <div className="rounded-lg border border-hairline p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
          <ExternalStage title="Input blocks" rows={["A1..A750", "A751..A1500", "..."]} />
          <ArrowText />
          <ExternalStage title="Initial runs" rows={["R1", "R2", "R3", "R4", "R5", "R6"]} />
          <ArrowText />
          <ExternalStage title="Merged file" rows={["one sorted run"]} />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {copy.map((item, index) => (
          <Fact key={item} label={`Point ${index + 1}`} value={item} />
        ))}
      </div>
    </div>
  );
}

function ExternalStage({ title, rows }: { title: string; rows: string[] }) {
  return (
    <div className="rounded-lg border border-hairline bg-white p-3">
      <h4 className="font-mono text-xs font-medium uppercase tracking-wide text-mute">{title}</h4>
      <div className="mt-3 space-y-2">
        {rows.map((row) => (
          <div key={row} className="rounded border border-hairline bg-surface-soft px-3 py-2 text-center font-mono text-xs text-ink">
            {row}
          </div>
        ))}
      </div>
    </div>
  );
}

function ArrowText() {
  return <div className="hidden text-center font-mono text-sm text-mute md:block">-&gt;</div>;
}

export default function InternalSortingConceptViz({ sectionId }: { sectionId: string }) {
  if (sectionId === "7-1") return <SearchPanel />;
  if (sectionId === "7-2") return <DefinitionsPanel />;
  if (sectionId === "7-3") return <InsertionPanel />;
  if (sectionId === "7-4") return <QuickSortPanel />;
  if (sectionId === "7-5") return <LowerBoundPanel />;
  if (sectionId === "7-6") return <MergeSortPanel />;
  if (sectionId === "7-9") return <PracticalPanel />;
  if (sectionId === "7-10") return <SummaryPanel />;
  if (sectionId.startsWith("7-11")) return <ExternalSortPanel sectionId={sectionId} />;
  return null;
}
