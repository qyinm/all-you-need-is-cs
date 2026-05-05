"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import P5Wrapper, { type SketchFunction } from "@/components/viz/P5Wrapper";

type SearchMode = "obst" | "avl" | "multiway" | "rb" | "btree" | "splay" | "digital" | "trie" | "diff";

const MODES: Record<
  SearchMode,
  {
    label: string;
    target: string;
    idea: string;
    facts: string[];
  }
> = {
  obst: {
    label: "Optimal BST",
    target: "Static tables",
    idea: "Choose a tree that minimizes expected search cost from success and failure probabilities.",
    facts: ["Uses internal and external path costs.", "Dynamic programming fills cost/root tables.", "Knuth's bound reduces the table work."],
  },
  avl: {
    label: "AVL",
    target: "Strict height balance",
    idea: "Keep every node's left/right subtree heights within one.",
    facts: ["Balance factors are -1, 0, or 1.", "Repairs use LL, RR, LR, and RL rotations.", "Worst-case height is logarithmic."],
  },
  multiway: {
    label: "2-3 / 2-3-4",
    target: "Balanced multiway search",
    idea: "Let nodes hold multiple keys so all external nodes stay on the same level.",
    facts: ["2-nodes, 3-nodes, and 4-nodes encode intervals.", "Splits and combines preserve level balance.", "2-3-4 trees support top-down updates."],
  },
  rb: {
    label: "Red-black",
    target: "Binary form of 2-3-4",
    idea: "Represent multiway nodes with black and red links in a binary search tree.",
    facts: ["Search ignores colors.", "No two consecutive red links.", "Height is within a constant factor of log n."],
  },
  btree: {
    label: "B-tree",
    target: "Disk indexes",
    idea: "Use high-degree balanced nodes so a search needs very few disk reads.",
    facts: ["Nonroot nodes stay at least half full.", "Failure nodes are at the same level.", "Insertion splits; deletion rotates or combines."],
  },
  splay: {
    label: "Splay",
    target: "Amortized locality",
    idea: "After each operation, rotate the accessed node to the root.",
    facts: ["No stored balance bits or colors.", "Uses zig, zig-zig, and zig-zag rotations.", "O(log n) amortized per operation."],
  },
  digital: {
    label: "Digital / Patricia",
    target: "Bitwise keys",
    idea: "Branch on key bits instead of comparing full keys at every node.",
    facts: ["Digital trees store one element per node.", "Binary tries compare full keys only at element nodes.", "Patricia compresses degree-one branches."],
  },
  trie: {
    label: "Trie",
    target: "Variable string keys",
    idea: "Branch by sampled characters or key fragments.",
    facts: ["Shared prefixes share paths.", "Sampling strategy controls height.", "Branch nodes can be collapsed with skip fields."],
  },
  diff: {
    label: "Differential files",
    target: "Indexed-file updates",
    idea: "Keep updates in smaller differential structures and merge later.",
    facts: ["Differential files reduce master-file rewrites.", "Differential indexes avoid frequent master-index backup.", "Bloom filters avoid many unnecessary differential-index reads."],
  },
};

const SECTION_TO_MODE: Record<string, SearchMode> = {
  "10-1": "obst",
  "10-2": "avl",
  "10-3": "multiway",
  "10-4": "multiway",
  "10-5": "rb",
  "10-6": "btree",
  "10-6-1": "btree",
  "10-6-2": "btree",
  "10-6-3": "btree",
  "10-6-4": "btree",
  "10-6-5": "btree",
  "10-6-6": "btree",
  "10-7": "splay",
  "10-8": "digital",
  "10-8-1": "digital",
  "10-8-2": "digital",
  "10-8-3": "digital",
  "10-9": "trie",
  "10-9-1": "trie",
  "10-9-2": "trie",
  "10-9-3": "trie",
  "10-9-4": "trie",
  "10-9-5": "trie",
  "10-10": "diff",
};

const COMPARISON_ROWS = [
  ["Optimal BST", "static", "expected cost"],
  ["AVL", "dynamic", "strict height"],
  ["Red-black", "dynamic", "2-3-4 encoding"],
  ["B-tree", "external", "disk access"],
  ["Splay", "dynamic", "amortized locality"],
  ["Trie", "strings", "sampled keys"],
];

