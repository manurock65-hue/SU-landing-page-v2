import type { ReactNode } from "react";

// Tiny inline-markup parser for agent-panel copy: **bold** for lead-in labels
// (e.g. "Timeline:"), [[highlight]] for cited terms (e.g. a KB id or name).
export function parseInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\[\[[^\]]+\]\])/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("[[") && part.endsWith("]]")) {
      return (
        <span key={i} className="font-semibold text-cta">
          {part.slice(2, -2)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
