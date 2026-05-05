"use client";

import { useMemo, useState } from "react";

type TreeConceptVizProps = {
  sectionId: string;
};

type DiagramNode = {
  id: string;
  label: string;
  x: number;
  y: number;
};

type DiagramEdge = {
  from: string;
  to: string;
  dashed?: boolean;
  label?: string;
};

const BASE_NODES: DiagramNode[] = [
  { id: "A", label: "A", x: 340, y: 46 },
  { id: "B", label: "B", x: 205, y: 128 },
  { id: "C", label: "C", x: 340, y: 128 },
  { id: "D", label: "D", x: 475, y: 128 },
  { id: "E", label: "E", x: 140, y: 218 },
  { id: "F", label: "F", x: 270, y: 218 },
  { id: "G", label: "G", x: 340, y: 218 },
  { id: "H", label: "H", x: 430, y: 218 },
  { id: "I", label: "I", x: 520, y: 218 },
];

const BASE_EDGES: DiagramEdge[] = [
  { from: "A", to: "B" },
  { from: "A", to: "C" },
  { from: "A", to: "D" },
  { from: "B", to: "E" },
  { from: "B", to: "F" },
  { from: "C", to: "G" },
  { from: "D", to: "H" },
  { from: "D", to: "I" },
];

const BINARY_NODES: DiagramNode[] = [
  { id: "A", label: "A", x: 340, y: 44 },
  { id: "B", label: "B", x: 220, y: 132 },
  { id: "C", label: "C", x: 460, y: 132 },
  { id: "D", label: "D", x: 150, y: 228 },
  { id: "E", label: "E", x: 290, y: 228 },
  { id: "F", label: "F", x: 390, y: 228 },
  { id: "G", label: "G", x: 530, y: 228 },
];

const BINARY_EDGES: DiagramEdge[] = [
  { from: "A", to: "B", label: "left" },
  { from: "A", to: "C", label: "right" },
  { from: "B", to: "D" },
  { from: "B", to: "E" },
  { from: "C", to: "F" },
  { from: "C", to: "G" },
];

const THREAD_NODES: DiagramNode[] = [
  { id: "D", label: "D", x: 125, y: 220 },
  { id: "B", label: "B", x: 245, y: 132 },
  { id: "E", label: "E", x: 365, y: 220 },
  { id: "A", label: "A", x: 365, y: 44 },
  { id: "F", label: "F", x: 510, y: 132 },
];

const THREAD_EDGES: DiagramEdge[] = [
  { from: "A", to: "B" },
  { from: "A", to: "F" },
  { from: "B", to: "D" },
  { from: "B", to: "E" },
  { from: "D", to: "B", dashed: true, label: "succ" },
  { from: "E", to: "A", dashed: true, label: "succ" },
];

const WINNER_NODES: DiagramNode[] = [
  { id: "r", label: "7", x: 340, y: 44 },
  { id: "l", label: "7", x: 235, y: 124 },
  { id: "rr", label: "13", x: 445, y: 124 },
  { id: "a", label: "7", x: 165, y: 218 },
  { id: "b", label: "21", x: 305, y: 218 },
  { id: "c", label: "13", x: 375, y: 218 },
  { id: "d", label: "18", x: 515, y: 218 },
];

const WINNER_EDGES: DiagramEdge[] = [
  { from: "r", to: "l" },
  { from: "r", to: "rr" },
  { from: "l", to: "a" },
  { from: "l", to: "b" },
  { from: "rr", to: "c" },
  { from: "rr", to: "d" },
];

const FOREST_NODES: DiagramNode[] = [
  { id: "A", label: "A", x: 150, y: 78 },
  { id: "B", label: "B", x: 95, y: 170 },
  { id: "C", label: "C", x: 205, y: 170 },
  { id: "D", label: "D", x: 340, y: 78 },
  { id: "E", label: "E", x: 285, y: 170 },
  { id: "F", label: "F", x: 395, y: 170 },
  { id: "G", label: "G", x: 530, y: 78 },
  { id: "H", label: "H", x: 530, y: 170 },
];

