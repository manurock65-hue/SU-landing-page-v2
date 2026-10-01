"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, Award } from "lucide-react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";

// Chapter 7 — "Industry Recognitions". Bento of analyst recognitions; each card
// carries the "Glowing Effect" border (Aceternity, via 21st.dev) that tracks the
// cursor. Tiers, reports, years and links mirror the live site.
const PR = "https://www.searchunify.com/press-release";

type Recognition = {
  tier: string;
  report: string;
  when: string;
  badge: string;
  issuer: string;
  href: string;
};

const G2: Recognition = {
  tier: "Leader",
  report: "G2 Grid® Report for Enterprise Search",
  when: "Six years running · Summer 2026",
  badge: "/assets/awards/g2.webp",
  issuer: "G2",
  href: `${PR}/searchunify-achieves-25-consecutive-quarters-of-leadership-in-g2-grid-report-for-enterprise-search-in-summer-2026/`,
};

const WIDE: Recognition[] = [
  {
    tier: "Strong Performer",
    report: "The Forrester Wave™: Knowledge Management Solutions",
    when: "Q4 2024",
    badge: "/assets/awards/forrester.webp",
    issuer: "Forrester",
    href: `${PR}/grazitti-interactives-searchunify-cited-as-a-strong-performer-among-knowledge-management-solutions-in-latest-evaluation-by-independent-research-firm/`,
  },
  {
    tier: "Major Player",
    report: "IDC MarketScape: General-Purpose Knowledge Discovery Software",
    when: "2025",
    badge: "/assets/awards/idc.webp",
    issuer: "IDC",
    href: `${PR}/searchunify-named-a-major-player-in-idc-marketscape-2025-for-general-purpose-knowledge-discovery-software/`,
  },
];

const SMALL: Recognition[] = [
  {
    tier: "Major Contender",
    report: "Everest Group Enterprise Search Products PEAK Matrix®",
    when: "2026",
    badge: "/assets/awards/everest-group-logo-v2-1.svg",
    issuer: "Everest Group",
    href: `${PR}/searchunify-named-a-major-contender-in-everest-groups-enterprise-search-products-peak-matrix-assessment-2026/`,
  },
  {
    tier: "Champion",
    report: "SoftwareReviews Enterprise Search Emotional Footprint",
    when: "2022–2026 · fifth straight year",
    badge: "/assets/awards/software.webp",
    issuer: "SoftwareReviews",
    href: `${PR}/searchunify-named-champion-in-2026-softwarereviews-enterprise-search-emotional-footprint-report-fifth-straight-year/`,
  },
  {
    tier: "Champion",
    report: "SoftwareReviews Enterprise Search Data Quadrant",
    when: "2024 · 2025 · 2026",
    badge: "/assets/awards/software.webp",
    issuer: "SoftwareReviews",
    href: `${PR}/searchunify-named-champion-in-softwarereviews-enterprise-search-data-quadrant-for-the-third-consecutive-year/`,
  },
  {
    tier: "Gold Medalist",
    report: "SoftwareReviews Enterprise Search Data Quadrant",
    when: "2024 · 2025",
    badge: "/assets/awards/software.webp",
    issuer: "SoftwareReviews",
    href: `${PR}/searchunify-named-a-gold-medalist-in-2025-enterprise-search-data-quadrant-report-by-info-tech-research-groups-softwarereviews/`,
  },
];

const QUARTERS = 25;
const ease = [0.22, 1, 0.36, 1] as const;

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

      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">
          <Award className="size-3.5" /> Recognized by analysts
        </span>
        <h2 id="recognitions-heading" className="mt-5 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Industry Recognitions
        </h2>
        <p className="mt-5 text-pretty text-lg text-slate-400">
          Named by Forrester, IDC, Everest Group, G2 and SoftwareReviews for enterprise search and knowledge management.
        </p>
      </div>

      <ul className="mx-auto mt-16 grid max-w-7xl gap-4 md:grid-cols-12">
        <li className="md:col-span-12 lg:col-span-6 lg:row-span-2">
          <FeaturedCard r={G2} />
        </li>
        {WIDE.map((r) => (
          <li key={r.issuer} className="md:col-span-6">
            <GlowCard href={r.href} label={`${r.issuer}: ${r.tier}, ${r.report}, ${r.when}`} className="flex items-center gap-5 p-5">
              <Badge src={r.badge} className="h-16 w-28" />
              <CardText r={r} />
            </GlowCard>
          </li>
        ))}
        {SMALL.map((r) => (
          <li key={r.href} className="md:col-span-6 lg:col-span-3">
            <GlowCard href={r.href} label={`${r.issuer}: ${r.tier}, ${r.report}, ${r.when}`} className="flex flex-col p-5">
              <Badge src={r.badge} className="h-14 w-24" />
              <div className="mt-5">
                <CardText r={r} />
              </div>
            </GlowCard>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* G2 — the longest-running recognition, so it gets the big tile: a grid of 25
   quarters that light up in sequence. */
function FeaturedCard({ r }: { r: Recognition }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(0);
  const shown = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      count.set(QUARTERS);
      return;
    }
    const c = animate(count, QUARTERS, { duration: 2, ease });
    return () => c.stop();
  }, [inView, reduceMotion, count]);

  return (
    <GlowCard href={r.href} label={`${r.issuer}: ${r.tier}, 25 consecutive quarters, ${r.report}`} className="flex h-full flex-col p-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[#ff492c] opacity-[0.12] blur-3xl"
      />
      <div className="relative flex items-start justify-between gap-4">
        <Badge src={r.badge} className="h-20 w-32" />
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">
          {r.tier}
        </span>
      </div>

      <div ref={ref} className="relative mt-8 flex items-end gap-4">
        <motion.span className="text-7xl font-bold leading-none tracking-tight text-white tabular-nums sm:text-8xl">
          {shown}
        </motion.span>
        <span className="pb-2 text-lg font-medium leading-snug text-slate-300">
          consecutive quarters
          <br />
          as a Leader
        </span>
      </div>

      {/* One cell per quarter. */}
      <div aria-hidden="true" className="relative mt-6 grid grid-cols-[repeat(25,minmax(0,1fr))] gap-1">
        {Array.from({ length: QUARTERS }, (_, i) => (
          <motion.span
            key={i}
            className="h-6 rounded-sm bg-gradient-to-t from-[#ff492c] to-[#ff8a3d]"
            initial={{ opacity: 0.12, scaleY: 0.4 }}
            animate={inView ? { opacity: 1, scaleY: 1 } : undefined}
            transition={{ duration: 0.3, delay: reduceMotion ? 0 : (i / QUARTERS) * 2, ease }}
          />
        ))}
      </div>

      <div className="relative mt-auto pt-8">
        <p className="text-lg font-semibold text-white">{r.report}</p>
        <p className="mt-1 text-sm text-slate-400">{r.when}</p>
        <ExploreMore />
      </div>
    </GlowCard>
  );
}

function CardText({ r }: { r: Recognition }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">{r.tier}</p>
      <p className="mt-1.5 text-[15px] font-semibold leading-snug text-white">{r.report}</p>
      <p className="mt-1 text-sm text-slate-400">{r.when}</p>
      <ExploreMore />
    </div>
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

/* Badges are full-colour logos on white, so they sit on a white tile. */
function Badge({ src, className }: { src: string; className?: string }) {
  return (
    <span className={cn("relative grid shrink-0 place-items-center rounded-xl bg-white p-2 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]", className)}>
      <Image src={src} alt="" fill sizes="128px" className="object-contain p-1.5" />
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
