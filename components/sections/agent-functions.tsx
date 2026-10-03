"use client";

import { AgentLog } from "@/components/sections/agent-log";
import { AGENT_TYPES, AGENT_DEFAULT_INDEX as DEFAULT } from "@/lib/functions-data";
import { useIsDesktop } from "@/lib/use-is-desktop";
import { cn } from "@/lib/utils";
import { useInView } from "motion/react";
import { useRef, useState } from "react";

// Chapter 4a — "AI Agents Engineered for Your Business Functions".
// Expand-on-hover panels adapted from Skiper UI "skiper52" (ExpandOnHover).
// Attribution: Skiper UI — https://skiper-ui.com (free tier requires credit).

export function AgentFunctions() {
  const [active, setActive] = useState(DEFAULT);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const isDesktop = useIsDesktop();

  return (
    <section aria-labelledby="functions-heading" className="relative px-6 pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-400 opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-cyan-400" />
          </span>
          Agents at work
        </span>
        <h2 id="functions-heading" className="mt-5 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Purpose-built AI Agents
        </h2>
        <p className="mt-5 text-pretty text-lg text-slate-400">
          Not one mega-bot. Hover an agent to watch it pick up a case and close it out.
        </p>
      </div>

      <div
        ref={ref}
        className="mx-auto mt-14 flex max-w-7xl flex-col gap-2 lg:h-[30rem] lg:flex-row"
      >
        {AGENT_TYPES.map((f, i) => {
          const isActive = i === active;
          return (
            <div
              key={f.name}
              onMouseEnter={() => isDesktop && setActive(i)}
              className={cn(
                "group relative overflow-hidden rounded-3xl border transition-[flex-grow,background-color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                "lg:min-w-0 lg:flex-1",
                isActive
                  ? "border-cyan-400/25 bg-gradient-to-b from-[#0b1a3d] to-[#071028] lg:grow-[6]"
                  : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
              )}
            >
              {/* Glow in the active panel */}
              <div
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[#005be2] blur-3xl transition-opacity duration-700",
                  isActive ? "opacity-40" : "opacity-0",
                )}
              />

              <button
                type="button"
                aria-expanded={isActive}
                aria-controls={`fn-panel-${i}`}
                onClick={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="relative flex w-full items-center gap-3 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400/60 lg:h-full lg:flex-col lg:items-start lg:p-6"
              >
                <span
                  className={cn(
                    "grid size-11 shrink-0 place-items-center rounded-2xl transition-colors duration-500",
                    isActive ? "bg-cyan-400/15 text-cyan-300" : "bg-white/5 text-slate-400 group-hover:text-slate-200",
                  )}
                >
                  <f.icon className="size-5" />
                </span>
                <span
                  className={cn(
                    "font-semibold text-white transition-opacity duration-300",
                    "text-lg lg:absolute lg:bottom-6 lg:left-1/2 lg:origin-left lg:-rotate-90 lg:whitespace-nowrap",
                    isActive ? "lg:opacity-0" : "lg:opacity-80",
                  )}
                >
                  {f.name}
                </span>
                <span className="ml-auto flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[11px] font-medium text-emerald-300 lg:hidden">
                  <span className="size-1.5 rounded-full bg-emerald-400" /> Agent live
                </span>
              </button>

              {/* Expanded content */}
              <div
                id={`fn-panel-${i}`}
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-500 lg:absolute lg:inset-0 lg:block lg:pt-24",
                  isActive
                    ? "grid-rows-[1fr] opacity-100 lg:delay-200"
                    : "pointer-events-none grid-rows-[0fr] opacity-0 lg:delay-0",
                )}
              >
                {/* Padding lives on the inner wrapper so a collapsed (0fr) row is truly 0px tall. */}
                <div className="overflow-hidden lg:overflow-visible">
                  <div className="px-5 pb-6 lg:w-[34rem] lg:max-w-full lg:px-8">
                    <h3 className="hidden text-3xl font-bold tracking-tight text-white lg:block">{f.name}</h3>
                    <p className="mt-1 max-w-md text-[15px] leading-relaxed text-slate-300 lg:mt-3">{f.description}</p>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur">
                      <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/5 pb-3">
                        <p className="truncate font-mono text-xs text-cyan-200">{f.trigger}</p>
                        <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-emerald-300">
                          <span className="size-1.5 animate-pulse rounded-full bg-emerald-400 motion-reduce:animate-none" />
                          Agent run
                        </span>
                      </div>
                      <AgentLog key={f.name} steps={f.steps} result={f.result} playing={isActive && inView} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