const FOREST_EDGES: DiagramEdge[] = [
  { from: "A", to: "B" },
  { from: "A", to: "C" },
  { from: "D", to: "E" },
  { from: "D", to: "F" },
  { from: "G", to: "H" },
  { from: "A", to: "D", dashed: true, label: "sibling" },
  { from: "D", to: "G", dashed: true, label: "sibling" },
];

const COUNT_NODES: DiagramNode[] = [
  { id: "1", label: "1", x: 340, y: 44 },
  { id: "2", label: "2", x: 220, y: 124 },
  { id: "3", label: "3", x: 460, y: 124 },
  { id: "4", label: "4", x: 150, y: 212 },
  { id: "5", label: "5", x: 290, y: 212 },
  { id: "6", label: "6", x: 390, y: 212 },
  { id: "7", label: "7", x: 530, y: 212 },
];

const COUNT_EDGES: DiagramEdge[] = [
  { from: "1", to: "2", label: "2i" },
  { from: "1", to: "3", label: "2i+1" },
  { from: "2", to: "4" },
  { from: "2", to: "5" },
  { from: "3", to: "6" },
  { from: "3", to: "7" },
];

const TRAVERSALS = {
  pre: ["A", "B", "D", "E", "C", "F", "G"],
  in: ["D", "B", "E", "A", "F", "C", "G"],
  post: ["D", "E", "B", "F", "G", "C", "A"],
};

export default function TreeConceptViz({ sectionId }: TreeConceptVizProps) {
  const [order, setOrder] = useState<keyof typeof TRAVERSALS>("in");

  const content = useMemo(() => conceptFor(sectionId, order), [sectionId, order]);

  return (
    <div className="space-y-4">
      <div className="rounded-[12px] border border-hairline bg-surface-soft p-4">
        <svg
          viewBox="0 0 680 300"
          role="img"
          aria-label={content.title}
          className="h-auto w-full"
        >
          <rect x="0" y="0" width="680" height="300" rx="12" fill="#fafafa" />
          <g>
            {content.edges.map((edge, index) => (
              <DiagramLine key={`${edge.from}-${edge.to}-${index}`} edge={edge} nodes={content.nodes} />
            ))}
          </g>
          <g>
            {content.nodes.map((node) => (
              <DiagramCircle key={node.id} node={node} active={content.active.includes(node.id)} />
            ))}
          </g>
          {content.annotations.map((annotation) => (
            <text
              key={annotation.text}
              x={annotation.x}
              y={annotation.y}
              textAnchor="middle"
              className="fill-charcoal font-mono text-[12px]"
            >
              {annotation.text}
            </text>
          ))}
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {sectionId === "5-3" ? (
          <>
            <button type="button" onClick={() => setOrder("pre")} className={order === "pre" ? "ui-btn-primary" : "ui-btn-secondary"}>
              Preorder
            </button>
            <button type="button" onClick={() => setOrder("in")} className={order === "in" ? "ui-btn-primary" : "ui-btn-secondary"}>
              Inorder
            </button>
            <button type="button" onClick={() => setOrder("post")} className={order === "post" ? "ui-btn-primary" : "ui-btn-secondary"}>
              Postorder
            </button>
          </>
        ) : null}
      </div>

      <p className="ui-caption text-center">{content.caption}</p>
    </div>
  );
}

