"use client";

import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const STEP_MS = 1100;
const HOLD_MS = 2600;

// A simulated agent run: steps appear one by one (spinner → check), then the
// result, then it loops. Shows the finished run when `playing` is false or the
// user prefers reduced motion.
export function AgentLog({
  steps,
  result,
  playing,
  tone = "dark",
  className,
}: {
  steps: string[];
  result: string;
  playing: boolean;
  tone?: "dark" | "light";
  className?: string;
}) {
  const light = tone === "light";
  const reduceMotion = useReducedMotion();
  const animate = playing && !reduceMotion;
  const total = steps.length + 1; // steps + result
  const [count, setCount] = useState(1);
  const shown = animate ? count : total;

  useEffect(() => {
    if (!animate) return;
    const t = setTimeout(
      () => setCount((c) => (c >= total ? 1 : c + 1)),
      count >= total ? HOLD_MS : STEP_MS,
    );
    return () => clearTimeout(t);
  }, [animate, count, total]);

  return (
    <div className={cn("font-mono text-[12.5px] leading-relaxed", className)}>
      <ul className="space-y-2">
        <AnimatePresence initial={false}>
          {steps.slice(0, Math.min(shown, steps.length)).map((s, i) => {
            const running = animate && i === shown - 1 && shown <= steps.length;
            return (
              <motion.li
                key={`${i}-${s}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-start gap-2.5"
              >
                <span
                  className={cn(
                    "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full",
                    running
                      ? light ? "text-[#005be2]" : "text-cyan-300"
                      : light ? "bg-emerald-500/10 text-emerald-600" : "bg-emerald-400/15 text-emerald-300",
                  )}
                >
                  {running ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3" strokeWidth={3} />}
                </span>
                <span className={running ? (light ? "text-slate-900" : "text-white") : light ? "text-slate-500" : "text-slate-400"}>
                  {s}
                </span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
      <AnimatePresence>
        {shown > steps.length && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 font-sans text-xs font-medium ring-1",
              light
                ? "bg-emerald-50 text-emerald-700 ring-emerald-500/20"
                : "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
            )}
          >
            <span className={cn("size-1.5 rounded-full", light ? "bg-emerald-500" : "bg-emerald-400")} />
            {result}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
