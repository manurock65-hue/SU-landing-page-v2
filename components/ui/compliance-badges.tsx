import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

// Security & compliance standards SearchUnify meets (from the live site's FAQ
// answer and its compliance badge strip). Drawn as crisp seals instead of the
// live site's low-resolution badge image.
export const COMPLIANCE = [
  { mark: "ISO", name: "ISO 27001", detail: "Information security" },
  { mark: "SOC 2", name: "SOC 2", detail: "AICPA audited" },
  { mark: "HIPAA", name: "HIPAA", detail: "Health data" },
  { mark: "GDPR", name: "GDPR", detail: "EU data privacy" },
  { mark: "CCPA", name: "CCPA", detail: "California privacy" },
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

/* `cards`: seal + name + detail tiles (FAQ). `seals`: a compact row (footer). */
export function ComplianceBadges({ variant = "cards", className }: { variant?: "cards" | "seals"; className?: string }) {
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
