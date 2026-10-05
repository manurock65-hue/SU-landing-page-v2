"use client";

import { Button } from "@/components/ui/button";
import { DEMO_HREF } from "@/lib/nav-data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type Ref } from "react";
import s from "./harness-stack.module.css";

// "AI Agents harnessed for resolution." A pinned, scroll-driven section: the
// left column steps through the eight harness components while the matching
// isometric layer slides to the centre of the stack on the right. Structure
// and motion follow griffin.com's bank-platform section (sticky panel + one
// rAF loop, no animation library); content mirrors the live site verbatim.

type Step = {
  id: string;
  title: string;
  heading: string;
  description: string;
  accent: string;
  // Sub-items from the live site, shown as call-outs on the layer. "\n" wraps.
  labels: string[];
};

const STEPS: Step[] = [
  {
    id: "channels",
    title: "Every Channel",
    heading: "One brain, consistent answers",
    description:
      "Every channel reaches the same harness. Portal, chat, email, voice, in-product and the agent desk get one consistent answer.",
    accent: "#38bdf8",
    labels: ["Portal", "Chat", "Email", "Voice", "In-product", "Agent desk"],
  },
  {
    id: "agents",
    title: "Purpose-built AI Agents",
    heading: "Not one mega-bot",
    description:
      "Six agent types, each scoped to a well-defined support job: L1 and L2 support, rep assist, escalation, knowledge and case quality.",
    accent: "#22d3ee",
    labels: ["L1 Support", "L2 Trouble-\nshooting", "Agent Partner", "Escalation", "Knowledge", "Case Quality"],
  },
  {
    id: "orchestration",
    title: "Orchestration & Governance",
    heading: "Plan, retrieve, act, verify",
    description:
      "Every agent run is planned, retrieved, acted and verified, with guardrails, human-in-the-loop checkpoints, evals and a full audit trail.",
    accent: "#818cf8",
    labels: ["Workflow builder", "Guardrails", "Human in\nthe loop", "Evals", "Audit trail"],
  },
  {
    id: "retrieval",
    title: "Retrieval",
    heading: "Agentic RAG, the right index for each question",
    description:
      "Lexical, dense, graph and SQL retrieval, pulled from community too, with a sufficiency check before an agent ever acts on it.",
    accent: "#34d399",
    labels: ["Lexical", "Dense", "Graph", "SQL", "Community", "Sufficiency\ncheck"],
  },
  {
    id: "actions",
    title: "Actions & Tools",
    heading: "Answers become outcomes",
    description:
      "MCP tools, skills and agent-to-agent handoff reach into ticketing, entitlements and billing to actually close the loop.",
    accent: "#fbbf24",
    labels: ["MCP tools", "Skills", "Agent-to-agent", "Ticketing", "Entitlements", "Billing"],
  },
  {
    id: "knowledge",
    title: "Agent-ready Knowledge",
    heading: "Written for machines, not just people",
    description:
      "Knowledge gets cleaned, deduplicated and kept fresh, with resolved cases turned into articles and gaps flagged before a customer hits them.",
    accent: "#60a5fa",
    labels: ["Cleanup and\ndedupe", "Knowledge\nfrom cases", "Freshness", "Versions and\nentitlements", "Gap detection"],
  },
  {
    id: "data",
    title: "Connected Data",
    heading: "Permission-aware, no copy-and-hope",
    description:
      "The harness reads knowledge, cases, community, docs, CRM and telemetry in place, with the same permissions your team already has.",
    accent: "#2dd4bf",
    labels: ["Knowledge base", "Cases", "Community", "Product docs", "CRM", "Telemetry"],
  },
  {
    id: "models",
    title: "Any Model",
    heading: "Swappable, and not where the results come from",
    description:
      "Every vendor runs the same models. Swap the model underneath without changing where the results come from.",
    accent: "#a78bfa",
    labels: ["GPT", "Claude", "Gemini", "Open-weight"],
  },
];

const N = STEPS.length;

// Scroll budget, in viewport heights: the intro holds for INTRO, each step
// gets STEP, and the final 1 is the pinned panel itself.
const INTRO = 0.4;
const STEP = 0.6;
const RUNWAY = INTRO + STEP * N + 1;
const BEAM_FADE_PX = 200;

