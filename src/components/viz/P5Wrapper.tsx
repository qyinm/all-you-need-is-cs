"use client";

import { useEffect, useRef, useCallback } from "react";
import type p5 from "p5";

export type SketchFunction = (p: p5) => void;

interface P5WrapperProps {
  sketch: SketchFunction;
  className?: string;
  onReady?: () => void;
}

/**
 * P5Wrapper — React wrapper for p5.js in instance mode.
 *
 * Mounts a p5 instance into a div container. The sketch function receives
 * the p5 instance object. Cleanup is automatic on unmount.
 *
 * To use with dynamic width: the canvas resizes to the container's width
 * on mount. The sketch should use p.width/p.height accordingly.
 */
export default function P5Wrapper({
  sketch,
  className,
  onReady,
}: P5WrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<p5 | null>(null);

  const mount = useCallback(async () => {
    if (!containerRef.current) return;

    // Dynamic import to avoid SSR issues
    const P5 = (await import("p5")).default;

    // If a previous instance exists, remove it
    if (instanceRef.current) {
      instanceRef.current.remove();
      instanceRef.current = null;
    }

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // Wrap sketch to inject container dimensions
    const wrappedSketch = (p: p5) => {
      // Store container dimensions for sketch use
      (p as any)._containerWidth = rect.width;
      (p as any)._containerHeight = Math.min(rect.width * 0.6, 600);

      p.setup = () => {
        p.createCanvas(
          (p as any)._containerWidth,
          (p as any)._containerHeight
        );
        p.pixelDensity(1);
        // Call user's setup if they define one
        if ((sketch as any).setup) {
          (sketch as any).setup.call(p, p);
        }
      };

      // Delegate draw to the sketch function, which may override
      // p.draw by assigning to it inside the function
      sketch(p);

      // If sketch didn't set up a draw loop, set a default no-op
      if (!p.draw) {
        p.noLoop();
      }
    };

    instanceRef.current = new P5(wrappedSketch, container);
    onReady?.();
  }, [sketch, onReady]);

  useEffect(() => {
    mount();
    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
    };
  }, [mount]);

  return (
    <div
      ref={containerRef}
      className={`p5-canvas-container w-full ${className ?? ""}`}
    />
  );
}