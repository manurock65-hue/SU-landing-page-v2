"use client";

import { DotGridBackground } from "@/components/ui/dot-grid-background";
import { cn } from "@/lib/utils";
import { Bot, CheckCircle2, FileCheck2, HelpCircle, MessageSquareText, Users, Wrench, Workflow, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// "Most AI support pilots stall for four reasons." Four market-claim vs.
// SearchUnify-reality pairs, copy mirrors the live site verbatim. Redesigned
// as a tab-picker + a single physical toggle switch that flips one pair's
// content between "what got sold" and "what SearchUnify does" — one thing on
// screen at a time, easier to follow than four cards read all at once.
const ease = [0.22, 1, 0.36, 1] as const;
const AUTO_FLIP_MS = 2600;

type Pair = {
  title: string;
  marketLabel: string;
  marketIcon: LucideIcon;
  market: string;
  usLabel: string;
  usIcon: LucideIcon;
  us: string;
};

const PAIRS: Pair[] = [
  {
    title: "Builders vs. Agents",
    marketLabel: "A builder",
    marketIcon: Wrench,
    market: "Agentforce, ServiceNow, Microsoft sell you a builder. Months later you have a project, not an agent that does the job.",
    usLabel: "An agent, live on day one",
    usIcon: Workflow,
    us: "Purpose-built agents for well-defined support jobs — L1 answers, rep assist, routing, QA, knowledge. Live on day one.",
  },
  {
    title: "Bots vs. Crew",
    marketLabel: "A standalone bot",
    marketIcon: Bot,
    market: "A standalone chatbot at one step of the journey. No shared context, no hand-off, no idea what happened before or after.",
    usLabel: "A support harness",
    usIcon: Users,
    us: "A support harness: agents that share context and hand work to each other from the front door, beside the rep, and behind the queue, end to end.",
  },
  {
    title: "Answers vs. Resolution",
    marketLabel: "An answer",
    marketIcon: MessageSquareText,
    market: "Retrieval and Q&A stop at the answer. Someone still has to open the Jira, route the case, update the status, write the article.",
    usLabel: "A resolution",
    usIcon: CheckCircle2,
    us: "Agents that act: they resolve the case, create the Jira, swarm in Slack, assign the right rep, and publish the KB through MCP, with approval where you want it.",
  },
  {
    title: "Bluffs vs. Sources",
    marketLabel: "A confident guess",
    marketIcon: HelpCircle,
    market: "When the model doesn't know, it invents — confidently. Nobody can trace where the answer came from when it's wrong.",
    usLabel: "A cited source",
    usIcon: FileCheck2,
    us: "No source, no action. Every answer, draft, route and score is retrieved first, cited, and logged, or the agent hands off.",
  },
];

export function TheGap() {
  const [active, setActive] = useState(0);
  const [side, setSide] = useState<"market" | "us">("market");
  const [interacted, setInteracted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const pair = PAIRS[active];

  // Demo the switch once per pair: flip to "us" shortly after it's shown,
  // unless the reader has already touched the control themselves.
  useEffect(() => {
    if (interacted || reduceMotion || !inView) return;
    const t = setTimeout(() => setSide("us"), AUTO_FLIP_MS);
    return () => clearTimeout(t);
  }, [active, interacted, reduceMotion, inView]);

  const selectPair = (i: number) => {
    setActive(i);
    setSide("market");
    setInteracted(false);
  };

  const flip = (next: "market" | "us") => {
    setSide(next);
    setInteracted(true);
  };

  const onMarket = side === "market";
  const Icon = onMarket ? pair.marketIcon : pair.usIcon;

  return (
    <section aria-labelledby="gap-heading" className="relative overflow-hidden bg-slate-50 px-6 py-24 sm:py-32">
      <DotGridBackground />
      <div className="relative mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full bg-[#005be2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#005be2]">
          The gap
        </span>
        <h2 id="gap-heading" className="mt-5 text-balance text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          Most AI support pilots stall for four reasons.
        </h2>
        <p className="mt-5 text-pretty text-lg text-slate-600">
          Not because the models aren&apos;t good enough. Because of what got sold: a builder instead of an agent, a
          bot instead of a crew, an answer instead of a resolution, and a guess instead of a source.
        </p>
      </div>

      {/* Tabs — pick which pair is on the switch below. */}
      <div role="tablist" aria-label="Comparisons" className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-2">
        {PAIRS.map((p, i) => {
          const isActive = i === active;
          return (
            <button
              key={p.title}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => selectPair(i)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005be2]/40",
                isActive
                  ? "border-[#005be2] bg-[#005be2] text-white shadow-[0_8px_20px_-8px_rgba(0,91,226,0.6)]"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950",
              )}
            >
              <span className="tabular-nums text-xs opacity-70">0{i + 1}</span> {p.title}
            </button>
          );
        })}
      </div>

      {/* The switch itself. */}
      <div ref={ref} className="mx-auto mt-10 max-w-2xl">
        <div
          role="group"
          aria-label="What got sold, vs. what SearchUnify does"
          className={cn(
            "relative mx-auto flex w-full max-w-md items-center rounded-full border p-1 transition-colors duration-500",
            onMarket ? "border-rose-200 bg-rose-50" : "border-emerald-200 bg-emerald-50",
          )}
        >
          <motion.span
            aria-hidden="true"
            animate={{ x: onMarket ? "0%" : "100%" }}
            transition={{ duration: 0.45, ease }}
            className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-white shadow-[0_6px_16px_-6px_rgba(15,23,42,0.35)]"
          />
          <button
            type="button"
            onClick={() => flip("market")}
            aria-pressed={onMarket}
            className={cn(
              "relative z-10 flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-300",
              onMarket ? "text-rose-600" : "text-slate-400 hover:text-slate-600",
            )}
          >
            What got sold
          </button>
          <button
            type="button"
            onClick={() => flip("us")}
            aria-pressed={!onMarket}
            className={cn(
              "relative z-10 flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-300",
              !onMarket ? "text-emerald-600" : "text-slate-400 hover:text-slate-600",
            )}
          >
            What SearchUnify does
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${active}-${side}`}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.35, ease }}
            className={cn(
              "relative mt-6 overflow-hidden rounded-3xl border bg-white p-8 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.35)] transition-colors duration-500 sm:p-10",
              onMarket ? "border-rose-200/70" : "border-emerald-200/70",
            )}
          >
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute -right-20 -top-20 size-64 rounded-full blur-3xl transition-colors duration-500",
                onMarket ? "bg-rose-200/40" : "bg-emerald-200/40",
              )}
            />
            <div className="relative flex items-center gap-4">
              <span
                className={cn(
                  "grid size-12 shrink-0 place-items-center rounded-2xl transition-colors duration-500",
                  onMarket ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600",
                )}
              >
                <Icon className="size-6" />
              </span>
              <p className={cn("text-xl font-bold transition-colors duration-500", onMarket ? "text-rose-600" : "text-emerald-600")}>
                {onMarket ? pair.marketLabel : pair.usLabel}
              </p>
            </div>
            <p className="relative mt-5 text-pretty text-lg leading-relaxed text-slate-700">
              {onMarket ? pair.market : pair.us}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
