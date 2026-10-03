"use client";

import { cn } from "@/lib/utils";
import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

// Ambient "agent network" canvas for the hero: a scatter of nodes drifting
// slowly, connected by faint lines when close enough, with the occasional
// bright pulse traveling an edge — agents quietly at work in the background,
// not a literal diagram. Masked to fade out over the centered text column so
// it never fights readability; runs on its own (no mouse tracking) since the
// hero should feel alive even before anyone moves the cursor.

type Node = { bx: number; by: number; phase: number; drift: number };

// Deterministic scatter, weighted to the edges — percent coordinates, a
// phase offset so nodes don't move in lockstep, and a drift radius (% of the
// canvas's shorter side).
const NODES: Node[] = [
  { bx: 6, by: 20, phase: 0.2, drift: 9 },
  { bx: 20, by: 8, phase: 1.1, drift: 7 },
  { bx: 38, by: 15, phase: 2.0, drift: 10 },
  { bx: 12, by: 45, phase: 0.6, drift: 8 },
  { bx: 28, by: 58, phase: 1.8, drift: 9 },
  { bx: 5, by: 74, phase: 2.6, drift: 6 },
  { bx: 46, by: 76, phase: 0.4, drift: 9 },
  { bx: 62, by: 18, phase: 1.4, drift: 8 },
  { bx: 82, by: 10, phase: 2.2, drift: 7 },
  { bx: 94, by: 32, phase: 0.8, drift: 9 },
  { bx: 74, by: 46, phase: 1.6, drift: 8 },
  { bx: 90, by: 60, phase: 2.4, drift: 7 },
  { bx: 62, by: 82, phase: 0.3, drift: 7 },
  { bx: 80, by: 88, phase: 1.2, drift: 8 },
  { bx: 34, by: 90, phase: 2.0, drift: 6 },
  { bx: 96, by: 80, phase: 0.9, drift: 7 },
];

const CONNECT_PCT = 24; // max connect distance, as a % of the shorter canvas side
const DRIFT_SPEED = 0.00032;
const PULSE_MS = 2000;
const BLUE = "0, 91, 226";
const CYAN = "6, 182, 212";

export function AgentNetworkBackground({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    let positions: { x: number; y: number }[] = [];
    let pulse: { from: number; to: number; start: number } | null = null;

    const resize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const place = (t: number) => {
      const dim = Math.min(width, height);
      positions = NODES.map((n) => ({
        x: (n.bx / 100) * width + Math.sin(t * DRIFT_SPEED + n.phase) * (n.drift / 100) * dim,
        y: (n.by / 100) * height + Math.cos(t * DRIFT_SPEED * 1.3 + n.phase) * (n.drift / 100) * dim,
      }));
    };

    const draw = (t: number) => {
      place(t);
      ctx.clearRect(0, 0, width, height);
      const dim = Math.min(width, height);
      const connectDist = (CONNECT_PCT / 100) * dim;

      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const a = positions[i];
          const b = positions[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > connectDist) continue;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${BLUE}, ${(1 - d / connectDist) * 0.4})`;
          ctx.lineWidth = 1.3;
          ctx.stroke();
        }
      }

      for (const p of positions) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${BLUE}, 0.55)`;
        ctx.fill();
      }

      if (!reduceMotion) {
        if (!pulse || t - pulse.start > PULSE_MS) {
          const from = Math.floor(Math.random() * positions.length);
          let to = from;
          for (let tries = 0; tries < 12 && to === from; tries++) {
            const cand = Math.floor(Math.random() * positions.length);
            if (cand === from) continue;
            const d = Math.hypot(positions[from].x - positions[cand].x, positions[from].y - positions[cand].y);
            if (d < connectDist) to = cand;
          }
          pulse = { from, to, start: t };
        }
        const a = positions[pulse.from];
        const b = positions[pulse.to];
        if (a && b) {
          const pT = Math.min(1, (t - pulse.start) / PULSE_MS);
          const px = a.x + (b.x - a.x) * pT;
          const py = a.y + (b.y - a.y) * pT;
          const fade = 1 - Math.abs(pT - 0.5) * 1.6;
          ctx.beginPath();
          ctx.arc(px, py, 3.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${CYAN}, ${Math.max(0, fade)})`;
          ctx.shadowColor = `rgba(${CYAN}, 0.95)`;
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(container);

    if (reduceMotion || !inView) {
      draw(0);
      return () => ro.disconnect();
    }

    let raf = 0;
    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [inView, reduceMotion]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        // Fades out over the centered headline/copy so a node or pulse
        // never sits behind text — visible only as edge ambience.
        "[mask-image:radial-gradient(ellipse_68%_64%_at_50%_42%,transparent_20%,black_72%)]",
        className,
      )}
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}
