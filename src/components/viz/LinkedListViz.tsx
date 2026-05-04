"use client";

import { useCallback, useRef, useState } from "react";
import P5Wrapper, { type SketchFunction } from "@/components/viz/P5Wrapper";

interface LLNode {
  value: number;
  prev?: number; // index of prev node (for doubly)
}

export default function LinkedListViz({
  initialDoubly = false,
}: {
  initialDoubly?: boolean;
} = {}) {
  const [nodes, setNodes] = useState<LLNode[]>([
    { value: 10 }, { value: 25 }, { value: 7 }, { value: 42 },
  ]);
  const [doubly, setDoubly] = useState(initialDoubly);
  const [highlight, setHighlight] = useState<number | null>(null);
  const [searchVal, setSearchVal] = useState("");
  const [insertVal, setInsertVal] = useState("");
  const [insertIdx, setInsertIdx] = useState("");
  const [deleteIdx, setDeleteIdx] = useState("");
  const nodesRef = useRef(nodes);
  const highlightRef = useRef<number | null>(null);
  const doublyRef = useRef(doubly);

  nodesRef.current = nodes;
  doublyRef.current = doubly;

  const sketch: SketchFunction = useCallback((p) => {
    const NODE_R = 22;

    p.setup = () => {
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(12);
    };

    p.draw = () => {
      p.background(225, 10, 8);
      const arr = nodesRef.current;
      const hl = highlightRef.current;
      const isDoubly = doublyRef.current;
      if (arr.length === 0) return;

      const totalW = arr.length * 100;
      const startX = Math.max(30, (p.width - totalW) / 2);
      const y = p.height / 2 - 10;

      // Draw edges (arrows)
      for (let i = 0; i < arr.length - 1; i++) {
        const x1 = startX + i * 100 + NODE_R + 8;
        const x2 = startX + (i + 1) * 100 - NODE_R - 8;
        p.stroke(0, 0, 35);
        p.strokeWeight(2);
        p.line(x1, y, x2 - 6, y);
        // Arrowhead
        p.fill(0, 0, 35);
        p.noStroke();
        p.triangle(x2, y, x2 - 8, y - 5, x2 - 8, y + 5);

        // Doubly reverse arrow (dashed)
        if (isDoubly) {
          p.stroke(260, 20, 40);
          p.strokeWeight(1);
          const ctx = p.drawingContext as CanvasRenderingContext2D;
          if (ctx && ctx.setLineDash) {
            ctx.setLineDash([4, 4]);
            p.line(x2 - 14, y + 14, x1 + 14, y + 14);
            ctx.setLineDash([]);
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < arr.length; i++) {
        const x = startX + i * 100;
        const isHl = hl === i;

        p.push();
        // Node circle
        if (isHl) {
          p.fill(45, 90, 95); // yellow
          p.stroke(50, 100, 100);
        } else {
          p.fill(240, 10, 14);
          p.stroke(260, 40, 50);
        }
        p.strokeWeight(2);
        p.ellipse(x, y, NODE_R * 2, NODE_R * 2);

        // Value text
        p.fill(0, 0, isHl ? 15 : 100);
        p.noStroke();
        p.text(arr[i].value, x, y);

        // Label
        p.fill(0, 0, 40);
        p.textSize(9);
        if (i === 0) p.text("HEAD", x, y - NODE_R - 14);
        if (i === arr.length - 1) p.text("TAIL", x, y + NODE_R + 14);

        p.pop();
      }
    };
  }, []);

  const insertHead = () => {
    const val = insertVal ? parseInt(insertVal) : Math.floor(Math.random() * 100);
    setNodes((prev) => [{ value: val }, ...prev]);
    highlightRef.current = 0;
    setHighlight(0);
    setTimeout(() => { highlightRef.current = null; setHighlight(null); }, 500);
  };

  const insertTail = () => {
    const val = insertVal ? parseInt(insertVal) : Math.floor(Math.random() * 100);
    setNodes((prev) => [...prev, { value: val }]);
  };

  const insertAt = () => {
    const val = insertVal ? parseInt(insertVal) : Math.floor(Math.random() * 100);
    const idx = parseInt(insertIdx);
    if (isNaN(idx) || idx < 0 || idx > nodes.length) return;
    setNodes((prev) => {
      const n = [...prev];
      n.splice(idx, 0, { value: val });
      return n;
    });
    highlightRef.current = idx;
    setHighlight(idx);
    setTimeout(() => { highlightRef.current = null; setHighlight(null); }, 500);
  };

  const deleteAt = () => {
    const idx = parseInt(deleteIdx);
    if (isNaN(idx) || idx < 0 || idx >= nodes.length || nodes.length <= 1) return;
    highlightRef.current = idx;
    setHighlight(idx);
    setTimeout(() => {
      setNodes((prev) => prev.filter((_, i) => i !== idx));
      highlightRef.current = null;
      setHighlight(null);
    }, 400);
  };

  const search = () => {
    const val = parseInt(searchVal);
    if (isNaN(val)) return;
    const idx = nodes.findIndex((n) => n.value === val);
    if (idx >= 0) {
      highlightRef.current = idx;
      setHighlight(idx);
      setTimeout(() => { highlightRef.current = null; setHighlight(null); }, 1000);
    }
  };

  return (
    <div className="space-y-4">
      <P5Wrapper sketch={sketch} className="min-h-[280px]" />

      <div className="flex flex-wrap items-center gap-2 justify-center">
        <input
          type="number"
          placeholder="Value"
          value={insertVal}
          onChange={(e) => setInsertVal(e.target.value)}
          className="ui-input w-20"
        />
        <button type="button" onClick={insertHead} className="ui-btn-secondary">
          Insert Head
        </button>
        <button type="button" onClick={insertTail} className="ui-btn-secondary">
          Insert Tail
        </button>
        <input
          type="number"
          placeholder="Idx"
          value={insertIdx}
          onChange={(e) => setInsertIdx(e.target.value)}
          className="ui-input w-16"
        />
        <button type="button" onClick={insertAt} className="ui-btn-secondary">
          Insert At
        </button>
        <input
          type="number"
          placeholder="Del idx"
          value={deleteIdx}
          onChange={(e) => setDeleteIdx(e.target.value)}
          className="ui-input w-[4.5rem]"
        />
        <button type="button" onClick={deleteAt} className="ui-btn-secondary">
          Delete
        </button>
        <input
          type="number"
          placeholder="Search"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="ui-input w-20"
        />
        <button type="button" onClick={search} className="ui-btn-primary">
          Search
        </button>
        <label className="ui-label flex cursor-pointer items-center gap-1.5">
          <input type="checkbox" checked={doubly} onChange={(e) => setDoubly(e.target.checked)} className="accent-[var(--color-primary)]" />
          Doubly
        </label>
      </div>
      <p className="ui-caption text-center">
        Nodes: {nodes.length} · HEAD = {nodes[0]?.value} · TAIL = {nodes[nodes.length - 1]?.value}
      </p>
    </div>
  );
}