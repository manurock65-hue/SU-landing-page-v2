"use client";

import { cn } from "@/lib/utils";
import {
  Angry,
  ArrowRight,
  BookOpenCheck,
  Check,
  FileText,
  Frown,
  Laugh,
  Loader2,
  Meh,
  Search,
  Smile,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";

// Chapter 5 — "Transform Customer Support Outcomes to Drive Higher CSAT".
// Titles and descriptions mirror the live site. Each card carries a small,
// looping product vignette that acts out its outcome; the vignettes are
// illustrative (the ~$1M figure is the live site's claim).

const ease = [0.22, 1, 0.36, 1] as const;

type Outcome = { title: string; description: string; Visual: (p: { play: boolean }) => ReactNode; label: string };

const OUTCOMES: Outcome[] = [
  {
    title: "Enhance Self-Service Experience",
    description:
      "Unify data sources to provide intuitive self-service and swift query resolution through personalized AI guidance and instant access to relevant knowledge.",
    Visual: SelfServiceVisual,
    label: "A customer types a question into search and gets a direct answer drawn from the admin guide.",
  },
  {
    title: "Deliver Empathetic AI Support",
    description:
      "Delight customers with AI-driven personalized support. Ensure swift and empathetic case resolution, boosting customer satisfaction at every step.",
    Visual: EmpathyVisual,
    label: "A frustrated customer message gets an empathetic AI reply, and detected sentiment turns from frustrated to reassured.",
  },
  {
    title: "Augment Support Efficiency",
    description:
      "Automatically triage and route tickets to the right expert. Leverage intelligent sentiment analysis for faster and more accurate resolutions.",
    Visual: RoutingVisual,
    label: "Incoming tickets are tagged by topic and sentiment and routed to the billing, technical or account team.",
  },
  {
    title: "Sustain Service Excellence at Scale",
    description:
      "Navigate rising ticket volumes seamlessly. SearchUnify AI agents automate routine queries and assist reps, ensuring consistent and fast support across channels and time zones.",
    Visual: ScaleVisual,
    label: "Ticket volume rises month over month while the share handled automatically by AI grows.",
  },
  {
    title: "Fuel Knowledge-Centered Support",
    description:
      "Implement proactive support programs like Knowledge-Centered Support (KCS) effectively by embedding automated knowledge capture in every user interaction.",
    Visual: KcsVisual,
    label: "A resolved case is turned into a new knowledge article and published for reuse.",
  },
  {
    title: "Maximize Customer Service ROI",
    description:
      "Measure, quantify, maximize, and showcase ROI in your entire support ecosystem. Save ~$1 Million in support cost in three months of deployment with quick time to value.",
    Visual: RoiVisual,
    label: "Support cost saved climbs to about one million dollars over the first three months.",
  },
];

export function SupportOutcomes() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.15 });
  const reduceMotion = useReducedMotion();
  const play = inView && !reduceMotion;

  return (
    <section
      aria-labelledby="outcomes-heading"
      className="relative z-10 -mt-14 rounded-t-[2.5rem] bg-white px-6 pb-28 pt-24 sm:rounded-t-[3.5rem] sm:pb-32 sm:pt-28"
    >
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full bg-[#005be2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#005be2]">
          Outcomes
        </span>
        <h2 id="outcomes-heading" className="mt-5 text-balance text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          Transform Customer Support Outcomes to Drive Higher{" "}
          <span className="bg-gradient-to-r from-[#005be2] to-[#06b6d4] bg-clip-text text-transparent">CSAT</span>
        </h2>
        <MoodTrack play={play} />
      </div>

      <div ref={ref} className="mx-auto mt-16 grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {OUTCOMES.map((o, i) => (
          <OutcomeCard key={o.title} outcome={o} index={i} play={play} />
        ))}
      </div>
    </section>
  );
}

/* Customer mood slides from angry to delighted as the section comes into view. */
const MOODS = [Angry, Frown, Meh, Smile, Laugh];

