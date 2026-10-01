"use client";

import { useIsDesktop } from "@/lib/use-is-desktop";
import { cn } from "@/lib/utils";
import { Check, Workflow, BrainCircuit, Cable, Layers, Building2, type LucideIcon } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";

// Chapter 5 — "SearchUnify Agentic AI Suite Architecture", told as one ticket's
// journey through the stack. On desktop the section pins: scrolling moves a
// glowing packet (the ticket) down a rail through five layers, each layer
// "scans" it, and a live trace console logs what that layer did.
// Layer descriptions for the four suite layers mirror the live site; the
// Enterprise Functions line, chips and trace entries are illustrative.

type Layer = {
  name: string;
  tag: string;
  icon: LucideIcon;
  accent: { text: string; ring: string; glow: string; chip: string; dot: string };
  chips: string[];
  description: string;
  trace: { t: string; op: string; msg: string }[];
};

const LAYERS: Layer[] = [
  {
    name: "Enterprise Functions",
    tag: "Where the work starts",
    icon: Building2,
    accent: {
      text: "text-sky-300",
      ring: "border-sky-300/50",
      glow: "shadow-[0_0_50px_-12px_rgba(56,189,248,0.7)]",
      chip: "bg-sky-400/10 text-sky-100 ring-sky-300/25",
      dot: "bg-sky-300",
    },
    chips: ["IT", "Marketing", "Customer Support", "Sales", "HR"],
    description:
      "Requests arrive from every team's everyday tools: help desk, CRM, chat and email. The suite picks them up where they already live.",
    trace: [
      { t: "0.00s", op: "ticket.created", msg: "#48213 · Customer Support · via Zendesk" },
      { t: "0.04s", op: "ticket.text", msg: "“SSO users are not syncing since this morning”" },
    ],
  },
  {
    name: "AI Agents",
    tag: "Agentic AI Suite",
    icon: Workflow,
    accent: {
      text: "text-cyan-300",
      ring: "border-cyan-300/50",
      glow: "shadow-[0_0_50px_-12px_rgba(34,211,238,0.7)]",
      chip: "bg-cyan-400/10 text-cyan-100 ring-cyan-300/25",
      dot: "bg-cyan-300",
    },
    chips: ["Support Agent", "Classification", "Knowledge", "Escalation", "+6"],
    description:
      "At the core of the SearchUnify Agentic AI suite is the capability to achieve end-to-end execution of tasks within enterprise business functions. Its purpose-built AI agents seamlessly exchange data, coordinate through distributed orchestration, and dynamically negotiate via MCP protocols: enabling complex, multi-step task execution both individually and collectively.",
    trace: [
      { t: "0.31s", op: "agent.claim", msg: "AI Support Agent picks up #48213" },
      { t: "0.46s", op: "agent.handoff", msg: "AI Classification Agent → intent: sso_sync · P2" },
    ],
  },
  {
    name: "LLM Intelligence",
    tag: "Reasoning with BYOLLM",
    icon: BrainCircuit,
    accent: {
      text: "text-violet-300",
      ring: "border-violet-300/50",
      glow: "shadow-[0_0_50px_-12px_rgba(167,139,250,0.7)]",
      chip: "bg-violet-400/10 text-violet-100 ring-violet-300/25",
      dot: "bg-violet-300",
    },
    chips: ["Planning", "Reasoning", "Tool use", "Your LLM"],
    description:
      "LLMs enrich the reasoning component of Agentic AI by enabling complex planning, natural language understanding, and contextual memory. Leveraging BYOLLM, the platform seamlessly uses any preferred model, facilitating tool utilization and continuous self-improvement, empowering AI Agents to generate coherent responses, adapt to new scenarios, and decide autonomously.",
    trace: [
      { t: "1.12s", op: "llm.plan", msg: "1 check tenant SSO config · 2 find fix · 3 draft reply" },
      { t: "1.58s", op: "llm.route", msg: "reasoning → your preferred model (BYOLLM)" },
    ],
  },
  {
    name: "Memory Module",
    tag: "SearchUnifyFRAG™ + Insights Engine",
    icon: Layers,
    accent: {
      text: "text-blue-300",
      ring: "border-blue-300/50",
      glow: "shadow-[0_0_50px_-12px_rgba(96,165,250,0.7)]",
      chip: "bg-blue-400/10 text-blue-100 ring-blue-300/25",
      dot: "bg-blue-300",
    },
    chips: ["FRAG™ · short-term", "Insights Engine · long-term"],
    description:
      "The platform features a sophisticated memory module that facilitates complex task execution. It executes deep contextual understanding and temporal consistency. Leveraging proprietary SearchUnifyFRAG™ technology, it unifies siloed content to enhance short-term working memory, while the Insights Engine serves as long-term episodic and semantic memory, preserving critical data. This synergy enables the AI Agents to recall patterns, rules, and past interactions: facilitating informed, contextually relevant decisions that drive business success.",
    trace: [
      { t: "2.20s", op: "frag.retrieve", msg: "12 sources · docs, past cases, community" },
      { t: "2.41s", op: "insights.recall", msg: "similar case #47102 resolved last week" },
    ],
  },
  {
    name: "SearchUnify MCP",
    tag: "Model Context Protocols + connectors",
    icon: Cable,
    accent: {
      text: "text-emerald-300",
      ring: "border-emerald-300/50",
      glow: "shadow-[0_0_50px_-12px_rgba(52,211,153,0.7)]",
      chip: "bg-emerald-400/10 text-emerald-100 ring-emerald-300/25",
      dot: "bg-emerald-300",
    },
    chips: ["Zendesk", "Salesforce", "Slack", "Jira", "SharePoint", "100+ tools"],
    description:
      "At the heart of the SearchUnify Agentic AI Suite are Model Context Protocols (MCPs). These pre-built protocols ensure contextual accuracy for AI models, enabling precise task execution across diverse business functions. Leveraging an expansive network of in-house connectors, MCPs drive accelerated time-to-value for AI initiatives and significantly enhance operational efficiency.",
    trace: [
      { t: "3.05s", op: "mcp.zendesk", msg: "update_ticket(#48213, status: solved, reply: …)" },
      { t: "3.18s", op: "mcp.slack", msg: "notify(#support-ops, “SSO sync fixed”)" },
    ],
  },
];

