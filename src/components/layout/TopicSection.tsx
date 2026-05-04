"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

interface TopicSectionProps {
  id: string;
  title: string;
  subtitle: string;
  complexity: "easy" | "medium" | "hard";
  children: ReactNode;
}

const complexityColors: Record<string, string> = {
  easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  hard: "bg-red-500/10 text-red-400 border-red-500/20",
};

const complexityLabels: Record<string, string> = {
  easy: "기초",
  medium: "중급",
  hard: "고급",
};

export default function TopicSection({
  id,
  title,
  subtitle,
  complexity,
  children,
}: TopicSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 border-b border-white/[0.04]"
    >
      <div className="w-full max-w-5xl">
        {/* Section header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="font-mono text-sm text-zinc-500">
              {id.replace("-", "_")}.
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-mono border ${complexityColors[complexity]}`}
            >
              {complexityLabels[complexity]}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-3">
            {title}
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">{subtitle}</p>
        </div>

        {/* Content */}
        <div className="relative">
          {/* Decorative corner brackets */}
          <div className="absolute -top-3 -left-3 text-purple-500/20 font-mono text-xl select-none">
            {"/*"}
          </div>
          <div className="absolute -bottom-3 -right-3 text-purple-500/20 font-mono text-xl select-none">
            {"*/"}
          </div>
          {children}
        </div>
      </div>
    </motion.section>
  );
}