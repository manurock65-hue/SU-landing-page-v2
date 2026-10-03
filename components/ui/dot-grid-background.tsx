"use client";

import { cn } from "@/lib/utils";
import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

// A canvas dot-grid background (21st.dev "sonar-grid" pattern, reimplemented
// dependency-free): dots near the cursor grow and brighten, easing back to
// their resting size as the pointer moves away. Pauses off-screen and when
// `prefers-reduced-motion` is set (renders a static grid instead).
const GAP = 28; // px between dots
const BASE_R = 1;
const MAX_R = 2.6;
const RADIUS = 140; // px of cursor influence
const COLOR = "0, 91, 226"; // --primary, as an rgb triplet

export function DotGridBackground({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const inView = useInView(containerRef, { amount: 0 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !container || !ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(); // repaint immediately so a resize never shows a blank frame
    };

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const { x: mx, y: my } = mouse.current;
      for (let y = GAP / 2; y < height; y += GAP) {
        for (let x = GAP / 2; x < width; x += GAP) {
          const dist = Math.hypot(x - mx, y - my);
          const t = Math.max(0, 1 - dist / RADIUS);
          const r = BASE_R + (MAX_R - BASE_R) * t;
          const alpha = 0.1 + 0.45 * t;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${COLOR}, ${alpha})`;
          ctx.fill();
        }
      }
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    if (reduceMotion || !inView) {
      return () => ro.disconnect();
    }

    const onMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
    };

    let raf = 0;
    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    container.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, [inView, reduceMotion]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        // Fades out over the centered content column so an enlarged dot
        // never sits behind text being read — visible only as edge decor.
        "[mask-image:radial-gradient(ellipse_60%_55%_at_50%_45%,transparent_30%,black_85%)]",
        className,
      )}
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}
