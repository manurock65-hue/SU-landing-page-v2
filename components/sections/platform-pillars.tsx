"use client";

import {
  DeployVisual,
  EthicsVisual,
  LoopVisual,
  UnifiedDataVisual,
} from "@/components/sections/pillar-visuals";
import { AgentNetworkBackground } from "@/components/ui/agent-network-background";
import { cn } from "@/lib/utils";
import { MoveRight } from "lucide-react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useIsDesktop } from "@/lib/use-is-desktop";
import { Fragment, useRef, useState, type KeyboardEvent } from "react";

// "Connect. Deploy. Resolve." — the four-step "How It Works" narrative.
// Titles, descriptions and tags mirror the live site.
const PILLARS = [
  {
    title: "Connect",
    description: "Point it at what you already run — CRM, ticketing, KB, docs, community, telemetry, LMS.",
    term: "40+ connectors, MCP, permission-aware",
    visualLabel: "Six connected systems flowing into a unified index that returns a grounded answer.",
    Visual: UnifiedDataVisual,
  },
  {
    title: "Deploy the agents",
    description: "Purpose-built for defined support jobs. Switch on the ones you need, scoped to the topics you choose. Live on day one.",
    term: "L1 Support, Agent Partner, Routing · QA · Knowledge",
    visualLabel: "An agent library with L1 Support and Agent Partner live, and more agents ready to deploy.",
    Visual: DeployVisual,
  },
  {
    title: "They resolve, with a source",
    description: "Retrieve first, then act — answer, draft, route, create the Jira, publish the KB. Every action cited, logged, and hand-off ready.",
    term: "RAG grounding, acts via MCP, no source no action",
    visualLabel: "An agent's draft answer passing guardrail checks with 94% confidence; low-confidence answers go to a human.",
    Visual: EthicsVisual,
  },
  {
    title: "The crew gets smarter",
    description: "QA scores every case, Knowledge writes the article, Routing learns the pattern — so the front door has a source next time.",
    term: "100% QA, KCS articles, loop closed",
    visualLabel: "QA scoring a closed case, Knowledge publishing an article from it, and Routing learning the pattern.",
    Visual: LoopVisual,
  },
];

const STEP_MS = 6500;

export function PlatformPillars() {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [hovering, setHovering] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const inView = useInView(sectionRef, { amount: 0.35 });
  const reduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  // Auto-advance only on desktop (on mobile the visual sits inline, so advancing
  // would shift the page while reading), while visible, not hovered, and until
  // the user picks one.
  const showProgress = autoplay && !reduceMotion && isDesktop;
  const running = showProgress && inView && !hovering;

  const select = (i: number, focus = false) => {
    setActive(i);
    setAutoplay(false);
    if (focus) tabRefs.current[i]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const last = PILLARS.length - 1;
    const map: Record<string, number> = {
      ArrowDown: active === last ? 0 : active + 1,
      ArrowRight: active === last ? 0 : active + 1,
      ArrowUp: active === 0 ? last : active - 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    if (e.key in map) {
      e.preventDefault();
      select(map[e.key], true);
    }
  };

  return (
    <section ref={sectionRef} aria-labelledby="pillars-heading" className="relative overflow-hidden bg-white pb-24 pt-10 sm:pb-32 sm:pt-14">
      <AgentNetworkBackground />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-[#005be2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#005be2]">
            How it works
          </span>
          <h2 id="pillars-heading" className="mt-5 text-balance text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Connect. Deploy. Resolve.
          </h2>
          <p className="mt-5 text-pretty text-lg text-slate-600">
            No model training. No agent building. No knowledge migration. Your systems stay where they are; the
            harness runs on top.
          </p>
        </div>

        <div
          className="mt-16 grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {/* Pillar list (tabs) */}
          <div>
            <div
              {...(isDesktop
                ? { role: "tablist", "aria-orientation": "vertical" as const, "aria-label": "Platform capabilities", onKeyDown }
                : {})}
              className="flex flex-col gap-1"
            >
              {PILLARS.map((p, i) => {
                const isActive = i === active;
                // Desktop = tabs pattern; mobile = accordion (visual sits inline).
                const a11y = isDesktop
                  ? { role: "tab", "aria-selected": isActive, tabIndex: isActive ? 0 : -1 }
                  : { "aria-expanded": isActive };
                return (
                  <Fragment key={p.title}>
                  <button
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    id={`pillar-tab-${i}`}
                    type="button"
                    {...a11y}
                    aria-controls="pillar-panel"
                    onClick={() => select(i)}
                    className={cn(
                      "group relative w-full rounded-2xl py-5 pl-8 pr-5 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005be2]/40",
                      isActive ? "bg-slate-50" : "hover:bg-slate-50/70",
                    )}
                  >
                    {/* Progress rail */}
                    <span aria-hidden="true" className="absolute inset-y-5 left-3 w-0.5 overflow-hidden rounded-full bg-slate-200">
                      {isActive &&
                        (showProgress ? (
                          <span
                            key={active}
                            className="absolute inset-0 origin-top rounded-full bg-[#005be2]"
                            style={{
                              animation: `pillar-progress ${STEP_MS}ms linear forwards`,
                              animationPlayState: running ? "running" : "paused",
                            }}
                            onAnimationEnd={() => setActive((a) => (a + 1) % PILLARS.length)}
                          />
                        ) : (
                          <span className="absolute inset-0 rounded-full bg-[#005be2]" />
                        ))}
                    </span>

                    <span className="flex items-baseline gap-3">
                      <span className={cn("text-xs font-semibold tabular-nums", isActive ? "text-[#005be2]" : "text-slate-400")}>
                        0{i + 1}
                      </span>
                      <span className={cn("text-lg font-semibold transition-colors", isActive ? "text-slate-950" : "text-slate-500 group-hover:text-slate-800")}>
                        {p.title}
                      </span>
                    </span>

                    {/* Expands smoothly; stays in the DOM for search engines and screen readers. */}
                    <span
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
                        isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <span className="overflow-hidden pl-7">
                        <span className="mt-2 block text-[15px] leading-relaxed text-slate-600">{p.description}</span>
                        <span className="mt-3 inline-block rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                          {p.term}
                        </span>
                      </span>
                    </span>
                  </button>
                  {/* Mobile: the visual opens right under the chosen pillar. */}
                  {!isDesktop && isActive && (
                    <VisualPanel active={active} className="mb-2 mt-1 p-4" minHeight="min-h-[260px]" />
                  )}
                  </Fragment>
                );
              })}
            </div>

            <Link
              href="https://www.searchunify.com/platform/"
              className="group ml-8 mt-8 inline-flex items-center gap-2 text-sm font-semibold text-link hover:underline hover:underline-offset-4"
            >
              Explore the platform
              <MoveRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Desktop: visual panel beside the list. */}
          {isDesktop && (
            <VisualPanel
              active={active}
              role="tabpanel"
              aria-labelledby={`pillar-tab-${active}`}
              className="p-10"
              minHeight="min-h-[420px]"
            />
          )}
        </div>
      </div>
    </section>
  );
}

function VisualPanel({
  active,
  className,
  minHeight,
  ...aria
}: {
  active: number;
  className?: string;
  minHeight: string;
  role?: string;
  "aria-labelledby"?: string;
}) {
  const current = PILLARS[active];
  return (
    <div
      id="pillar-panel"
      {...aria}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-[#eef4ff] via-white to-[#ecfbff]",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)] opacity-60"
      />
      <div className={cn("relative flex items-center justify-center", minHeight)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            role="img"
            aria-label={current.visualLabel}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex w-full justify-center"
          >
            <current.Visual />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
