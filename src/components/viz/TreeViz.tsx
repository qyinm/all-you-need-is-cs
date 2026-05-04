"use client";

import { useCallback, useRef, useState } from "react";
import P5Wrapper, { type SketchFunction } from "@/components/viz/P5Wrapper";

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function TreeViz() {
  const [root, setRoot] = useState<TreeNode | null>(() => buildSampleTree());
  const [traversal, setTraversal] = useState<number[]>([]);
  const [travIdx, setTravIdx] = useState(-1);
  const [travType, setTravType] = useState<"pre" | "in" | "post" | null>(null);
  const [insertVal, setInsertVal] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const rootRef = useRef(root);
  const travRef = useRef<number[]>([]);
  const travIdxRef = useRef(-1);

  rootRef.current = root;

  const sketch: SketchFunction = useCallback((p) => {
    p.setup = () => {
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.textAlign(p.CENTER, p.CENTER);
    };

    const getHeight = (node: TreeNode | null): number => {
      if (!node) return 0;
      return 1 + Math.max(getHeight(node.left), getHeight(node.right));
    };

    const drawNode = (node: TreeNode | null, x: number, y: number, level: number, maxW: number) => {
      if (!node) return;
      const gap = maxW / (2 ** (level + 1));
      const isTrav = travRef.current[travIdxRef.current] === node.value;

      // Left child
      if (node.left) {
        const lx = x - gap;
        const ly = y + 70;
        p.stroke(0, 0, 25);
        p.strokeWeight(2);
        p.line(x, y + 22, lx, ly - 22);
        drawNode(node.left, lx, ly, level + 1, maxW);
      }

      // Right child
      if (node.right) {
        const rx = x + gap;
        const ry = y + 70;
        p.stroke(0, 0, 25);
        p.strokeWeight(2);
        p.line(x, y + 22, rx, ry - 22);
        drawNode(node.right, rx, ry, level + 1, maxW);
      }

      // Node circle
      p.push();
      if (isTrav) {
        const s = 1 + 0.15 * p.sin(p.frameCount * 0.3);
        p.translate(x, y);
        p.scale(s);
        p.fill(45, 85, 90);
        p.stroke(50, 90, 100);
        p.ellipse(0, 0, 44, 44);
        p.fill(0, 0, 10);
        p.textSize(14);
        p.text(node.value, 0, 0);
      } else {
        p.fill(260, 25, 16);
        p.stroke(260, 50, 50);
        p.ellipse(x, y, 44, 44);
        p.fill(0, 0, 90);
        p.textSize(14);
        p.text(node.value, x, y);
      }
      p.pop();
    };

    p.draw = () => {
      p.background(225, 10, 8);
      const r = rootRef.current;
      if (!r) {
        p.fill(0, 0, 25);
        p.textSize(13);
        p.text("Empty tree", p.width / 2, p.height / 2);
        return;
      }

      const h = getHeight(r);
      const maxW = p.width * 0.7;
      drawNode(r, p.width / 2, 50, 0, maxW);
    };
  }, []);

  const startTraversal = (type: "pre" | "in" | "post") => {
    const path: number[] = [];
    const traverse = (node: TreeNode | null) => {
      if (!node) return;
      if (type === "pre") path.push(node.value);
      traverse(node.left);
      if (type === "in") path.push(node.value);
      traverse(node.right);
      if (type === "post") path.push(node.value);
    };
    traverse(root);
    setTravType(type);
    setTraversal(path);
    travRef.current = path;
    setTravIdx(0);
    travIdxRef.current = 0;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= path.length) {
        clearInterval(interval);
        setTravIdx(-1);
        travIdxRef.current = -1;
        return;
      }
      setTravIdx(i);
      travIdxRef.current = i;
    }, 500);
  };

  const insert = () => {
    const val = parseInt(insertVal);
    if (isNaN(val)) return;
    // Insert at first available spot (level order)
    const insertLevelOrder = (r: TreeNode | null, v: number): TreeNode => {
      if (!r) return { value: v, left: null, right: null };
      const queue: TreeNode[] = [r];
      while (queue.length > 0) {
        const node = queue.shift()!;
        if (!node.left) { node.left = { value: v, left: null, right: null }; return { ...r }; }
        queue.push(node.left);
        if (!node.right) { node.right = { value: v, left: null, right: null }; return { ...r }; }
        queue.push(node.right);
      }
      return r;
    };
    setRoot((prev) => insertLevelOrder(prev, val));
    setInsertVal("");
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
        <button onClick={insert} className="px-3 py-1.5 rounded bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 text-sm font-mono transition-colors">
          Insert
        </button>
        <span className="text-zinc-700 mx-1">|</span>
        <button onClick={() => startTraversal("pre")} className="px-3 py-1.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 hover:bg-zinc-700 text-sm font-mono transition-colors">
          Preorder
        </button>
        <button onClick={() => startTraversal("in")} className="px-3 py-1.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 hover:bg-zinc-700 text-sm font-mono transition-colors">
          Inorder
        </button>
        <button onClick={() => startTraversal("post")} className="px-3 py-1.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 hover:bg-zinc-700 text-sm font-mono transition-colors">
          Postorder
        </button>
      </div>
      <p className="text-center text-zinc-500 text-xs font-mono">
        {travType ? `${travType}order traversal: [${traversal.join(", ")}]` : "Click traversal button to animate"}
      </p>
    </div>
  );
}

function buildSampleTree(): TreeNode {
  return {
    value: 42,
    left: {
      value: 23,
      left: { value: 15, left: null, right: { value: 18, left: null, right: null } },
      right: { value: 31, left: null, right: null },
    },
    right: {
      value: 67,
      left: { value: 55, left: null, right: null },
      right: { value: 89, left: { value: 72, left: null, right: null }, right: null },
    },
  };
}