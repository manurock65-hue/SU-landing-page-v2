"use client";

import { useIsDesktop } from "@/lib/use-is-desktop";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  BookOpen,
  ClipboardCheck,
  Handshake,
  Headset,
  MessageSquareText,
  MoveRight,
  Radar,
  Siren,
  Tags,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Chapter 4b — "AI Agents for Customer Support" as a support-journey map:
// four stages left to right, each agent a card that says what it does in one
// line. Nothing to click to understand it; cards link to the agent's page.
// Agent names and links mirror the live site; stages and one-line summaries are
// ours, condensed from the live descriptions.
const SITE = "https://www.searchunify.com/products/ai-agents";

type Agent = { name: string; icon: LucideIcon; summary: string; href?: string };
type Stage = { name: string; blurb: string; agents: Agent[] };

const STAGES: Stage[] = [
  {
    name: "Self-service",
    blurb: "Resolve before a case is opened",
    agents: [
      { name: "AI Support Agent", icon: Headset, summary: "Personalized self-service that cuts case volume.", href: `${SITE}/ai-support-agent/` },
      { name: "AI Proactive Support Agent", icon: Radar, summary: "Spots at-risk customers and steps in early." },
    ],
  },
  {
    name: "Agent assist",
    blurb: "Make every support rep faster",
    agents: [
      { name: "AI Agent Partner", icon: Handshake, summary: "Summarizes cases and suggests the next best action.", href: `${SITE}/ai-agent-partner` },
      { name: "AI Competency Agent", icon: Wrench, summary: "Troubleshoots complex cases and swarms experts.", href: `${SITE}/ai-competency-agent/` },
      { name: "AI Workflow Automation Agent", icon: Workflow, summary: "Hands off between AI and humans with full context." },
    ],
  },
  {
    name: "Knowledge",
    blurb: "Keep answers fresh and complete",
    agents: [
      { name: "AI Knowledge Agent", icon: BookOpen, summary: "Turns resolved cases into knowledge articles.", href: `${SITE}/ai-knowledge-agent` },
      { name: "AI Feedback Analyst", icon: MessageSquareText, summary: "Turns customer feedback into product insights." },
    ],
  },
  {
    name: "Quality & operations",
    blurb: "Triage, protect and improve",
    agents: [
      { name: "AI Classification Agent", icon: Tags, summary: "Classifies and routes every ticket by intent.", href: `${SITE}/ai-classification-agent` },
      { name: "AI Escalation Manager", icon: Siren, summary: "Predicts escalations and prevents them early.", href: `${SITE}/ai-escalation-manager` },
      { name: "AI Case Quality Auditor", icon: ClipboardCheck, summary: "Audits cases in real time for quality and compliance.", href: `${SITE}/ai-case-quality-auditor/` },
    ],
  },
];

const TOTAL = STAGES.reduce((n, s) => n + s.agents.length, 0);

function AgentCard({ agent }: { agent: Agent }) {
  const body = (
    <>
      <span className="flex items-start justify-between gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors duration-200 group-hover:border-cyan-300/40 group-hover:bg-cyan-400/15 group-hover:text-cyan-200">
          <agent.icon className="size-5" />
        </span>
        {agent.href && (
          <ArrowUpRight className="size-4 shrink-0 text-slate-500 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-300" />
        )}
      </span>
      <span className="mt-4 block text-[15px] font-semibold leading-snug text-white">{agent.name}</span>
      <span className="mt-1.5 block text-sm leading-relaxed text-slate-400">{agent.summary}</span>
    </>
  );

  const card = "group block h-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors duration-200";

  return agent.href ? (
    <Link
      href={agent.href}
      className={cn(card, "hover:border-cyan-300/30 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60")}
    >
      {body}
    </Link>
  ) : (
    <div className={card}>{body}</div>
  );
}