function MoodTrack({ play }: { play: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduceMotion = useReducedMotion();
  const done = inView || reduceMotion;

  return (
    <div ref={ref} className="mx-auto mt-8 flex max-w-sm items-center gap-3" aria-hidden="true">
      <span className="text-xs font-medium text-slate-500">Customer mood</span>
      <div className="relative flex flex-1 items-center justify-between rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5">
        <motion.div
          className="absolute inset-y-1 left-1 rounded-full bg-gradient-to-r from-rose-100 via-amber-100 to-emerald-100"
          initial={{ width: "12%" }}
          animate={{ width: done ? "calc(100% - 0.5rem)" : "12%" }}
          transition={{ duration: 2.2, ease, delay: 0.3 }}
        />
        {MOODS.map((Icon, i) => {
          const last = i === MOODS.length - 1;
          return (
            <motion.span
              key={i}
              className={cn("relative grid size-7 place-items-center rounded-full", last ? "text-emerald-600" : "text-slate-400")}
              initial={false}
              animate={done && last ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={{ duration: 0.6, delay: 2.3, repeat: play && last ? Infinity : 0, repeatDelay: 3 }}
            >
              <Icon className="size-4" />
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}

function OutcomeCard({ outcome, index, play }: { outcome: Outcome; index: number; play: boolean }) {
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <motion.article
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease, delay: (index % 3) * 0.08 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-3 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.25)] transition-[border-color,box-shadow] duration-300 hover:border-[#005be2]/25 hover:shadow-[0_24px_60px_-28px_rgba(0,91,226,0.35)]"
    >
      {/* Cursor spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(360px_circle_at_var(--x)_var(--y),rgba(0,91,226,0.09),transparent_45%)]"
      />

      <div
        role="img"
        aria-label={outcome.label}
        className="relative h-52 overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-b from-slate-50 to-white p-4 [background-image:radial-gradient(rgba(148,163,184,0.25)_1px,transparent_1px)] [background-size:16px_16px]"
      >
        <outcome.Visual play={play} />
      </div>

      <div className="relative px-3 pb-3 pt-5">
        <span className="text-xs font-semibold tabular-nums text-[#005be2]">0{index + 1}</span>
        <h3 className="mt-1 text-lg font-semibold leading-snug text-slate-950">{outcome.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{outcome.description}</p>
      </div>
    </motion.article>
  );
}

/* ---------------------------------------------------------------- helpers */

// Steps through `durations` in a loop while playing; rests on the last step
// (the "finished" frame) when paused, off screen or with reduced motion.
function useStep(durations: readonly number[], play: boolean) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!play) return;
    const t = setTimeout(() => setStep((s) => (s + 1) % durations.length), durations[step]);
    return () => clearTimeout(t);
  }, [play, step, durations]);
  return play ? step : durations.length - 1;
}

function useTyped(text: string, active: boolean, speed = 45) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    setN(0);
    const t = setInterval(() => setN((c) => (c >= text.length ? c : c + 1)), speed);
    return () => clearInterval(t);
  }, [active, text, speed]);
  return active ? text.slice(0, n) : text;
}

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.35, ease },
};

/* ---------------------------------------------------------------- visuals */

/* 1 — Self-service: the question is typed, sources are searched, an answer appears. */
const SS_STEPS = [1900, 900, 3400] as const;
const SS_QUERY = "How do I reset SSO for my team?";