export default function SearchStructuresConceptViz({ sectionId }: { sectionId: string }) {
  const mode = useMemo(() => SECTION_TO_MODE[sectionId] ?? "obst", [sectionId]);
  const active = MODES[mode];
  const controls = useMemo(() => controlsFor(mode, sectionId), [mode, sectionId]);
  const [frame, setFrame] = useState(0);
  const [avlValues, setAvlValues] = useState([30, 20, 40]);
  const [avlInput, setAvlInput] = useState("");
  const [avlStatus, setAvlStatus] = useState("Insert a value or load a rotation preset.");
  const avlTree = useMemo(() => buildAVL(avlValues).root, [avlValues]);
  const modeRef = useRef(mode);
  const sectionRef = useRef(sectionId);
  const frameRef = useRef(frame);
  const avlRootRef = useRef<AVLNode | null>(avlTree);
  const avlValuesRef = useRef(avlValues);
  const avlStatusRef = useRef(avlStatus);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    frameRef.current = frame;
  }, [frame]);

  useEffect(() => {
    avlRootRef.current = avlTree;
  }, [avlTree]);

  useEffect(() => {
    avlValuesRef.current = avlValues;
  }, [avlValues]);

  useEffect(() => {
    avlStatusRef.current = avlStatus;
  }, [avlStatus]);

  useEffect(() => {
    sectionRef.current = sectionId;
  }, [sectionId]);

  const sketch: SketchFunction = useCallback((p) => {
    p.setup = () => {
      p.colorMode(p.HSB, 360, 100, 100, 100);
      p.textAlign(p.CENTER, p.CENTER);
      p.textFont("monospace");
    };

    p.draw = () => {
      p.background(0, 0, 100);
      drawChapter10Scene(
        p,
        modeRef.current,
        sectionRef.current,
        frameRef.current,
        avlRootRef.current,
        avlStatusRef.current
      );
    };
  }, []);

  const loadAVLPreset = (index: number) => {
    const presets = [
      { label: "LL", values: [30, 20, 10] },
      { label: "RR", values: [10, 20, 30] },
      { label: "LR", values: [30, 10, 20] },
      { label: "RL", values: [10, 30, 20] },
    ];
    const preset = presets[index] ?? presets[0];
    setFrame(index);
    setAvlValues(preset.values);
    setAvlStatus(`${preset.label} preset inserted: ${preset.values.join(", ")}.`);
  };

  const insertAVLValue = () => {
    const value = Number.parseInt(avlInput, 10);
    if (Number.isNaN(value)) return;
    if (avlValuesRef.current.includes(value)) {
      setAvlStatus(`${value} is already in the AVL tree.`);
      setAvlInput("");
      return;
    }
    const next = [...avlValuesRef.current, value];
    const built = buildAVL(next);
    setAvlValues(next);
    setAvlStatus(
      built.lastRotation
        ? `Inserted ${value}; repaired with ${built.lastRotation} rotation.`
        : `Inserted ${value}; no rotation needed.`
    );
    setAvlInput("");
  };

  return (
    <div className="space-y-5">
      <P5Wrapper sketch={sketch} className="min-h-[380px]" />

      {mode === "avl" ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {controls.map((control, index) => (
              <button
                key={control}
                type="button"
                onClick={() => loadAVLPreset(index)}
                className={index === frame ? "ui-btn-primary" : "ui-btn-secondary"}
              >
                {control}
              </button>
            ))}
            <input
              type="number"
              value={avlInput}
              onChange={(event) => setAvlInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") insertAVLValue();
              }}
              placeholder="Value"
              className="ui-input w-24"
            />
            <button type="button" onClick={insertAVLValue} className="ui-btn-primary">
              Insert
            </button>
            <button
              type="button"
              onClick={() => {
                setAvlValues([30, 20, 40]);
                setAvlStatus("AVL tree reset.");
              }}
              className="ui-btn-secondary"
            >
              Reset
            </button>
          </div>
          <p className="ui-caption text-center">
            Values: {avlValues.join(", ")} · {avlStatus}
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {controls.map((control, index) => (
            <button
              key={control}
              type="button"
              onClick={() => setFrame(index)}
              className={index === frame ? "ui-btn-primary" : "ui-btn-secondary"}
            >
              {control}
            </button>
          ))}
          <button type="button" onClick={() => setFrame((current) => (current + 1) % controls.length)} className="ui-btn-secondary">
            Next
          </button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-hairline p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-[20px] font-medium leading-[1.4] text-ink">
              {active.label}
            </h3>
            <span className="rounded-full bg-surface-soft px-3 py-1 font-mono text-xs text-charcoal">
              {active.target}
            </span>
          </div>
          <p className="text-sm leading-[1.43] text-body">{active.idea}</p>
        </div>

        <div className="rounded-lg border border-hairline p-4">
          <h4 className="mb-3 font-mono text-xs font-medium uppercase text-mute">Section checks</h4>
          <div className="space-y-2">
            {active.facts.map((fact) => (
              <div key={fact} className="flex items-start gap-2 text-sm leading-[1.43] text-charcoal">
                <span className="mt-[0.55rem] h-1.5 w-1.5 rounded-full bg-ink" />
                <span>{fact}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-hairline p-4">
        <h4 className="mb-3 font-mono text-xs font-medium uppercase text-mute">Tradeoff map</h4>
        <div className="grid gap-2 sm:grid-cols-2">
          {COMPARISON_ROWS.map(([name, setting, pressure]) => (
            <div key={name} className="flex items-center justify-between gap-3 border-b border-hairline py-2 sm:last:border-b">
              <span className="text-sm font-medium text-ink">{name}</span>
              <span className="text-right font-mono text-xs text-charcoal">
                {setting} · {pressure}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function controlsFor(mode: SearchMode, sectionId: string): string[] {
  if (mode === "avl") return ["LL", "RR", "LR", "RL"];
  if (mode === "obst") return ["Uniform", "Weighted", "DP table"];
  if (mode === "multiway") return sectionId === "10-4" ? ["Before split", "After split"] : ["Search", "Insert", "Delete"];
  if (mode === "rb") return ["2-3-4 view", "Red links", "Recolor"];
  if (mode === "btree") return ["Search", "Split", "Rotate", "Variable keys"];
  if (mode === "splay") return ["Search path", "Zig-zag", "Root"];
  if (mode === "digital") return ["Digital", "Trie", "Patricia"];
  if (mode === "trie") return ["Search", "Insert", "Delete"];
  if (mode === "diff") return ["Master", "Differential", "Bloom filter"];
  return ["View"];
}

type P5Like = Parameters<SketchFunction>[0];

type AVLNode = {
  value: number;
  height: number;
  left: AVLNode | null;
  right: AVLNode | null;
};

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  fill?: "white" | "black" | "soft";
  accent?: boolean;
};

type Edge = {
  from: string;
  to: string;
  red?: boolean;
  dashed?: boolean;
};

function drawChapter10Scene(
  p: P5Like,
  mode: SearchMode,
  sectionId: string,
  frame: number,
  avlRoot: AVLNode | null,
  avlStatus: string
) {
  drawTitle(p, MODES[mode].label, sectionLabel(sectionId));

  switch (mode) {
    case "obst":
      drawOptimalBST(p, frame);
      break;
    case "avl":
      drawAVLTree(p, avlRoot, avlStatus);
      break;
    case "multiway":
      drawMultiwayTree(p, sectionId === "10-4", frame);
      break;
    case "rb":
      drawRedBlackTree(p, frame);
      break;
    case "btree":
      drawBTree(p, sectionId, frame);
      break;
    case "splay":
      drawSplay(p, frame);
      break;
    case "digital":
      drawDigitalTree(p, sectionId, frame);
      break;
    case "trie":
      drawTrie(p, sectionId, frame);
      break;
    case "diff":
      drawDifferentialFiles(p, frame);
      break;
  }
}

function drawTitle(p: P5Like, title: string, section: string) {
  p.noStroke();
  p.fill(0, 0, 8);
  p.textSize(15);
  p.text(title, p.width / 2, 26);
  p.fill(0, 0, 48);
  p.textSize(11);
  p.text(section, p.width / 2, 46);
}

function sectionLabel(sectionId: string) {
  const labels: Record<string, string> = {
    "10-1": "Expected search cost table",
    "10-2": "Height repair by rotation",
    "10-3": "2-3 node intervals",
    "10-4": "Top-down 4-node split",
    "10-5": "2-3-4 encoded as red-black links",
    "10-6": "High fanout index node",
    "10-6-1": "m-way search node",
    "10-6-2": "Search within node, then descend",
    "10-6-3": "Half-full balanced index",
    "10-6-4": "Leaf split and promotion",
    "10-6-5": "Rotation or combine after deletion",
    "10-6-6": "Variable key storage",
    "10-7": "Splay rotates access to root",
    "10-8": "Bit-directed search",
    "10-8-1": "Digital search tree",
    "10-8-2": "Binary trie",
    "10-8-3": "Patricia compressed trie",
    "10-9": "Character-sampled trie",
    "10-9-1": "Branch and element nodes",
    "10-9-2": "Search by sampled characters",
    "10-9-3": "Sampling changes height",
    "10-9-4": "Insert by first differing sample",
    "10-9-5": "Delete and collapse branches",
    "10-10": "Master plus differential structures",
    "10-11": "Search-structure tradeoff review",
  };
  return labels[sectionId] ?? "Search-structure visualization";
}

function drawOptimalBST(p: P5Like, frame: number) {
  if (frame === 2) {
    drawTable(p, p.width / 2 - 185, 132, [
      ["i,j", "0,1", "1,2", "2,3", "3,4"],
      ["w", "8", "7", "3", "3"],
      ["c", "8", "7", "3", "3"],
      ["r", "1", "2", "3", "4"],
    ]);
    drawPill(p, p.width / 2, 284, "fill diagonals -> choose root r[i,j] with min c[i,k-1] + c[k,j]");
    drawCaption(p, "Interactively step from probability model to dynamic-programming table.");
    return;
  }
  const weighted = frame === 1;
  const nodes: Node[] = [
    { id: weighted ? "do" : "for", label: weighted ? "do" : "for", x: p.width / 2, y: 112, fill: "black" },
    { id: "for", label: "for", x: p.width / 2 - 120, y: 192 },
    { id: "void", label: "void", x: p.width / 2 + 120, y: 192 },
    { id: "while", label: "while", x: p.width / 2 + 178, y: 270 },
  ];
  drawEdges(p, nodes, [
    { from: weighted ? "do" : "for", to: weighted ? "for" : "do" },
    { from: weighted ? "do" : "for", to: "void" },
    { from: "void", to: "while" },
  ]);
  drawNodes(p, nodes);
  drawTable(p, p.width / 2 - 230, 310, [
    ["p", "3", "3", "1", "1"],
    ["q", "2", "3", "1", "1"],
    ["root", "a2", "cost", "32"],
  ]);
  drawCaption(p, weighted ? "Weighted p/q values can move a frequent key closer to the root." : "Uniform search cost favors shallow balanced shape.");
}

function drawAVLTree(p: P5Like, root: AVLNode | null, status: string) {
  if (!root) {
    drawPill(p, p.width / 2, p.height / 2, "Empty AVL tree");
    return;
  }

  const positioned = layoutAVL(root, p.width / 2, 100, Math.max(70, p.width * 0.24));
  for (const item of positioned) {
    if (item.node.left) {
      const child = positioned.find((candidate) => candidate.node === item.node.left);
      if (child) drawLine(p, item.x, item.y + 22, child.x, child.y - 22, false);
    }
    if (item.node.right) {
      const child = positioned.find((candidate) => candidate.node === item.node.right);
      if (child) drawLine(p, item.x, item.y + 22, child.x, child.y - 22, false);
    }
  }

  for (const item of positioned) {
    const bf = avlHeight(item.node.left) - avlHeight(item.node.right);
    drawNode(p, {
      id: String(item.node.value),
      label: String(item.node.value),
      x: item.x,
      y: item.y,
      fill: Math.abs(bf) > 1 ? "black" : "white",
      accent: bf !== 0,
    });
    p.noStroke();
    p.fill(0, 0, 48);
    p.textSize(10);
    p.text(`bf ${bf}`, item.x, item.y + 34);
  }

  drawPill(p, p.width / 2, 318, status);
  drawCaption(p, "Insert values to run ordinary BST insertion followed by AVL balance repair.");
}

function drawMultiwayTree(p: P5Like, splitView: boolean, frame: number) {
  if (splitView && frame > 0) {
    drawRectNode(p, p.width / 2 - 160, 120, ["x", "y", "z"], true);
    drawArrow(p, p.width / 2 - 70, 120, p.width / 2 + 70, 120, false);
    drawRectNode(p, p.width / 2 + 160, 92, ["y"], true);
    drawRectNode(p, p.width / 2 + 90, 198, ["x"], false);
    drawRectNode(p, p.width / 2 + 230, 198, ["z"], false);
    drawLine(p, p.width / 2 + 160, 114, p.width / 2 + 90, 176, false);
    drawLine(p, p.width / 2 + 160, 114, p.width / 2 + 230, 176, false);
    drawCaption(p, "2-3-4 insertion splits 4-nodes on the way down, so the leaf has room.");
    return;
  }
  drawRectNode(p, p.width / 2, 100, frame === 1 ? ["30", "50", "70"] : ["30", "70"], true);
  drawRectNode(p, p.width / 2 - 160, 210, ["10", "20"], false);
  drawRectNode(p, p.width / 2, 210, ["40", "60"], false);
  drawRectNode(p, p.width / 2 + 160, 210, ["80", "90"], false);
  drawLine(p, p.width / 2 - 40, 124, p.width / 2 - 160, 186, false);
  drawLine(p, p.width / 2, 124, p.width / 2, 186, false);
  drawLine(p, p.width / 2 + 40, 124, p.width / 2 + 160, 186, false);
  drawPill(p, p.width / 2, 310, frame === 2 ? "delete: rotate or combine to avoid uneven leaves" : frame === 1 ? "insert: split and promote if node overflows" : "search: choose an interval inside the node");
  drawCaption(p, "2-3 trees keep all external nodes at one level by storing one or two keys per node.");
}

function drawRedBlackTree(p: P5Like, frame: number) {
  const nodes: Node[] = [
    { id: "50", label: "50", x: p.width / 2, y: 88, fill: "black" },
    { id: "10", label: "10", x: p.width / 2 - 135, y: 170, fill: "black" },
    { id: "70", label: "70", x: p.width / 2 + 135, y: 170, fill: "black" },
    { id: "7", label: "7", x: p.width / 2 - 205, y: 250, accent: frame !== 2 },
    { id: "40", label: "40", x: p.width / 2 - 65, y: 250 },
    { id: "60", label: "60", x: p.width / 2 + 70, y: 250 },
    { id: "80", label: "80", x: p.width / 2 + 205, y: 250, accent: frame !== 2 },
  ];
  drawEdges(p, nodes, [
    { from: "50", to: "10" },
    { from: "50", to: "70" },
    { from: "10", to: "7", red: frame !== 2 },
    { from: "10", to: "40" },
    { from: "70", to: "60" },
    { from: "70", to: "80", red: frame !== 2 },
  ]);
  drawNodes(p, nodes);
  drawPill(p, p.width / 2, 320, frame === 0 ? "2-3-4 node expanded into binary form" : frame === 1 ? "red links join keys from one multiway node" : "recolor/split a 4-node on descent");
  drawCaption(p, "Red links encode keys that belonged to the same 2-3-4 node; search is still BST search.");
}

function drawBTree(p: P5Like, sectionId: string, frame: number) {
  const focus =
    frame === 1 || sectionId === "10-6-4"
      ? "split"
      : frame === 2 || sectionId === "10-6-5"
        ? "delete"
        : frame === 3 || sectionId === "10-6-6"
          ? "variable"
          : "search";
  drawRectNode(p, p.width / 2, 92, focus === "split" ? ["20", "35", "50", "75"] : ["20", "35", "50"], true);
  drawRectNode(p, p.width / 2 - 220, 210, ["5", "10", "15"], false);
  drawRectNode(p, p.width / 2 - 75, 210, ["25", "30"], false);
  drawRectNode(p, p.width / 2 + 75, 210, ["40", "45"], false);
  drawRectNode(p, p.width / 2 + 220, 210, focus === "variable" ? ["long-key", "k"] : ["60", "85", "90"], false);
  for (const x of [-220, -75, 75, 220]) {
    drawLine(p, p.width / 2, 116, p.width / 2 + x, 186, false);
  }
  if (focus === "split") {
    drawPill(p, p.width / 2, 310, "overflow -> split leaf, promote separator");
  } else if (focus === "delete") {
    drawPill(p, p.width / 2, 310, "deficient leaf -> rotate with sibling or combine");
  } else if (focus === "variable") {
    drawPill(p, p.width / 2, 310, "fixed node, variable key addresses or sampling");
  } else {
    drawPill(p, p.width / 2, 310, "one disk read per level");
  }
  drawCaption(p, "B-trees trade wider nodes for fewer disk accesses.");
}

function drawSplay(p: P5Like, frame: number) {
  if (frame === 2) {
    drawNode(p, { id: "10r", label: "10", x: p.width / 2, y: 110, fill: "black", accent: true });
    drawNode(p, { id: "8r", label: "8", x: p.width / 2 - 90, y: 205 });
    drawNode(p, { id: "12r", label: "12", x: p.width / 2 + 90, y: 205 });
    drawLine(p, p.width / 2, 132, p.width / 2 - 90, 183, false);
    drawLine(p, p.width / 2, 132, p.width / 2 + 90, 183, false);
    drawPill(p, p.width / 2, 310, "accessed node is now root");
    drawCaption(p, "A splay finishes with the accessed node at the root.");
    return;
  }
  const nodes: Node[] = [
    { id: "8", label: "8", x: p.width / 2 - 110, y: 92, fill: "black" },
    { id: "4", label: "4", x: p.width / 2 - 180, y: 172 },
    { id: "12", label: "12", x: p.width / 2 - 40, y: 172 },
    { id: "10", label: "10", x: p.width / 2 - 72, y: 252, accent: true },
    { id: "14", label: "14", x: p.width / 2 - 5, y: 252 },
  ];
  drawEdges(p, nodes, [
    { from: "8", to: "4" },
    { from: "8", to: "12" },
    { from: "12", to: "10" },
    { from: "12", to: "14" },
  ]);
  drawNodes(p, nodes);
  drawArrow(p, p.width / 2 + 40, 172, p.width / 2 + 170, 172, false);
  drawNode(p, { id: "10r", label: "10", x: p.width / 2 + 225, y: 122, fill: "black", accent: true });
  drawNode(p, { id: "8r", label: "8", x: p.width / 2 + 165, y: 222 });
  drawNode(p, { id: "12r", label: "12", x: p.width / 2 + 285, y: 222 });
  drawLine(p, p.width / 2 + 225, 144, p.width / 2 + 165, 200, false);
  drawLine(p, p.width / 2 + 225, 144, p.width / 2 + 285, 200, false);
  drawPill(p, p.width / 2, 320, frame === 1 ? "zig-zag rotation" : "search path to key 10");
  drawCaption(p, "Splay search moves the accessed node to the root and pays by amortized analysis.");
}

function drawDigitalTree(p: P5Like, sectionId: string, frame: number) {
  const patricia = sectionId === "10-8-3" || frame === 2;
  const trie = sectionId === "10-8-2" || patricia || frame === 1;
  const nodes: Node[] = [
    { id: "1000", label: patricia ? "bit 0" : "1000", x: p.width / 2, y: 82, fill: "black" },
    { id: "0010", label: trie ? "bit 1" : "0010", x: p.width / 2 - 115, y: 165 },
    { id: "1001", label: trie ? "1001" : "1001", x: p.width / 2 + 115, y: 165 },
    { id: "0001", label: "0001", x: p.width / 2 - 175, y: 250 },
    { id: "1100", label: "1100", x: p.width / 2 + 175, y: 250 },
  ];
  drawEdges(p, nodes, [
    { from: "1000", to: "0010" },
    { from: "1000", to: "1001" },
    { from: "0010", to: "0001" },
    { from: "1001", to: "1100" },
  ]);
  drawNodes(p, nodes);
  drawPill(p, p.width / 2, 318, patricia ? "skip degree-one branches with bit numbers" : trie ? "branch nodes separate element nodes" : "branch by bit: 0 left, 1 right");
  drawCaption(p, "Digital search avoids full key comparison at every branch.");
}

function drawTrie(p: P5Like, sectionId: string, frame: number) {
  const sample = sectionId === "10-9-3" || frame === 1;
  drawRectNode(p, p.width / 2, 82, sample ? ["4th char"] : ["B", "C", "G", "O", "T"], true);
  drawRectNode(p, p.width / 2 - 205, 182, ["L", "O", "U"], false);
  drawRectNode(p, p.width / 2 - 45, 182, ["cardinal"], false);
  drawRectNode(p, p.width / 2 + 110, 182, ["gull", "goshawk"], false);
  drawRectNode(p, p.width / 2 + 245, 182, ["trie"], false);
  for (const x of [-205, -45, 110, 245]) {
    drawLine(p, p.width / 2, 106, p.width / 2 + x, 158, false);
  }
  drawRectNode(p, p.width / 2 - 250, 282, ["bluebird"], false);
  drawRectNode(p, p.width / 2 - 160, 282, ["bunting"], false);
  drawLine(p, p.width / 2 - 205, 206, p.width / 2 - 250, 258, false);
  drawLine(p, p.width / 2 - 205, 206, p.width / 2 - 160, 258, false);
  drawPill(p, p.width / 2, 320, frame === 2 ? "delete: collapse one-child branch nodes" : frame === 1 ? "insert: split at first differing sample" : "search: follow sampled characters");
  drawCaption(p, sample ? "Sampling choice changes trie height." : "Tries share sampled prefixes and store full keys at element nodes.");
}

function drawDifferentialFiles(p: P5Like, frame: number) {
  const y = 138;
  drawStore(p, p.width / 2 - 225, y, "Master index", frame === 0 ? ["A -> M1", "B -> M4", "C -> M9"] : ["A -> M1", "B -> D4", "C -> M9"]);
  drawStore(p, p.width / 2, y, "Differential index", frame === 0 ? ["empty", "", ""] : ["B -> D4", "E -> D7", "C -> null"]);
  drawStore(p, p.width / 2 + 225, y, "Differential file", frame === 0 ? ["empty", "", ""] : ["D4: updated B", "D7: inserted E"]);
  drawArrow(p, p.width / 2 - 125, y, p.width / 2 - 55, y, false);
  drawArrow(p, p.width / 2 + 80, y, p.width / 2 + 140, y, false);
  drawPill(p, p.width / 2, 310, frame === 2 ? "Bloom filter: no -> master only, maybe -> differential first" : frame === 1 ? "update writes differential index and file" : "read master index and master file");
  drawCaption(p, "Differential files keep the master stable while updates accumulate in smaller structures.");
}

function drawStore(p: P5Like, x: number, y: number, title: string, rows: string[]) {
  p.stroke(0, 0, 88);
  p.strokeWeight(1);
  p.fill(0, 0, 100);
  p.rectMode(p.CENTER);
  p.rect(x, y, 170, 140, 12);
  p.noStroke();
  p.fill(0, 0, 8);
  p.textSize(12);
  p.text(title, x, y - 48);
  p.fill(0, 0, 42);
  p.textSize(10);
  rows.forEach((row, index) => p.text(row, x, y - 18 + index * 24));
}

function drawTable(p: P5Like, x: number, y: number, rows: string[][]) {
  const cellW = 62;
  const cellH = 28;
  p.textSize(11);
  rows.forEach((row, r) => {
    row.forEach((cell, c) => {
      p.stroke(0, 0, 88);
      p.fill(r === 0 ? 0 : 0, 0, r === 0 ? 98 : 100);
      p.rect(x + c * cellW, y + r * cellH, cellW, cellH, 7);
      p.noStroke();
      p.fill(0, 0, 24);
      p.text(cell, x + c * cellW, y + r * cellH);
    });
  });
}

function drawRectNode(p: P5Like, x: number, y: number, keys: string[], active: boolean) {
  const w = Math.max(74, keys.length * 46);
  p.rectMode(p.CENTER);
  p.stroke(active ? 0 : 0, 0, active ? 0 : 82);
  p.strokeWeight(active ? 2 : 1.5);
  p.fill(active ? 0 : 0, 0, active ? 8 : 100);
  p.rect(x, y, w, 48, 12);
  keys.forEach((key, index) => {
    const start = x - ((keys.length - 1) * 42) / 2;
    p.fill(active ? 100 : 0, 0, active ? 100 : 12);
    p.noStroke();
    p.textSize(12);
    p.text(key, start + index * 42, y);
    if (index > 0) {
      p.stroke(active ? 100 : 0, 0, active ? 50 : 88);
      p.line(start + index * 42 - 21, y - 16, start + index * 42 - 21, y + 16);
    }
  });
}

function drawEdges(p: P5Like, nodes: Node[], edges: Edge[]) {
  for (const edge of edges) {
    const from = nodes.find((node) => node.id === edge.from);
    const to = nodes.find((node) => node.id === edge.to);
    if (!from || !to) continue;
    drawLine(p, from.x, from.y + 22, to.x, to.y - 22, edge.red ?? false, edge.dashed ?? false);
  }
}

function drawNodes(p: P5Like, nodes: Node[]) {
  for (const node of nodes) drawNode(p, node);
}

function drawNode(p: P5Like, node: Node) {
  const dark = node.fill === "black";
  p.stroke(node.accent ? 0 : 0, 0, node.accent ? 0 : 72);
  p.strokeWeight(node.accent ? 3 : 1.5);
  p.fill(dark ? 0 : 0, 0, dark ? 0 : node.fill === "soft" ? 96 : 100);
  p.circle(node.x, node.y, 46);
  p.noStroke();
  p.fill(dark ? 100 : 0, 0, dark ? 100 : 10);
  p.textSize(12);
  p.text(node.label, node.x, node.y);
}

function drawLine(p: P5Like, x1: number, y1: number, x2: number, y2: number, red: boolean, dashed = false) {
  p.stroke(red ? 0 : 0, red ? 75 : 0, red ? 55 : 78);
  p.strokeWeight(red ? 3 : 1.5);
  if (!dashed) {
    p.line(x1, y1, x2, y2);
    return;
  }
  const parts = 12;
  for (let i = 0; i < parts; i += 2) {
    p.line(p.lerp(x1, x2, i / parts), p.lerp(y1, y2, i / parts), p.lerp(x1, x2, (i + 1) / parts), p.lerp(y1, y2, (i + 1) / parts));
  }
}

function drawArrow(p: P5Like, x1: number, y1: number, x2: number, y2: number, red: boolean) {
  drawLine(p, x1, y1, x2, y2, red);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  p.push();
  p.translate(x2, y2);
  p.rotate(angle);
  p.noStroke();
  p.fill(red ? 0 : 0, red ? 75 : 0, red ? 55 : 20);
  p.triangle(0, 0, -10, -5, -10, 5);
  p.pop();
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

function drawCaption(p: P5Like, text: string) {
  p.noStroke();
  p.fill(0, 0, 48);
  p.textSize(11);
  p.text(text, p.width / 2, p.height - 24);
}

function avlHeight(node: AVLNode | null): number {
  return node?.height ?? 0;
}

function cloneAVL(node: AVLNode | null): AVLNode | null {
  if (!node) return null;
  return {
    value: node.value,
    height: node.height,
    left: cloneAVL(node.left),
    right: cloneAVL(node.right),
  };
}

function updateAVLHeight(node: AVLNode) {
  node.height = Math.max(avlHeight(node.left), avlHeight(node.right)) + 1;
}

function rotateAVLRight(y: AVLNode): AVLNode {
  const x = y.left;
  if (!x) return y;
  const t2 = x.right;
  x.right = y;
  y.left = t2;
  updateAVLHeight(y);
  updateAVLHeight(x);
  return x;
}

function rotateAVLLeft(x: AVLNode): AVLNode {
  const y = x.right;
  if (!y) return x;
  const t2 = y.left;
  y.left = x;
  x.right = t2;
  updateAVLHeight(x);
  updateAVLHeight(y);
  return y;
}

function insertAVLNode(node: AVLNode | null, value: number): { root: AVLNode; rotation: string | null } {
  if (!node) {
    return { root: { value, height: 1, left: null, right: null }, rotation: null };
  }

  const root = cloneAVL(node);
  if (!root) {
    return { root: { value, height: 1, left: null, right: null }, rotation: null };
  }

  let rotation: string | null = null;
  if (value < root.value) {
    const inserted = insertAVLNode(root.left, value);
    root.left = inserted.root;
    rotation = inserted.rotation;
  } else if (value > root.value) {
    const inserted = insertAVLNode(root.right, value);
    root.right = inserted.root;
    rotation = inserted.rotation;
  } else {
    return { root, rotation: null };
  }

  updateAVLHeight(root);
  const balance = avlHeight(root.left) - avlHeight(root.right);

  if (balance > 1 && root.left && value < root.left.value) {
    return { root: rotateAVLRight(root), rotation: rotation ?? "LL" };
  }
  if (balance < -1 && root.right && value > root.right.value) {
    return { root: rotateAVLLeft(root), rotation: rotation ?? "RR" };
  }
  if (balance > 1 && root.left && value > root.left.value) {
    root.left = rotateAVLLeft(root.left);
    return { root: rotateAVLRight(root), rotation: rotation ?? "LR" };
  }
  if (balance < -1 && root.right && value < root.right.value) {
    root.right = rotateAVLRight(root.right);
    return { root: rotateAVLLeft(root), rotation: rotation ?? "RL" };
  }

  return { root, rotation };
}

function buildAVL(values: number[]): { root: AVLNode | null; lastRotation: string | null } {
  let root: AVLNode | null = null;
  let lastRotation: string | null = null;
  for (const value of values) {
    const inserted = insertAVLNode(root, value);
    root = inserted.root;
    if (inserted.rotation) lastRotation = inserted.rotation;
  }
  return { root, lastRotation };
}

function layoutAVL(
  node: AVLNode,
  x: number,
  y: number,
  gap: number
): Array<{ node: AVLNode; x: number; y: number }> {
  const current = [{ node, x, y }];
  const nextGap = Math.max(gap * 0.55, 42);
  if (node.left) current.push(...layoutAVL(node.left, x - gap, y + 82, nextGap));
  if (node.right) current.push(...layoutAVL(node.right, x + gap, y + 82, nextGap));
  return current;
}
