"use client";

import { cn } from "@/lib/utils";
import { Check, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

// Security & compliance standards SearchUnify meets (from the live site's FAQ
// answer and its compliance badge strip). Drawn as crisp seals instead of the
// live site's low-resolution badge image.
export const COMPLIANCE = [
  { mark: "SOC 2", name: "SOC 2 Type II", detail: "AICPA audited" },
  { mark: "ISO", name: "ISO 27001:2013", detail: "Information security" },
  { mark: "HIPAA", name: "HIPAA", detail: "Health data" },
  { mark: "GDPR", name: "GDPR", detail: "EU data privacy" },
];

function Seal({ mark, className }: { mark: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid size-12 shrink-0 place-items-center rounded-full bg-white shadow-[0_6px_16px_-8px_rgba(15,23,42,0.35)] ring-1 ring-slate-200",
        className,
      )}
    >
      {/* Inner dashed ring gives it a seal feel. */}
      <span className="absolute inset-[3px] rounded-full border border-dashed border-[#005be2]/30" />
      <span className="relative text-[10px] font-bold tracking-tight text-slate-800">{mark}</span>
      <span className="absolute -bottom-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
        <Check className="size-2.5" strokeWidth={3.5} />
      </span>
    </span>
  );
}

/* `cards`: seal + name + detail tiles (FAQ). `seals`: a compact row (footer).
   `strip`: a full-width banner with the label and seals end to end, dividers
   between each — a dedicated "trust bar" treatment. */
export function ComplianceBadges({
  variant = "cards",
  className,
}: {
  variant?: "cards" | "seals" | "strip";
  className?: string;
}) {
  if (variant === "strip") {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-6 rounded-3xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-white px-6 py-8 sm:flex-row sm:gap-0 sm:py-0",
          className,
        )}
      >
        <div className="flex shrink-0 items-center gap-2 sm:w-[220px] sm:border-r sm:border-slate-200 sm:py-8 sm:pr-6">
          <ShieldCheck className="size-4 text-[#005be2]" />
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Certified compliance</span>
        </div>
        <ul
          aria-label="Security and compliance"
          className="grid w-full grid-cols-2 place-items-center gap-x-4 gap-y-6 sm:flex sm:flex-1 sm:items-center sm:justify-evenly sm:divide-x sm:divide-slate-200 sm:gap-0 sm:py-6"
        >
          {COMPLIANCE.map((c, i) => (
            <motion.li
              key={c.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex flex-col items-center justify-center gap-2 px-4 text-center transition-transform duration-200 hover:-translate-y-0.5 first:pl-0 last:pr-0"
            >
              <Seal mark={c.mark} className="size-12" />
              <span className="text-[11px] font-medium text-slate-500">{c.name}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    );
  }

  if (variant === "seals") {
    return (
      <ul aria-label="Security and compliance" className={cn("flex flex-wrap items-center gap-3", className)}>
        {COMPLIANCE.map((c) => (
          <li key={c.name} title={`${c.name} · ${c.detail}`} className="transition-transform duration-200 hover:-translate-y-0.5">
            <Seal mark={c.mark} className="size-11" />
            <span className="sr-only">{c.name}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul aria-label="Security and compliance" className={cn("grid grid-cols-2 gap-2 sm:grid-cols-3", className)}>
      {COMPLIANCE.map((c) => (
        <li key={c.name} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2.5 pr-3">
          <Seal mark={c.mark} className="size-10" />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-slate-950">{c.name}</span>
            <span className="block truncate text-[11px] text-slate-500">{c.detail}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