function conceptFor(sectionId: string, order: keyof typeof TRAVERSALS) {
  switch (sectionId) {
    case "5-1":
      return {
        title: "Tree terminology and left-child right-sibling representation",
        nodes: BASE_NODES,
        edges: BASE_EDGES,
        active: ["A", "E", "F", "G", "H", "I"],
        annotations: [
          { x: 340, y: 22, text: "root" },
          { x: 205, y: 106, text: "degree 2" },
          { x: 415, y: 278, text: "leaves: E F G H I" },
        ],
        caption: "General tree: root, subtrees, degree, siblings, ancestors, descendants, level, and height.",
      };
    case "5-2":
      return {
        title: "Complete binary tree array positions",
        nodes: COUNT_NODES,
        edges: COUNT_EDGES,
        active: ["1", "4", "5", "6", "7"],
        annotations: [
          { x: 180, y: 278, text: "level i max: 2^(i-1)" },
          { x: 500, y: 278, text: "parent(i)=floor(i/2)" },
        ],
        caption: "Complete binary tree: positions 1..n map directly to array indices.",
      };
    case "5-3":
      return {
        title: "Binary tree traversal orders",
        nodes: BINARY_NODES,
        edges: BINARY_EDGES,
        active: TRAVERSALS[order],
        annotations: [
          { x: 340, y: 278, text: `${order} order: ${TRAVERSALS[order].join(" ")}` },
        ],
        caption: "Traversal changes the visit order, not the tree shape.",
      };
    case "5-4":
      return {
        title: "Copy and equality recurse over matching subtrees",
        nodes: BINARY_NODES,
        edges: BINARY_EDGES,
        active: ["A", "B", "C"],
        annotations: [
          { x: 202, y: 278, text: "copy(left), copy(right)" },
          { x: 496, y: 278, text: "equal(data,left,right)" },
        ],
        caption: "Copying and equality both handle NULL first, then recurse on left and right subtrees.",
      };
    case "5-5":
      return {
        title: "Threaded binary tree inorder successor links",
        nodes: THREAD_NODES,
        edges: THREAD_EDGES,
        active: ["D", "B", "E", "A", "F"],
        annotations: [
          { x: 340, y: 278, text: "dashed links replace NULL child links with inorder threads" },
        ],
        caption: "Threads let repeated insucc calls perform inorder traversal without a stack.",
      };
    case "5-8":
      return {
        title: "Winner tree for k-way merging",
        nodes: WINNER_NODES,
        edges: WINNER_EDGES,
        active: ["r", "l", "a"],
        annotations: [
          { x: 340, y: 278, text: "root stores the current smallest run head" },
        ],
        caption: "After output, rebuild only one leaf-to-root path: O(log k) per selected record.",
      };
    case "5-9":
      return {
        title: "Forest represented with left-child right-sibling links",
        nodes: FOREST_NODES,
        edges: FOREST_EDGES,
        active: ["A", "D", "G"],
        annotations: [
          { x: 340, y: 258, text: "roots become a sibling chain" },
        ],
        caption: "The PDF skips §5.9, so this page visualizes the earlier tree-to-binary representation bridge.",
      };
    case "5-11":
      return {
        title: "Binary tree counting properties",
        nodes: COUNT_NODES,
        edges: COUNT_EDGES,
        active: ["4", "5", "6", "7"],
        annotations: [
          { x: 205, y: 278, text: "leaves n0 = 4" },
          { x: 480, y: 278, text: "degree-two n2 = 3" },
        ],
        caption: "PDF-backed counting facts: full tree nodes are 2^k - 1, and leaves satisfy n0 = n2 + 1.",
      };
    default:
      return {
        title: "Binary tree overview",
        nodes: BINARY_NODES,
        edges: BINARY_EDGES,
        active: ["A"],
        annotations: [],
        caption: "Binary tree structure with left and right children.",
      };
  }
}

function DiagramLine({ edge, nodes }: { edge: DiagramEdge; nodes: DiagramNode[] }) {
  const from = nodes.find((node) => node.id === edge.from);
  const to = nodes.find((node) => node.id === edge.to);
  if (!from || !to) return null;
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 - 6;

  return (
    <g>
      <line
        x1={from.x}
        y1={from.y + 18}
        x2={to.x}
        y2={to.y - 18}
        stroke={edge.dashed ? "#a3a3a3" : "#d4d4d4"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={edge.dashed ? "5 6" : undefined}
      />
      {edge.label ? (
        <text x={midX} y={midY} textAnchor="middle" className="fill-mute font-mono text-[10px]">
          {edge.label}
        </text>
      ) : null}
    </g>
  );
}

function DiagramCircle({ node, active }: { node: DiagramNode; active: boolean }) {
  return (
    <g>
      <circle
        cx={node.x}
        cy={node.y}
        r="22"
        fill={active ? "#000000" : "#ffffff"}
        stroke={active ? "#000000" : "#d4d4d4"}
        strokeWidth="1.5"
      />
      <text
        x={node.x}
        y={node.y + 4}
        textAnchor="middle"
        className={active ? "fill-white font-mono text-[13px]" : "fill-ink font-mono text-[13px]"}
      >
        {node.label}
      </text>
    </g>
  );
}
