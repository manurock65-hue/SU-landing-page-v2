"use client";

import { cn } from "@/lib/utils";
import { Repeat2, ShieldCheck, Smile, UserCheck, Zap, type LucideIcon } from "lucide-react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef, type MouseEvent } from "react";

// "What changes when the harness is on." Five stats, heading, intro and
// footer note verbatim from the live site.
const ease = [0.22, 1, 0.36, 1] as const;

type Outcome = { value: number; icon: LucideIcon; title: string; description: string };

const OUTCOMES: Outcome[] = [
  {
    value: 60,
    icon: UserCheck,
    title: "Increase in case deflection",
    description: "More customers self-served at the front door with a cited answer, not a bluff.",
  },
  {
    value: 45,
    icon: ShieldCheck,
    title: "Reduction in escalations",
    description: "Routing spots the at-risk case and lands it with the right rep before the customer asks for a manager.",
  },
  {
    value: 35,
    icon: Zap,
    title: "Faster resolution",
    description: "Reps start with the timeline, the logs and the precedent already in front of them.",
  },
  {
    value: 40,
    icon: Smile,
    title: "Higher CSAT",
    description: "Consistent, sourced answers and coaching built from 100% of closed cases, not a 2% sample.",
  },
  {
    value: 20,
    icon: Repeat2,
    title: "Higher renewals",
    description: "Fewer bad support moments in the renewal window. Support becomes a reason to stay.",
  },
];

export function SupportOutcomes() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.15 });
  const reduceMotion = useReducedMotion();
  const play = inView && !reduceMotion;

  return (
    <section
      aria-labelledby="outcomes-heading"
      className="relative z-10 -mt-14 rounded-t-[2.5rem] bg-white px-6 pb-20 pt-24 sm:rounded-t-[3.5rem] sm:pb-24 sm:pt-28"
    >
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full bg-[#005be2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#005be2]">
          Customer outcomes
        </span>
        <h2 id="outcomes-heading" className="mt-5 text-balance text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          What changes when the{" "}
          <span className="bg-gradient-to-r from-[#005be2] to-[#06b6d4] bg-clip-text text-transparent">harness is on.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-slate-600">
          Aggregated from published customer case studies. These are not projections, but what support teams measured
          after switching the agents on.
        </p>
      </div>

      <div ref={ref} className="mx-auto mt-14 flex max-w-6xl flex-wrap justify-center gap-5">
        {OUTCOMES.map((o, i) => (
          <OutcomeCard key={o.title} outcome={o} index={i} play={play} />
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-slate-400">Figures aggregated across published SearchUnify case studies</p>
    </section>
  );
}

function OutcomeCard({ outcome, index, play }: { outcome: Outcome; index: number; play: boolean }) {
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <motion.article
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ duration: 0.6, ease, delay: (index % 3) * 0.08 }}
      className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.25)] transition-[border-color,box-shadow] duration-300 hover:border-[#005be2]/25 hover:shadow-[0_28px_70px_-28px_rgba(0,91,226,0.4)] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
    >
      {/* Cursor spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(360px_circle_at_var(--x)_var(--y),rgba(0,91,226,0.09),transparent_45%)]"
      />

      <div className="relative flex items-center justify-between">
        <motion.span
          whileHover={{ scale: 1.1, rotate: -6 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#005be2]/10 text-[#005be2]"
        >
          <outcome.icon className="size-5" />
        </motion.span>
        <span className="text-xs font-semibold tabular-nums text-slate-300">0{index + 1}</span>
      </div>

      <div role="img" aria-label={`${outcome.value}% ${outcome.title.toLowerCase()}`} className="relative mt-5">
        <StatVisual play={play} value={outcome.value} />
      </div>

      <div className="relative mt-4">
        <h3 className="text-lg font-semibold leading-snug text-slate-950">{outcome.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{outcome.description}</p>
      </div>
    </motion.article>
  );
}

/* Big count-up percentage with a drawn underline sparkline. */
function StatVisual({ play, value }: { play: boolean; value: number }) {
  const count = useMotionValue(0);
  const shown = useTransform(count, (v) => `${Math.round(v)}%`);

  useEffect(() => {
    if (!play) {
      count.set(value);
      return;
    }
    count.set(0);
    const c = animate(count, value, { duration: 1.6, ease });
    return () => c.stop();
  }, [play, value, count]);

  return (
    <div>
      <motion.p className="text-5xl font-bold tracking-tight text-slate-950 tabular-nums">{shown}</motion.p>
      <svg viewBox="0 0 220 10" className="mt-3 h-2.5 w-full max-w-[220px]" preserveAspectRatio="none" aria-hidden="true">
        <path d="M1 8 Q 55 2, 110 5 T 219 2" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
        <motion.path
          d="M1 8 Q 55 2, 110 5 T 219 2"
          fill="none"
          stroke="#005be2"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={false}
          animate={{ pathLength: play ? value / 100 : value / 100 }}
          transition={{ duration: play ? 1.6 : 0, ease }}
        />
      </svg>
    </div>
  );
}
