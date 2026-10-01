"use client";

import { resourceCenter, SITE } from "@/lib/nav-data";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  BookOpen,
  FileSpreadsheet,
  LayoutGrid,
  MonitorPlay,
  MoveRight,
  NotebookPen,
  Play,
  Presentation,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";

// Chapter 9 — "Featured Resources". Tabs and items mirror the live site's
// resource rail; each tab lays its three picks out as a bento (one feature,
// two supporting) and the cards re-deal when the tab changes.
const RC = `${SITE}/resource-center`;
const IMG = "/assets/resources";

type Item = { type: string; title: string; description?: string; image: string; href: string; cta?: string };
type Tab = { name: string; icon: LucideIcon; more: string; items: Item[] };

const TABS: Tab[] = [
  {
    name: "All Resources",
    icon: LayoutGrid,
    more: `${RC}/`,
    items: [
      {
        type: "E-Book",
        title: "The AI Agent Adoption Playbook",
        description: "Struggling to future-proof your support strategy with the right solution?",
        image: `${IMG}/ai-agent-adoption-playbook.webp`,
        href: `${SITE}/pages-pdf/the-ai-agent-adoption-playbook.pdf`,
      },
      {
        type: "Blog",
        title: "Top 5 AI Agent Use Cases for Customer Support",
        description: "From routine queries to complex escalations—support teams are…",
        image: `${IMG}/top-5-ai-agent-use-cases.webp`,
        href: `${RC}/blog/top-ai-agents-for-customer-service-5-proven-to-elevate-support-self-service/`,
      },
      {
        type: "Whitepaper",
        title: "SearchUnify's Governance Layer",
        image: `${IMG}/governance-layer.webp`,
        href: `${SITE}/pages-pdf/searchunifys-governance-layer.pdf`,
      },
    ],
  },
  {
    name: "Blogs",
    icon: NotebookPen,
    more: `${RC}/blog/`,
    items: [
      {
        type: "Blog",
        title: "Workflow-Anchored Knowledge: Smarter Support in Action",
        description: "AI knowledge agents embedded in workflows deliver context, speed, and precision to transform customer support.",
        image: `${IMG}/workflow-anchored-knowledge.webp`,
        href: `${RC}/blog/workflow-anchored-knowledge-smarter-support-in-action/`,
      },
      {
        type: "Blog",
        title: "Agentic AI Driving Enterprise Intelligence Growth",
        description: "Discover how Agentic AI suite & AI Knowledge Agent transform knowledge into real-time intelligence and enterprise growth.",
        image: `${IMG}/agentic-ai-enterprise-growth.jpg`,
        href: `${RC}/blog/agentic-ai-driving-enterprise-intelligence-growth/`,
      },
      {
        type: "Blog",
        title: "Modular Approach: A Smarter Way to Contact Center Automation",
        description: "Building Smarter Workflows with AI Agents, One Step at a Time",
        image: `${IMG}/modular-contact-center.webp`,
        href: `${RC}/blog/modular-approach-a-smarter-way-to-contact-center-automation/`,
      },
    ],
  },
  {
    name: "Webinars",
    icon: Presentation,
    more: resourceCenter("1_28_rc_webinar"),
    items: [
      {
        type: "Webinar",
        title: "Case Quality Auditor You Can Trust: Continuous QA Across Every Closed Case",
        image: `${IMG}/case-quality-auditor.webp`,
        href: `${RC}/webinar/case-quality-auditor-you-can-trust-continuous-qa-across-every-closed-case/`,
        cta: "Save My Spot",
      },
      {
        type: "Webinar",
        title: "Agentic AI in Support: Elevating Your Support Website to Excellence",
        description: "Beyond Deflection: Boosting CSAT and Case Quality with Autonomous Support",
        image: `${IMG}/agentic-ai-in-support.webp`,
        href: `${RC}/webinar/agentic-ai-in-support/`,
      },
      {
        type: "Webinar",
        title: "Find. Assist. Act. The Future of Enterprise Support in One AI Suite",
        description: "Elevate Efficiency, Ensure Compliance, and Deliver Superior Experiences",
        image: `${IMG}/find-assist-act.webp`,
        href: `${RC}/webinar/find-assist-act-the-future-of-enterprise-support-in-one-ai-suite/`,
      },
    ],
  },
  {
    name: "Analyst Reports",
    icon: BarChart3,
    more: resourceCenter("1_22_rc_analyst_report"),
    items: [
      {
        type: "Analyst Report",
        title: "SearchUnify Named a Leader in the 2024 IDC MarketScape",
        description: "Vendor assessment report on worldwide knowledge discovery software for external-facing use cases.",
        image: `${IMG}/idc-marketscape-2024.webp`,
        href: "https://my.idc.com/getdoc.jsp?containerId=US51813424",
      },
      {
        type: "Analyst Report",
        title: "SearchUnify Knowbler Named a Strong Performer in The Forrester Wave™",
        description: "A report on the 11 Knowledge Management Solutions that matter most.",
        image: `${IMG}/forrester-wave-knowbler.webp`,
        href: "https://www.forrester.com/report/RES181704",
      },
      {
        type: "Infographic",
        title: "SearchUnify Ranked No. 1 in 2024 Enterprise Search Emotional Footprint",
        description: "SearchUnify is Numero Uno with the highest composite score of 8.3.",
        image: `${IMG}/itrg-infographic.webp`,
        href: "https://pages.searchunify.com/leader-in-enterprise-search-data-quadrant-report-2024.html",
      },
    ],
  },
  {
    name: "Datasheets",
    icon: FileSpreadsheet,
    more: resourceCenter("1_23_rc_datasheet"),
    items: [
      {
        type: "Datasheet",
        title: "SearchUnify's Contextual Relevance Engine (SCORE) Framework",
        description: "Ushering in a new era of neural search precision with the SCORE framework.",
        image: `${IMG}/score-framework.webp`,
        href: `${SITE}/pages-pdf/searchunify-contextual-relevance-engine-score-framework.pdf`,
      },
      {
        type: "Datasheet",
        title: "SearchUnify for Salesforce Service Cloud",
        description: "Empowering service agents with AI to find answers faster and resolve cases sooner.",
        image: `${IMG}/salesforce-service-cloud.webp`,
        href: `${SITE}/pages-pdf/searchunify-for-salesforce-service-cloud.pdf`,
      },
      {
        type: "Datasheet",
        title: "SearchUnify Agent Helper Technical Guidebook",
        description: "Streamlining case resolution with AI-driven summaries, responses, and analytics.",
        image: `${IMG}/agent-helper-guidebook.webp`,
        href: `${SITE}/pages-pdf/agent-helper-guidebook.pdf`,
      },
    ],
  },
  {
    name: "E-Books",
    icon: BookOpen,
    more: resourceCenter("1_25_rc_e_book"),
    items: [
      {
        type: "E-Book",
        title: "Discover How Unified AI Agents Work Together to Boost Speed, Accuracy and Customer Satisfaction",
        image: `${IMG}/connected-ai-agents.webp`,
        href: `${RC}/ebook/smarter-workflows-start-with-connected-ai-agents/`,
      },
      {
        type: "E-Book",
        title: "Unlock the Full Potential of KCS in Customer Support",
        description: "Explore core KCS principles, real-world implementation insights & ways to avoid common pitfalls.",
        image: `${IMG}/demystifying-kcs.png`,
        href: `${RC}/ebook/unlock-the-full-potential-of-kcs-in-customer-support/`,
      },
      {
        type: "E-Book",
        title: "AI Agents for Customer Support: A Deep Dive",
        description: "Delivering faster, smarter, and more cost-effective customer support.",
        image: `${IMG}/ai-agents-deep-dive.webp`,
        href: `${RC}/ebook/ai-agents-for-customer-support-a-deep-dive/`,
      },
    ],
  },
  {
    name: "Videos",
    icon: MonitorPlay,
    more: `${RC}/videos/`,
    items: [
      {
        type: "Video",
        title: "SearchUnify AI Speed: Your Competitive Edge",
        description: "Discover why speed is key to achieving a sustained business advantage.",
        image: `${IMG}/ai-speed.webp`,
        href: `${RC}/video/why-ai-speed-matters-stay-ahead-with-searchunify/`,
      },
      {
        type: "Video",
        title: "SearchUnify Leadership Dashboard",
        description: "A revolutionary analytics visualization tool designed to optimize support.",
        image: `${IMG}/leadership-dashboard.webp`,
        href: `${RC}/video/searchunify-leadership-dashboard-ai-driven-insights-for-proactive-decision-making/`,
      },
      {
        type: "Video",
        title: "Key Considerations for LLM Deployment",
        description: "Discover the critical factors that demand careful thought before deploying LLMs in online communities.",
        image: `${IMG}/llm-deployment.webp`,
        href: `${RC}/video/key-considerations-for-responsible-deployment-of-large-language-models-for-online-communities/`,
      },
    ],
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Resources() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tab = TABS[active];

  const onKeyDown = (e: KeyboardEvent) => {
    const last = TABS.length - 1;
    const map: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    if (e.key in map) {
      e.preventDefault();
      setActive(map[e.key]);
      tabRefs.current[map[e.key]]?.focus();
    }
  };

  return (
    <section
      aria-labelledby="resources-heading"
      className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-white px-6 pb-24 pt-24 sm:rounded-t-[3.5rem] sm:pb-32 sm:pt-28"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full bg-[#005be2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#005be2]">
            Resource center
          </span>
          <h2 id="resources-heading" className="mt-5 text-balance text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Featured Resources
          </h2>
          <p className="mt-4 text-pretty text-lg text-slate-600">Playbooks, research and walkthroughs from the SearchUnify team.</p>
        </div>
        <Link
          href={tab.more}
          className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-link hover:underline focus-visible:outline-none focus-visible:underline"
        >
          Explore more {tab.name === "All Resources" ? "resources" : tab.name.toLowerCase()}
          <MoveRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Tabs — scroll sideways on small screens. */}
      <div className="mx-auto mt-10 max-w-7xl">
        <div
          role="tablist"
          aria-label="Resource types"
          onKeyDown={onKeyDown}
          className="-mx-6 flex gap-1 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:mx-0 md:inline-flex md:rounded-full md:border md:border-slate-200 md:bg-slate-50 md:p-1"
        >
          {TABS.map((t, i) => {
            const selected = i === active;
            return (
              <button
                key={t.name}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`rtab-${i}`}
                aria-selected={selected}
                aria-controls="rpanel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                className={cn(
                  "relative inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005be2]/50",
                  selected ? "text-white" : "text-slate-600 hover:text-slate-950",
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="resource-tab"
                    className="absolute inset-0 rounded-full bg-slate-950"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <t.icon className="relative size-4" />
                <span className="relative whitespace-nowrap">{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div id="rpanel" role="tabpanel" aria-labelledby={`rtab-${active}`} className="mx-auto mt-8 max-w-7xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul key={tab.name} className="grid gap-5 lg:grid-cols-2 lg:grid-rows-2">
            {tab.items.map((item, i) => (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, y: 24, rotate: i === 0 ? -1 : 1 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.18, delay: 0 } }}
                transition={{ duration: 0.45, ease, delay: i * 0.08 }}
                className={i === 0 ? "lg:row-span-2" : ""}
              >
                <ResourceCard item={item} featured={i === 0} />
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </section>
  );
}

function ResourceCard({ item, featured }: { item: Item; featured: boolean }) {
  const isVideo = item.type === "Video";
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex h-full overflow-hidden rounded-3xl border border-slate-200 bg-white transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-[#005be2]/25 hover:shadow-[0_28px_60px_-30px_rgba(0,91,226,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005be2]/50",
        featured ? "flex-col" : "flex-col sm:flex-row",
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-slate-100",
          featured ? "aspect-[16/10] w-full" : "aspect-[16/10] w-full sm:aspect-square sm:w-48 lg:w-56",
        )}
      >
        <Image
          src={item.image}
          alt=""
          fill
          sizes={featured ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 640px) 224px, 100vw"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {isVideo && (
          <span className="absolute inset-0 grid place-items-center bg-slate-950/20">
            <span className="grid size-14 place-items-center rounded-full bg-white/90 text-slate-950 shadow-lg transition-transform duration-300 group-hover:scale-110">
              <Play className="ml-0.5 size-5 fill-current" />
            </span>
          </span>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col", featured ? "p-7" : "p-6")}>
        <span className="self-start rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
          {item.type}
        </span>
        <h3 className={cn("mt-3 font-semibold leading-snug text-slate-950", featured ? "text-2xl" : "text-lg")}>{item.title}</h3>
        {item.description && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{item.description}</p>}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-link">
          {item.cta ?? "Know More"}
          <MoveRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
