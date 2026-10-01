"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, LifeBuoy, Plus, Sparkles, Users } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useId, useState } from "react";

// Chapter 11 — "Frequently Asked Questions". Questions and answers mirror the
// live site. Opening a question "streams" its answer in word by word, the way
// an AI agent would reply. Help links drop the live site's _gl tracking params.
const FAQS = [
  {
    q: "What is Agentic AI?",
    a: "Agentic AI refers to AI systems that can autonomously perceive, reason, plan and act to achieve specific goals. It continuously learns from interactions and contextual data to proactively optimize processes, deliver personalized responses and streamline complex tasks with minimal manual intervention.",
  },
  {
    q: "What are Agentic workflows and how does it enhance enterprises?",
    a: "Agentic workflows are the orchestrated, end-to-end automation processes powered by Agentic AI that streamline cross-functional tasks and boost overall operational efficiency. With SearchUnify AI agents, entire workflows across enterprise functions can be intelligently optimized. This dynamic capability empowers organizations to achieve significant efficiency gains, deliver superior customer experiences and unlock new levels of business agility.",
  },
  {
    q: "What is the SearchUnifyFRAG™ approach?",
    a: "SearchUnifyFRAG (Federated Retrieval Augmented Generation) is our innovation that synergizes three layers — Federation, Retrieval and Augmented Generation — to enhance the model for more context-aware, personalized and efficient response generation.",
  },
  {
    q: "Is SearchUnify secure for enterprises?",
    a: "SearchUnify meets the strictest security compliance standards of ISO 27001:2013, HIPAA, SOC 2 and others. It does so by adding a governance layer with granular access controls, securely storing data and retrieving it with zero retention. Moreover, SearchUnify maintains a detailed audit trail of all prompts, responses and trust signals, providing complete visibility into the AI's decision-making process.",
  },
];

const HELP = [
  { label: "Help center", href: "https://docs.searchunify.com/", icon: LifeBuoy },
  { label: "Community", href: "https://community.searchunify.com/hc/en-us", icon: Users },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq-heading" className="bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="inline-block rounded-full bg-[#005be2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#005be2]">
            FAQ
          </span>
          <h2 id="faq-heading" className="mt-5 text-balance text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Frequently Asked Questions
          </h2>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-lg font-semibold text-slate-950">Still need assistance?</p>
            <p className="mt-1 text-sm text-slate-600">Browse the docs or ask the SearchUnify community.</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {HELP.map((h) => (
                <Link
                  key={h.label}
                  href={h.href}
                  className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-colors hover:border-[#005be2]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005be2]/50"
                >
                  <h.icon className="size-4 text-[#005be2]" />
                  {h.label}
                  <ArrowUpRight className="ml-auto size-4 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#005be2]" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <ul className="divide-y divide-slate-200 border-y border-slate-200">
          {FAQS.map((f, i) => (
            <FaqItem key={f.q} index={i} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function FaqItem({
  index,
  q,
  a,
  open,
  onToggle,
}: {
  index: number;
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  const id = useId();
  const reduceMotion = useReducedMotion();
  const words = a.split(" ");

  return (
    <li>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-btn`}
          onClick={onToggle}
          className="group flex w-full items-start gap-5 py-7 text-left focus-visible:outline-none"
        >
          <span
            className={cn(
              "mt-1 text-sm font-semibold tabular-nums transition-colors",
              open ? "text-[#005be2]" : "text-slate-400",
            )}
          >
            0{index + 1}
          </span>
          <span
            className={cn(
              "flex-1 text-lg font-semibold leading-snug transition-colors group-focus-visible:underline sm:text-xl",
              open ? "text-slate-950" : "text-slate-700 group-hover:text-slate-950",
            )}
          >
            {q}
          </span>
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-300",
              open ? "border-[#005be2] bg-[#005be2] text-white" : "border-slate-200 text-slate-500 group-hover:border-slate-300",
            )}
          >
            <Plus className={cn("size-4 transition-transform duration-300", open && "rotate-45")} />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-btn`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="overflow-hidden"
          >
            <div className="pb-8 pl-10 pr-14">
              <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#005be2]/[0.07] px-2.5 py-1 text-[11px] font-semibold text-[#005be2]">
                <Sparkles className="size-3" /> SearchUnify answer
              </p>
              <p className="text-[15px] leading-relaxed text-slate-600">
                {reduceMotion
                  ? a
                  : words.map((w, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, filter: "blur(4px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.25, delay: 0.15 + i * 0.018 }}
                      >
                        {w}{" "}
                      </motion.span>
                    ))}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
