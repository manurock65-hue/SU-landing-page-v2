"use client";

import { useIsDesktop } from "@/lib/use-is-desktop";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  BrainCircuit,
  Check,
  Cog,
  Database,
  FileText,
  Handshake,
  Headset,
  Megaphone,
  Network,
  Server,
  ShieldCheck,
  Siren,
  Sparkles,
  Tags,
  TrendingUp,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { Fragment, useRef, useState } from "react";

// Chapter 5 — "SearchUnify Agentic AI Suite Architecture".
// A top-to-bottom flow (Enterprise Functions → AI Agents → LLM → Memory → MCP)
// mirroring the live site's diagram. On desktop the section pins: the flow
// starts fully open, and as you scroll each finished layer folds into a closed
// stack at the top while the current layer stays open with its description.
// Layer descriptions mirror the live site; the small feature labels follow the
// reference diagram.

type Step = { name: string; tag: string; accent: string; description: string; tiers: number[] };

const STEPS: Step[] = [
  {
    name: "Agentic AI Suite",
    tag: "Agents across enterprise functions",
    accent: "text-cyan-300",
    tiers: [0, 1],
    description:
      "At the core of the SearchUnify Agentic AI suite is the capability to achieve end-to-end execution of tasks within enterprise business functions. Its purpose-built AI agents seamlessly exchange data, coordinate through distributed orchestration, and dynamically negotiate via MCP protocols: enabling complex, multi-step task execution both individually and collectively.",
  },
  {
    name: "LLM Intelligence",
    tag: "Reasoning with BYOLLM",
    accent: "text-violet-300",
    tiers: [2],
    description:
      "LLMs enrich the reasoning component of Agentic AI by enabling complex planning, natural language understanding, and contextual memory. Leveraging BYOLLM, the platform seamlessly uses any preferred model, facilitating tool utilization and continuous self-improvement, empowering AI Agents to generate coherent responses, adapt to new scenarios, and decide autonomously.",
  },
  {
    name: "Memory Module",
    tag: "Short-term + long-term memory",
    accent: "text-sky-300",
    tiers: [3],
    description:
      "The platform features a sophisticated memory module that facilitates complex task execution. It executes deep contextual understanding and temporal consistency. Leveraging proprietary SearchUnifyFRAG™ technology, it unifies siloed content to enhance short-term working memory, while the Insights Engine serves as long-term episodic and semantic memory, preserving critical data. This synergy enables the AI Agents to recall patterns, rules, and past interactions: facilitating informed, contextually relevant decisions that drive business success.",
  },
  {
    name: "SearchUnify MCP",
    tag: "Model Context Protocols + connectors",
    accent: "text-emerald-300",
    tiers: [4],
    description:
      "At the heart of the SearchUnify Agentic AI Suite are Model Context Protocols (MCPs). These pre-built protocols ensure contextual accuracy for AI models, enabling precise task execution across diverse business functions. Leveraging an expansive network of in-house connectors, MCPs drive accelerated time-to-value for AI initiatives and significantly enhance operational efficiency.",
  },
];

const N = STEPS.length;
const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------- Flow building blocks ---------- */

function Pill({ children, on }: { children: React.ReactNode; on: boolean }) {
  return (
    <span
      className={cn(
        "relative z-10 mx-auto block w-fit rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors duration-500",
        on
          ? "bg-gradient-to-r from-[#005be2] to-cyan-500 text-white shadow-[0_0_30px_-6px_rgba(34,211,238,0.8)]"
          : "bg-white/5 text-slate-300 ring-1 ring-white/10",
      )}
    >
      {children}
    </span>
  );
}

function Tile({ icon: Icon, label, on }: { icon: LucideIcon; label: string; on: boolean }) {
  return (
    <span
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 text-center transition-colors duration-500",
        on ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-100" : "border-white/10 bg-white/[0.03] text-slate-400",
      )}
    >
      <Icon className="size-4" />
      <span className="text-[10px] font-medium leading-tight">{label}</span>
    </span>
  );
}

