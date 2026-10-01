"use client";

import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, MoveRight } from "lucide-react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Chapter 6 — "Real-World Customer Success Stories".
// Layout adapted from the 21st.dev "Testimonial1" pattern: customer photos sit
// inline in the headline and open a case-study card; a logo strip flips to
// each customer's headline stat. Stats, copy and links mirror the live site.
const STORY_BASE = "https://www.searchunify.com/resource-center/success-story";

type Stat = { value?: string; label: string; dir?: "up" | "down" };
type Story = {
  company: string;
  logo: string;
  photo: string;
  href: string;
  context: string;
  stats: Stat[];
  headline: number; // index of the stat shown in the logo strip
};

const STORIES: Story[] = [
  {
    company: "Automation Anywhere",
    logo: "/assets/clients/automation-anywhere.svg",
    photo: "/assets/stories/automation-anywhere.webp",
    href: `${STORY_BASE}/how-automation-anywhere-is-winning-at-user-experience-with-searchunify/`,
    context: "Enhanced support efficiency and customer experience with SearchUnify Knowbler.",
    stats: [
      { value: "57%", label: "Boost in knowledge creation", dir: "up" },
      { value: "37%", label: "More contributing agents", dir: "up" },
      { value: "46%", label: "Cut in publishing time", dir: "down" },
    ],
    headline: 0,
  },
  {
    company: "Accela",
    logo: "/assets/clients/accela.svg",
    photo: "/assets/stories/accela.webp",
    href: `${STORY_BASE}/accela-scales-support-efficiency-and-decrease-first-response-time-by-92/`,
    context: "Deployed SearchUnify Agent Helper to keep pace with rising support volumes.",
    stats: [
      { value: "77.5%", label: "Increase in total closed case volume", dir: "up" },
      { value: "92.7%", label: "Decrease in first response time", dir: "down" },
      { value: "16%", label: "Increase in agent productivity", dir: "up" },
    ],
    headline: 1,
  },
  {
    company: "Cornerstone OnDemand",
    logo: "/assets/clients/cornerstone.svg",
    photo: "/assets/stories/cornerstone.webp",
    href: `${STORY_BASE}/how-cornerstone-ondemand-achieved-a-98-self-service-resolution-rate-with-searchunify/`,
    context: "Unified fragmented content with Cognitive Search and Knowbler.",
    stats: [
      { value: "98%", label: "Self-service resolution rate", dir: "up" },
      { value: "5%", label: "Higher CSAT", dir: "up" },
      { value: "9%", label: "Higher same-day resolution", dir: "up" },
    ],
    headline: 0,
  },
  {
    company: "EBSCO",
    logo: "/assets/clients/ebsco.svg",
    photo: "/assets/stories/ebsco.webp",
    href: `${STORY_BASE}/ebsco-academy-boosts-learner-engagement-by-125-8-with-searchunify/`,
    context: "Adopted the SearchUnify Cognitive Platform to make content easier to discover.",
    stats: [
      { value: "125.8%", label: "Growth in academy views", dir: "up" },
      { label: "Improved content visibility" },
      { label: "Actionable insights" },
    ],
    headline: 0,
  },
];

const CYCLE_MS = 2600;
const ease = [0.22, 1, 0.36, 1] as const;

export function SuccessStories() {
  return (
    <section aria-labelledby="stories-heading" className="relative overflow-hidden bg-slate-50 px-6 py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[56rem] -translate-x-1/2 rounded-full bg-[#005be2] opacity-[0.06] blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex justify-center">
          <span className="inline-block rounded-full bg-[#005be2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#005be2]">
            Customer success
          </span>
        </div>

        <h2
          id="stories-heading"
          className="mx-auto mt-6 max-w-4xl text-center text-[2rem] font-bold leading-[1.25] tracking-tight text-slate-950 sm:text-5xl sm:leading-[1.2] lg:text-6xl"
        >
          Real-World <StoryChip story={STORIES[0]} /> Customer
          <br />
          Success <StoryChip story={STORIES[1]} /> Stories <StoryChip story={STORIES[2]} />
        </h2>

        <p className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-medium text-slate-500 sm:text-base">
          <span>Accelerated ROI</span>
          <span aria-hidden="true" className="size-1 rounded-full bg-slate-300" />
          <span>Proven Performance</span>
          <span aria-hidden="true" className="size-1 rounded-full bg-slate-300" />
          <span>Trusted by Industry Pioneers</span>
        </p>

        <StatStrip />
      </div>
    </section>
  );
}

/* A customer photo inline in the headline. Widens on hover/focus and opens a
   card with that customer's results. */
