"use client";

import { DEMO_HREF, siteSearchUrl } from "@/lib/nav-data";
import { SECTION_SUMMARIES, type SectionSummary } from "@/lib/section-summaries";
import { cn } from "@/lib/utils";
import { ArrowUp, BookOpenText, CornerDownRight, Hash, MoveRight, Search, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

// Page assistant, in the spirit of the side-panel agents on salesforce.com.
// Hovering anywhere in a section shows a small "Summarize this section" tip;
// clicking it opens a chat panel on the right with a streamed summary, the full
// section text, and questions answered from the section's own text.
//
// There is no model behind this: summaries are pre-written
// (lib/section-summaries) and questions are answered by keyword retrieval over
// the text actually on the page, so every answer is quoted, never invented.

type Snippet = { text: string; sectionId: string };
type Message =
  | { id: number; kind: "user"; text: string }
  | { id: number; kind: "summary"; section: SectionSummary }
  | { id: number; kind: "full"; section: SectionSummary; lines: string[] }
  | { id: number; kind: "answer"; query: string; snippets: Snippet[]; terms: string[] };

type Registered = { section: SectionSummary; el: HTMLElement };

const ease = [0.22, 1, 0.36, 1] as const;
const HEADER_OFFSET = 96; // keep the tip below the fixed site header
const PANEL_WIDTH = 420;

/* ------------------------------------------------------------- retrieval */

const STOP = new Set(
  "the a an and or of to in on for with is are was were what how why who which does do did this that these those it its by from as at be about can could you your me my i we our us tell show give more please there their they".split(
    " ",
  ),
);

function readLines(el: HTMLElement): string[] {
  const out: string[] = [];
  for (const raw of el.innerText.split("\n")) {
    const line = raw.replace(/\s+/g, " ").trim();
    if (line.length < 3) continue;
    for (const part of line.split(/(?<=[.!?])\s+(?=[A-Z0-9])/)) {
      if (part.length > 2 && !out.includes(part)) out.push(part);
    }
  }
  return out;
}

function queryTerms(q: string) {
  return (q.toLowerCase().match(/[a-z0-9%$.™]+/g) ?? [])
    .map((w) => w.replace(/^\.+|\.+$/g, ""))
    .filter((w) => w.length > 1 && !STOP.has(w));
}

function retrieve(q: string, pool: Registered[]): { snippets: Snippet[]; terms: string[] } {
  const terms = queryTerms(q);
  if (!terms.length) return { snippets: [], terms };
  const scored: (Snippet & { score: number })[] = [];
  for (const { section, el } of pool) {
    for (const text of readLines(el)) {
      const low = text.toLowerCase();
      let score = 0;
      for (const t of terms) {
        const stem = t.length > 4 && t.endsWith("s") ? t.slice(0, -1) : t;
        if (low.includes(stem)) score += stem.length > 4 ? 2 : 1;
      }
      if (score) scored.push({ text, sectionId: section.id, score });
    }
  }
  scored.sort((a, b) => b.score - a.score || a.text.length - b.text.length);
  return { snippets: scored.slice(0, 4), terms };
}

function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (!terms.length) return <>{text}</>;
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return (
    <>
      {text.split(re).map((part, i) =>
        i % 2 ? (
          <mark key={i} className="rounded bg-[#005be2]/10 px-0.5 text-[#0b3aa8]">
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/* ------------------------------------------------------------- assistant */

export function SectionAssistant() {
  const [regs, setRegs] = useState<Registered[]>([]);
  const [hover, setHover] = useState<{ id: string; top: number } | null>(null);
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const nextId = useRef(1);
  const tipRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  // Find each section and track which one the pointer is over.
  useEffect(() => {
    const list = SECTION_SUMMARIES.flatMap((section) => {
      const el = document.getElementById(section.id)?.closest("section");
      return el ? [{ section, el: el as HTMLElement }] : [];
    });
    setRegs(list);
    if (!window.matchMedia("(hover: hover)").matches) return;

    let raf = 0;
    let point: { x: number; y: number } | null = null;
    const update = () => {
      if (!point) return;
      const target = document.elementFromPoint(point.x, point.y);
      if (!target || tipRef.current?.contains(target)) return;
      const hit = list.find((r) => r.el.contains(target));
      if (!hit) return setHover(null);
      const r = hit.el.getBoundingClientRect();
      const top = Math.round(Math.max(HEADER_OFFSET, Math.min(r.top + 28, r.bottom - 64)));
      setHover((h) => (h?.id === hit.section.id && h.top === top ? h : { id: hit.section.id, top }));
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    const onMove = (e: PointerEvent) => {
      point = { x: e.clientX, y: e.clientY };
      schedule();
    };
    const onLeave = () => {
      point = null;
      setHover(null);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", schedule);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const push = useCallback((...m: Omit<Message, "id">[]) => {
    setMessages((prev) => [...prev, ...m.map((x) => ({ ...x, id: nextId.current++ }) as Message)]);
  }, []);

  const openPanel = useCallback(() => {
    if (!open) returnFocus.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, [open]);

  const summarize = useCallback(
    (section: SectionSummary) => {
      openPanel();
      setContext(section.id);
      push({ kind: "user", text: `Summarize "${section.title}"` }, { kind: "summary", section });
    },
    [openPanel, push],
  );

  const readFull = useCallback(
    (section: SectionSummary) => {
      const reg = regs.find((r) => r.section.id === section.id);
      if (!reg) return;
      push({ kind: "user", text: `Read the full "${section.title}" section` }, { kind: "full", section, lines: readLines(reg.el) });
    },
    [regs, push],
  );

  const ask = useCallback(
    (q: string) => {
      const pool = context ? regs.filter((r) => r.section.id === context) : regs;
      const { snippets, terms } = retrieve(q, pool);
      push({ kind: "user", text: q }, { kind: "answer", query: q, snippets, terms });
    },
    [context, regs, push],
  );

  // Lines from the current section that carry a figure (%, $, counts, years).
  const keyNumbers = useCallback(() => {
    const reg = regs.find((r) => r.section.id === context);
    if (!reg) return;
    const snippets = readLines(reg.el)
      .filter((l) => /\d/.test(l) && l.length > 6)
      .slice(0, 6)
      .map((text) => ({ text, sectionId: reg.section.id }));
    push(
      { kind: "user", text: `Key numbers in "${reg.section.title}"` },
      { kind: "answer", query: reg.section.title, snippets, terms: [] },
    );
  }, [context, regs, push]);

  const close = useCallback(() => {
    setOpen(false);
    returnFocus.current?.focus();
    returnFocus.current = null;
  }, []);

  const hovered = hover && SECTION_SUMMARIES.find((s) => s.id === hover.id);

  return (
    <>
      {/* Hover tip */}
      <AnimatePresence>
        {hover && hovered && (
          <motion.button
            ref={tipRef}
            type="button"
            onClick={() => summarize(hovered)}
            initial={{ opacity: 0, scale: 0.9, top: hover.top, right: open ? PANEL_WIDTH + 36 : 24 }}
            animate={{ opacity: 1, scale: 1, top: hover.top, right: open ? PANEL_WIDTH + 36 : 24 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            aria-label={`Summarize the ${hovered.title} section`}
            className="fixed z-[65] hidden items-center gap-1.5 rounded-full bg-slate-950/90 py-1.5 pl-1.5 pr-3.5 text-xs font-semibold text-white shadow-[0_12px_32px_-10px_rgba(0,91,226,0.6)] ring-1 ring-white/10 backdrop-blur transition-colors hover:bg-[#005be2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005be2]/60 md:flex"
          >
            <span className="grid size-6 place-items-center rounded-full bg-gradient-to-br from-[#005be2] via-[#06b6d4] to-[#ff7400]">
              <Sparkles className="size-3.5" />
            </span>
            Summarize this section
          </motion.button>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            onClick={openPanel}
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ duration: 0.25, ease }}
            className="fixed bottom-24 right-6 z-[60] flex items-center gap-2 rounded-full bg-slate-950 py-3 pl-4 pr-5 text-sm font-semibold text-white shadow-[0_16px_40px_-12px_rgba(0,91,226,0.6)] ring-1 ring-white/10 transition-colors hover:bg-[#005be2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005be2]/60"
          >
            <span className="grid size-6 place-items-center rounded-full bg-gradient-to-br from-[#005be2] via-[#06b6d4] to-[#ff7400]">
              <Sparkles className="size-3.5" />
            </span>
            Ask AI
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <Panel
            messages={messages}
            context={SECTION_SUMMARIES.find((s) => s.id === context) ?? null}
            onClearContext={() => setContext(null)}
            onSummarize={summarize}
            onReadFull={readFull}
            onAsk={ask}
            onKeyNumbers={keyNumbers}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ----------------------------------------------------------------- panel */

function Panel({
  messages,
  context,
  onClearContext,
  onSummarize,
  onReadFull,
  onAsk,
  onKeyNumbers,
  onClose,
}: {
  messages: Message[];
  context: SectionSummary | null;
  onClearContext: () => void;
  onSummarize: (s: SectionSummary) => void;
  onReadFull: (s: SectionSummary) => void;
  onAsk: (q: string) => void;
  onKeyNumbers: () => void;
  onClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const summarized = new Set(messages.flatMap((m) => (m.kind === "summary" ? [m.section.id] : [])));
  const others = SECTION_SUMMARIES.filter((s) => !summarized.has(s.id));

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const scrollToEnd = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, []);
  useEffect(scrollToEnd, [messages.length, scrollToEnd]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    onAsk(q);
    setQuery("");
  };

  return (
    <motion.aside
      role="dialog"
      aria-modal="false"
      aria-label="SearchUnify AI assistant"
      initial={{ x: "110%", opacity: 0.6 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "110%", opacity: 0.6 }}
      transition={{ type: "spring", stiffness: 260, damping: 32 }}
      style={{ width: `min(${PANEL_WIDTH}px, calc(100vw - 1.5rem))` }}
      className="fixed inset-y-3 right-3 z-[70] flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_40px_100px_-30px_rgba(5,11,31,0.55)] ring-1 ring-slate-200"
    >
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#005be2] via-[#0a6cf0] to-[#06b6d4] px-5 py-4 text-white">
        <div aria-hidden="true" className="absolute -right-10 -top-10 size-40 rounded-full bg-[#ff7400] opacity-30 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
            <Sparkles className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold leading-tight">SearchUnify AI</p>
            <p className="truncate text-xs text-white/75">{context ? `Reading: ${context.title}` : "Ask about anything on this page"}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant"
            className="grid size-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Conversation */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-slate-50 px-4 py-5" aria-live="polite">
        <Bubble from="assistant">
          Hi! Hover any section and choose <b className="font-semibold text-slate-900">Summarize this section</b>. Then read
          the whole section or ask me anything about it.
        </Bubble>

        {messages.map((m) => {
          if (m.kind === "user") return <Bubble key={m.id} from="user">{m.text}</Bubble>;
          if (m.kind === "summary") return <SummaryMessage key={m.id} section={m.section} onProgress={scrollToEnd} onClose={onClose} />;
          if (m.kind === "full") return <FullMessage key={m.id} section={m.section} lines={m.lines} />;
          return <AnswerMessage key={m.id} query={m.query} snippets={m.snippets} terms={m.terms} onClose={onClose} />;
        })}

        {!messages.length && (
          <SectionChips label="Sections on this page" sections={SECTION_SUMMARIES} onPick={onSummarize} />
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-slate-200 bg-white p-3">
        {context && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            <QuickAction icon={BookOpenText} onClick={() => onReadFull(context)}>
              Read full section
            </QuickAction>
            <QuickAction icon={Hash} onClick={onKeyNumbers}>
              Key numbers
            </QuickAction>
            {others.length > 0 && (
              <QuickAction icon={Sparkles} onClick={() => onSummarize(others[0])}>
                Next: {others[0].title}
              </QuickAction>
            )}
          </div>
        )}

        <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-slate-50 p-1.5 focus-within:border-[#005be2]/50 focus-within:ring-2 focus-within:ring-[#005be2]/15">
          {context && (
            <span className="mb-1 ml-1 inline-flex max-w-full items-center gap-1 rounded-full bg-[#005be2]/10 py-0.5 pl-2 pr-1 text-[11px] font-semibold text-[#005be2]">
              <span className="truncate">About: {context.title}</span>
              <button
                type="button"
                onClick={onClearContext}
                aria-label="Ask about the whole page instead"
                className="grid size-4 place-items-center rounded-full hover:bg-[#005be2]/15"
              >
                <X className="size-3" />
              </button>
            </span>
          )}
          <div className="flex items-center gap-2 pl-2.5">
            <label htmlFor="assistant-input" className="sr-only">
              Ask a question
            </label>
            <input
              ref={inputRef}
              id="assistant-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={context ? "Ask about this section…" : "Ask about this page…"}
              className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Ask"
              disabled={!query.trim()}
              className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-950 text-white transition-colors hover:bg-[#005be2] disabled:bg-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005be2]/50"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </form>

        <div className="mt-2 flex items-center justify-between gap-3 px-1 text-[11px] text-slate-400">
          <span>Answers quote this page.</span>
          <Link href={DEMO_HREF} className="group inline-flex items-center gap-1 font-semibold text-link hover:underline">
            Book a Demo <MoveRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.aside>
  );
}

/* -------------------------------------------------------------- messages */

function Bubble({ from, children }: { from: "user" | "assistant"; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease }}
      className={cn(
        "max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
        from === "user" ? "ml-auto rounded-br-md bg-slate-950 text-white" : "rounded-bl-md bg-white text-slate-600 shadow-sm ring-1 ring-slate-200",
      )}
    >
      {children}
    </motion.div>
  );
}

function Card({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease }}
      className="max-w-[94%] rounded-2xl rounded-bl-md bg-white p-4 text-sm leading-relaxed text-slate-700 shadow-sm ring-1 ring-slate-200"
    >
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#005be2]">{label}</p>
      {children}
    </motion.div>
  );
}

function jumpTo(id: string, onClose: () => void) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
  if (window.innerWidth < 768) onClose();
}

/* Short "thinking" beat, then the summary streams in, then key points. */
function SummaryMessage({ section, onProgress, onClose }: { section: SectionSummary; onProgress: () => void; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const words = section.summary.split(" ");
  const [thinking, setThinking] = useState(!reduceMotion);
  const [shown, setShown] = useState(reduceMotion ? words.length : 0);
  const done = shown >= words.length;

  useEffect(() => {
    if (!thinking) return;
    const t = setTimeout(() => setThinking(false), 650);
    return () => clearTimeout(t);
  }, [thinking]);

  useEffect(() => {
    if (thinking || done) return;
    const t = setTimeout(() => setShown((n) => Math.min(words.length, n + 2)), 45);
    return () => clearTimeout(t);
  }, [thinking, done, shown, words.length]);

  useEffect(onProgress, [thinking, shown, done, onProgress]);

  return (
    <Card
      label={
        <>
          <Sparkles className="size-3" /> Summary · {section.title}
        </>
      }
    >
      {thinking ? (
        <Dots />
      ) : (
        <>
          <p>
            {words.slice(0, shown).join(" ")}
            {!done && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse rounded-sm bg-[#005be2] align-middle" />}
          </p>
          {done && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }}>
              <ul className="mt-3 space-y-1.5">
                {section.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gradient-to-br from-[#005be2] to-[#06b6d4]" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <JumpLink onClick={() => jumpTo(section.id, onClose)} />
            </motion.div>
          )}
        </>
      )}
    </Card>
  );
}

function FullMessage({ section, lines }: { section: SectionSummary; lines: string[] }) {
  return (
    <Card
      label={
        <>
          <BookOpenText className="size-3" /> Full text · {section.title}
        </>
      }
    >
      <div className="max-h-80 space-y-1.5 overflow-y-auto pr-1 text-[13px] text-slate-600">
        {lines.map((l, i) => (
          <p key={i}>{l}</p>
        ))}
      </div>
    </Card>
  );
}

function AnswerMessage({ query, snippets, terms, onClose }: { query: string; snippets: Snippet[]; terms: string[]; onClose: () => void }) {
  const title = (id: string) => SECTION_SUMMARIES.find((s) => s.id === id)?.title ?? "";
  return (
    <Card
      label={
        <>
          <Search className="size-3" /> {snippets.length ? "From this page" : "Not on this page"}
        </>
      }
    >
      {snippets.length ? (
        <ul className="space-y-2.5">
          {snippets.map((s, i) => (
            <li key={i} className="border-l-2 border-[#005be2]/30 pl-3">
              <p className="text-[13px] text-slate-700">
                <Highlight text={s.text} terms={terms} />
              </p>
              <button
                type="button"
                onClick={() => jumpTo(s.sectionId, onClose)}
                className="mt-1 text-[11px] font-semibold text-slate-400 hover:text-[#005be2] hover:underline"
              >
                {title(s.sectionId)} →
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>I couldn&apos;t find that in this section.</p>
      )}
      <a
        href={siteSearchUrl(query)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#005be2] hover:underline"
      >
        <Search className="size-3.5" /> Search searchunify.com for “{query}”
      </a>
    </Card>
  );
}

function SectionChips({ label, sections, onPick }: { label: string; sections: SectionSummary[]; onPick: (s: SectionSummary) => void }) {
  return (
    <div>
      <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onPick(s)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-left text-xs font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:border-[#005be2]/40 hover:text-[#005be2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005be2]/50"
          >
            {s.title}
          </button>
        ))}
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, onClick, children }: { icon: typeof Sparkles; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-colors hover:border-[#005be2]/40 hover:text-[#005be2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005be2]/50"
    >
      <Icon className="size-3 shrink-0" />
      <span className="truncate">{children}</span>
    </button>
  );
}

function JumpLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#005be2] hover:underline focus-visible:outline-none focus-visible:underline"
    >
      <CornerDownRight className="size-3.5" /> Jump to this section
    </button>
  );
}

function Dots() {
  return (
    <span className="flex items-center gap-1 py-1" aria-label="Thinking">
      {[0, 1, 2].map((d) => (
        <motion.span
          key={d}
          className="size-1.5 rounded-full bg-[#005be2]/60"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.12 }}
        />
      ))}
    </span>
  );
}
