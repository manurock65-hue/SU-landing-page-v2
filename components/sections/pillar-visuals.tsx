"use client";

import { BookOpenCheck, Check, CircleDashed, FileLock2, KeyRound, Lock, Plus, Route, ScrollText, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

// Illustrative product UI for each platform pillar. Decorative: each is wrapped
// in role="img" with a text description by the parent tab panel.

const ease = [0.22, 1, 0.36, 1] as const;
const rise = (i: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: 0.08 * i, ease },
});

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_40px_-16px_rgba(15,23,42,0.18)] ${className}`}>
      {children}
    </div>
  );
}

/* 1 — Unified data: sources converge into SearchUnifyFRAG™, which returns a grounded answer. */
const SOURCES = ["Salesforce", "Zendesk", "SharePoint", "Slack", "Khoros", "Madcap Flare"];

export function UnifiedDataVisual() {
  const ys = SOURCES.map((_, i) => 44 + i * 58);
  const [hovered, setHovered] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <svg viewBox="0 0 560 400" className="h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id="flow" x1="0" x2="1">
          <stop offset="0" stopColor="#cbd5e1" />
          <stop offset="1" stopColor="#005be2" />
        </linearGradient>
        <radialGradient id="hubGlow">
          <stop offset="0" stopColor="#005be2" stopOpacity="0.25" />
          <stop offset="1" stopColor="#005be2" stopOpacity="0" />
        </radialGradient>
      </defs>

      {ys.map((y, i) => {
        const active = hovered === i;
        return (
          <g key={`p${i}`}>
            <motion.path
              d={`M156 ${y} C 220 ${y}, 230 200, 282 200`}
              fill="none"
              stroke={active ? "#005be2" : "url(#flow)"}
              strokeWidth={active ? 2.5 : 1.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.1 + i * 0.07, ease }}
              style={{ transition: "stroke 0.25s, stroke-width 0.25s" }}
            />
            {/* Ambient "data flowing" current — a dashed overlay marching toward the hub. */}
            {!reduceMotion && (
              <motion.path
                d={`M156 ${y} C 220 ${y}, 230 200, 282 200`}
                fill="none"
                stroke={active ? "#60a5fa" : "#93c5fd"}
                strokeWidth={active ? 2.5 : 1.5}
                strokeLinecap="round"
                strokeDasharray="1 11"
                opacity={active ? 0.95 : 0.55}
                animate={{ strokeDashoffset: [0, -24] }}
                transition={{ duration: active ? 0.7 : 1.6, repeat: Infinity, ease: "linear" }}
              />
            )}
          </g>
        );
      })}

      {SOURCES.map((s, i) => (
        <motion.g
          key={s}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, x: hovered === i ? -4 : 0 }}
          transition={{ opacity: { duration: 0.5, delay: 0.08 * i, ease }, y: { duration: 0.5, delay: 0.08 * i, ease }, x: { duration: 0.25, ease } }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
          style={{ cursor: "pointer" }}
        >
          <rect
            x="16"
            y={ys[i] - 17}
            width="140"
            height="34"
            rx="10"
            fill={hovered === i ? "#eff6ff" : "#fff"}
            stroke={hovered === i ? "#005be2" : "#e2e8f0"}
            style={{ transition: "fill 0.25s, stroke 0.25s" }}
          />
          <circle cx="34" cy={ys[i]} r="4" fill={hovered === i ? "#005be2" : "#94a3b8"} style={{ transition: "fill 0.25s" }} />
          <text x="46" y={ys[i] + 4.5} fontSize="13" fontWeight={hovered === i ? 600 : 400} fill={hovered === i ? "#005be2" : "#334155"}>
            {s}
          </text>
        </motion.g>
      ))}

      <circle cx="322" cy="200" r="90" fill="url(#hubGlow)" />
      {!reduceMotion && (
        <motion.circle
          cx="322"
          cy="200"
          r="50"
          fill="none"
          stroke="#005be2"
          strokeWidth="1"
          initial={{ opacity: 0.35, scale: 1 }}
          animate={{ opacity: [0.35, 0, 0.35], scale: [1, 1.5, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 1 }}
          style={{ transformOrigin: "322px 200px" }}
        />
      )}
      <motion.g
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: hovered !== null ? 1.06 : 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.55, ease }}
        style={{ transformOrigin: "322px 200px" }}
      >
        <circle cx="322" cy="200" r="42" fill="#005be2" />
        <text x="322" y="197" textAnchor="middle" fontSize="12" fontWeight="600" fill="#fff">FRAG™</text>
        <text x="322" y="213" textAnchor="middle" fontSize="9" fill="#bfdbfe">unified index</text>
      </motion.g>

      <motion.path
        d="M364 200 H 392"
        stroke="#005be2"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.9 }}
      />
      <motion.g {...rise(10)}>
        <rect x="392" y="128" width="156" height="144" rx="14" fill="#fff" stroke="#e2e8f0" />
        <text x="408" y="154" fontSize="11" fontWeight="600" fill="#005be2">✦ AI answer</text>
        {!reduceMotion ? (
          <>
            <motion.rect
              x="408" y="168" width="124" height="7" rx="3.5" fill="#e2e8f0"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity, ease, delay: 0 }}
            />
            <motion.rect
              x="408" y="183" width="108" height="7" rx="3.5" fill="#e2e8f0"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity, ease, delay: 0.25 }}
            />
            <motion.rect
              x="408" y="198" width="118" height="7" rx="3.5" fill="#e2e8f0"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity, ease, delay: 0.5 }}
            />
          </>
        ) : (
          <>
            <rect x="408" y="168" width="124" height="7" rx="3.5" fill="#e2e8f0" />
            <rect x="408" y="183" width="108" height="7" rx="3.5" fill="#e2e8f0" />
            <rect x="408" y="198" width="118" height="7" rx="3.5" fill="#e2e8f0" />
          </>
        )}
        <motion.rect
          x="408" y="226" width="124" height="28" rx="8" fill="#ecfdf5"
          animate={!reduceMotion ? { scale: [1, 1.03, 1] } : undefined}
          transition={{ duration: 2.2, repeat: Infinity, ease, delay: 1.2 }}
          style={{ transformOrigin: "470px 240px" }}
        />
        <text x="420" y="244" fontSize="10.5" fill="#047857">✓ Cites 6 sources</text>
      </motion.g>
    </svg>
  );
}

/* 2 — Optimal models (BYOLLM): each task is routed to the model that fits it best. */
const ROUTES = [
  { task: "Answer generation", model: "GPT", tone: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  { task: "Case summarization", model: "Claude", tone: "bg-orange-50 text-orange-700 ring-orange-200" },
  { task: "Intent classification", model: "Llama · self-hosted", tone: "bg-sky-50 text-sky-700 ring-sky-200" },
  { task: "Translation", model: "Gemini", tone: "bg-violet-50 text-violet-700 ring-violet-200" },
];

export function ModelsVisual() {
  return (
    <Card className="w-full max-w-md p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">Model routing</p>
        <span className="rounded-full bg-[#005be2]/10 px-2.5 py-1 text-[11px] font-semibold text-[#005be2]">BYOLLM</span>
      </div>
      <ul className="space-y-2.5">
        {ROUTES.map((r, i) => (
          <motion.li key={r.task} {...rise(i)} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3.5 py-3">
            <span className="flex-1 text-sm text-slate-700">{r.task}</span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.25 + i * 0.08 }}
              className="h-px w-8 origin-left bg-slate-300"
            />
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${r.tone}`}>{r.model}</span>
          </motion.li>
        ))}
        <motion.li {...rise(ROUTES.length)} className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-3.5 py-3 text-sm text-slate-500">
          <Plus className="size-4" /> Bring your own model
        </motion.li>
      </ul>
    </Card>
  );
}

