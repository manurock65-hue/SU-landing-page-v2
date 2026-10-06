"use client";

import { AgentRunPanels, RUN_HOLD_MS, STEP_MS } from "@/components/sections/agent-run-panels";
import { HERO_EXAMPLES, HERO_DEFAULT_INDEX, type Fn } from "@/lib/functions-data";
import { HERO_RUNS, type AgentRun } from "@/lib/hero-runs";
import { cn } from "@/lib/utils";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Hero deck — one card per business function. The front card plays its agent
// run, then swipes out to the left and fades while the rest step forward; it
// re-enters invisibly at the back. Pauses on hover/focus and while off screen.
const TABS = ["DEFLECT", "ASSIST", "OPERATE"] as const;
const TUCK_MS = 480; // how long the leaving card takes to swipe out
const PEEK = 16; // px each card behind peeks out above the one in front
const VISIBLE = 4; // cards drawn behind the front one fade out past this depth
const GLOW_EASE = [0.22, 1, 0.36, 1] as const;
const GLOW_PROXIMITY = 64; // px — how far outside the card the pointer still wakes the glow

// Cursor-tracking glow border (same technique as the recognitions cards):
// the ring's angle eases toward the pointer, and it only runs for the active
// card so idle cards behind it never attach a listener.
function useGlowBorder(enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    let angle = 0;
    let stop: (() => void) | undefined;

    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const near =
          e.clientX > r.left - GLOW_PROXIMITY &&
          e.clientX < r.right + GLOW_PROXIMITY &&
          e.clientY > r.top - GLOW_PROXIMITY &&
          e.clientY < r.bottom + GLOW_PROXIMITY;
        el.style.setProperty("--glow-on", near ? "1" : "0");
        if (!near) return;

        const target =
          (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI + 90;
        const delta = ((target - angle + 540) % 360) - 180;
        stop?.();
        stop = animate(angle, angle + delta, {
          duration: 0.4,
          ease: GLOW_EASE,
          onUpdate: (v) => {
            angle = v;
            el.style.setProperty("--glow-angle", String(v));
          },
        }).stop;
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      stop?.();
      el.style.setProperty("--glow-on", "0");
    };
  }, [enabled]);

  return ref;
}