export function AgentSuite() {
  const isDesktop = useIsDesktop();
  const reduceMotion = useReducedMotion();
  const pinned = isDesktop && !reduceMotion;

  return (
    <section aria-labelledby="suite-heading" className={cn("relative pt-12", pinned ? "pb-12" : "px-6 pb-28 sm:pb-36")}>
      <div className={cn("mx-auto max-w-3xl text-center", pinned && "px-6")}>
        <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">
          Meet the agents
        </span>
        <h2 id="suite-heading" className="mt-5 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
          AI Agents for Customer Support
        </h2>
        <p className="mt-5 text-pretty text-lg text-slate-400">
          A versatile, secure, cloud-hosted ecosystem of prebuilt AI Agents that leverage SearchUnifyFRAG™ and 100
          out-of-the-box tools.
        </p>
        <p className="mt-6 inline-flex items-center gap-2 text-sm text-slate-500">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          {TOTAL} agents across the support journey · all connected via MCP
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href="https://www.searchunify.com/platform/agentic-ai-suite/"
            className="group inline-flex items-center gap-2 rounded-full bg-cta px-6 py-3 text-sm font-semibold text-cta-foreground shadow-[0_8px_24px_-8px_rgba(255,116,0,0.65)] transition-colors hover:bg-cta-hover"
          >
            See all agents
            <MoveRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {pinned ? <PinnedJourney /> : <StaticJourney />}
    </section>
  );
}

// Desktop: the section pins and vertical scroll drives the four stages
// sideways, one stage (parent) at a time.
function PinnedJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const x = useTransform(progress, (v) => -v * distance);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(STAGES.length - 1, Math.max(0, Math.floor(v * STAGES.length))));
  });

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + travel * ((i + 0.5) / STAGES.length), behavior: "smooth" });
  };

  return (
    <div ref={ref} className="relative mt-10 h-[320vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-clip pt-20">
        <div className="mx-auto mb-8 flex w-full max-w-7xl items-center gap-4 px-6">
          <ol className="flex flex-wrap gap-2" aria-label="Support journey stages">
            {STAGES.map((s, i) => (
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
          <div aria-hidden="true" className="h-px flex-1 overflow-hidden bg-white/10">
            <motion.div
              style={{ scaleX: progress }}
              className="h-full origin-left bg-gradient-to-r from-cyan-400 to-[#3b82f6]"
            />
          </div>
        </div>

        <motion.ol
          ref={trackRef}
          style={{ x }}
          className="relative flex w-max gap-6 px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
        >
          {STAGES.map((stage, i) => (
            <li
              key={stage.name}
              onFocusCapture={() => i !== active && goTo(i)}
              className={cn(
                "flex w-[min(30rem,38vw)] shrink-0 flex-col rounded-3xl border p-6 transition-[opacity,border-color,background-color] duration-500",
                i === active ? "border-cyan-300/20 bg-white/[0.04] opacity-100" : "border-white/5 bg-white/[0.015] opacity-45",
              )}
            >
              <div className="flex items-center gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-cyan-300/40 bg-[#07122e] text-sm font-semibold tabular-nums text-cyan-200 shadow-[0_0_20px_-4px_rgba(34,211,238,0.6)]">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-white">{stage.name}</h3>
                  <p className="mt-0.5 text-sm text-slate-400">{stage.blurb}</p>
                </div>
              </div>

              <ul className="mt-6 flex flex-col gap-3">
                {stage.agents.map((a) => (
                  <li key={a.name}>
                    <AgentCard agent={a} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </motion.ol>
      </div>
    </div>
  );
}

// Mobile and reduced motion: the original stacked grid.
function StaticJourney() {
  return (
    <>
      <div className="relative mx-auto mt-16 max-w-7xl">
        {/* Journey line linking the four stages (desktop). */}
        <div
          aria-hidden="true"
          className="absolute left-[12.5%] right-[12.5%] top-[15px] hidden h-px bg-gradient-to-r from-cyan-400/60 via-[#3b82f6]/60 to-cyan-400/60 lg:block"
        />

        <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {STAGES.map((stage, i) => (
            <li key={stage.name} className="flex flex-col">
              <div className="flex flex-col items-start lg:items-center lg:text-center">
                <span className="relative grid size-8 place-items-center rounded-full border border-cyan-300/40 bg-[#07122e] text-xs font-semibold tabular-nums text-cyan-200 shadow-[0_0_20px_-4px_rgba(34,211,238,0.6)]">
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-white">{stage.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{stage.blurb}</p>
              </div>

              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {stage.agents.map((a) => (
                  <li key={a.name}>
                    <AgentCard agent={a} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
