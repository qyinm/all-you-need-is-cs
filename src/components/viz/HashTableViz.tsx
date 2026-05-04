"use client";

import { useCallback, useRef, useState } from "react";
import P5Wrapper, { type SketchFunction } from "@/components/viz/P5Wrapper";

const BUCKETS = 8;
const CELL_W = 90;
const CELL_H = 46;
const START_X = 40;
const START_Y = 70;

export default function HashTableViz() {
  const [table, setTable] = useState<Map<number, number[]>>(new Map());
  const [keyInput, setKeyInput] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [highlightBucket, setHighlightBucket] = useState<number | null>(null);
  const [stats, setStats] = useState({ elements: 0, buckets: BUCKETS });
  const tableRef = useRef(table);
  const highlightRef = useRef<number | null>(null);

  tableRef.current = table;

  // Init with some data
  useState(() => {
    const m = new Map<number, number[]>();
    m.set(3, [11, 19, 27]);
    m.set(5, [13, 21]);
    m.set(0, [8]);
    setTable(m);
    setStats({ elements: 6, buckets: BUCKETS });
  });

  const hash = (key: number) => ((key % BUCKETS) + BUCKETS) % BUCKETS;

  const sketch: SketchFunction = useCallback((p) => {
    p.setup = () => {
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.textAlign(p.CENTER, p.CENTER);
    };

    p.draw = () => {
      p.background(225, 10, 8);
      const tbl = tableRef.current;
      const hl = highlightRef.current;

      // Hash function label
      p.fill(260, 40, 70);
      p.textSize(12);
      p.text("hash(key) = key % " + BUCKETS, p.width / 2, 30);

      for (let i = 0; i < BUCKETS; i++) {
        const x = START_X + (i % 4) * 160;
        const y = START_Y + Math.floor(i / 4) * (CELL_H + 80);

        // Bucket cell
        p.fill(hl === i ? 45 : 240, hl === i ? 90 : 8, hl === i ? 95 : 13);
        p.stroke(hl === i ? 50 : 260, hl === i ? 100 : 40, hl === i ? 100 : 30);
        p.strokeWeight(1.5);
        p.rect(x, y, CELL_W, CELL_H, 4);

        // Bucket index
        p.fill(0, 0, 35);
        p.noStroke();
        p.textSize(11);
        p.text("[" + i + "]", x - 25, y + CELL_H / 2);

        // Chain display
        const chain = tbl.get(i) || [];
        if (chain.length === 0) {
          p.fill(0, 0, 20);
          p.textSize(13);
          p.text("∅", x + CELL_W / 2, y + CELL_H / 2);
        } else {
          p.fill(0, 0, 90);
          p.textSize(13);
          // Show first value + count
          const display = chain.length > 2
            ? chain.slice(0, 2).join(", ") + ", …"
            : chain.join(", ");
          p.text(display, x + CELL_W / 2, y + CELL_H / 2);
        }

        // Chain nodes below
        if (chain.length > 1) {
          for (let j = 1; j < chain.length; j++) {
            const cx = x + CELL_W / 2;
            const cy = y + CELL_H + 16 + (j - 1) * 24;
            p.fill(260, 30, 20);
            p.stroke(260, 50, 40);
            p.strokeWeight(1);
            p.ellipse(cx, cy, CELL_H - 10, CELL_H - 10);
            p.fill(0, 0, 85);
            p.noStroke();
            p.textSize(11);
            p.text(chain[j], cx, cy);

            // Arrow from prev
            if (j === 1) {
              p.stroke(0, 0, 30);
              p.strokeWeight(1);
              p.line(cx, y + CELL_H, cx, cy - (CELL_H - 10) / 2);
              p.fill(0, 0, 30);
              p.noStroke();
              p.triangle(cx, cy - (CELL_H - 10) / 2 + 4, cx - 4, cy - (CELL_H - 10) / 2 - 4, cx + 4, cy - (CELL_H - 10) / 2 - 4);
            }
          }
        }
      }
    };
  }, []);

  const insert = () => {
    const key = parseInt(keyInput);
    if (isNaN(key)) return;
    const bucket = hash(key);

    setTable((prev) => {
      const m = new Map(prev);
      const chain = m.get(bucket) || [];
      if (!chain.includes(key)) {
        chain.push(key);
        m.set(bucket, chain);
      }
      return m;
    });
    setHighlightBucket(bucket);
    highlightRef.current = bucket;
    setStats((s) => ({ ...s, elements: s.elements + 1 }));
    setTimeout(() => { setHighlightBucket(null); highlightRef.current = null; }, 800);
    setKeyInput("");
  };

  const search = () => {
    const key = parseInt(searchKey);
    if (isNaN(key)) return;
    const bucket = hash(key);
    setHighlightBucket(bucket);
    highlightRef.current = bucket;
    setTimeout(() => { setHighlightBucket(null); highlightRef.current = null; }, 1000);
  };

  const remove = () => {
    const key = parseInt(searchKey);
    if (isNaN(key)) return;
    const bucket = hash(key);

    setTable((prev) => {
      const m = new Map(prev);
      const chain = (m.get(bucket) || []).filter((k) => k !== key);
      if (chain.length === 0) m.delete(bucket);
      else m.set(bucket, chain);
      return m;
    });
    setHighlightBucket(bucket);
    highlightRef.current = bucket;
    setStats((s) => ({ ...s, elements: Math.max(0, s.elements - 1) }));
    setTimeout(() => { setHighlightBucket(null); highlightRef.current = null; }, 800);
  };

  return (
    <div className="space-y-4">
      <P5Wrapper sketch={sketch} className="min-h-[380px]" />

      <div className="flex flex-wrap items-center gap-2 justify-center">
        <input
          type="number"
          placeholder="Key"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          className="ui-input w-24"
        />
        <button type="button" onClick={insert} className="ui-btn-primary">
          Insert
        </button>
        <button type="button" onClick={search} className="ui-btn-secondary">
          Search
        </button>
        <button type="button" onClick={remove} className="ui-btn-secondary">
          Delete
        </button>
      </div>
      <p className="ui-caption text-center">
        Load factor: {(stats.elements / stats.buckets).toFixed(2)} · Elements: {stats.elements} · Buckets: {stats.buckets}
      </p>
    </div>
  );
}