const N = LAYERS.length;
const BAND_H = 96; // px — fixed so the rail can place the packet exactly
const BAND_GAP = 14;
const centerOf = (i: number) => i * (BAND_H + BAND_GAP) + BAND_H / 2;

// Scroll → packet: it pauses on each layer (so there's time to read) and
// travels between them. [from, to] progress for each hold.
const HOLDS: [number, number][] = [
  [0, 0.12],
  [0.2, 0.32],
  [0.4, 0.52],
  [0.6, 0.72],
  [0.8, 0.92],
];
const DONE_AT = 0.9;

function activeFor(v: number) {
  let a = 0;
  HOLDS.forEach(([start], i) => {
    if (v >= start - 0.04) a = i;
  });
  return a;
}

/* ---------- Layer band ---------- */

function Band({
  layer,
  index,
  state,
  onSelect,
}: {
  layer: Layer;
  index: number;
  state: "done" | "active" | "next";
  onSelect?: () => void;
}) {
  const Tag = onSelect ? "button" : "div";
  return (
    <Tag
      type={onSelect ? "button" : undefined}
      onClick={onSelect}
      aria-current={state === "active" ? "step" : undefined}
      style={{ height: BAND_H }}
      className={cn(
        "group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border px-5 text-left transition-[opacity,border-color,box-shadow,background-color] duration-500",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60",
        state === "active" && cn(layer.accent.ring, layer.accent.glow, "bg-white/[0.06]"),
        state === "done" && "border-white/10 bg-white/[0.03]",
        state === "next" && "border-white/5 bg-white/[0.015] opacity-50",
      )}
    >
      {/* Scanning sweep across the active layer */}
      {state === "active" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent motion-reduce:hidden"
          style={{ animation: "band-scan 2.2s ease-in-out infinite" }}
        />
      )}

      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl border transition-colors duration-500",
          state === "active" ? cn(layer.accent.ring, layer.accent.text, "bg-white/5") : "border-white/10 text-slate-400",
        )}
      >
        <layer.icon className="size-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          <span className="text-[11px] font-semibold tabular-nums text-slate-500">0{index + 1}</span>
          <span className="truncate text-[15px] font-semibold text-white">{layer.name}</span>
        </span>
        <span className="mt-2 flex flex-wrap gap-1.5">
          {layer.chips.map((c) => (
            <span
              key={c}
              className={cn(
                "rounded-md px-2 py-0.5 text-[10.5px] font-medium ring-1 transition-colors duration-500",
                state === "active" ? layer.accent.chip : "bg-white/[0.04] text-slate-400 ring-white/10",
              )}
            >
              {c}
            </span>
          ))}
        </span>
      </span>

      <span className="w-16 shrink-0 text-right font-mono text-[11px]">
        {state === "done" && (
          <span className="inline-flex items-center gap-1 text-emerald-300">
            <Check className="size-3.5" strokeWidth={3} />
            {layer.trace[layer.trace.length - 1].t}
          </span>
        )}
        {state === "active" && <span className={layer.accent.text}>running</span>}
      </span>
    </Tag>
  );
}

