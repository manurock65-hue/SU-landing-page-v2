"use client";

import { AgentLog } from "@/components/sections/agent-log";
import { FUNCTIONS, SUPPORT_INDEX, type Fn } from "@/lib/functions-data";
import { cn } from "@/lib/utils";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Hero deck — one card per business function. The front card plays its agent
// run, then drops, tucks behind the stack and rises into the back slot while
// the rest step forward. Pauses on hover/focus and while off screen.
const SHUFFLE_MS = 5600; // 3 steps × 1.1s + time to read the result
const TUCK_MS = 360; // how long the leaving card stays in front while dropping
const PEEK = 16; // px each card behind peeks out above the one in front
const VISIBLE = 4; // cards drawn behind the front one fade out past this depth

export function FunctionDeck({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [order, setOrder] = useState(() => FUNCTIONS.map((_, i) => (i + SUPPORT_INDEX) % FUNCTIONS.length));
  const [leaving, setLeaving] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  const top = order[0];
  const autoplay = inView && !paused && !reduceMotion;

  useEffect(() => {
    if (!autoplay) return;
    const t = setTimeout(() => {
      setLeaving(top);
      setOrder((o) => [...o.slice(1), o[0]]);
    }, SHUFFLE_MS);
    return () => clearTimeout(t);
  }, [autoplay, top]);

  useEffect(() => {
    if (leaving === null) return;
    const t = setTimeout(() => setLeaving(null), TUCK_MS);
    return () => clearTimeout(t);
  }, [leaving]);

  return (
    <div
      ref={ref}
      role="region"
      aria-roledescription="carousel"
      aria-label="AI agents by team"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      // Card height plus room for the cards peeking out above it.
      className={cn("relative h-[480px] w-full", className)}
    >
      {FUNCTIONS.map((fn, i) => {
        const depth = order.indexOf(i);
        const isTop = depth === 0;
        const tucking = leaving === i;
        const shown = Math.min(depth, VISIBLE);

        return (
          <motion.div
            key={fn.name}
            aria-hidden={!isTop}
            inert={!isTop}
            initial={false}
            animate={
              tucking
                ? { y: 150, scale: 0.96, rotate: -3, opacity: 1 }
                : {
                    y: -shown * PEEK,
                    scale: 1 - shown * 0.05,
                    rotate: 0,
                    opacity: depth >= VISIBLE ? 0 : 1,
                  }
            }
            transition={
              tucking
                ? { duration: TUCK_MS / 1000, ease: [0.4, 0, 1, 1] }
                : { type: "spring", stiffness: 210, damping: 26, mass: 0.9 }
            }
            style={{ zIndex: tucking ? 60 : 50 - depth, transformOrigin: "50% 0%" }}
            className="absolute inset-x-0 bottom-0 will-change-transform"
          >
            <DeckCard fn={fn} active={isTop} playing={isTop && inView} dim={!isTop && !tucking} countdown={isTop && autoplay} />
          </motion.div>
        );
      })}
    </div>
  );
}

function DeckCard({
  fn,
  active,
  playing,
  dim,
  countdown,
}: {
  fn: Fn;
  active: boolean;
  playing: boolean;
  dim: boolean;
  countdown: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border bg-white p-6 text-left transition-[border-color,box-shadow] duration-500",
        active
          ? "border-slate-200 shadow-[0_32px_64px_-28px_rgba(15,23,42,0.28),0_0_0_1px_rgba(0,91,226,0.04)]"
          : "border-slate-200/80 shadow-[0_12px_32px_-20px_rgba(15,23,42,0.2)]",
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full bg-[#005be2] opacity-[0.07] blur-3xl"
      />
      {/* Cards behind the front one fade toward the page so the stack reads as depth. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-10 bg-slate-50 transition-opacity duration-500",
          dim ? "opacity-60" : "opacity-0",
        )}
      />

      <div className="relative flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#005be2]/10 text-[#005be2]">
          <fn.icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">AI agents for</p>
          <h3 className="truncate text-xl font-semibold text-slate-950">{fn.name}</h3>
        </div>
        <span className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-500/20">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-500 motion-reduce:animate-none" />
          Agent live
        </span>
      </div>

      <p className="relative mt-4 line-clamp-2 text-sm leading-relaxed text-slate-600">{fn.description}</p>

      <div className="relative mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
        <p className="mb-4 truncate border-b border-slate-200 pb-3 font-mono text-xs text-[#0b3aa8]">{fn.trigger}</p>
        {/* Remount when the card reaches the front so its run starts from step one. */}
        <AgentLog
          key={active ? "front" : "back"}
          steps={fn.steps}
          result={fn.result}
          playing={playing}
          tone="light"
          className="min-h-[150px]"
        />
      </div>

      {/* Countdown to the next shuffle. */}
      <div aria-hidden="true" className="relative mt-5 h-1 overflow-hidden rounded-full bg-slate-100">
        {countdown && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: SHUFFLE_MS / 1000, ease: "linear" }}
            className="h-full origin-left rounded-full bg-gradient-to-r from-[#005be2] to-[#06b6d4]"
          />
        )}
      </div>
    </div>
  );
}
