"use client";

import { BorderBeam } from "@/components/ui/border-beam-search";
import { siteSearchUrl } from "@/lib/nav-data";
import { cn } from "@/lib/utils";
import { ArrowUpRight, CornerDownLeft, Search, X } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const POPULAR = [
  "AI Support Agent",
  "Agentic RAG",
  "Model Context Protocol",
  "Knowbler",
  "Case studies",
  "Salesforce integration",
];

// Header search: a trigger (pill with an animated border beam on xl, icon
// below) that opens a search dialog. Ctrl/⌘+K opens it from anywhere; results
// open in the SearchUnify Resource Center.
export function SiteSearch({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  // Whatever had focus when the dialog opened gets it back on close.
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  const openDialog = useCallback(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    returnFocusRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openDialog();
      } else if (e.key === "Escape" && open) {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, openDialog]);

  useEffect(() => {
    if (!open) return;
    // Select any previous query so typing replaces it.
    inputRef.current?.select();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const go = (q: string) => {
    const term = q.trim();
    if (!term) return;
    window.location.href = siteSearchUrl(term);
  };

  return (
    <>
      {/* xl+: search pill with an animated border beam */}
      <BorderBeam
        // "md" (full rotating border) — the bottom-only "line" beam barely shows on white.
        size="md"
        theme="light"
        colorVariant="colorful"
        duration={3.1}
        borderRadius={20}
        // The light theme is subtle on a white header; boost it so the beam reads.
        brightness={1.9}
        saturation={1.8}
        glowSize={1.3}
        active={!reduceMotion}
        className={cn("hidden xl:block", className)}
      >
        <button
          type="button"
          onClick={openDialog}
          aria-label="Search SearchUnify"
          aria-haspopup="dialog"
          className="group inline-flex h-10 w-56 items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 pl-4 pr-2 text-slate-500 transition-colors hover:border-slate-300 hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005be2]/40"
        >
          <Search className="size-[18px] shrink-0" />
          <span className="flex-1 text-left text-sm">Search…</span>
          <kbd className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 font-sans text-[11px] font-medium text-slate-400">
            Ctrl K
          </kbd>
        </button>
      </BorderBeam>

      {/* Below xl: icon-only trigger */}
      <button
        type="button"
        onClick={openDialog}
        aria-label="Search SearchUnify"
        aria-haspopup="dialog"
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-900/5 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005be2]/40 xl:hidden",
          className,
        )}
      >
        <Search className="size-[18px] shrink-0" />
      </button>

      {/* Portalled to <body>: the header's backdrop-blur would otherwise trap
          this fixed overlay inside the header box. */}
      {open && createPortal(
        <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]">
          <div
            aria-hidden="true"
            onClick={close}
            className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm animate-in fade-in-0 duration-200"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search SearchUnify"
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
          >
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                go(query);
              }}
              className="flex items-center gap-3 border-b border-slate-100 px-5"
            >
              <Search className="size-5 shrink-0 text-[#005be2]" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search agents, products, docs and resources…"
                aria-label="Search query"
                className="h-16 flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 [&::-webkit-search-cancel-button]:hidden"
              />
              {query ? (
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full bg-cta px-3 py-1.5 text-xs font-semibold text-cta-foreground hover:bg-cta-hover"
                >
                  Search <CornerDownLeft className="size-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close search"
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="size-4" />
                </button>
              )}
            </form>

            <div className="px-5 py-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Popular searches
              </p>
              <ul className="flex flex-wrap gap-2">
                {POPULAR.map((term) => (
                  <li key={term}>
                    <button
                      type="button"
                      onClick={() => go(term)}
                      className="group/chip inline-flex items-center gap-1 rounded-full border border-slate-200 px-3.5 py-1.5 text-sm text-slate-700 transition-colors hover:border-[#005be2]/40 hover:bg-[#005be2]/5 hover:text-[#005be2]"
                    >
                      {term}
                      <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover/chip:opacity-100" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-5 py-2.5 text-xs text-slate-400">
              <span>Results open in the SearchUnify Resource Center</span>
              <span className="hidden sm:inline">
                <kbd className="rounded border border-slate-200 bg-white px-1 font-sans">Esc</kbd> to close
              </span>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
