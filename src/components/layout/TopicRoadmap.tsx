"use client";

import { motion } from "framer-motion";

const TOPICS = [
  { id: "arrays", label: "Arrays", x: 15, y: 45, status: "active" },
  { id: "sorting", label: "Sorting", x: 30, y: 45, status: "active" },
  { id: "linked-list", label: "Linked List", x: 50, y: 30, status: "active" },
  { id: "stack-queue", label: "Stack & Queue", x: 50, y: 60, status: "active" },
  { id: "hash-table", label: "Hash Table", x: 70, y: 25, status: "active" },
  { id: "trees", label: "Trees & BST", x: 70, y: 50, status: "active" },
  { id: "heap", label: "Heap", x: 70, y: 70, status: "active" },
  { id: "graphs", label: "Graphs", x: 85, y: 40, status: "active" },
  { id: "dp", label: "DP & Recursion", x: 85, y: 60, status: "active" },
  // Phase 2 placeholders
  { id: "os", label: "OS", x: 20, y: 80, status: "planned" },
  { id: "networks", label: "Networks", x: 40, y: 82, status: "planned" },
  { id: "databases", label: "Databases", x: 60, y: 85, status: "planned" },
  // Phase 3 placeholders
  { id: "papers", label: "Papers", x: 85, y: 85, status: "planned" },
];

const CONNECTIONS = [
  // Data Structures cluster
  ["arrays", "linked-list"],
  ["arrays", "sorting"],
  ["arrays", "stack-queue"],
  ["linked-list", "stack-queue"],
  ["linked-list", "hash-table"],
  ["linked-list", "trees"],
  ["hash-table", "trees"],
  ["trees", "heap"],
  ["trees", "graphs"],
  ["graphs", "dp"],
  ["dp", "sorting"],
  // Phase connectors
  ["os", "networks"],
  ["networks", "databases"],
  ["databases", "papers"],
  ["graphs", "networks"],
];

interface TopicRoadmapProps {
  activeSection: string | null;
  onTopicClick: (topicId: string) => void;
}

export default function TopicRoadmap({
  activeSection,
  onTopicClick,
}: TopicRoadmapProps) {
  const getNodeColor = (status: string, isActive: boolean) => {
    if (isActive) return "#a78bfa";
    if (status === "planned") return "#4b5563";
    return "#7c3aed";
  };

  const getNodeSize = (status: string) => {
    return status === "planned" ? 10 : 16;
  };

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        viewBox="0 0 100 100"
        className="w-full min-w-[700px] h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b2f5e" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#5b3a8a" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Connections */}
        {CONNECTIONS.map(([from, to]) => {
          const fromNode = TOPICS.find((t) => t.id === from);
          const toNode = TOPICS.find((t) => t.id === to);
          if (!fromNode || !toNode) return null;
          return (
            <motion.line
              key={`${from}-${to}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={
                fromNode.status === "planned" && toNode.status === "planned"
                  ? "#1f2937"
                  : "url(#edgeGrad)"
              }
              strokeWidth={0.4}
              strokeDasharray={
                fromNode.status === "planned" ? "2 2" : undefined
              }
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          );
        })}

        {/* Nodes */}
        {TOPICS.map((topic) => {
          const isActive = activeSection === topic.id;
          const size = getNodeSize(topic.status);
          const color = getNodeColor(topic.status, isActive);
          const isPlanned = topic.status === "planned";

          return (
            <motion.g
              key={topic.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.2 + Math.random() * 0.3,
                type: "spring",
                stiffness: 200,
              }}
              style={{ cursor: isPlanned ? "not-allowed" : "pointer" }}
              onClick={() => !isPlanned && onTopicClick(topic.id)}
            >
              {/* Outer glow ring */}
              <circle
                cx={topic.x}
                cy={topic.y}
                r={isActive ? size + 8 : size + 4}
                fill="none"
                stroke={isActive ? color : "transparent"}
                strokeWidth={0.5}
                opacity={isActive ? 0.3 : 0}
              />

              {/* Node circle */}
              <motion.circle
                cx={topic.x}
                cy={topic.y}
                r={size}
                fill={color}
                opacity={isPlanned ? 0.3 : isActive ? 1 : 0.7}
                filter={isActive ? "url(#glow)" : undefined}
                whileHover={isPlanned ? {} : { scale: 1.3 }}
                transition={{ type: "spring", stiffness: 300 }}
              />

              {/* Label */}
              <text
                x={topic.x}
                y={topic.y + size + 6}
                textAnchor="middle"
                className="pointer-events-none select-none"
                style={{
                  fill: isActive ? "#c4b5fd" : isPlanned ? "#4b5563" : "#9ca3af",
                  fontSize: topic.status === "planned" ? "2.5px" : "3px",
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: "0.05em",
                }}
              >
                {topic.label}
              </text>
            </motion.g>
          );
        })}

        {/* Phase labels */}
        <text
          x={45}
          y={15}
          textAnchor="middle"
          style={{
            fill: "#a78bfa",
            fontSize: "3.5px",
            fontFamily: "var(--font-geist-mono), monospace",
            fontWeight: 600,
            letterSpacing: "0.15em",
          }}
        >
          PHASE 1: DATA STRUCTURES & ALGORITHMS
        </text>

        <text
          x={40}
          y={92}
          textAnchor="middle"
          style={{
            fill: "#4b5563",
            fontSize: "2.5px",
            fontFamily: "var(--font-geist-mono), monospace",
            fontWeight: 400,
            letterSpacing: "0.1em",
          }}
        >
          PHASE 2–3: COMING SOON → OS / NETWORKS / DB / PAPERS
        </text>
      </svg>
    </div>
  );
}