/* 3 — Operational resilience: layered security across the AI lifecycle. */
const LAYERS = [
  { icon: Lock, label: "Encryption in transit & at rest" },
  { icon: KeyRound, label: "SSO & role-based access" },
  { icon: FileLock2, label: "PII detection & redaction" },
  { icon: ScrollText, label: "Full audit trail" },
];

export function ResilienceVisual() {
  return (
    <div className="flex w-full max-w-md flex-col items-center">
      <div className="w-full space-y-2.5">
        {LAYERS.map((l, i) => (
          <motion.div key={l.label} {...rise(i)} style={{ marginInline: `${(LAYERS.length - 1 - i) * 10}px` }}>
            <Card className="flex items-center gap-3 px-4 py-3.5">
              <span className="grid size-9 place-items-center rounded-xl bg-[#005be2]/10 text-[#005be2]">
                <l.icon className="size-[18px]" />
              </span>
              <span className="flex-1 text-sm font-medium text-slate-800">{l.label}</span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <span className="size-1.5 rounded-full bg-emerald-500" /> Active
              </span>
            </Card>
          </motion.div>
        ))}
      </div>
      <motion.div {...rise(5)} className="mt-5 flex flex-wrap justify-center gap-2">
        {["ISO 27001", "SOC 2", "HIPAA"].map((b) => (
          <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
            <ShieldCheck className="size-3.5 text-[#005be2]" /> {b}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* 4 — Ethical autonomy: guardrails check every answer before it's sent. */
const CHECKS = ["Grounded in approved sources", "No sensitive data exposed", "Brand tone & policy"];

export function EthicsVisual() {
  return (
    <Card className="w-full max-w-md p-5">
      <motion.div {...rise(0)} className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-slate-100 px-4 py-2.5 text-sm text-slate-700">
        How do I restore admin access after an SSO lockout?
      </motion.div>
      <motion.div {...rise(1)} className="mt-3 max-w-[88%] rounded-2xl rounded-bl-md border border-slate-200 px-4 py-3">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Agent draft</p>
        <div className="space-y-1.5">
          <div className="h-2 w-full rounded bg-slate-200" />
          <div className="h-2 w-4/5 rounded bg-slate-200" />
        </div>
      </motion.div>

      <div className="mt-4 space-y-2">
        {CHECKS.map((c, i) => (
          <motion.div key={c} {...rise(2 + i)} className="flex items-center gap-2.5 text-sm text-slate-700">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.35 + i * 0.15 }}
              className="grid size-5 place-items-center rounded-full bg-emerald-500 text-white"
            >
              <Check className="size-3" strokeWidth={3} />
            </motion.span>
            {c}
          </motion.div>
        ))}
      </div>

      <motion.div {...rise(6)} className="mt-4 rounded-xl bg-slate-50 p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-700">Confidence</span>
          <span className="font-semibold text-emerald-600">94% · Auto-resolve</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "94%" }}
            transition={{ duration: 0.9, delay: 0.7, ease }}
            className="h-full rounded-full bg-emerald-500"
          />
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
          <CircleDashed className="size-3" /> Below 80% hands off to a human agent
        </p>
      </motion.div>
    </Card>
  );
}

/* Loop closed — QA scores the case, Knowledge writes the article, Routing learns the pattern. */
const LOOP_ROWS = [
  { icon: ShieldCheck, label: "QA scores every case", detail: "96/100 · policy, tone, sources cited" },
  { icon: BookOpenCheck, label: "Knowledge writes the article", detail: "Published · closes the gap for next time" },
  { icon: Route, label: "Routing learns the pattern", detail: "Next SAML case lands here first" },
];

export function LoopVisual() {
  return (
    <Card className="w-full max-w-md p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">Loop closed</p>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Case #48390</span>
      </div>
      <ul className="space-y-2.5">
        {LOOP_ROWS.map((r, i) => (
          <motion.li key={r.label} {...rise(i)} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3.5 py-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#005be2]/10 text-[#005be2]">
              <r.icon className="size-[18px]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-slate-800">{r.label}</span>
              <span className="block truncate text-xs text-slate-500">{r.detail}</span>
            </span>
          </motion.li>
        ))}
      </ul>
      <motion.p {...rise(LOOP_ROWS.length)} className="mt-4 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
        <Check className="size-3.5" strokeWidth={3} /> The front door has a source next time
      </motion.p>
    </Card>
  );
}

/* 5 — Deploy with confidence: pre-built agents, ready to switch on. */
const AGENTS = [
  { name: "AI Support Agent", role: "Resolves cases end to end", live: true },
  { name: "AI Knowledge Agent", role: "Turns resolutions into articles", live: true },
  { name: "AI Escalation Manager", role: "Flags at-risk cases early", live: false },
  { name: "AI Case Quality Auditor", role: "Scores every closed case", live: false },
];

export function DeployVisual() {
  return (
    <div className="w-full max-w-lg">
      <motion.div {...rise(0)} className="mb-3 flex items-center justify-between px-1">
        <p className="text-sm font-semibold text-slate-900">Agent library</p>
        <p className="text-xs text-slate-500">8 pre-built agents</p>
      </motion.div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {AGENTS.map((a, i) => (
          <motion.div key={a.name} {...rise(i + 1)}>
            <Card className="h-full p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold leading-snug text-slate-900">{a.name}</p>
                <span
                  className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${a.live ? "bg-[#005be2]" : "bg-slate-200"}`}
                >
                  <span className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-all ${a.live ? "left-[18px]" : "left-0.5"}`} />
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{a.role}</p>
              <p className={`mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium ${a.live ? "text-emerald-600" : "text-slate-400"}`}>
                <span className={`size-1.5 rounded-full ${a.live ? "bg-emerald-500" : "bg-slate-300"}`} />
                {a.live ? "Live" : "Ready to deploy"}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
