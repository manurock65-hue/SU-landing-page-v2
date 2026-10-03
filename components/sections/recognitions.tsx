"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, Award } from "lucide-react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";

// "Industry recognition" — redesigned as a uniform dark bento grid (reference:
// searchunify.com's "Awards and recognition" layout), one equal-size card per
// analyst award instead of the old featured+wide+small asymmetric grid. Each
// card keeps the cursor-tracking glow border; G2's card keeps its
// quarter-count-up as the one bespoke animated stat. Tiers, reports, years
// and links mirror the live site.
const PR = "https://www.searchunify.com/press-release";
const ease = [0.22, 1, 0.36, 1] as const;
const QUARTERS = 26;

type Award = {
  issuer: string;
  badge: string; // "" falls back to a text wordmark
  stat: string; // big headline figure, e.g. "2026", "5th year"
  tier: string; // eyebrow, e.g. "Leader", "Major Contender"
  report: string;
  href: string;
  quarterCountUp?: boolean; // only G2: animate `stat` up to QUARTERS instead of printing it
};

const AWARDS: Award[] = [
  {
    issuer: "G2",
    badge: "/assets/awards/g2.webp",
    stat: String(QUARTERS),
    tier: "Leader · consecutive quarters",
    report: "G2 Grid® — Enterprise Search, since 2020",
    href: `${PR}/searchunify-achieves-26-consecutive-quarters-of-leadership-in-g2-grid-report-for-enterprise-search/`,
    quarterCountUp: true,
  },
  {
    issuer: "Everest Group",
    badge: "/assets/awards/everest-group-logo-v2-1.svg",
    stat: "2026",
    tier: "Major Contender",
    report: "PEAK Matrix® — Enterprise Search",
    href: `${PR}/searchunify-named-a-major-contender-in-everest-groups-enterprise-search-products-peak-matrix-assessment-2026/`,
  },
  {
    issuer: "SoftwareReviews",
    badge: "/assets/awards/software.webp",
    stat: "5th year",
    tier: "Champion",
    report: "Enterprise Search Emotional Footprint 2026",
    href: `${PR}/searchunify-named-champion-in-2026-softwarereviews-enterprise-search-emotional-footprint-report-fifth-straight-year/`,
  },
  {
    issuer: "KMWorld",
    badge: "",
    stat: "2026",
    tier: "AI 100",
    report: "Empowering intelligent knowledge management",
    href: `${PR}/searchunify-named-to-kmworlds-ai-100-2026/`,
  },
  {
    issuer: "Globee® Awards",
    badge: "",
    stat: "2026",
    tier: "Gold",
    report: "AI-Powered Knowledge Management",
    href: `${PR}/searchunify-wins-gold-in-the-2026-globee-awards-for-ai-powered-knowledge-management/`,
  },
  {
    issuer: "IDC MarketScape",
    badge: "/assets/awards/idc.webp",
    stat: "2025",
    tier: "Major Player",
    report: "Knowledge Discovery Software",
    href: `${PR}/searchunify-named-a-major-player-in-idc-marketscape-2025-for-general-purpose-knowledge-discovery-software/`,
  },
];