export function FunctionDeck({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [order, setOrder] = useState(() => HERO_EXAMPLES.map((_, i) => (i + HERO_DEFAULT_INDEX) % HERO_EXAMPLES.length));
  const [leaving, setLeaving] = useState<number | null>(null);
  // Bumped each time a card finishes tucking out and settles at the back —
  // changing its key forces a clean remount instead of springing in from
  // wherever the tuck-out animation left it (that was the reappear glitch).
  const [resetKeys, setResetKeys] = useState<number[]>(() => HERO_EXAMPLES.map(() => 0));
  const [paused, setPaused] = useState(false);

  const top = order[0];
  const autoplay = inView && !paused && !reduceMotion;
  // How long the top card's own run takes to play out and sit on its result —
  // the deck waits exactly that long before moving on, instead of a fixed
  // timer that either cuts a long run short or sits idle after a short one.
  const topShuffleMs = HERO_RUNS[top].panels.length * STEP_MS + RUN_HOLD_MS;

  useEffect(() => {
    if (!autoplay) return;
    const t = setTimeout(() => {
      setLeaving(top);
      setOrder((o) => [...o.slice(1), o[0]]);
    }, topShuffleMs);
    return () => clearTimeout(t);
  }, [autoplay, top, topShuffleMs]);

  useEffect(() => {
    if (leaving === null) return;
    const t = setTimeout(() => {
      setResetKeys((keys) => keys.map((k, idx) => (idx === leaving ? k + 1 : k)));
      setLeaving(null);
    }, TUCK_MS);
    return () => clearTimeout(t);
  }, [leaving]);

  // Manual jump (dots, tabs): rotate whichever card is chosen straight to the
  // front. No tuck-out needed — the spring reflow reads fine on its own.
  const goTo = (i: number) => {
    setOrder((o) => {
      const idx = o.indexOf(i);
      return [...o.slice(idx), ...o.slice(0, idx)];
    });
    setLeaving(null);
  };

  const goToTab = (tab: AgentRun["tab"]) => {
    const i = HERO_RUNS.findIndex((r) => r.tab === tab);
    if (i !== -1) goTo(i);
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        ref={ref}
        role="region"
        aria-roledescription="carousel"
        aria-label="Live SearchUnify agent examples"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        // Card height plus room for the cards peeking out above it.
        className="relative h-[600px] w-full"
      >
        {HERO_EXAMPLES.map((fn, i) => {
          const depth = order.indexOf(i);
          const isTop = depth === 0;
          const tucking = leaving === i;
          const shown = Math.min(depth, VISIBLE);
          const settled = {
            x: 0,
            y: -shown * PEEK,
            scale: 1 - shown * 0.05,
            rotate: 0,
            opacity: depth >= VISIBLE ? 0 : 1,
          };

          return (
            <motion.div
              key={`${fn.name}-${resetKeys[i]}`}
              aria-hidden={!isTop}
              inert={!isTop}
              // Every mount (first paint, or a fresh key after tucking out)
              // starts from "just behind the stack, invisible" so a card
              // only ever animates a short distance into place — never a
              // long cross-screen jump.
              initial={{ x: 0, y: -VISIBLE * PEEK, scale: 1 - VISIBLE * 0.05, rotate: 0, opacity: 0 }}
              animate={tucking ? { x: -40, y: 10, scale: 0.92, rotate: -4, opacity: 0 } : settled}
              transition={
                tucking
                  ? { duration: TUCK_MS / 1000, ease: [0.4, 0, 0.2, 1] }
                  : { type: "spring", stiffness: 210, damping: 26, mass: 0.9 }
              }
              style={{ zIndex: tucking ? 60 : 50 - depth, transformOrigin: "50% 0%" }}
              className="absolute inset-x-0 bottom-0 will-change-transform"
            >
              <DeckCard
                fn={fn}
                run={HERO_RUNS[i]}
                active={isTop}
                playing={isTop && inView}
                dim={!isTop && !tucking}
                countdown={isTop && autoplay}
                shuffleMs={HERO_RUNS[i].panels.length * STEP_MS + RUN_HOLD_MS}
                onTabSelect={goToTab}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Manual jump dots. */}
      <div role="tablist" aria-label="Choose an example" className="mt-5 flex items-center justify-center gap-2">
        {HERO_EXAMPLES.map((fn, i) => {
          const isTop = order[0] === i;
          return (
            <button
              key={fn.name}
              type="button"
              role="tab"
              aria-selected={isTop}
              aria-label={fn.name}
              onClick={() => goTo(i)}
              className="group p-1.5 focus-visible:outline-none"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-all duration-300",
                  isTop ? "w-6 bg-[#005be2]" : "w-1.5 bg-slate-300 group-hover:bg-slate-400",
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DeckCard({
  fn,
  run,
  active,
  playing,
  dim,
  countdown,
  shuffleMs,
  onTabSelect,
}: {
  fn: Fn;
  run: AgentRun;
  active: boolean;
  playing: boolean;
  dim: boolean;
  countdown: boolean;
  shuffleMs: number;
  onTabSelect: (tab: AgentRun["tab"]) => void;
}) {
  const glowRef = useGlowBorder(active);

  return (
    <div
      ref={glowRef}
      aria-label={fn.name}
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border bg-white text-left transition-[border-color,box-shadow] duration-500",
        active
          ? "border-slate-200 shadow-[0_40px_80px_-32px_rgba(15,23,42,0.32),0_0_0_1px_rgba(0,91,226,0.04)]"
          : "border-slate-200/80 shadow-[0_14px_36px_-22px_rgba(15,23,42,0.2)]",
      )}
    >
      {/* Cursor-tracking glow ring — only wakes for the front card. */}
      {active && <span aria-hidden="true" className="glow-border pointer-events-none absolute -inset-px" />}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-32 size-80 rounded-full bg-[#005be2] opacity-[0.07] blur-3xl"
      />
      {/* Cards behind the front one fade toward the page so the stack reads as depth. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-10 bg-slate-50 transition-opacity duration-500",
          dim ? "opacity-60" : "opacity-0",
        )}
      />

      {/* Window chrome — frames this as a live product screen. */}
      <div className="relative flex items-center gap-1.5 border-b border-slate-100 px-6 py-3.5">
        <span className="size-2.5 rounded-full bg-rose-300" />
        <span className="size-2.5 rounded-full bg-amber-300" />
        <span className="size-2.5 rounded-full bg-emerald-300" />
        <span className="ml-3 truncate font-mono text-[11px] text-slate-400">{run.chromeTitle}</span>
        <span className="ml-auto flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-500 motion-reduce:animate-none" />
          LIVE
        </span>
      </div>

      {/* Deflect / Assist / Operate — marks which lane this example lives in. */}
      <div role="tablist" aria-label="Agent lane" className="relative flex items-center gap-1 border-b border-slate-100 px-6 pt-2.5">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={tab === run.tab}
            onClick={() => onTabSelect(tab)}
            className={cn(
              "border-b-2 px-3 pb-2.5 text-[11px] font-bold tracking-wide transition-colors focus-visible:outline-none",
              tab === run.tab
                ? "border-cta text-cta"
                : "border-transparent text-slate-400 hover:text-slate-600",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative p-6">
        <div className="rounded-xl bg-slate-50 p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{run.context.eyebrow}</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-slate-700">{run.context.body}</p>
        </div>

        {/* Remount when the card reaches the front so its run starts from panel one. */}
        <AgentRunPanels
          key={active ? "front" : "back"}
          run={run}
          resultHeadline={fn.result}
          playing={playing}
          className="mt-3.5"
        />

        {/* Countdown to the next shuffle. */}
        <div aria-hidden="true" className="relative mt-4 h-1 overflow-hidden rounded-full bg-slate-100">
          {countdown && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: shuffleMs / 1000, ease: "linear" }}
              className="h-full origin-left rounded-full bg-gradient-to-r from-[#005be2] to-[#06b6d4]"
            />
          )}
        </div>
      </div>
    </div>
  );
}
