"use client";

import { ComplianceBadges } from "@/components/ui/compliance-badges";
import { Check, Gauge, KeyRound, Quote, ScrollText } from "lucide-react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// "Autonomy you can audit." Governance section — heading, intro, the four
// bullet points and the "agent-trace" console mirror the live site; the
// trace's own timestamps/log lines are illustrative.
const ease = [0.22, 1, 0.36, 1] as const;

const POINTS = [
  {
    icon: KeyRound,
    label: "Permission-aware retrieval",
    detail: "Agents inherit your existing entitlements, not a copy of them.",
  },
  {
    icon: Quote,
    label: "Source citation on every answer",
    detail: "Every generated answer is traceable to a document you own.",
  },
  {
    icon: Gauge,
    label: "Topic-level guardrails",
    detail: "Confidence thresholds decide when it answers and when it hands off.",
  },
  {
    icon: ScrollText,
    label: "Full audit trail",
    detail: "What was retrieved, what was said, and why — logged every time.",
  },
];

const TRACE = [
  { t: "10:42:03", op: "retrieve", msg: "12 sources · KB, past cases, community" },
  { t: "10:42:04", op: "confidence", msg: "94% · grounded in 3 cited sources" },
  { t: "10:42:04", op: "guardrail", msg: "topic: sso_sync · within scope" },
  { t: "10:42:05", op: "action", msg: "draft reply · awaiting rep approval" },
  { t: "10:42:09", op: "approve", msg: "Priya R. approved · sent to customer" },
  { t: "10:42:09", op: "log", msg: "full trace saved · retention 90d" },
];
const STEP_MS = 650;
const HOLD_MS = 2400;

export function Governance() {
  return (
    <section aria-labelledby="governance-heading" className="relative overflow-hidden bg-white px-6 py-24 sm:py-32">
      {/* A fine audit-ledger grid, continuously swept by a security-scan beam —
          "autonomy you can audit" as a literal, always-running scan. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.05)_1px,transparent_1px)] [background-size:36px_36px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -z-10 h-56 animate-governance-scan bg-gradient-to-b from-transparent via-[#005be2]/[0.09] to-transparent [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,black,transparent)] motion-reduce:hidden"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -z-10 h-px animate-governance-scan bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_12px_2px_rgba(34,211,238,0.6)] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,black,transparent)] motion-reduce:hidden"
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="inline-block rounded-full bg-[#005be2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#005be2]">
            Governance
          </span>
          <h2 id="governance-heading" className="mt-5 text-balance text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Autonomy you can audit.
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-slate-600">
            Every agent action is scoped, logged, and reversible. You decide what it may answer, whom it may answer
            for, and when it must hand off to a person — and the trace shows you exactly what happened, every time.
          </p>

          <div className="mt-8 grid gap-3">
            {POINTS.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, ease, delay: i * 0.08 }}
                className="flex items-start gap-3.5"
              >
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-[#005be2]/10 text-[#005be2]">
                  <p.icon className="size-4" />
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-slate-950">{p.label}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{p.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

          <TraceConsole />
        </div>

        <ComplianceBadges variant="strip" className="mt-16" />
      </div>
    </section>
  );
}

/* A looping "agent-trace" console — the right-hand half of the live section. */
function TraceConsole() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const play = inView && !reduceMotion;
  const [shown, setShown] = useState(1);

  useEffect(() => {
    if (!play) return;
    const t = setTimeout(
      () => setShown((s) => (s >= TRACE.length ? 1 : s + 1)),
      shown >= TRACE.length ? HOLD_MS : STEP_MS,
    );
    return () => clearTimeout(t);
  }, [play, shown]);

  const lines = play ? TRACE.slice(0, shown) : TRACE;
  const done = !play || shown >= TRACE.length;

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-[#050b1f] shadow-[0_30px_70px_-40px_rgba(15,23,42,0.5)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[#005be2] opacity-20 blur-3xl" />
      <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-3.5">
        <span className="font-mono text-xs text-slate-400">agent-trace · case #48213</span>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-300">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-400 motion-reduce:animate-none" />
          live
        </span>
      </div>
      <ol className="relative flex min-h-[300px] flex-col justify-end gap-2 px-5 py-5 font-mono text-[12.5px] leading-relaxed">
        <AnimatePresence initial={false}>
          {lines.map((l) => (
            <motion.li
              key={l.op + l.t}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease }}
              className="flex gap-3"
            >
              <span className="w-16 shrink-0 text-slate-600">{l.t}</span>
              <span className="shrink-0 text-cyan-300">{l.op}</span>
              <span className="min-w-0 text-slate-300">{l.msg}</span>
            </motion.li>
          ))}
          {done && (
            <motion.li
              key="done"
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center gap-2 rounded-lg bg-emerald-400/10 px-3 py-2 font-sans text-[13px] font-semibold text-emerald-300 ring-1 ring-emerald-400/20"
            >
              <Check className="size-4" strokeWidth={3} />
              Trace complete · nothing hidden
            </motion.li>
          )}
        </AnimatePresence>
      </ol>
    </div>
  );
}
