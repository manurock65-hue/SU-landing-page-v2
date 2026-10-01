"use client";

import { AgentLog } from "@/components/sections/agent-log";
import { FUNCTIONS } from "@/lib/functions-data";
import { CONTACT_HREF, DEMO_HREF } from "@/lib/nav-data";
import { cn } from "@/lib/utils";
import { MonitorPlay, MoveRight } from "lucide-react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Chapter 8 — "Begin Your AI Transformation". The live site's two next steps,
// built as two deliberately different cards: a wide dark "demo" card running
// real agents, and a light "expert" card you can talk to by picking a topic.
const ease = [0.22, 1, 0.36, 1] as const;

export function TransformCta() {
  return (
    <section aria-labelledby="transform-heading" className="relative isolate overflow-hidden bg-[#050b1f] px-6 pb-28 pt-8 sm:pb-36">
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/4 -z-10 h-80 w-[48rem] rounded-full bg-[#ff7400] opacity-[0.12] blur-[140px]" />
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-1/3 -z-10 h-80 w-[36rem] rounded-full bg-cyan-400 opacity-[0.08] blur-[140px]" />

      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <h2 id="transform-heading" className="max-w-2xl text-balance text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Begin Your{" "}
          <span className="bg-gradient-to-r from-[#ff8a3d] via-[#ffb26b] to-[#22d3ee] bg-clip-text text-transparent">
            AI Transformation
          </span>
        </h2>
        <p className="max-w-sm text-pretty text-lg text-slate-400">See the agents at work, or map them to your own use case with our team.</p>
      </div>

      <div className="mx-auto mt-14 grid max-w-7xl gap-5 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease }}
          className="lg:col-span-7"
        >
          <DemoCard />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          className="lg:col-span-5"
        >
          <ExpertCard />
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ demo */

// Three agents the demo window rotates through.
const DEMO_FNS = ["Customer Support", "IT", "Sales"].map((n) => FUNCTIONS.find((f) => f.name === n)!);
const DEMO_MS = 6000;

function DemoCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [picked, setPicked] = useState(false);
  const cycling = inView && !picked && !reduceMotion;
  const fn = DEMO_FNS[active];

  useEffect(() => {
    if (!cycling) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % DEMO_FNS.length), DEMO_MS);
    return () => clearTimeout(t);
  }, [cycling, active]);

  return (
    <div
      ref={ref}
      className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#0b1a3d] via-[#071028] to-[#050b1f] p-7 sm:p-9"
    >
      {/* Orange edge light along the top */}
      <div aria-hidden="true" className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#ff8a3d] to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[#ff7400] opacity-20 blur-3xl" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-md">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#ff8a3d]">
            <MonitorPlay className="size-4" /> Experience AI in action
          </p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">Watch the agents work</h3>
          <p className="mt-3 text-pretty leading-relaxed text-slate-300">
            Discover how our AI agents streamline complex workflows effortlessly.
          </p>
        </div>
        <Link
          href={DEMO_HREF}
          className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-cta px-6 py-3 text-sm font-semibold text-cta-foreground shadow-[0_12px_32px_-10px_rgba(255,116,0,0.8)] transition-colors hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:self-auto"
        >
          Book a Demo
          <MoveRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Product window */}
      <div className="relative mt-8 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
        <div className="flex items-center gap-1 border-b border-white/5 px-2 pt-2" role="tablist" aria-label="Agent to preview">
          {DEMO_FNS.map((f, i) => {
            const on = i === active;
            return (
              <button
                key={f.name}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => {
                  setActive(i);
                  setPicked(true);
                }}
                className={cn(
                  "relative flex items-center gap-2 rounded-t-xl px-3.5 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-300/60",
                  on ? "bg-white/[0.06] text-white" : "text-slate-500 hover:text-slate-200",
                )}
              >
                <f.icon className="size-3.5" />
                {f.name}
                {on && cycling && (
                  <motion.span
                    key={`bar-${active}`}
                    aria-hidden="true"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: DEMO_MS / 1000, ease: "linear" }}
                    className="absolute inset-x-2 bottom-0 h-0.5 origin-left rounded-full bg-[#ff8a3d]"
                  />
                )}
              </button>
            );
          })}
          <span className="ml-auto flex items-center gap-1.5 pr-3 text-[11px] font-medium text-emerald-300">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70 motion-reduce:animate-none" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
            </span>
            Live
          </span>
        </div>

        <div className="p-5" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={fn.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease }}
            >
              <p className="mb-4 truncate rounded-lg bg-white/[0.04] px-3 py-2 font-mono text-xs text-cyan-200 ring-1 ring-white/5">{fn.trigger}</p>
              <AgentLog steps={fn.steps} result={fn.result} playing={inView} className="min-h-[124px]" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- expert */

