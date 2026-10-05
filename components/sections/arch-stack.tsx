"use client";

import { useIsDesktop } from "@/lib/use-is-desktop";
import { cn } from "@/lib/utils";
import {
  BookOpenCheck,
  BrainCircuit,
  Database,
  Radio,
  Search,
  ShieldCheck,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// "AI Agents harnessed for resolution." Redesigned as a hub-and-spoke diagram
// — the harness at the centre, its eight real components arranged around it.
// Click or hover a node (no scroll-jacking) to see its tagline and sub-items;
// the section demos itself once by auto-cycling, then hands control to the
// reader. Content mirrors the live site's eight harness components verbatim.

type Node = {
  name: string;
  tag: string;
  icon: LucideIcon;
  accent: { text: string; ring: string; glow: string; chip: string; line: string };
  chips: string[];
  description: string;
};

const NODES: Node[] = [
  {
    name: "Every Channel",
    tag: "One brain, consistent answers",
    icon: Radio,
    accent: { text: "text-sky-300", ring: "ring-sky-300/60", glow: "shadow-[0_0_40px_-10px_rgba(56,189,248,0.8)]", chip: "bg-sky-400/20 text-sky-50 ring-sky-300/40", line: "#38bdf8" },
    chips: ["Portal", "Chat", "Email", "Voice", "In-product", "Agent desk"],
    description: "Every channel reaches the same harness. Portal, chat, email, voice, in-product and the agent desk — one brain gives a consistent answer no matter where the question comes from.",
  },
  {
    name: "Purpose-built AI Agents",
    tag: "Not one mega-bot",
    icon: Workflow,
    accent: { text: "text-cyan-300", ring: "ring-cyan-300/60", glow: "shadow-[0_0_40px_-10px_rgba(34,211,238,0.8)]", chip: "bg-cyan-400/20 text-cyan-50 ring-cyan-300/40", line: "#22d3ee" },
    chips: ["L1 Support", "L2 Troubleshooting", "Agent Partner", "Escalation", "Knowledge", "Case Quality"],
    description: "Not one mega-bot. Six agent types, each scoped to a well-defined support job — L1 and L2 support, rep assist, escalation, knowledge, and case quality.",
  },
  {
    name: "Orchestration & Governance",
    tag: "Plan, retrieve, act, verify",
    icon: ShieldCheck,
    accent: { text: "text-indigo-300", ring: "ring-indigo-300/60", glow: "shadow-[0_0_40px_-10px_rgba(129,140,248,0.8)]", chip: "bg-indigo-400/20 text-indigo-50 ring-indigo-300/40", line: "#818cf8" },
    chips: ["Workflow builder", "Guardrails", "Human in the loop", "Evals", "Audit trail"],
    description: "Every agent run is planned, retrieved, acted and verified — with guardrails, human-in-the-loop checkpoints, evals and a full audit trail behind every step.",
  },
  {
    name: "Retrieval",
    tag: "Agentic RAG, the right index for each question",
    icon: Search,
    accent: { text: "text-emerald-300", ring: "ring-emerald-300/60", glow: "shadow-[0_0_40px_-10px_rgba(52,211,153,0.8)]", chip: "bg-emerald-400/20 text-emerald-50 ring-emerald-300/40", line: "#34d399" },
    chips: ["Lexical", "Dense", "Graph", "SQL", "Community", "Sufficiency check"],
    description: "Not one search index for every question. Lexical, dense, graph and SQL retrieval, pulled from community too, with a sufficiency check before an agent ever acts on it.",
  },
  {
    name: "Actions & Tools",
    tag: "Answers become outcomes",
    icon: Zap,
    accent: { text: "text-amber-300", ring: "ring-amber-300/60", glow: "shadow-[0_0_40px_-10px_rgba(252,211,77,0.8)]", chip: "bg-amber-400/20 text-amber-50 ring-amber-300/40", line: "#fbbf24" },
    chips: ["MCP tools", "Skills", "Agent-to-agent", "Ticketing", "Entitlements", "Billing"],
    description: "A retrieved answer becomes an outcome: MCP tools, skills and agent-to-agent handoff reach into ticketing, entitlements and billing to actually close the loop.",
  },
  {
    name: "Agent-ready Knowledge",
    tag: "Written for machines, not just people",
    icon: BookOpenCheck,
    accent: { text: "text-blue-300", ring: "ring-blue-300/60", glow: "shadow-[0_0_40px_-10px_rgba(96,165,250,0.8)]", chip: "bg-blue-400/20 text-blue-50 ring-blue-300/40", line: "#60a5fa" },
    chips: ["Cleanup / dedupe", "Knowledge from cases", "Freshness", "Versions & entitlements", "Gap detection"],
    description: "Knowledge gets cleaned, deduplicated and kept fresh, with resolved cases turned into articles automatically and gaps flagged before a customer hits them.",
  },
  {
    name: "Connected Data",
    tag: "Permission-aware, no copy-and-hope",
    icon: Database,
    accent: { text: "text-teal-300", ring: "ring-teal-300/60", glow: "shadow-[0_0_40px_-10px_rgba(45,212,191,0.8)]", chip: "bg-teal-400/20 text-teal-50 ring-teal-300/40", line: "#2dd4bf" },
    chips: ["Knowledge base", "Cases", "Community", "Product docs", "CRM", "Telemetry"],
    description: "Connected, not copied: the harness reads knowledge, cases, community, docs, CRM and telemetry in place, with the same permissions your team already has.",
  },
  {
    name: "Any Model",
    tag: "Swappable, not where the results come from",
    icon: BrainCircuit,
    accent: { text: "text-violet-300", ring: "ring-violet-300/60", glow: "shadow-[0_0_40px_-10px_rgba(167,139,250,0.8)]", chip: "bg-violet-400/20 text-violet-50 ring-violet-300/40", line: "#a78bfa" },
    chips: ["GPT", "Claude", "Gemini", "Open-weight"],
    description: "Every vendor runs the same models. SearchUnify is the harness around them — swap the model underneath without changing where the results come from.",
  },
];

const N = NODES.length;
const RADIUS = 37; // percent of the container
const ease = [0.22, 1, 0.36, 1] as const;

function posFor(i: number) {
  const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
  return { x: 50 + RADIUS * Math.cos(angle), y: 50 + RADIUS * Math.sin(angle) };
}

export function ArchStack() {
  const isDesktop = useIsDesktop();
  const reduceMotion = useReducedMotion();
  return (
    <section aria-labelledby="arch-heading" className="relative pb-28 pt-12">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">
          The harness
        </span>
        <h2 id="arch-heading" className="mt-5 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
          AI Agents harnessed for resolution.
        </h2>
        <p className="mt-5 text-pretty text-lg text-slate-400">
          Every vendor runs the same models. SearchUnify is the harness around them: the knowledge, retrieval,
          orchestration and governance that make agents resolve cases instead of deflecting them.
        </p>
      </div>

      {isDesktop && !reduceMotion ? <Orbit /> : <StaticList />}
    </section>
  );
}

function Orbit() {
  const [active, setActive] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });

  useEffect(() => {
    if (interacted || paused || !inView) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % N), 3200);
    return () => clearTimeout(t);
  }, [active, interacted, paused, inView]);

  const pick = (i: number) => {
    setActive(i);
    setInteracted(true);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") pick((active + 1) % N);
      else if (e.key === "ArrowLeft") pick((active - 1 + N) % N);
    };
    const el = ref.current;
    el?.addEventListener("keydown", onKey);
    return () => el?.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const node = NODES[active];

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className="relative mx-auto mt-16 max-w-7xl px-6 focus:outline-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:gap-16">
        {/* The orbit */}
        <div className="relative mx-auto aspect-square w-full max-w-[560px]">
          <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
            <defs>
              {NODES.map((n, i) => {
                const p = posFor(i);
                return (
                  <linearGradient key={`g${i}`} id={`arch-g${i}`} x1={p.x} y1={p.y} x2="50" y2="50" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor={n.accent.line} stopOpacity="0.1" />
                    <stop offset="1" stopColor={n.accent.line} stopOpacity="0.85" />
                  </linearGradient>
                );
              })}
            </defs>
            {NODES.map((n, i) => {
              const p = posFor(i);
              const isActive = i === active;
              return (
                <g key={n.name}>
                  {/* Base line — always on, a soft gradient from each node into the hub. */}
                  <line x1="50" y1="50" x2={p.x} y2={p.y} stroke={`url(#arch-g${i})`} strokeWidth={isActive ? 0.9 : 0.6} vectorEffect="non-scaling-stroke" style={{ transition: "stroke-width 0.4s" }} />
                  {/* Ambient current — only the active spoke animates continuously; the
                      rest sit as a static dashed line so seven infinite loops aren't
                      running at once (that was the lag). */}
                  {isActive ? (
                    <motion.line
                      x1="50"
                      y1="50"
                      x2={p.x}
                      y2={p.y}
                      stroke={n.accent.line}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeDasharray="0.9 3"
                      vectorEffect="non-scaling-stroke"
                      animate={{ strokeDashoffset: [0, -8] }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <line
                      x1="50"
                      y1="50"
                      x2={p.x}
                      y2={p.y}
                      stroke={n.accent.line}
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeDasharray="0.8 4"
                      strokeOpacity="0.55"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                  {isActive && (
                    <motion.line
                      key={`draw-${active}`}
                      x1="50"
                      y1="50"
                      x2={p.x}
                      y2={p.y}
                      stroke={n.accent.line}
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={{ pathLength: 0, opacity: 0.9 }}
                      animate={{ pathLength: 1, opacity: 0 }}
                      transition={{ duration: 0.6, ease }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Pulsing hub */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-cyan-300/40"
              style={{ transformOrigin: "50% 50%" }}
              animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
            />
            <div className="relative grid size-24 place-items-center rounded-full bg-gradient-to-br from-[#0b1a3d] to-[#071028] text-center ring-1 ring-white/15 shadow-[0_0_50px_-10px_rgba(34,211,238,0.5)] sm:size-28">
              <span className="text-base font-bold text-white sm:text-lg">Harness</span>
            </div>
          </div>

          {/* Nodes */}
          {NODES.map((n, i) => {
            const p = posFor(i);
            const isActive = i === active;
            return (
              <motion.button
                key={n.name}
                type="button"
                onClick={() => pick(i)}
                onMouseEnter={() => pick(i)}
                aria-pressed={isActive}
                aria-label={`${n.name} — ${n.tag}`}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.06, ease }}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 focus-visible:outline-none"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                <motion.span
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ duration: 0.3, ease }}
                  className={cn(
                    "grid size-14 place-items-center rounded-2xl border border-white/10 bg-[#0b1226] transition-colors duration-300 sm:size-16",
                    isActive ? n.accent.text : "text-slate-500 group-hover:text-slate-300",
                  )}
                >
                  <n.icon className="size-6" />
                </motion.span>
                <span
                  className={cn(
                    "max-w-[96px] rounded-md bg-[#050b1f]/85 px-1.5 py-0.5 text-center text-[10.5px] leading-tight backdrop-blur-sm transition-[color,font-weight] duration-300 sm:max-w-[112px] sm:text-[11px]",
                    isActive ? "font-bold text-white" : "font-medium text-slate-500",
                  )}
                >
                  {n.name}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="min-h-[280px]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={node.name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease }}
            >
              <div className="flex items-center gap-3">
                <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl bg-white/5 ring-1", node.accent.text, node.accent.ring)}>
                  <node.icon className="size-5" />
                </span>
                <div>
                  <p className={cn("text-xs font-semibold uppercase tracking-[0.14em]", node.accent.text)}>{node.tag}</p>
                  <p className="font-mono text-[11px] text-slate-500">
                    {active + 1} of {N}
                  </p>
                </div>
              </div>
              <h3 className="mt-4 text-3xl font-bold tracking-tight text-white">{node.name}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-400">{node.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {node.chips.map((c, i) => (
                  <motion.span
                    key={c}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 + i * 0.04, ease }}
                    className={cn("rounded-full px-3 py-1 text-xs font-semibold ring-1", node.accent.chip)}
                  >
                    {c}
                  </motion.span>
                ))}
              </div>
              <div className="mt-7 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => pick((active - 1 + N) % N)}
                  aria-label="Previous component"
                  className="grid size-9 place-items-center rounded-full border border-white/10 text-slate-400 transition-colors hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => pick((active + 1) % N)}
                  aria-label="Next component"
                  className="grid size-9 place-items-center rounded-full border border-white/10 text-slate-400 transition-colors hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
                >
                  →
                </button>
                <span className="text-xs text-slate-500">or use ← → keys</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress dots */}
      <div className="mt-10 flex justify-center gap-1.5" role="tablist" aria-label="Harness components">
        {NODES.map((n, i) => (
          <button
            key={n.name}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={n.name}
            onClick={() => pick(i)}
            className={cn("h-1.5 rounded-full transition-all duration-300", i === active ? "w-6 bg-cyan-300" : "w-1.5 bg-white/15 hover:bg-white/30")}
          />
        ))}
      </div>
    </div>
  );
}

// Mobile / reduced motion: a simple accordion, every component expandable.
function StaticList() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto mt-12 flex max-w-2xl flex-col gap-3 px-4 sm:px-6">
      {NODES.map((n, i) => {
        const expanded = open === i;
        return (
          <div key={n.name} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? -1 : i)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl bg-white/5 ring-1", n.accent.text, n.accent.ring)}>
                <n.icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-white">{n.name}</span>
                <span className={cn("block text-xs", n.accent.text)}>{n.tag}</span>
              </span>
            </button>
            <div className={cn("grid transition-[grid-template-rows] duration-300", expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
              <div className="overflow-hidden">
                <div className="px-4 pb-4">
                  <p className="text-sm leading-relaxed text-slate-400">{n.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {n.chips.map((c) => (
                      <span key={c} className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1", n.accent.chip)}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
