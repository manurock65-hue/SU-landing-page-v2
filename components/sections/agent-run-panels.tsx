"use client";

import type { AgentRun, Panel } from "@/lib/hero-runs";
import { parseInline } from "@/lib/parse-inline";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

// Exported so the deck (function-deck.tsx) can size its own shuffle timer to
// match: panels.length * STEP_MS + RUN_HOLD_MS is exactly how long a run
// takes to finish and sit on its result.
export const STEP_MS = 2200;
export const RUN_HOLD_MS = 2000;
// Tall enough for the richest panel (a 3-source retrieval list) with a little
// headroom — fixed so switching panels never resizes the card around it.
const STAGE_H = 212;

// Plays a run's panels one at a time inside a fixed-height stage: the current
// panel crossfades out and the next crossfades in (no stacking, no scroll),
// so the card's overall size never changes as the run progresses. Ends on the
// result summary and holds there — it does not loop back to panel one on its
// own; the deck (function-deck.tsx) owns the next move, swapping in the next
// example and remounting this component so it starts clean next time.
export function AgentRunPanels({
  run,
  resultHeadline,
  playing,
  className,
}: {
  run: AgentRun;
  resultHeadline: string;
  playing: boolean;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const animate = playing && !reduceMotion;
  const total = run.panels.length + 1; // panels + result
  const [count, setCount] = useState(1);
  const shown = animate ? count : total;
  const done = shown > run.panels.length;

  useEffect(() => {
    if (!animate || count >= total) return;
    const t = setTimeout(() => setCount((c) => c + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [animate, count, total]);

  return (
    <div className={className}>
      {/* Step progress — each segment fills live in sync with that panel's
          time on screen, so the bar reads as a real countdown, not a toggle. */}
      <div className="mb-2.5 flex gap-1" aria-hidden="true">
        {run.panels.map((_, i) => {
          const state = done || i < shown - 1 ? "done" : i === shown - 1 ? "active" : "pending";
          return (
            <span key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-slate-200">
              <motion.span
                className="block h-full origin-left rounded-full bg-cta"
                animate={{ scaleX: state === "pending" ? 0 : 1 }}
                transition={
                  state === "active" && animate
                    ? { duration: STEP_MS / 1000, ease: "linear" }
                    : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
                }
              />
            </span>
          );
        })}
      </div>

      <div className="relative overflow-hidden" style={{ height: STAGE_H }}>
        <AnimatePresence mode="wait" initial={false}>
          {!done ? (
            <AgentPanelCard key={shown} panel={run.panels[Math.min(shown, run.panels.length) - 1]} />
          ) : (
            <RunSummary key="summary" headline={resultHeadline} footer={run.footer} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const EASE = [0.22, 1, 0.36, 1] as const;

// Inner blocks pop in one beat after another instead of all at once — the
// small lag is what reads as "live" rather than a static swap. Children use
// the same hidden/show/exit keys and inherit them from the parent's state,
// so a single parent transition drives the whole staggered sequence.
const stage = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: EASE, staggerChildren: 0.07, delayChildren: 0.1 },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.18, ease: EASE } },
};
const item = {
  hidden: { opacity: 0, y: 7 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE } },
  exit: { opacity: 0, y: -7, transition: { duration: 0.15 } },
};

function AgentPanelCard({ panel }: { panel: Panel }) {
  const Icon = panel.icon;
  const variant = panel.variant ?? "default";

  return (
    <motion.div
      variants={stage}
      initial="hidden"
      animate="show"
      exit="exit"
      className={cn(
        "absolute inset-0 overflow-hidden rounded-xl border p-3.5",
        variant === "dashed" && "border-dashed border-slate-300 bg-white",
        variant === "highlight" && "border-cta/25 bg-orange-50/50",
        variant === "default" && "border-slate-200 bg-white",
      )}
    >
      <motion.div variants={item} className="flex items-center gap-2">
        {panel.index != null && (
          <span className="grid size-5 shrink-0 place-items-center rounded-full border border-slate-300 text-[10px] font-bold text-slate-500">
            {panel.index}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cta/10 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide text-cta">
          <Icon className="size-3" />
          {panel.agent}
        </span>
        <span className="ml-auto shrink-0 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">{panel.status}</span>
      </motion.div>

      {panel.chips && (
        <motion.div
          variants={item}
          className="mt-2.5 flex flex-wrap gap-1.5"
        >
          {panel.chips.map((c) => (
            <span
              key={c}
              className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-600 transition-transform duration-200 hover:-translate-y-px hover:border-slate-300"
            >
              {c}
            </span>
          ))}
        </motion.div>
      )}

      {panel.decision && (
        <motion.div
          variants={item}
          className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2.5"
        >
          <span className="rounded-full border border-cta px-2.5 py-1 text-[11px] font-semibold text-cta transition-transform duration-200 hover:scale-105">
            {panel.decision.primary}
          </span>
          {panel.decision.secondary?.map((s) => (
            <span key={s} className="text-[11px] text-slate-400">
              {s}
            </span>
          ))}
          {panel.decision.meta && <span className="ml-auto text-[10.5px] text-slate-400">{panel.decision.meta}</span>}
        </motion.div>
      )}

      {panel.sources && (
        <motion.div
          variants={item}
          className="mt-2.5 space-y-2 border-t border-slate-100 pt-2.5"
        >
          {panel.sources.map((s, i) => (
            <div key={s.name}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12.5px] font-semibold text-slate-800">
                  {s.name}
                  {s.tag && (
                    <span className="ml-1.5 rounded border border-slate-300 px-1 text-[9px] font-semibold text-slate-500">{s.tag}</span>
                  )}
                </span>
                <motion.span
                  initial={{ opacity: 0, scale: 0.75 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 420, damping: 20, delay: 0.18 + i * 0.12 }}
                  className={cn("shrink-0 text-[11px]", s.statusTone === "ok" ? "text-emerald-600" : "text-slate-400 line-through")}
                >
                  {s.status}
                </motion.span>
              </div>
              <p className="mt-0.5 truncate text-[12px] text-slate-500">· {s.detail}</p>
            </div>
          ))}
        </motion.div>
      )}

      {panel.checklist && (
        <motion.div
          variants={item}
          className="mt-2.5 space-y-1.5 border-t border-slate-100 pt-2.5"
        >
          {panel.checklist.map((row, i) => (
            <div key={row.label} className="flex items-start gap-1.5 text-[12px]">
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 22, delay: 0.15 + i * 0.1 }}
                className="mt-0.5 inline-flex shrink-0"
              >
                <Check className="size-3 text-emerald-600" strokeWidth={3} />
              </motion.span>
              <span>
                <span className="font-semibold text-slate-800">{row.label}</span>
                {row.tag && <span className="ml-1 rounded border border-slate-300 px-1 text-[9px] font-semibold text-slate-500">{row.tag}</span>}
                <span className="text-slate-500"> {row.detail}</span>
              </span>
            </div>
          ))}
        </motion.div>
      )}

      {panel.body && (
        <motion.div
          variants={item}
          className="mt-2.5 space-y-1.5 border-t border-slate-100 pt-2.5 text-[12.5px] leading-relaxed text-slate-600"
        >
          {panel.body.split("\n").map((line, i) => (
            <p key={i} className="line-clamp-2">
              {parseInline(line)}
            </p>
          ))}
        </motion.div>
      )}

      {panel.footChips && (
        <motion.div
          variants={item}
          className="mt-2.5 flex flex-wrap gap-1.5"
        >
          {panel.footChips.map((c) => (
            <span
              key={c}
              className="rounded-full border border-cta/30 bg-white px-2 py-0.5 text-[10.5px] font-medium text-cta transition-transform duration-200 hover:-translate-y-px"
            >
              {c}
            </span>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

const summaryItem = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: EASE } },
};

function RunSummary({ headline, footer }: { headline: string; footer: AgentRun["footer"] }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.12 } }}
      variants={{
        hidden: { opacity: 0, scale: 0.88 },
        show: {
          opacity: 1,
          scale: 1,
          transition: { type: "spring", stiffness: 480, damping: 24, mass: 0.6, staggerChildren: 0.09, delayChildren: 0.18 },
        },
      }}
      className="absolute inset-0 overflow-hidden rounded-xl border border-emerald-200/80 bg-gradient-to-b from-white to-emerald-50/70"
    >
      {/* A finished-case band across the top, same language as the live-ring on the other panels. */}
      <div aria-hidden="true" className="h-[3px] w-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-400" />

      <div className="flex h-[calc(100%-3px)] flex-col items-center justify-center gap-3 px-6 text-center">
        {/* A single soft breathing glow behind the badge — steady, no reset-jump. */}
        <span className="relative grid size-11 place-items-center">
          {!reduceMotion && (
            <motion.span
              aria-hidden="true"
              animate={{ scale: [1, 1.45, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity, delay: 0.5 }}
              className="absolute inset-0 rounded-full bg-emerald-400"
            />
          )}
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.4, times: [0, 0.65, 1], ease: "easeOut", delay: 0.05 }}
            className="relative grid size-11 place-items-center rounded-full bg-emerald-500 text-white shadow-[0_10px_24px_-8px_rgba(16,185,129,0.65)]"
          >
            <Check className="size-5" strokeWidth={3} />
          </motion.span>
        </span>

        <motion.p variants={summaryItem} className="text-[15px] font-bold leading-snug text-slate-900">
          {headline}
        </motion.p>

        <motion.div variants={summaryItem} className="flex flex-wrap items-center justify-center gap-1.5">
          {footer.map((f, i) => (
            <span
              key={i}
              className={cn(
                "rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium",
                f.tone === "green" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-500",
              )}
            >
              {f.text}
            </span>
          ))}
          <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-[10px] font-semibold text-emerald-700">
            <Check className="size-2.5" strokeWidth={3} />
            logged
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
