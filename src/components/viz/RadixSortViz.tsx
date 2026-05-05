"use client";

import { useMemo, useState } from "react";

const BASE = 10;
const PASSES = 3;

function digitAt(n: number, place: number) {
  return Math.floor(n / BASE ** place) % BASE;
}

const SEED = [329, 457, 657, 839, 436, 720, 355];

function applyPass(values: number[], place: number): number[] {
  const buckets: number[][] = Array.from({ length: BASE }, () => []);
  for (const n of values) {
    buckets[digitAt(n, place)].push(n);
  }
  return buckets.flat();
}

export default function RadixSortViz() {
  const [pass, setPass] = useState(0);
  const [values, setValues] = useState(SEED);

  const buckets = useMemo(() => {
    const b: number[][] = Array.from({ length: BASE }, () => []);
    for (const n of values) {
      b[digitAt(n, pass)].push(n);
    }
    return b;
  }, [values, pass]);

  const goNext = () => {
    if (pass >= PASSES - 1) {
      setPass(PASSES);
      setValues(applyPass(values, pass));
      return;
    }
    const nextVals = applyPass(values, pass);
    setValues(nextVals);
    setPass((p) => p + 1);
  };

  const goPrev = () => {
    if (pass === 0) return;
    if (pass === PASSES) {
      let v = SEED;
      v = applyPass(v, 0);
      v = applyPass(v, 1);
      setValues(v);
      setPass(2);
      return;
    }
    let v = SEED;
    for (let p = 0; p < pass - 1; p++) {
      v = applyPass(v, p);
    }
    setValues(v);
    setPass((p) => p - 1);
  };

  const reset = () => {
    setValues(SEED);
    setPass(0);
  };

  const done = pass >= PASSES;

  return (
    <div className="space-y-6">
      <p className="text-center text-sm text-body">
        Least-significant-digit radix sort: stable bucket passes per decimal place (§7.6). Numbers
        keep relative order within a bucket from the previous pass.
      </p>

      <p className="text-center font-mono text-xs text-mute">
        Input (reset): {SEED.join(", ")}
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" className="ui-btn-secondary" onClick={goPrev} disabled={pass === 0}>
          ← Previous
        </button>
        <button type="button" className="ui-btn-secondary" onClick={goNext} disabled={pass >= PASSES}>
          Apply pass →
        </button>
        <button type="button" className="ui-btn-primary" onClick={reset}>
          Reset
        </button>
      </div>

      {!done && (
        <>
          <p className="text-center font-mono text-sm text-ink">
            Pass {pass + 1}/{PASSES} · bucket by digit at place {pass} (LSB = 0)
          </p>
          <p className="text-center font-mono text-xs text-body">
            Current sequence before this pass: [{values.join(", ")}]
          </p>
        </>
      )}

      {!done && (
        <div className="mx-auto max-w-3xl space-y-2">
          {buckets.map((bucket, d) => (
            <div key={d} className="flex flex-wrap items-center gap-2">
              <span className="w-8 shrink-0 font-mono text-xs text-mute">d={d}</span>
              <div className="flex min-h-10 flex-1 flex-wrap gap-1 rounded border border-hairline bg-canvas p-2">
                {bucket.length === 0 ? (
                  <span className="text-xs text-mute">∅</span>
                ) : (
                  bucket.map((n, idx) => (
                    <span
                      key={`${d}-${idx}-${n}`}
                      className="rounded border border-hairline bg-surface-soft px-2 py-1 font-mono text-sm text-ink"
                    >
                      {n}
                    </span>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!done && (
        <p className="text-center font-mono text-xs text-body">
          After this pass (concatenate 0…9): [{buckets.flat().join(", ")}]
        </p>
      )}

      {done && (
        <p className="text-center font-mono text-sm text-ink">
          Sorted: [{values.join(", ")}]
        </p>
      )}

      <p className="ui-caption text-center">
        Full correctness needs stable per-bucket ordering on every pass; this demo follows the book’s
        story on small decimal keys.
      </p>
    </div>
  );
}
