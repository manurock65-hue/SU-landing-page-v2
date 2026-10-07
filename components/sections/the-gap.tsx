"use client";

import { DotGridBackground } from "@/components/ui/dot-grid-background";
import { ArrowDown, Bot, CheckCircle2, FileCheck2, HelpCircle, MessageSquareText, Users, Wrench, Workflow, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";

// "Most AI support pilots stall for four reasons." Four market-claim vs.
// SearchUnify-reality pairs, copy mirrors the live site verbatim. All four are
// on screen at once as split cards: what got sold on top, struck through, and
// what SearchUnify does instead underneath. The seam between the two halves
// lines up across the row, so the section reads as one before/after band.
const ease = [0.22, 1, 0.36, 1] as const;

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

      {/* Each card spans the grid's three shared rows (sold · seam · SearchUnify),
          so the halves stay level across the row however long the copy runs. */}
      <ol className="relative mx-auto mt-14 grid max-w-7xl gap-x-5 gap-y-6 sm:grid-cols-2 xl:grid-cols-4">
        {PAIRS.map((p, i) => (
          <motion.li
            key={p.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease, delay: i * 0.1 }}
            className="group row-span-3 grid grid-rows-subgrid gap-y-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] transition-[border-color,box-shadow] duration-500 hover:border-[#005be2]/40 hover:shadow-[0_32px_70px_-36px_rgba(0,91,226,0.55)]"
          >
            {/* What got sold */}
            <div className="p-6 pb-9">
              <p className="flex items-baseline gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-950">
                <span className="font-mono text-slate-400">0{i + 1}</span>
                {p.title}
              </p>
              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">What got sold</p>
              <div className="mt-2.5 flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-400">
                  <p.marketIcon className="size-5" />
                </span>
                <h3 className="text-lg font-bold leading-tight text-slate-500 line-through decoration-rose-400/80 decoration-2">
                  {p.marketLabel}
                </h3>
              </div>
              <p className="mt-3.5 text-pretty text-sm leading-relaxed text-slate-500">{p.market}</p>
            </div>

            {/* The seam: where the pitch ends and the product starts. */}
            <div aria-hidden="true" className="relative z-10 h-0">
              <span className="absolute left-6 top-0 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-full border border-[#005be2]/25 bg-white py-1 pl-1 pr-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#005be2] shadow-[0_6px_16px_-8px_rgba(0,91,226,0.6)]">
                <span className="grid size-5 place-items-center rounded-full bg-[#005be2] text-white transition-transform duration-500 group-hover:translate-y-0.5">
                  <ArrowDown className="size-3" strokeWidth={3} />
                </span>
                Instead
              </span>
            </div>

            {/* What SearchUnify does — fills with the brand gradient on hover. */}
            <div className="relative border-t border-[#005be2]/15 bg-gradient-to-br from-[#005be2]/[0.07] to-cyan-400/[0.09] p-6 pt-9">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-br from-[#005be2] to-[#0891d1] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6, ease, delay: 0.35 + i * 0.1 }}
                className="relative"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#005be2] transition-colors duration-500 group-hover:text-white/75">
                  With SearchUnify
                </p>
                <div className="mt-2.5 flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#005be2] text-white shadow-[0_8px_20px_-8px_rgba(0,91,226,0.7)] transition-colors duration-500 group-hover:bg-white group-hover:text-[#005be2]">
                    <p.usIcon className="size-5" />
                  </span>
                  <h3 className="text-lg font-bold leading-tight text-slate-950 transition-colors duration-500 group-hover:text-white">
                    {p.usLabel}
                  </h3>
                </div>
                <p className="mt-3.5 text-pretty text-sm leading-relaxed text-slate-700 transition-colors duration-500 group-hover:text-white/90">
                  {p.us}
                </p>
              </motion.div>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
