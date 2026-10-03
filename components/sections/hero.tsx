"use client";

import { FunctionDeck } from "@/components/sections/function-deck";
import { AgentNetworkBackground } from "@/components/ui/agent-network-background";
import { Button } from "@/components/ui/button";
import { CONTACT_HREF, DEMO_HREF } from "@/lib/nav-data";
import { MoveRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { useRef } from "react";

// Chapter 1 — Hero. Copy mirrors the live searchunify.com hero.
// Parallax: as the hero scrolls out, the copy drifts down slower than the page
// and fades, while the background glows move at different speeds for depth.
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  // 0 disables the effect for users who prefer reduced motion.
  const k = reduceMotion ? 0 : 1;
  const contentY = useTransform(progress, [0, 1], [0, 260 * k]);
  const contentOpacity = useTransform(progress, [0, 0.85], [1, 1 - k]);
  const contentScale = useTransform(progress, [0, 1], [1, 1 - 0.08 * k]);
  const glowY = useTransform(progress, [0, 1], [0, -220 * k]);
  // Moves up (not down) so the glow never gets clipped at the section edge.
  const glowBottomY = useTransform(progress, [0, 1], [0, -120 * k]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[calc(100svh-200px)] items-center justify-center overflow-hidden bg-white px-6 pb-24 pt-36 text-center"
    >
      <AgentNetworkBackground />
      <motion.div
        aria-hidden="true"
        style={{ y: glowY }}
        className="pointer-events-none absolute left-1/2 top-1/4 size-[680px] -translate-x-1/2 rounded-full bg-[#005be2] opacity-[0.08] blur-[140px]"
      />
      <motion.div
        aria-hidden="true"
        style={{ y: glowBottomY }}
        className="pointer-events-none absolute bottom-24 left-1/2 h-64 w-[900px] -translate-x-1/2 rounded-full bg-cyan-400 opacity-[0.08] blur-[120px]"
      />

      {/* Fades the glows into the next section so their clipped edge never shows. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-white"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
        className="relative mx-auto grid w-full max-w-7xl items-center gap-14 will-change-transform lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16"
      >
        <div className="flex flex-col items-center lg:items-start lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            The support harness · Agentic AI for enterprise support
          </span>

          <h1 className="mt-5 text-balance text-[2.25rem] font-bold leading-[1.1] tracking-tight text-slate-950 sm:text-[56px] xl:text-[64px]">
            AI support agents that{" "}
            <span className="bg-gradient-to-r from-[#005be2] via-[#2563eb] to-[#06b6d4] bg-clip-text text-transparent">
              don&apos;t bluff.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
            Answering a customer at the front door, drafting for a rep, routing a ticket, flagging an
            escalation, or auditing a case: every SearchUnify agent retrieves from your CRM, ticketing,
            knowledge base, docs, community and telemetry before it acts, shows what it found, and
            hands off when it can&apos;t — to a person or to the next agent in the harness.{" "}
            <span className="font-semibold text-slate-950">No source, no action.</span>
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Button
              asChild
              size="lg"
              variant="cta"
              className="group h-12 rounded-full px-7 text-base shadow-[0_12px_40px_-10px_rgba(255,116,0,0.7)]"
            >
              <Link href={DEMO_HREF}>
                Book a Demo
                <MoveRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-7 text-base">
              <Link href={CONTACT_HREF}>Talk to an expert</Link>
            </Button>
          </div>
        </div>

        <FunctionDeck className="mx-auto max-w-[440px] lg:mr-0" />
      </motion.div>
    </section>
  );
}