// ── Isometric geometry ──────────────────────────────────────────────────────
const CX = 360;
const CY = 280;
const W = 190; // half-width of a tile's top face
const H = 110; // half-height
const T = 14; // slab thickness

// Maps a 100×100 "face" space onto the tile's top diamond, so layer art can
// be drawn as flat rects/circles/text and comes out isometric.
const FACE = `matrix(${W / 100} ${H / 100} ${-W / 100} ${H / 100} ${CX} ${CY - H})`;
const face = (u: number, v: number) => ({ x: CX + ((u - v) * W) / 100, y: CY + ((u + v - 100) * H) / 100 });

// Vertical offset of a layer for a given active layer (null = resting stack).
function layerOffset(layer: number, active: number | null) {
  if (active === null) return 46 * (layer - (N - 1) / 2);
  if (layer === active) return 0;
  const d = layer - active;
  return Math.sign(d) * (300 + 34 * (Math.abs(d) - 1));
}

export function HarnessStack() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const beamRef = useRef({ start: 0, lineHeight: 1 });
  const progressRef = useRef(0);
  const indexRef = useRef(0);
  // 0 = intro, 1..N = steps.
  const [index, setIndex] = useState(0);

  const updateBeam = useCallback(() => {
    const track = trackRef.current;
    const i = indexRef.current;
    if (!track || i === 0) return;
    const { start, lineHeight } = beamRef.current;
    const p = progressRef.current;
    const first = i === 1;
    const last = i === N;
    // First step grows from the marker down, the last from the top to the
    // marker; steps in between sweep the whole line.
    const end = first ? start + (1 - start) * p : last ? start * p : p;
    const opacity = first ? 1 : Math.min(1, (end * lineHeight) / 100);
    track.style.setProperty("--beam-fade-start", String(first ? start : 0));
    track.style.setProperty("--beam-fade-top-px", first ? "0px" : `${BEAM_FADE_PX}px`);
    track.style.setProperty("--beam-end", String(end));
    track.style.setProperty("--beam-opacity", String(opacity));
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // The SVG paints layers bottom-up, so DOM order is the reverse of STEPS.
    const layers = Array.from(root.querySelectorAll<SVGGElement>("[data-layer]")).reverse();
    let raf = 0;
    let running = false;
    let current = -1;

    const tick = () => {
      const vh = window.innerHeight;
      const scrolled = -root.getBoundingClientRect().top;
      const intro = INTRO * vh;
      const l = (scrolled - intro) / (STEP * vh);
      let next = 0;
      let progress = 0;
      if (scrolled >= intro) {
        next = Math.min(1 + Math.floor(l), N);
        progress = Math.max(0, Math.min(1, l - Math.floor(l)));
      }
      progressRef.current = progress;
      if (next !== current) {
        current = next;
        setIndex(next);
      }
      updateBeam();

      // Layers are scrubbed half a step ahead, so each one is centred
      // mid-step and the hand-off straddles the point where the text swaps.
      const t = Math.max(0, Math.min(N, l + 0.5));
      const seg = Math.min(Math.floor(t), N - 1);
      const a = t - seg;
      const from = seg === 0 ? null : seg - 1;
      layers.forEach((g, i) => {
        const y0 = layerOffset(i, from);
        const y = y0 + (layerOffset(i, seg) - y0) * a;
        g.setAttribute("transform", `translate(0, ${y})`);
      });
    };

    const loop = () => {
      tick();
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        loop();
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
        tick();
      }
    });
    io.observe(root);
    tick();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [updateBeam]);

  // Where the active marker sits on the line, as a fraction of its height.
  useLayoutEffect(() => {
    indexRef.current = index;
    if (index === 0) return;
    const measure = () => {
      const track = trackRef.current;
      const marker = markerRef.current;
      if (!track || !marker) return;
      const tr = track.getBoundingClientRect();
      if (tr.height === 0) return;
      const mr = marker.getBoundingClientRect();
      beamRef.current = { start: (mr.top + mr.height / 2 - tr.top) / tr.height, lineHeight: tr.height };
      updateBeam();
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [index, updateBeam]);

  const step = index === 0 ? null : STEPS[index - 1];

  return (
    <section aria-labelledby="arch-heading" className={s.root}>
      <h2 id="arch-heading" className="sr-only">
        AI Agents harnessed for resolution.
      </h2>
      <div ref={rootRef} style={{ height: `${RUNWAY * 100}dvh` }}>
        <div className={s.sticky}>
          <div className={s.layout}>
            <div className={s.content}>
              {step && (
                <div
                  ref={trackRef}
                  className={s.stepTrack}
                  style={{ "--beam-fade-px": `${BEAM_FADE_PX}px`, "--beam-color": step.accent } as React.CSSProperties}
                />
              )}
              <div className={cn(s.stepNav, s.prevNav)}>
                <StepNav from={1} to={index - 1} variant="prev" />
              </div>
              <div key={index} className={s.stepPanel}>
                {step ? (
                  <>
                    <h3 className={s.panelHeader}>
                      <StepItem index={index} title={step.title} active accent={step.accent} markerRef={markerRef} />
                      <span className="sr-only">: </span>
                      <span className={s.heading}>{step.heading}</span>
                    </h3>
                    <p className={s.description}>{step.description}</p>
                    {index === N && (
                      <Button asChild variant="cta" size="lg" className={cn(s.cta, "rounded-full px-6")}>
                        <Link href={DEMO_HREF}>Request a demo</Link>
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <p aria-hidden="true" className={s.introHeading}>
                      AI Agents harnessed for <em>resolution.</em>
                    </p>
                    <p className={s.description}>
                      Every vendor runs the same models. SearchUnify is the harness around them: the knowledge,
                      retrieval, orchestration and governance that make agents resolve cases instead of deflecting
                      them.
                    </p>
                  </>
                )}
              </div>
              <div className={cn(s.stepNav, s.nextNav)}>
                <StepNav from={index + 1} to={N} variant="next" />
              </div>
            </div>
            <div className={s.visual}>
              <Stack active={step ? index - 1 : null} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepItem({
  index,
  title,
  active,
  accent,
  markerRef,
  className,
}: {
  index: number;
  title: string;
  active?: boolean;
  accent?: string;
  markerRef?: Ref<HTMLSpanElement>;
  className?: string;
}) {
  return (
    <span className={cn(s.stepItem, active && s.stepItemActive, className)}>
      <span
        ref={markerRef}
        className={cn(s.marker, active && s.markerActive)}
        style={accent ? ({ "--hs-marker-color": accent } as React.CSSProperties) : undefined}
      />
      <span className={s.stepItemContent}>
        <span aria-hidden="true">{String(index).padStart(2, "0")}</span>
        <span>{title}</span>
      </span>
    </span>
  );
}

function StepNav({ from, to, variant }: { from: number; to: number; variant: "prev" | "next" }) {
  if (to < from) return null;
  return (
    <div className={cn(s.navList, variant === "prev" ? s.navPrev : s.navNext)}>
      {STEPS.slice(from - 1, to).map((st, i) => (
        <StepItem key={st.id} index={from + i} title={st.title} />
      ))}
    </div>
  );
}

// ── The stack ───────────────────────────────────────────────────────────────

function Stack({ active }: { active: number | null }) {
  return (
    <svg
      className={s.stackSvg}
      viewBox="-60 0 840 560"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="The SearchUnify harness, layer by layer"
    >
      {/* Rendered bottom-up so upper layers paint over the ones beneath. */}
      {STEPS.map((st, i) => (
        <g
          key={st.id}
          data-layer={st.id}
          data-state={active === null ? "all" : active === i ? "active" : "inactive"}
          className={s.stackLayer}
          style={{ "--hs-accent-on": st.accent } as React.CSSProperties}
          transform={`translate(0, ${layerOffset(i, null)})`}
        >
          <g className={s.layerArt}>
            <Slab />
            <g transform={FACE}>{ART[st.id]}</g>
          </g>
          <Annotations labels={st.labels} accent={st.accent} />
        </g>
      )).reverse()}
    </svg>
  );
}

const SURFACE = "#070e24";
const PANEL = "#02050f";
const STROKE = "var(--hs-stroke)";
const NS = "non-scaling-stroke" as const;

function Slab() {
  const top = `${CX},${CY - H} ${CX + W},${CY} ${CX},${CY + H} ${CX - W},${CY}`;
  const left = `${CX - W},${CY} ${CX},${CY + H} ${CX},${CY + H + T} ${CX - W},${CY + T}`;
  const right = `${CX},${CY + H} ${CX + W},${CY} ${CX + W},${CY + T} ${CX},${CY + H + T}`;
  return (
    <>
      <polygon points={left} fill={PANEL} stroke={STROKE} vectorEffect={NS} />
      <polygon points={right} fill={PANEL} stroke={STROKE} vectorEffect={NS} />
      <polygon points={top} fill={SURFACE} stroke={STROKE} vectorEffect={NS} />
    </>
  );
}

// Call-out slots around the tile: where the label sits, and the point on the
// face (in face units) its leader line lands on.
const SLOTS: { side: "l" | "r"; x: number; y: number; u: number; v: number; up?: boolean }[] = [
  { side: "l", x: 150, y: 118, u: 12, v: 56 },
  { side: "r", x: 572, y: 150, u: 56, v: 12 },
  { side: "l", x: 122, y: 233, u: 30, v: 92 },
  { side: "r", x: 600, y: 233, u: 92, v: 30 },
  { side: "l", x: 150, y: 470, u: 72, v: 96, up: true },
  { side: "r", x: 572, y: 470, u: 96, v: 72, up: true },
];
const CHAR_W = 9.25; // mono advance at 14px + letter-spacing
const ISO = H / W;

function Annotations({ labels, accent }: { labels: string[]; accent: string }) {
  return (
    <g className={s.layerAnnotations}>
      {labels.map((label, i) => {
        const slot = SLOTS[i];
        const lines = label.toUpperCase().split("\n");
        const width = Math.max(...lines.map((l) => l.length)) * CHAR_W;
        const target = face(slot.u, slot.v);
        const elbowY = slot.y + (slot.up ? -1 : 1) * Math.abs(target.x - slot.x) * ISO;
        const left = slot.side === "l";
        const textX = left ? slot.x - 10 - width : slot.x + 14;
        const dotX = left ? textX - 14 : slot.x;
        return (
          <g key={label}>
            <path
              d={`M${slot.x} ${slot.y}L${target.x} ${elbowY}L${target.x} ${target.y}`}
              fill="none"
              stroke="#64748b"
              pathLength={1}
              vectorEffect={NS}
            />
            <circle cx={dotX} cy={slot.y} r={4} fill={accent} />
            <text x={textX} y={slot.y + 5}>
              {lines.map((l, j) => (
                <tspan key={l} x={textX} dy={j === 0 ? 0 : 18}>
                  {l}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </g>
  );
}

// ── Layer art, drawn flat in 100×100 face units ────────────────────────────

function Box({
  x,
  y,
  w,
  h,
  r = 0,
  solid,
  dashed,
  accent,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  solid?: boolean;
  dashed?: boolean;
  accent?: boolean;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={r}
      fill={solid ? PANEL : "none"}
      stroke={accent ? "var(--hs-accent)" : STROKE}
      strokeDasharray={dashed ? "3 3" : undefined}
      vectorEffect={NS}
    />
  );
}

function Ln({ d, accent, dashed }: { d: string; accent?: boolean; dashed?: boolean }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={accent ? "var(--hs-accent)" : STROKE}
      strokeDasharray={dashed ? "3 3" : undefined}
      vectorEffect={NS}
    />
  );
}

function Bar({ x, y, w, h = 2.6, accent }: { x: number; y: number; w: number; h?: number; accent?: boolean }) {
  return <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={accent ? "var(--hs-accent)" : "var(--hs-fill)"} />;
}

function Txt({
  x,
  y,
  size = 3.8,
  middle,
  children,
}: {
  x: number;
  y: number;
  size?: number;
  middle?: boolean;
  children: ReactNode;
}) {
  return (
    <text x={x} y={y} fontSize={size} fill="var(--hs-text)" textAnchor={middle ? "middle" : undefined}>
      {children}
    </text>
  );
}

const COLS = [9, 38, 67];

function ChannelsArt() {
  const names = ["PORTAL", "CHAT", "EMAIL", "VOICE", "IN-APP", "DESK"];
  return (
    <>
      <Box x={5} y={5} w={90} h={90} />
      {/* Hatched rail along the near edge. */}
      <Box x={5} y={80} w={90} h={15} />
      <Ln d={Array.from({ length: 22 }, (_, i) => `M${9 + i * 4} 80v15`).join("")} />
      {names.map((n, i) => {
        const x = COLS[i % 3];
        const y = i < 3 ? 9 : 44;
        return (
          <g key={n}>
            <Box x={x} y={y} w={24} h={31} solid accent={i === 0} />
            <Bar x={x + 3} y={y + 4} w={i % 2 ? 9 : 13} h={2} accent={i === 0} />
            <Txt x={x + 3} y={y + 27} size={3.5}>
              {n}
            </Txt>
          </g>
        );
      })}
    </>
  );
}

function AgentsArt() {
  const tags = ["L1", "L2", "AP", "ESC", "KN", "QA"];
  return (
    <>
      <Box x={5} y={5} w={90} h={90} dashed />
      {tags.map((t, i) => {
        const a = (i / 6) * Math.PI * 2;
        // Rounded so server and client render identical attributes.
        const x = Math.round((50 + 31 * Math.cos(a)) * 100) / 100;
        const y = Math.round((50 + 31 * Math.sin(a)) * 100) / 100;
        return (
          <g key={t}>
            <Ln d={`M50 50L${x} ${y}`} />
            <Box x={x - 9} y={y - 7} w={18} h={14} r={2} solid />
            <Txt x={x} y={y + 1.5} size={4} middle>
              {t}
            </Txt>
          </g>
        );
      })}
      <circle cx={50} cy={50} r={9} fill={PANEL} stroke="var(--hs-accent)" vectorEffect={NS} />
      <circle cx={50} cy={50} r={2.4} fill="var(--hs-accent)" />
    </>
  );
}

function OrchestrationArt() {
  const stages: [string, number, number][] = [
    ["PLAN", 8, 9],
    ["RETRIEVE", 56, 9],
    ["ACT", 56, 71],
    ["VERIFY", 8, 71],
  ];
  return (
    <>
      {stages.map(([name, x, y]) => (
        <g key={name}>
          <Box x={x} y={y} w={36} h={20} solid />
          <Txt x={x + 18} y={y + 11.5} middle>
            {name}
          </Txt>
        </g>
      ))}
      {/* The loop between stages, with arrowheads. */}
      <Ln d="M44 19h12m-3-2.5l3 2.5l-3 2.5M74 29v42m-2.5-3l2.5 3l2.5-3M56 81h-12m3-2.5l-3 2.5l3 2.5M26 71v-42m-2.5 3l2.5-3l2.5 3" />
      <Box x={34} y={39} w={32} h={22} r={2} dashed accent />
      <Bar x={39} y={45} w={22} accent />
      <Bar x={39} y={51} w={14} />
    </>
  );
}

function RetrievalArt() {
  const dots = [
    [58, 12], [66, 22], [74, 13], [83, 25], [62, 34], [72, 38], [88, 14], [80, 40], [90, 34], [70, 28],
  ];
  return (
    <>
      <Box x={5} y={5} w={90} h={90} />
      <Ln d="M50 5v90M5 50h90" />
      {/* Lexical */}
      {[30, 22, 34, 18, 27].map((w, i) => (
        <Bar key={i} x={10} y={11 + i * 7.5} w={w} accent={i === 2} />
      ))}
      {/* Dense */}
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.5} fill={i === 5 ? "var(--hs-accent)" : "var(--hs-fill)"} />
      ))}
      {/* Graph */}
      <Ln d="M14 62L28 72L16 86M28 72L42 60M28 72L40 88" />
      {[[14, 62], [28, 72], [16, 86], [42, 60], [40, 88]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.6} fill={PANEL} stroke={i === 1 ? "var(--hs-accent)" : STROKE} vectorEffect={NS} />
      ))}
      {/* SQL */}
      <Box x={57} y={57} w={32} h={32} solid />
      <Ln d="M57 65h32M57 73h32M57 81h32M68 57v32M79 57v32" />
    </>
  );
}

function ActionsArt() {
  const rows: number[][] = [
    [10, 34],
    [16, 52],
    [16, 22, 42, 30],
    [22, 44],
    [22, 18, 44, 36],
    [16, 58],
    [16, 26],
    [10, 40, 54, 24],
  ];
  return (
    <>
      <Txt x={10} y={10} size={4}>
        RUN: MCP
      </Txt>
      {rows.map((r, i) => (
        <g key={i}>
          <Bar x={r[0]} y={17 + i * 9.5} w={r[1]} h={3.4} accent={i === 2} />
          {r.length > 2 && <Bar x={r[2]} y={17 + i * 9.5} w={r[3]} h={3.4} />}
        </g>
      ))}
    </>
  );
}

function KnowledgeArt() {
  return (
    <>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = COLS[i % 3];
        const y = i < 3 ? 9 : 53;
        const gap = i === 5;
        return (
          <g key={i}>
            <Box x={x} y={y} w={24} h={38} solid={!gap} dashed={gap} accent={i === 1} />
            {!gap && (
              <>
                <Bar x={x + 3} y={y + 5} w={12} accent={i === 1} />
                <Bar x={x + 3} y={y + 12} w={18} h={1.8} />
                <Bar x={x + 3} y={y + 17} w={15} h={1.8} />
                <Bar x={x + 3} y={y + 22} w={18} h={1.8} />
                <Bar x={x + 3} y={y + 27} w={9} h={1.8} />
              </>
            )}
            {gap && <Ln d={`M${x + 12} ${y + 14}v10M${x + 7} ${y + 19}h10`} accent />}
          </g>
        );
      })}
    </>
  );
}

function DataArt() {
  const names = ["KB", "CASES", "COMMUNITY", "DOCS", "CRM", "TELEMETRY"];
  const xs = [20, 50, 80];
  return (
    <>
      <Ln d="M20 28h60M20 72h60M20 28v44M50 28v44M80 28v44" dashed />
      {names.map((n, i) => {
        const x = xs[i % 3];
        const y = i < 3 ? 28 : 72;
        return (
          <g key={n}>
            <circle cx={x} cy={y} r={11} fill={PANEL} stroke={STROKE} vectorEffect={NS} />
            <circle cx={x} cy={y} r={6} fill="none" stroke={i === 0 ? "var(--hs-accent)" : STROKE} vectorEffect={NS} />
            <circle cx={x} cy={y} r={1.6} fill={i === 0 ? "var(--hs-accent)" : "var(--hs-fill)"} />
            <Txt x={x} y={y + 17.5} size={3.3} middle>
              {n}
            </Txt>
          </g>
        );
      })}
    </>
  );
}

function ModelsArt() {
  const names = ["GPT", "CLAUDE", "GEMINI", "OPEN"];
  const bars = [3, 1.2, 4.5, 1.2, 2, 6, 1.2, 3, 1.2, 1.2, 5, 2, 1.2, 4, 1.2, 2.5, 6, 1.2, 2];
  let bx = 8;
  return (
    <>
      {names.map((n, i) => {
        const x = 8 + i * 22;
        return (
          <g key={n}>
            {/* Chip pins */}
            <Ln d={`M${x + 4} 8v4M${x + 9} 8v4M${x + 14} 8v4M${x + 4} 34v4M${x + 9} 34v4M${x + 14} 34v4`} />
            <Box x={x} y={12} w={18} h={22} r={1.5} solid dashed={i === 3} accent={i === 1} />
            <Txt x={x + 9} y={24.5} size={3.3} middle>
              {n}
            </Txt>
          </g>
        );
      })}
      {/* Socket grid: the slot stays, the model swaps. */}
      <Ln
        d={[0, 1, 2, 3, 4, 5, 6]
          .flatMap((c) => [0, 1].map((r) => `M${12 + c * 12.5} ${47 + r * 11}v6m-3-3h6`))
          .join("")}
      />
      {bars.map((w, i) => {
        const x = bx;
        bx += w + 1.6;
        return <rect key={i} x={x} y={74} width={w} height={16} fill="var(--hs-fill)" />;
      })}
    </>
  );
}

const ART: Record<string, ReactNode> = {
  channels: <ChannelsArt />,
  agents: <AgentsArt />,
  orchestration: <OrchestrationArt />,
  retrieval: <RetrievalArt />,
  actions: <ActionsArt />,
  knowledge: <KnowledgeArt />,
  data: <DataArt />,
  models: <ModelsArt />,
};
