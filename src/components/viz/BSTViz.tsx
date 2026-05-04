"use client";

import { useCallback, useRef, useState } from "react";
import P5Wrapper, { type SketchFunction } from "@/components/viz/P5Wrapper";

interface BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

export default function BSTViz() {
  const [root, setRoot] = useState<BSTNode | null>(() => buildSampleBST());
  const [highlightPath, setHighlightPath] = useState<number[]>([]);
  const [insertVal, setInsertVal] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [deleteVal, setDeleteVal] = useState("");
  const rootRef = useRef(root);
  const hlRef = useRef<number[]>([]);

  rootRef.current = root;

  const sketch: SketchFunction = useCallback((p) => {
    p.setup = () => {
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.textAlign(p.CENTER, p.CENTER);
    };

    const drawBST = (node: BSTNode | null, x: number, y: number, level: number, maxW: number) => {
      if (!node) return;
      const gap = maxW / (2 ** (level + 1));
      const hl = hlRef.current;

      if (node.left) {
        const lx = x - gap;
        const ly = y + 70;
        p.stroke(0, 0, 25);
        p.strokeWeight(2);
        p.line(x, y + 22, lx, ly - 22);
        drawBST(node.left, lx, ly, level + 1, maxW);
      }
      if (node.right) {
        const rx = x + gap;
        const ry = y + 70;
        p.stroke(0, 0, 25);
        p.strokeWeight(2);
        p.line(x, y + 22, rx, ry - 22);
        drawBST(node.right, rx, ry, level + 1, maxW);
      }

      const isHighlighted = hl.includes(node.value);
      p.push();
      p.fill(isHighlighted ? 45 : 260, isHighlighted ? 85 : 25, isHighlighted ? 90 : 16);
      p.stroke(isHighlighted ? 50 : 260, isHighlighted ? 90 : 50, isHighlighted ? 100 : 50);
      p.strokeWeight(2);
      p.ellipse(x, y, 44, 44);
      p.fill(0, 0, isHighlighted ? 15 : 90);
      p.textSize(14);
      p.text(node.value, x, y);
      p.pop();
    };

    p.draw = () => {
      p.background(225, 10, 8);
      if (!rootRef.current) {
        p.fill(0, 0, 25);
        p.textSize(13);
        p.text("Empty BST", p.width / 2, p.height / 2);
        return;
      }
      drawBST(rootRef.current, p.width / 2, 40, 0, p.width * 0.7);
    };
  }, []);

  const insertBST = (node: BSTNode | null, val: number): BSTNode => {
    if (!node) return { value: val, left: null, right: null };
    if (val < node.value) node.left = insertBST(node.left, val);
    else if (val > node.value) node.right = insertBST(node.right, val);
    return node;
  };

  const findPath = (node: BSTNode | null, val: number, path: number[]): number[] => {
    if (!node) return path;
    path.push(node.value);
    if (val === node.value) return path;
    if (val < node.value) return findPath(node.left, val, path);
    return findPath(node.right, val, path);
  };

  const deleteBST = (node: BSTNode | null, val: number): BSTNode | null => {
    if (!node) return null;
    if (val < node.value) { node.left = deleteBST(node.left, val); return node; }
    if (val > node.value) { node.right = deleteBST(node.right, val); return node; }
    // Found: leaf
    if (!node.left && !node.right) return null;
    // One child
    if (!node.left) return node.right;
    if (!node.right) return node.left;
    // Two children: find successor
    let succ = node.right;
    while (succ.left) succ = succ.left;
    node.value = succ.value;
    node.right = deleteBST(node.right, succ.value);
    return node;
  };

  const insert = () => {
    const val = parseInt(insertVal);
    if (isNaN(val)) return;
    const path = findPath(root, val, []);
    setHighlightPath(path);
    hlRef.current = path;
    setTimeout(() => {
      setRoot((prev) => insertBST(prev ? { ...prev } : null, val));
      setHighlightPath([]);
      hlRef.current = [];
    }, 600);
    setInsertVal("");
  };

  const search = () => {
    const val = parseInt(searchVal);
    if (isNaN(val)) return;
    const path = findPath(root, val, []);
    setHighlightPath(path);
    hlRef.current = path;
    setTimeout(() => { setHighlightPath([]); hlRef.current = []; }, 1500);
  };

  const remove = () => {
    const val = parseInt(deleteVal);
    if (isNaN(val)) return;
    const path = findPath(root, val, []);
    setHighlightPath(path);
    hlRef.current = path;
    setTimeout(() => {
      setRoot((prev) => deleteBST(prev ? { ...prev } : null, val));
      setHighlightPath([]);
      hlRef.current = [];
    }, 600);
  };

  return (
    <div className="space-y-4">
      <P5Wrapper sketch={sketch} className="min-h-[400px]" />

      <div className="flex flex-wrap items-center gap-2 justify-center">
        <input
          type="number"
          placeholder="Insert"
          value={insertVal}
          onChange={(e) => setInsertVal(e.target.value)}
          className="w-20 px-2 py-1.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-mono"
        />
        <button onClick={insert} className="px-3 py-1.5 rounded bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 text-sm font-mono transition-colors">
          Insert
        </button>
        <input
          type="number"
          placeholder="Search"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="w-20 px-2 py-1.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-mono"
        />
        <button onClick={search} className="px-3 py-1.5 rounded bg-amber-600/20 border border-amber-500/30 text-amber-300 hover:bg-amber-600/30 text-sm font-mono transition-colors">
          Search
        </button>
        <input
          type="number"
          placeholder="Delete"
          value={deleteVal}
          onChange={(e) => setDeleteVal(e.target.value)}
          className="w-20 px-2 py-1.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-mono"
        />
        <button onClick={remove} className="px-3 py-1.5 rounded bg-red-600/20 border border-red-500/30 text-red-300 hover:bg-red-600/30 text-sm font-mono transition-colors">
          Delete
        </button>
        <button
          onClick={() => setRoot(buildSampleBST())}
          className="px-3 py-1.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 hover:bg-zinc-700 text-sm font-mono transition-colors"
        >
          🎲 Reset
        </button>
      </div>
      <p className="text-center text-zinc-500 text-xs font-mono">
        BST property: left &lt; root &lt; right · {highlightPath.length > 0 ? `Path: [${highlightPath.join(" → ")}]` : ""}
      </p>
    </div>
  );
}

function buildSampleBST(): BSTNode {
  return {
    value: 50,
    left: {
      value: 30,
      left: { value: 20, left: null, right: null },
      right: { value: 40, left: null, right: null },
    },
    right: {
      value: 70,
      left: { value: 60, left: null, right: null },
      right: { value: 80, left: null, right: null },
    },
  };
}