function SelfServiceVisual({ play }: { play: boolean }) {
  const step = useStep(SS_STEPS, play);
  const typed = useTyped(SS_QUERY, play && step === 0);

  return (
    <div className="flex h-full flex-col gap-2.5">
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-800 shadow-sm">
        <Search className="size-3.5 shrink-0 text-slate-400" />
        <span className="truncate">{typed}</span>
        {step === 0 && <span className="-ml-1.5 h-4 w-px animate-pulse bg-[#005be2]" />}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.p key="searching" {...fade} className="flex items-center gap-2 px-1 text-xs text-slate-500">
            <Loader2 className="size-3.5 animate-spin text-[#005be2]" /> Searching 12 connected sources…
          </motion.p>
        )}
        {step === 2 && (
          <motion.div key="answer" {...fade} className="space-y-2">
            <div className="rounded-xl border border-[#005be2]/20 bg-[#005be2]/[0.04] p-3">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#005be2]">
                <Sparkles className="size-3" /> AI answer · Admin Guide
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-700">
                Go to <b>Admin → Security → SSO</b>, select the users and choose <b>Reset sessions</b>.
              </p>
            </div>
            {["KB · SSO setup for admins", "Community · Resetting SAML users"].map((r, i) => (
              <motion.div
                key={r}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.12, duration: 0.3 }}
                className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 text-[11px] text-slate-500 ring-1 ring-slate-200"
              >
                <FileText className="size-3 text-slate-400" /> {r}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* 2 — Empathy: frustrated message → empathetic reply; detected sentiment flips. */
const EM_STEPS = [1700, 1300, 3600] as const;

function EmpathyVisual({ play }: { play: boolean }) {
  const step = useStep(EM_STEPS, play);
  const calm = step === 2;

  return (
    <div className="flex h-full flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-500">Live chat · Case #48213</span>
        <motion.span
          layout
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 transition-colors duration-500",
            calm ? "bg-emerald-50 text-emerald-700 ring-emerald-500/20" : "bg-rose-50 text-rose-600 ring-rose-500/20",
          )}
        >
          {calm ? <Smile className="size-3" /> : <Frown className="size-3" />}
          {calm ? "Reassured" : "Frustrated"}
        </motion.span>
      </div>

      <div className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-slate-900 px-3 py-2 text-xs leading-relaxed text-white">
        Third time my sync failed this week. I need this fixed today.
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="typing" {...fade} className="flex w-14 items-center justify-center gap-1 rounded-2xl rounded-bl-md bg-white py-2.5 ring-1 ring-slate-200">
            {[0, 1, 2].map((d) => (
              <motion.span
                key={d}
                className="size-1.5 rounded-full bg-slate-400"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.12 }}
              />
            ))}
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="reply" {...fade} className="max-w-[88%] rounded-2xl rounded-bl-md bg-white px-3 py-2 text-xs leading-relaxed text-slate-700 ring-1 ring-slate-200">
            I&apos;m sorry this keeps happening. I&apos;ve re-run the sync and it&apos;s <b className="text-emerald-600">healthy now</b>. I&apos;ll
            watch it for 24h.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* 3 — Efficiency: each ticket is tagged, then routed to the right team. */
const TICKETS = [
  { text: "Refund not received", topic: "Billing", mood: "Negative", lane: 0 },
  { text: "API returns 502 errors", topic: "Technical", mood: "Urgent", lane: 1 },
  { text: "Add 20 more seats", topic: "Account", mood: "Positive", lane: 2 },
] as const;
const LANES = [
  { team: "Billing", who: "AK" },
  { team: "Tech support", who: "RM" },
  { team: "Account mgmt", who: "SJ" },
];
const RT_STEPS = [2300, 2300, 2300] as const;

function RoutingVisual({ play }: { play: boolean }) {
  const step = useStep(RT_STEPS, play);
  const t = TICKETS[step];

  return (
    <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={t.text}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24, scale: 0.9 }}
          transition={{ duration: 0.4, ease }}
          className="rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-slate-200"
        >
          <p className="text-[10px] font-medium text-slate-400">New ticket</p>
          <p className="mt-0.5 text-xs font-medium leading-snug text-slate-800">{t.text}</p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: play ? 0.55 : 0 }}
            className="mt-2 flex flex-wrap gap-1"
          >
            <span className="rounded-md bg-[#005be2]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#005be2]">{t.topic}</span>
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">{t.mood}</span>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <ArrowRight className="size-4 text-slate-300" />

      <div className="flex flex-col gap-2">
        {LANES.map((l, i) => {
          const hit = i === t.lane;
          return (
            <motion.div
              key={l.team}
              initial={false}
              animate={{ scale: hit ? 1.03 : 1 }}
              transition={{ delay: play && hit ? 0.9 : 0, duration: 0.3 }}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] ring-1 transition-colors duration-300",
                hit ? "bg-[#005be2] text-white ring-[#005be2] delay-[900ms]" : "bg-white text-slate-500 ring-slate-200 delay-0",
              )}
            >
              <span className={cn("grid size-5 place-items-center rounded-full text-[9px] font-bold", hit ? "bg-white/20" : "bg-slate-100")}>
                {l.who}
              </span>
              <span className="truncate font-medium">{l.team}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* 4 — Scale: volume climbs every month, and AI takes a growing share of it. */
const VOLUME = [34, 42, 50, 58, 66, 76, 86, 96];
const AUTOMATED = [0.2, 0.28, 0.36, 0.44, 0.52, 0.58, 0.64, 0.7];
const SC_STEPS = [5200, 2200] as const;

function ScaleVisual({ play }: { play: boolean }) {
  const step = useStep(SC_STEPS, play);
  const grown = step === 0 || !play;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1 font-medium text-slate-600">
          <TrendingUp className="size-3.5 text-[#005be2]" /> Ticket volume
        </span>
        <span className="flex items-center gap-2.5 text-slate-500">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-sm bg-[#005be2]" /> AI
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-sm bg-slate-300" /> Reps
          </span>
        </span>
      </div>

      <div className="mt-3 flex flex-1 items-end gap-2">
        {VOLUME.map((v, i) => (
          <motion.div
            key={i}
            className="flex flex-1 origin-bottom flex-col justify-end overflow-hidden rounded-t-md"
            style={{ height: `${v}%` }}
            initial={false}
            animate={{ scaleY: grown ? 1 : 0.08 }}
            transition={{ duration: 0.7, ease, delay: grown ? i * 0.09 : 0 }}
          >
            <div className="bg-slate-300" style={{ height: `${(1 - AUTOMATED[i]) * 100}%` }} />
            <div className="bg-gradient-to-t from-[#005be2] to-[#3b82f6]" style={{ height: `${AUTOMATED[i] * 100}%` }} />
          </motion.div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-slate-500">
        Rising volume, same fast response — <span className="font-semibold text-[#005be2]">AI absorbs the growth</span>
      </p>
    </div>
  );
}

/* 5 — KCS: a resolved case becomes a published knowledge article. */
const KCS_STEPS = [1500, 2600, 2600] as const;

function KcsVisual({ play }: { play: boolean }) {
  const step = useStep(KCS_STEPS, play);

  return (
    <div className="grid h-full grid-cols-[1fr_auto_1.25fr] items-center gap-2">
      <div className="rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-slate-200">
        <p className="text-[10px] font-medium text-slate-400">Case #48213</p>
        <p className="mt-0.5 text-xs font-medium leading-snug text-slate-800">SSO users not syncing</p>
        <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
          <Check className="size-3" strokeWidth={3} /> Resolved
        </span>
      </div>

      <motion.div
        animate={step >= 1 ? { x: [0, 4, 0], opacity: 1 } : { opacity: 0.3 }}
        transition={{ duration: 0.8, repeat: step === 1 && play ? Infinity : 0 }}
      >
        <Sparkles className="size-4 text-[#005be2]" />
      </motion.div>

      <div className="relative rounded-xl bg-white p-2.5 shadow-sm ring-1 ring-slate-200">
        <p className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
          <FileText className="size-3" /> Draft article
        </p>
        <p className="mt-0.5 text-xs font-semibold leading-snug text-slate-800">How to resync SSO users</p>
        <div className="mt-2 space-y-1.5">
          {[100, 86, 92, 64].map((w, i) => (
            <motion.div
              key={i}
              className="h-1.5 origin-left rounded-full bg-slate-200"
              style={{ width: `${w}%` }}
              initial={false}
              animate={{ scaleX: step >= 1 ? 1 : 0 }}
              transition={{ duration: 0.45, ease, delay: step === 1 && play ? 0.2 + i * 0.3 : 0 }}
            />
          ))}
        </div>
        <AnimatePresence>
          {step === 2 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              className="absolute -bottom-3 right-2 inline-flex items-center gap-1 rounded-full bg-[#005be2] px-2 py-1 text-[10px] font-semibold text-white shadow-md"
            >
              <BookOpenCheck className="size-3" /> Published to KB
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* 6 — ROI: savings count up to ~$1M across the first three months. */
const ROI_STEPS = [3200, 3400] as const;

function RoiVisual({ play }: { play: boolean }) {
  const step = useStep(ROI_STEPS, play);
  const value = useMotionValue(1_000_000);
  const text = useTransform(value, (v) => `$${Math.round(v).toLocaleString("en-US")}`);

  useEffect(() => {
    if (!play) {
      value.set(1_000_000);
      return;
    }
    if (step !== 0) return;
    value.set(0);
    const c = animate(value, 1_000_000, { duration: 2.6, ease });
    return () => c.stop();
  }, [play, step, value]);

  const drawn = step === 0 || !play;

  return (
    <div className="flex h-full flex-col">
      <p className="text-[11px] font-medium text-slate-500">Support cost saved</p>
      <p className="mt-0.5 text-3xl font-bold tracking-tight text-slate-950 tabular-nums">
        ~<motion.span>{text}</motion.span>
      </p>

      <svg viewBox="0 0 300 90" className="mt-auto h-24 w-full" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="roiFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#005be2" stopOpacity="0.22" />
            <stop offset="1" stopColor="#005be2" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0 86 C 50 84, 80 76, 110 66 S 180 40, 210 30 S 270 8, 300 4 L 300 90 L 0 90 Z"
          fill="url(#roiFill)"
          initial={false}
          animate={{ opacity: drawn ? 1 : 0 }}
          transition={{ duration: 1.2, delay: drawn && play ? 0.8 : 0 }}
        />
        <motion.path
          d="M0 86 C 50 84, 80 76, 110 66 S 180 40, 210 30 S 270 8, 300 4"
          fill="none"
          stroke="#005be2"
          strokeWidth="2.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={false}
          animate={{ pathLength: drawn ? 1 : 0 }}
          transition={{ duration: drawn && play ? 2.6 : 0.3, ease }}
        />
      </svg>
      <div className="flex justify-between text-[10px] font-medium text-slate-400">
        <span>Month 1</span>
        <span>Month 2</span>
        <span>Month 3</span>
      </div>
    </div>
  );
}
