"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface TopicSectionProps {
  id: string;
  title: string;
  subtitle: string;
  complexity: "easy" | "medium" | "hard";
  children: ReactNode;
}

const complexityLabels: Record<string, string> = {
  easy: "Beginner",
  medium: "Intermediate",
  hard: "Advanced",
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
    <section
      ref={ref}
      id={id}
      className="scroll-mt-14 border-t border-hairline px-6 py-12 md:py-[88px]"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.45s ease-out, transform 0.45s ease-out",
      }}
    >
      <div className="mx-auto w-full max-w-[720px]">
        <div className="mb-12 text-center">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
            <span className="font-mono text-sm text-mute">
              {id.replace("-", "_")}.
            </span>
            <span className="rounded-full bg-surface-soft px-3 py-1 font-mono text-xs font-medium text-charcoal">
              {complexityLabels[complexity]}
            </span>
          </div>
          <h1 className="font-display text-[1.875rem] font-medium leading-[1.2] text-ink md:text-[30px]">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-[1.5] text-body">
            {subtitle}
          </p>
        </div>

        <div className="ui-terminal-panel">{children}</div>
      </div>
    </section>
  );
}