// What a visitor can bring to the conversation, and how the team would start.
// Products named here are SearchUnify's; the replies are illustrative.
const TOPICS = [
  {
    label: "Case deflection",
    reply: "Let's map the AI Support Agent to your top case drivers and the sources it should answer from.",
  },
  {
    label: "Agent productivity",
    reply: "Agent Helper and the AI Agent Partner summarize cases and suggest next steps right in your agents' console.",
  },
  {
    label: "Knowledge & KCS",
    reply: "Knowbler and the AI Knowledge Agent turn resolved cases into articles as part of your KCS flow.",
  },
  {
    label: "Salesforce or Zendesk",
    reply: "We'll walk through the native integration and exactly what your agents see inside the console.",
  },
];
const TYPING_MS = 900;

function ExpertCard() {
  const reduceMotion = useReducedMotion();
  const [topic, setTopic] = useState(0);
  const [typing, setTyping] = useState(false);
  const t = TOPICS[topic];

  const pick = (i: number) => {
    if (i === topic) return;
    setTopic(i);
    if (!reduceMotion) setTyping(true);
  };

  useEffect(() => {
    if (!typing) return;
    const id = setTimeout(() => setTyping(false), TYPING_MS);
    return () => clearTimeout(id);
  }, [typing, topic]);

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-white p-7 text-slate-950 shadow-[0_40px_80px_-40px_rgba(34,211,238,0.35)] sm:p-9">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-cyan-300 opacity-30 blur-3xl" />

      <div className="relative flex items-center gap-3">
        <span className="relative grid size-11 place-items-center rounded-full bg-[#005be2] text-sm font-bold text-white">
          SU
          <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 ring-2 ring-white" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#005be2]">Consult an expert</p>
          <h3 className="text-2xl font-bold tracking-tight">Talk it through</h3>
        </div>
      </div>
      <p className="relative mt-4 text-pretty leading-relaxed text-slate-600">
        Every business requirement is unique—let&apos;s discuss yours. Consult for tailored use cases and deep technical insights.
      </p>

      {/* Conversation */}
      <div className="relative mt-6 flex flex-1 flex-col rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
        <p className="max-w-[85%] self-start rounded-2xl rounded-bl-md bg-white px-3.5 py-2 text-[13px] leading-relaxed text-slate-700 ring-1 ring-slate-200">
          What would you like to solve first?
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Pick a topic">
          {TOPICS.map((tp, i) => (
            <button
              key={tp.label}
              type="button"
              aria-pressed={i === topic}
              onClick={() => pick(i)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005be2]/50",
                i === topic
                  ? "border-[#005be2] bg-[#005be2] text-white shadow-[0_6px_16px_-6px_rgba(0,91,226,0.6)]"
                  : "border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950",
              )}
            >
              {tp.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex min-h-[112px] flex-col gap-2" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={`q-${topic}`}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease }}
              className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-slate-950 px-3.5 py-2 text-[13px] leading-relaxed text-white"
            >
              {t.label}
            </motion.p>
            {typing ? (
              <motion.span
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex w-14 items-center justify-center gap-1 self-start rounded-2xl rounded-bl-md bg-white py-2.5 ring-1 ring-slate-200"
                aria-label="Expert is typing"
              >
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="size-1.5 rounded-full bg-slate-400"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.12 }}
                  />
                ))}
              </motion.span>
            ) : (
              <motion.p
                key={`a-${topic}`}
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease }}
                className="max-w-[90%] self-start rounded-2xl rounded-bl-md bg-white px-3.5 py-2 text-[13px] leading-relaxed text-slate-700 ring-1 ring-slate-200"
              >
                {t.reply}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Link
        href={CONTACT_HREF}
        className="group relative mt-6 inline-flex items-center justify-between gap-3 rounded-full bg-slate-950 py-2 pl-6 pr-2 text-sm font-semibold text-white transition-colors hover:bg-[#005be2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005be2]/50"
      >
        <span className="truncate">
          Talk to an Expert <span className="font-normal text-white/60">· {t.label.toLowerCase()}</span>
        </span>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0.5">
          <MoveRight className="size-4" />
        </span>
      </Link>
    </div>
  );
}