function StoryChip({ story }: { story: Story }) {
  const [open, setOpen] = useState(false);
  const id = `story-${story.company.replace(/\W+/g, "-").toLowerCase()}`;

  return (
    <span
      className="relative inline-block align-middle"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`${story.company} success story`}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "relative mx-1 block h-10 overflow-hidden rounded-full border-2 border-white align-middle shadow-[0_8px_24px_-8px_rgba(15,23,42,0.35)] ring-1 ring-slate-200 transition-[width] duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005be2]/60 sm:h-14 lg:h-16",
          open ? "w-24 sm:w-32 lg:w-40" : "w-14 sm:w-20 lg:w-24",
        )}
      >
        <Image src={story.photo} alt="" fill sizes="160px" className="object-cover" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="dialog"
            aria-label={`${story.company} results`}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.22, ease }}
            // pt-3 bridges the gap so the pointer can travel into the card.
            className="absolute left-1/2 top-full z-30 block w-72 -translate-x-1/2 pt-3 text-left"
          >
            <span className="block rounded-2xl border border-slate-200 bg-white p-4 text-base font-normal tracking-normal shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)]">
              <Image src={story.logo} alt={story.company} width={160} height={40} className="h-7 w-auto max-w-[150px] object-contain object-left" />
              <span className="mt-2 block text-[13px] leading-snug text-slate-600">{story.context}</span>
              <span className="mt-3 block space-y-2 border-t border-slate-100 pt-3">
                {story.stats.map((s) => (
                  <span key={s.label} className="flex items-baseline gap-2">
                    {s.value ? (
                      <span className="w-16 shrink-0 text-lg font-bold tabular-nums text-[#005be2]">{s.value}</span>
                    ) : (
                      <span className="w-16 shrink-0 text-sm font-semibold text-emerald-600">✓</span>
                    )}
                    <span className="text-[13px] leading-snug text-slate-700">{s.label}</span>
                  </span>
                ))}
              </span>
              <Link
                href={story.href}
                className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#005be2] focus-visible:outline-none focus-visible:underline"
              >
                View case study
                <MoveRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/* Logo strip: each cell flips from the customer's logo to its headline stat.
   Cycles on its own (so touch users see the numbers), pauses while hovered. */
function StatStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const [auto, setAuto] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const cycling = inView && hovered === null && !reduceMotion;

  useEffect(() => {
    if (!cycling) return;
    const t = setTimeout(() => setAuto((i) => (i + 1) % STORIES.length), CYCLE_MS);
    return () => clearTimeout(t);
  }, [cycling, auto]);

  const active = hovered ?? (cycling ? auto : null);

  return (
    <div
      ref={ref}
      className="mx-auto mt-14 grid max-w-5xl grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_-30px_rgba(15,23,42,0.3)] sm:grid-cols-4"
      onMouseLeave={() => setHovered(null)}
    >
      {STORIES.map((story, i) => {
        const stat = story.stats[story.headline];
        const on = active === i;
        const Arrow = stat.dir === "down" ? ArrowDown : ArrowUp;

        return (
          <Link
            key={story.company}
            href={story.href}
            onMouseEnter={() => setHovered(i)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
            aria-label={`${story.company}: ${stat.value} ${stat.label.toLowerCase()}. View case study`}
            className={cn(
              "relative h-32 overflow-hidden px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#005be2]/50",
              i % 2 === 1 && "border-l border-dashed border-slate-200",
              i >= 2 && "border-t border-dashed border-slate-200 sm:border-t-0",
              i === 2 && "sm:border-l",
            )}
          >
            {/* Active cell gets a soft wash. */}
            <motion.span
              aria-hidden="true"
              initial={false}
              animate={{ opacity: on ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-b from-[#005be2]/[0.06] to-transparent"
            />

            <motion.span
              aria-hidden="true"
              initial={false}
              animate={{ y: on ? -36 : 0, opacity: on ? 0 : 1 }}
              transition={{ duration: 0.35, ease }}
              className="absolute inset-0 grid place-items-center px-6"
            >
              <Image
                src={story.logo}
                alt=""
                width={160}
                height={40}
                className="h-9 w-auto max-w-[85%] object-contain opacity-70 grayscale"
              />
            </motion.span>

            <motion.span
              aria-hidden="true"
              initial={false}
              animate={{ y: on ? 0 : 36, opacity: on ? 1 : 0 }}
              transition={{ duration: 0.35, ease }}
              className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center"
            >
              <span className="flex items-center gap-1.5">
                <Arrow className="size-5 text-emerald-500 md:size-6" strokeWidth={2.5} />
                <span className="text-3xl font-bold tabular-nums tracking-tight text-slate-950 md:text-4xl">{stat.value}</span>
              </span>
              <span className="mt-1 text-xs leading-snug text-slate-600 md:text-sm">{stat.label}</span>
              <span className="mt-1 text-[11px] font-semibold text-[#005be2]">{story.company}</span>
            </motion.span>

            {/* Cycle progress on the auto-advancing cell. */}
            {on && cycling && (
              <motion.span
                key={`bar-${auto}`}
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-[#005be2] to-[#06b6d4]"
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}