function Chip({ icon: Icon, label, on }: { icon: LucideIcon; label: string; on: boolean }) {
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10.5px] font-medium transition-colors duration-500",
        on ? "border-violet-300/30 bg-violet-400/10 text-violet-100" : "border-white/10 bg-white/[0.03] text-slate-400",
      )}
    >
      <Icon className="size-3.5 shrink-0" /> {label}
    </span>
  );
}

function Arrow({ on, animate }: { on: boolean; animate: boolean }) {
  return (
    <div aria-hidden="true" className="relative mx-auto h-7 w-px">
      <span className={cn("absolute inset-0 transition-colors duration-500", on ? "bg-cyan-300/70" : "bg-white/15")} />
      <span
        className={cn(
          "absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 border-b border-r transition-colors duration-500",
          on ? "border-cyan-300" : "border-white/25",
        )}
      />
      {on && animate && (
        <span
          className="absolute left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-white shadow-[0_0_10px_2px_rgba(103,232,249,0.9)]"
          style={{ animation: "flow-pulse 1.2s ease-in infinite" }}
        />
      )}
    </div>
  );
}

function Dim({ on, children, className }: { on: boolean; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("transition-opacity duration-500", on ? "opacity-100" : "opacity-45", className)}>{children}</div>
  );
}

const FUNCTIONS: [LucideIcon, string][] = [
  [Server, "IT"],
  [Megaphone, "Marketing"],
  [Headset, "Customer Support"],
  [TrendingUp, "Sales"],
  [Users, "Human Resource"],
];
const AGENT_ICONS = [Headset, BookOpen, Siren, Tags, Handshake, Wrench];
const CONNECTORS = ["Jira", "Salesforce", "WordPress", "Dynamics 365", "Slack", "Dropbox"];

/* ---------- The five tiers ---------- */

function FunctionsTier({ on }: { on: boolean }) {
  return (
    <Dim on={on}>
      <Pill on={on}>Enterprise functions</Pill>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {FUNCTIONS.map(([I, l]) => (
          <Tile key={l} icon={I} label={l} on={on} />
        ))}
      </div>
    </Dim>
  );
}

function AgentsTier({ on }: { on: boolean }) {
  return (
    <Dim on={on}>
      <Pill on={on}>AI agents</Pill>
      <div
        className={cn(
          "relative -mt-3 rounded-[50%/40%] border px-6 pb-4 pt-6 transition-colors duration-500",
          on ? "border-cyan-300/30 bg-[radial-gradient(ellipse_at_center,rgba(0,91,226,0.35),transparent_70%)]" : "border-white/10",
        )}
      >
        <div className="flex justify-center gap-2.5">
          {AGENT_ICONS.map((I, i) => (
            <span
              key={i}
              className={cn(
                "grid size-9 place-items-center rounded-xl border transition-colors duration-500",
                on ? "border-cyan-300/40 bg-cyan-400/15 text-cyan-100" : "border-white/10 bg-white/5 text-slate-400",
              )}
            >
              <I className="size-4" />
            </span>
          ))}
        </div>
        <p className="mt-3 text-center text-[9.5px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Autonomous · Collaborative · Enterprise-ready
        </p>
      </div>
    </Dim>
  );
}

function LlmTier({ on }: { on: boolean }) {
  return (
    <Dim on={on} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      <div className="flex flex-col gap-1.5">
        <Chip icon={Sparkles} label="Reasoning" on={on} />
        <Chip icon={FileText} label="Planning" on={on} />
        <Chip icon={Wrench} label="Tool use" on={on} />
      </div>
      <div
        className={cn(
          "flex flex-col items-center rounded-2xl border px-5 py-4 text-center transition-all duration-500",
          on ? "border-violet-300/50 bg-violet-500/10 shadow-[0_0_40px_-10px_rgba(167,139,250,0.8)]" : "border-white/10 bg-white/[0.03]",
        )}
      >
        <BrainCircuit className={cn("size-7", on ? "text-violet-200" : "text-slate-400")} />
        <span className="mt-2 text-[13px] font-bold uppercase tracking-wide text-white">LLM Intelligence</span>
        <span className="text-[10px] text-slate-400">with BYOLLM support</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <Chip icon={ShieldCheck} label="Guardrails" on={on} />
        <Chip icon={Cog} label="Enterprise safety" on={on} />
        <Chip icon={Network} label="Scalable" on={on} />
      </div>
    </Dim>
  );
}

