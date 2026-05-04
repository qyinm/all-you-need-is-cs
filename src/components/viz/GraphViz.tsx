"use client";

import { useCallback, useRef, useState } from "react";
import P5Wrapper, { type SketchFunction } from "@/components/viz/P5Wrapper";

interface GraphNode {
  id: number;
  x: number;
  y: number;
  neighbors: number[];
}

export default function GraphViz() {
  const [nodes, setNodes] = useState<GraphNode[]>(() => createSampleGraph());
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const [current, setCurrent] = useState<number | null>(null);
  const [queue, setQueue] = useState<number[]>([]);
  const [stack, setStack] = useState<number[]>([]);
  const [algo, setAlgo] = useState<"bfs" | "dfs" | null>(null);
  const [startNode, setStartNode] = useState(0);
  const nodesRef = useRef(nodes);
  const visitedRef = useRef(visited);
  const currentRef = useRef(current);
  const queueRef = useRef(queue);
  const stackRef = useRef(stack);

  nodesRef.current = nodes;
  visitedRef.current = visited;
  currentRef.current = current;
  queueRef.current = queue;
  stackRef.current = stack;

  const sketch: SketchFunction = useCallback((p) => {
    p.setup = () => {
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.textAlign(p.CENTER, p.CENTER);
    };

    p.draw = () => {
      p.background(225, 10, 8);
      const ns = nodesRef.current;
      const vis = visitedRef.current;
      const cur = currentRef.current;
      const q = queueRef.current;
      const s = stackRef.current;

      // Draw edges
      for (const node of ns) {
        for (const neighborId of node.neighbors) {
          const neighbor = ns.find((n) => n.id === neighborId);
          if (!neighbor) continue;
          p.stroke(0, 0, 25);
          p.strokeWeight(2);
          p.line(node.x, node.y, neighbor.x, neighbor.y);
        }
      }

      // Draw nodes
      for (const node of ns) {
        const isVisited = vis.has(node.id);
        const isCurrent = cur === node.id;
        const inQueue = q.includes(node.id);
        const inStack = s.includes(node.id);

        p.push();
        if (isCurrent) {
          const scale = 1 + 0.15 * p.sin(p.frameCount * 0.4);
          p.translate(node.x, node.y);
          p.scale(scale);
          p.fill(45, 85, 90);
          p.stroke(50, 90, 100);
          p.ellipse(0, 0, 48, 48);
          p.fill(0, 0, 15);
          p.textSize(14);
          p.text(node.id, 0, 0);
        } else if (isVisited) {
          p.fill(140, 60, 75);
          p.stroke(150, 60, 55);
          p.ellipse(node.x, node.y, 44, 44);
          p.fill(0, 0, 100);
          p.textSize(14);
          p.text(node.id, node.x, node.y);
        } else if (inQueue) {
          p.fill(190, 60, 70);
          p.stroke(200, 60, 55);
          p.ellipse(node.x, node.y, 44, 44);
          p.fill(0, 0, 100);
          p.textSize(14);
          p.text(node.id, node.x, node.y);
        } else if (inStack) {
          p.fill(0, 60, 70);
          p.stroke(0, 60, 55);
          p.ellipse(node.x, node.y, 44, 44);
          p.fill(0, 0, 100);
          p.textSize(14);
          p.text(node.id, node.x, node.y);
        } else {
          p.fill(260, 25, 16);
          p.stroke(260, 50, 50);
          p.ellipse(node.x, node.y, 44, 44);
          p.fill(0, 0, 90);
          p.textSize(14);
          p.text(node.id, node.x, node.y);
        }
        p.pop();
      }

      // Draw queue/stack visualization
      if (algo === "bfs" && q.length > 0) {
        p.fill(0, 0, 35);
        p.textSize(11);
        p.text("Queue: [" + q.join(", ") + "]", p.width / 2, p.height - 30);
      } else if (algo === "dfs" && s.length > 0) {
        p.fill(0, 0, 35);
        p.textSize(11);
        p.text("Stack: [" + s.join(", ") + "]", p.width / 2, p.height - 30);
      }
    };
  }, []);

  const runBFS = () => {
    const start = startNode;
    const visitedSet = new Set<number>();
    const q: number[] = [start];
    visitedSet.add(start);

    setVisited(visitedSet);
    setQueue(q);
    setCurrent(start);
    setAlgo("bfs");

    let i = 0;
    const interval = setInterval(() => {
      if (i >= q.length) {
        clearInterval(interval);
        setCurrent(null);
        return;
      }
      const currentId = q[i];
      setCurrent(currentId);
      const node = nodes.find((n) => n.id === currentId);
      if (node) {
        for (const neighborId of node.neighbors) {
          if (!visitedSet.has(neighborId)) {
            visitedSet.add(neighborId);
            q.push(neighborId);
          }
        }
      }
      setQueue([...q]);
      setVisited(new Set(visitedSet));
      i++;
    }, 600);
  };

  const runDFS = () => {
    const start = startNode;
    const visitedSet = new Set<number>();
    const s: number[] = [start];

    setVisited(visitedSet);
    setStack(s);
    setAlgo("dfs");

    let i = 0;
    const interval = setInterval(() => {
      if (s.length === 0) {
        clearInterval(interval);
        setCurrent(null);
        return;
      }
      const currentId = s.pop()!;
      setCurrent(currentId);
      if (visitedSet.has(currentId)) {
        i++;
        return;
      }
      visitedSet.add(currentId);
      setVisited(new Set(visitedSet));

      const node = nodes.find((n) => n.id === currentId);
      if (node) {
        for (const neighborId of [...node.neighbors].reverse()) {
          if (!visitedSet.has(neighborId)) {
            s.push(neighborId);
          }
        }
      }
      setStack([...s]);
      i++;
    }, 600);
  };

  const reset = () => {
    setVisited(new Set());
    setCurrent(null);
    setQueue([]);
    setStack([]);
    setAlgo(null);
  };

  return (
    <div className="space-y-4">
      <P5Wrapper sketch={sketch} className="min-h-[400px]" />

      <div className="flex flex-wrap items-center gap-2 justify-center">
        <label className="ui-label">Start:</label>
        <select
          value={startNode}
          onChange={(e) => setStartNode(parseInt(e.target.value))}
          className="ui-input min-w-[6rem]"
        >
          {nodes.map((n) => (
            <option key={n.id} value={n.id}>
              Node {n.id}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={runBFS}
          disabled={algo !== null}
          className="ui-btn-primary disabled:opacity-40"
        >
          BFS
        </button>
        <button
          type="button"
          onClick={runDFS}
          disabled={algo !== null}
          className="ui-btn-secondary disabled:opacity-40"
        >
          DFS
        </button>
        <button type="button" onClick={reset} className="ui-btn-secondary">
          Reset
        </button>
      </div>
      <p className="ui-caption text-center">
        Visited: {visited.size} / {nodes.length} · {algo === "bfs" ? "BFS" : algo === "dfs" ? "DFS" : "Select algorithm"}
      </p>
    </div>
  );
}

function createSampleGraph(): GraphNode[] {
  return [
    { id: 0, x: 200, y: 100, neighbors: [1, 2] },
    { id: 1, x: 100, y: 200, neighbors: [0, 3, 4] },
    { id: 2, x: 300, y: 200, neighbors: [0, 5, 6] },
    { id: 3, x: 50, y: 300, neighbors: [1] },
    { id: 4, x: 150, y: 300, neighbors: [1, 5] },
    { id: 5, x: 250, y: 300, neighbors: [2, 4, 6] },
    { id: 6, x: 350, y: 300, neighbors: [2, 5] },
  ];
}