export function Recognitions() {
  return (
    <section
      aria-labelledby="recognitions-heading"
      className="relative isolate overflow-hidden rounded-t-[2.5rem] bg-[#050b1f] px-6 py-24 sm:rounded-t-[3.5rem] sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,black,transparent)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-[56rem] -translate-x-1/2 rounded-full bg-[#005be2] opacity-25 blur-[120px]" />

      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">
            <Award className="size-3.5" /> Recognized by analysts
          </span>
          <h2 id="recognitions-heading" className="mt-5 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Industry recognition
          </h2>
          <p className="mt-5 text-pretty text-lg text-slate-400">
            Named by KMWorld, Everest Group, G2, SoftwareReviews, Globee and IDC for enterprise search and knowledge
            management.
          </p>
        </div>
        <Link
          href={`${PR}/`}
          className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 sm:self-auto"
        >
          Explore all awards
          <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <ul className="mx-auto mt-14 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AWARDS.map((a, i) => (
          <li key={a.issuer}>
            <AwardCard award={a} index={i} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function AwardCard({ award, index }: { award: Award; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease, delay: (index % 3) * 0.1 }}
      className="h-full"
    >
      <GlowCard href={award.href} label={`${award.issuer}: ${award.tier}, ${award.report}`} className="flex h-full flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <Badge src={award.badge} issuer={award.issuer} className="h-14 w-24" />
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-cyan-300">
            {award.tier}
          </span>
        </div>

        <div className="mt-7">
          {award.quarterCountUp ? <QuarterCount /> : (
            <span className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{award.stat}</span>
          )}
        </div>

        <div className="mt-auto pt-6">
          <p className="text-[15px] font-semibold leading-snug text-white">{award.report}</p>
          <ExploreMore />
        </div>
      </GlowCard>
    </motion.div>
  );
}

/* G2's bespoke stat: counts up to 26 consecutive quarters on scroll-into-view. */
function QuarterCount() {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(0);
  const shown = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      count.set(QUARTERS);
      return;
    }
    const c = animate(count, QUARTERS, { duration: 1.8, ease });
    return () => c.stop();
  }, [inView, reduceMotion, count]);

  return (
    <span ref={ref} className="flex items-baseline gap-1">
      <motion.span className="text-4xl font-bold tracking-tight text-white tabular-nums sm:text-5xl">{shown}</motion.span>
      <span className="text-sm text-slate-400">quarters</span>
    </span>
  );
}

function ExploreMore() {
  return (
    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-link-on-dark">
      Explore more
      <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </span>
  );
}

/* Badges are full-colour logos on white, so they sit on a white tile. Issuers
   without a badge image (KMWorld, Globee) fall back to a text wordmark. */
function Badge({ src, issuer, className }: { src: string; issuer?: string; className?: string }) {
  if (!src) {
    return (
      <span className={cn("relative grid shrink-0 place-items-center rounded-xl bg-white p-2 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]", className)}>
        <span className="px-1 text-center text-sm font-bold leading-tight text-slate-900">{issuer}</span>
      </span>
    );
  }
  return (
    <span className={cn("relative grid shrink-0 place-items-center rounded-xl bg-white p-1 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]", className)}>
      <Image src={src} alt="" fill sizes="160px" className="object-contain p-1" />
    </span>
  );
}

/* Card shell with the cursor-tracking glow border. The glow wakes when the
   pointer comes within PROXIMITY px and eases its angle toward the pointer. */
const PROXIMITY = 64;

function GlowCard({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    let angle = 0;
    let stop: (() => void) | undefined;

    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const near =
          e.clientX > r.left - PROXIMITY &&
          e.clientX < r.right + PROXIMITY &&
          e.clientY > r.top - PROXIMITY &&
          e.clientY < r.bottom + PROXIMITY;
        el.style.setProperty("--glow-on", near ? "1" : "0");
        if (!near) return;

        const target =
          (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI + 90;
        // Take the short way round so the glow never spins the long way.
        const delta = ((target - angle + 540) % 360) - 180;
        stop?.();
        stop = animate(angle, angle + delta, {
          duration: 0.4,
          ease,
          onUpdate: (v) => {
            angle = v;
            el.style.setProperty("--glow-angle", String(v));
          },
        }).stop;
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      stop?.();
    };
  }, []);

  return (
    <Link
      ref={ref}
      href={href}
      aria-label={`${label}. Read the announcement`}
      className={cn(
        "group relative block h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-colors duration-300 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60",
        className,
      )}
    >
      <span aria-hidden="true" className="glow-border pointer-events-none absolute -inset-px" />
      {children}
    </Link>
  );
}