function MemoryCard({ t, s, items, on }: { t: string; s: string; items: string[]; on: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-3 transition-colors duration-500",
        on ? "border-sky-300/30 bg-sky-400/10" : "border-white/10 bg-white/[0.03]",
      )}
    >
      <p className="text-[11.5px] font-semibold text-white">{t}</p>
      <p className="text-[9.5px] text-slate-400">{s}</p>
      <ul className="mt-2 space-y-1">
        {items.map((it) => (
          <li key={it} className="flex items-center gap-1.5 text-[10px] text-slate-300">
            <Check className={cn("size-3 shrink-0", on ? "text-sky-300" : "text-slate-500")} strokeWidth={3} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MemoryTier({ on }: { on: boolean }) {
  const link = cn("h-px w-3 transition-colors duration-500", on ? "bg-sky-300/60" : "bg-white/15");
  return (
    <Dim on={on} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <MemoryCard
        t="Insights Engine"
        s="Long-term memory"
        items={["Persistent knowledge", "Behavioral learning", "Historical context"]}
        on={on}
      />
      <div className="flex items-center">
        <span className={link} />
        <span
          className={cn(
            "grid size-20 place-items-center rounded-full border text-center transition-all duration-500",
            on ? "border-sky-300/50 bg-sky-500/15 shadow-[0_0_40px_-8px_rgba(56,189,248,0.8)]" : "border-white/10 bg-white/[0.03]",
          )}
        >
          <span>
            <Database className={cn("mx-auto size-5", on ? "text-sky-200" : "text-slate-400")} />
            <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-white">Memory</span>
          </span>
        </span>
        <span className={link} />
      </div>
      <MemoryCard
        t="SearchUnifyFRAG™"
        s="Short-term memory"
        items={["Real-time retrieval", "Contextual search", "Grounded responses"]}
        on={on}
      />
    </Dim>
  );
}

function McpTier({ on }: { on: boolean }) {
  return (
    <Dim on={on}>
      <div
        className={cn(
          "rounded-2xl border p-3 transition-all duration-500",
          on ? "border-emerald-300/40 bg-emerald-400/[0.07] shadow-[0_0_40px_-12px_rgba(52,211,153,0.7)]" : "border-white/10 bg-white/[0.03]",
        )}
      >
        <p className="text-center text-[13px] font-bold text-white">Model Context Protocol (MCP)</p>
        <div className="mt-2.5 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
          {CONNECTORS.map((c) => (
            <span
              key={c}
              className={cn(
                "rounded-lg border px-1 py-2 text-center text-[9.5px] font-semibold transition-colors duration-500",
                on ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-100" : "border-white/10 bg-white/5 text-slate-400",
              )}
            >
              {c}
            </span>
          ))}
        </div>
        <p className="mt-2.5 text-center text-[9.5px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Connect · Integrate · Extend · Unlock more value
        </p>
      </div>
    </Dim>
  );
}

const TIERS = [
  { name: "Enterprise functions", Comp: FunctionsTier },
  { name: "AI agents", Comp: AgentsTier },
  { name: "LLM intelligence", Comp: LlmTier },
  { name: "Memory", Comp: MemoryTier },
  { name: "Model Context Protocol", Comp: McpTier },
];

/* ---------- Flow ---------- */

// `closed(i)`: tier i has been passed and folds into the stack at the top.
function Flow({
  lit,
  closed = () => false,
  animate,
}: {
  lit: (tier: number) => boolean;
  closed?: (tier: number) => boolean;
  animate: boolean;
}) {
  const lastClosed = TIERS.reduce((acc, _, i) => (closed(i) ? i : acc), -1);

  return (
    <div className="mx-auto w-full max-w-[580px]" aria-hidden="true">
      {TIERS.map(({ name, Comp }, i) => {
        const isClosed = closed(i);
        // Older folded tiers sit further back in the stack.
        const depth = isClosed ? lastClosed - i : 0;
        return (
          <Fragment key={name}>
            {i > 0 && !isClosed && (
              <motion.div layout transition={{ duration: 0.5, ease: EASE }}>
                <Arrow on={lit(i)} animate={animate} />
              </motion.div>
            )}
            <motion.div
              layout
              transition={{ duration: 0.5, ease: EASE }}
              style={{ zIndex: isClosed ? 10 + i : 20 }}
              className={cn("relative", isClosed && i > 0 && closed(i - 1) && "-mt-3")}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {isClosed ? (
                  <motion.div
                    key="closed"
                    initial={{ opacity: 0, scaleY: 0.6 }}
                    animate={{ opacity: 1 - depth * 0.18, scaleY: 1, scaleX: 1 - depth * 0.04 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="flex h-11 origin-top items-center justify-between rounded-xl border border-white/10 bg-[#0b1733] px-4 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.8)]"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">{name}</span>
                    <span className="grid size-5 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16, scaleY: 0.85 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="origin-top"
                  >
                    <Comp on={lit(i)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Fragment>
        );
      })}
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
        From enterprise functions down to connected data: how every request flows through the suite.
      </p>
    </div>
  );
}

function StepText({ step, index }: { step: Step; index: number }) {
  return (
    <>
      <p className={cn("text-sm font-semibold uppercase tracking-[0.14em]", step.accent)}>
        Layer 0{index + 1} · {step.tag}
      </p>
      <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">{step.name}</h3>
      <p className="mt-4 text-[15px] leading-relaxed text-slate-300">{step.description}</p>
    </>
  );
}

export function ArchStack() {
  const isDesktop = useIsDesktop();
  const reduceMotion = useReducedMotion();
  return (
    <section aria-labelledby="arch-heading" className="relative pb-28 pt-12">
      <Header />
      {isDesktop && !reduceMotion ? <PinnedFlow /> : <StaticFlow />}
    </section>
  );
}

function PinnedFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(N - 1, Math.max(0, Math.floor(v * N))));
  });

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + travel * ((i + 0.5) / N), behavior: "smooth" });
  };

  const step = STEPS[active];
  const lit = (tier: number) => step.tiers.includes(tier);
  // Everything above the current step's first tier has been passed → closed.
  const closed = (tier: number) => tier < step.tiers[0];

  return (
    <div ref={ref} className="relative mt-10 h-[340vh]">
      <div className="sticky top-0 flex h-screen items-center px-6 pt-20">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
          {/* Fixed height so the column doesn't re-centre as tiers fold. */}
          <div className="flex h-[700px] items-start">
            <Flow lit={lit} closed={closed} animate />
          </div>

          <div>
            <ol className="mb-6 flex flex-wrap gap-2" aria-label="Architecture layers">
              {STEPS.map((s, i) => (
                <li key={s.name}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={i === active ? "step" : undefined}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60",
                      i === active ? "border-cyan-300/40 bg-cyan-400/10 text-cyan-200" : "border-white/10 text-slate-400 hover:text-white",
                    )}
                  >
                    0{i + 1} · {s.name}
                  </button>
                </li>
              ))}
            </ol>

            <div className="relative min-h-[320px]" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.name}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <StepText step={step} index={active} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex gap-1.5" aria-hidden="true">
              {STEPS.map((s, i) => (
                <span
                  key={s.name}
                  className={cn("h-1 flex-1 rounded-full transition-colors duration-500", i <= active ? "bg-cyan-300/80" : "bg-white/10")}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile / reduced motion: the whole flow open and lit, then each layer's text.
function StaticFlow() {
  return (
    <div className="mt-12 px-4 sm:px-6">
      <Flow lit={() => true} animate={false} />
      <ol className="mx-auto mt-14 max-w-2xl space-y-10">
        {STEPS.map((s, i) => (
          <li key={s.name} className="border-l border-white/10 pl-5">
            <StepText step={s} index={i} />
          </li>
        ))}
      </ol>
    </div>
  );
}