/* ---------- Trace console ---------- */

function TraceConsole({ upTo, done }: { upTo: number; done: boolean }) {
  const lines = LAYERS.slice(0, upTo + 1).flatMap((l, li) => l.trace.map((line) => ({ ...line, layer: li })));
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
        <span className="font-mono text-[11px] text-slate-400">trace · ticket #48213</span>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-300">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-400 motion-reduce:animate-none" />
          live
        </span>
      </div>
      <ol className="flex min-h-[248px] flex-col justify-end gap-1.5 px-4 py-3 font-mono text-[12px] leading-relaxed">
        <AnimatePresence initial={false}>
          {lines.map((l) => (
            <motion.li
              key={l.op + l.t}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-3"
            >
              <span className="w-11 shrink-0 text-slate-600">{l.t}</span>
              <span className={cn("shrink-0", LAYERS[l.layer].accent.text)}>{l.op}</span>
              <span className={cn("min-w-0", l.layer === upTo ? "text-slate-200" : "text-slate-500")}>{l.msg}</span>
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
              Resolved in 3.2s · zero human touches
            </motion.li>
          )}
        </AnimatePresence>
      </ol>
    </div>
  );
}

/* ---------- Section ---------- */

function Header() {
  return (
    <div className="mx-auto max-w-3xl px-6 text-center">
      <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">
        Architecture
      </span>
      <h2 id="arch-heading" className="mt-5 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
        SearchUnify Agentic AI Suite Architecture
      </h2>
      <p className="mt-5 text-pretty text-lg text-slate-400">
        Follow one support ticket through the stack, from the moment it arrives to the moment it’s solved.
      </p>
    </div>
  );
}

function LayerText({ layer, index }: { layer: Layer; index: number }) {
  return (
    <>
      <p className={cn("text-xs font-semibold uppercase tracking-[0.16em]", layer.accent.text)}>
        Layer 0{index + 1} · {layer.tag}
      </p>
      <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">{layer.name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">{layer.description}</p>
    </>
  );
}

export function ArchStack() {
  const isDesktop = useIsDesktop();
  const reduceMotion = useReducedMotion();
  return (
    <section aria-labelledby="arch-heading" className="relative pb-28 pt-12">
      <Header />
      {isDesktop && !reduceMotion ? <PinnedJourney /> : <StaticJourney />}
    </section>
  );
}

function PinnedJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  const input = HOLDS.flat();
  const output = HOLDS.flatMap((_, i) => [centerOf(i), centerOf(i)]);
  const packetY = useTransform(progress, input, output);
  const railFill = useTransform(packetY, (y) => `${y - centerOf(0)}px`);

  const [active, setActive] = useState(0);
  const [done, setDone] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(activeFor(v));
    setDone(v >= DONE_AT);
  });

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    const [a, b] = HOLDS[i];
    window.scrollTo({ top: top + travel * ((a + b) / 2), behavior: "smooth" });
  };

  const railH = centerOf(N - 1) - centerOf(0);
  const layer = LAYERS[active];

  return (
    <div ref={ref} className="relative mt-6 h-[380vh]">
      <div className="sticky top-0 flex h-screen items-start px-6 pt-[132px]">
        <div className="mx-auto grid w-full max-w-7xl items-start gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          {/* Pipeline: rail + packet + bands */}
          <div className="relative pl-10">
            <div
              aria-hidden="true"
              className="absolute left-[15px] w-0.5 rounded-full bg-white/10"
              style={{ top: centerOf(0), height: railH }}
            >
              <motion.div
                style={{ height: railFill }}
                className="w-full rounded-full bg-gradient-to-b from-sky-300 via-cyan-300 to-emerald-300"
              />
            </div>
            {LAYERS.map((l, i) => (
              <span
                key={l.name}
                aria-hidden="true"
                className={cn(
                  "absolute left-[11px] size-2.5 rounded-full ring-4 ring-[#050b1f] transition-colors duration-500",
                  i <= active ? l.accent.dot : "bg-white/20",
                )}
                style={{ top: centerOf(i) - 5 }}
              />
            ))}
            {/* The ticket */}
            <motion.div
              aria-hidden="true"
              style={{ y: packetY }}
              className="absolute left-[7px] top-0 -mt-[9px] size-[18px]"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-cyan-300/50" />
              <span className="absolute inset-0 rounded-full bg-white shadow-[0_0_18px_4px_rgba(103,232,249,0.85)]" />
            </motion.div>

            <ol className="flex flex-col" style={{ gap: BAND_GAP }} aria-label="Architecture layers">
              {LAYERS.map((l, i) => (
                <li key={l.name}>
                  <Band
                    layer={l}
                    index={i}
                    state={i < active || (done && i === active && i === N - 1) ? "done" : i === active ? "active" : "next"}
                    onSelect={() => goTo(i)}
                  />
                </li>
              ))}
            </ol>
          </div>

          {/* What this layer did */}
          <div className="flex flex-col gap-5">
            <div className="min-h-[200px]" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={layer.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <LayerText layer={layer} index={active} />
                </motion.div>
              </AnimatePresence>
            </div>
            <TraceConsole upTo={active} done={done} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile / reduced motion: every layer shown, each with its own trace lines.
function StaticJourney() {
  return (
    <ol className="mx-auto mt-12 flex max-w-2xl flex-col gap-4 px-4 sm:px-6">
      {LAYERS.map((l, i) => (
        <li key={l.name} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <Band layer={l} index={i} state="done" />
          <div className="px-1 pt-4">
            <LayerText layer={l} index={i} />
            <ul className="mt-3 space-y-1 font-mono text-[11.5px]">
              {l.trace.map((t) => (
                <li key={t.op} className="flex gap-2">
                  <span className={cn("shrink-0", l.accent.text)}>{t.op}</span>
                  <span className="min-w-0 text-slate-400">{t.msg}</span>
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
      <li className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-400/20">
        <Check className="size-4" strokeWidth={3} /> Resolved in 3.2s · zero human touches
      </li>
    </ol>
  );
}
