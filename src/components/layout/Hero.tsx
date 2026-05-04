"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity }}
      className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 py-20 overflow-hidden"
    >
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Gradient orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-violet-800/10 rounded-full blur-[128px]" />

      <motion.div style={{ y }} className="relative z-10 text-center max-w-4xl">
        {/* Code bracket decoration */}
        <div className="mb-8 opacity-40">
          <pre className="font-mono text-sm md:text-base text-purple-400/60 text-left inline-block">
            <code>{`{`}</code>
          </pre>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400">
            All You Need
          </span>
          <br />
          <span className="text-zinc-100">is Computer Science</span>
        </h1>

        <p className="mt-8 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          자료구조와 알고리즘을{" "}
          <span className="text-purple-400 font-semibold">인터랙티브 시각화</span>
          로 이해하세요. 더 이상 읽기만 하는 CS 공부는 없습니다.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <a
            href="#topics"
            className="px-6 py-3 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 transition-all duration-200 font-mono text-sm"
          >
            ↓ 토픽 둘러보기
          </a>
          <span className="text-zinc-600 text-sm font-mono">
            Phase 1 · {">"} 8 topics
          </span>
        </div>

        {/* Code bracket close */}
        <div className="mt-8 opacity-40">
          <pre className="font-mono text-sm md:text-base text-purple-400/60 text-left inline-block">
            <code>{`}`}</code>
          </pre>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-zinc-600 text-xs font-mono">scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-purple-500/50 to-transparent" />
      </motion.div>
    </motion.section>
  );
}