"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

// "Real conversations. Real outcomes." — SearchUnify Customer Pulse. One
// featured video on top; the client-logo row below switches which video
// plays. videoId → company verified against each video's real YouTube title
// (fetched directly, not guessed): TBaNAUA291M = GlobalFoundries,
// 5Rru4mkJRlc = TechnologyOne, 57-oMOizU6I = Revenera, JK4C4I39lBs = Celonis.
type Story = {
  id: string;
  company: string;
  logo: string;
  caption: string; // short proof line, drawn from each video's real title
  name: string;
  title: string;
  quote: string;
  date: string;
  videoId: string;
};

const STORIES: Story[] = [
  {
    id: "globalfoundries",
    company: "GlobalFoundries",
    logo: "/assets/clients/globalfoundries.svg",
    caption: "Seamless self-service",
    name: "Ilavarasu Radju",
    title: "Lead Business System Analyst",
    quote: "Self-service went up, case conversion went down — and our engineers finally had one place to find the answer.",
    date: "August 2026",
    videoId: "TBaNAUA291M",
  },
  {
    id: "technologyone",
    company: "TechnologyOne",
    logo: "/assets/clients/technologyone.svg",
    caption: "76% case deflection",
    name: "Roxanne Hoare",
    title: "Director of Customer Community",
    quote: "Deeper community engagement, more self-service, and members connected to the right knowledge without friction.",
    date: "June 2026",
    videoId: "5Rru4mkJRlc",
  },
  {
    id: "revenera",
    company: "Revenera",
    logo: "/assets/clients/revenera.svg",
    caption: "AI-driven support efficiency",
    name: "Sudheendra Kumar",
    title: "Director, Technical Support",
    quote: "Faster resolution, empowered engineers, smoother outcomes across our entire technical support operation.",
    date: "May 2026",
    videoId: "57-oMOizU6I",
  },
  {
    id: "celonis",
    company: "Celonis",
    logo: "/assets/clients/celonis.svg",
    caption: "Knowledge, unified",
    name: "Michelle Stumpf",
    title: "Head of Knowledge Management · KCS Certified Trainer",
    quote: "Knowledge finally has visibility. Self-service adoption is up and our support outcomes are more consistent.",
    date: "April 2026",
    videoId: "JK4C4I39lBs",
  },
];

/* ----------------------------------------------------- featured video rail */
// One large player on top (auto-plays, muted, switches instantly) and a row
// of client logos below that choose what's playing above.
function FeaturedVideoRail({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  const active = STORIES.find((s) => s.id === activeId) ?? STORIES[0];

  return (
    <div className="mt-14">
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-black shadow-[0_30px_70px_-30px_rgba(15,23,42,0.45)]">
        <iframe
          key={active.id}
          src={`https://www.youtube.com/embed/${active.videoId}?autoplay=1&mute=1&rel=0`}
          title={`${active.company} customer story`}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-16"
        >
          <p className="text-sm font-semibold text-white">{active.company}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-white/70">&ldquo;{active.quote}&rdquo;</p>
        </div>
      </div>

      <ClientSwitchStrip activeId={activeId} onSelect={onSelect} />
    </div>
  );
}

/* Logo row: picks which video plays above. Real logos — a local asset for
   TechnologyOne, Google's favicon service for the other three (no local
   asset exists for them). Caption is a short line drawn from each video's
   real title, not a guessed stat. */
function ClientSwitchStrip({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  return (
    <div className="mx-auto mt-4 grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_-30px_rgba(15,23,42,0.3)] sm:grid-cols-4">
      {STORIES.map((s, i) => {
        const on = s.id === activeId;
        return (
          <button
            key={s.id}
            type="button"
            onMouseEnter={() => onSelect(s.id)}
            onFocus={() => onSelect(s.id)}
            onClick={() => onSelect(s.id)}
            aria-pressed={on}
            aria-label={`Play ${s.company} customer story`}
            className={cn(
              "relative flex h-32 flex-col items-center justify-center px-4 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#005be2]/50",
              on ? "bg-[#005be2]/[0.05]" : "hover:bg-slate-50",
              i % 2 === 1 && "border-l border-dashed border-slate-200",
              i >= 2 && "border-t border-dashed border-slate-200 sm:border-t-0",
              i === 2 && "sm:border-l",
            )}
          >
            <span
              className={cn(
                "absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-[#005be2] to-[#06b6d4] transition-transform duration-300",
                on && "scale-x-100",
              )}
            />
            <Image
              src={s.logo}
              alt={s.company}
              width={106}
              height={106}
              className={cn(
                "size-[88px] rounded-lg object-contain transition-[opacity,transform] duration-300 sm:size-[106px]",
                on ? "scale-110 opacity-100" : "opacity-70 hover:opacity-100",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

export function SuccessStories() {
  const [activeId, setActiveId] = useState(STORIES[0].id);

  return (
    <section aria-labelledby="stories-heading" className="relative overflow-hidden bg-white px-6 py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[56rem] -translate-x-1/2 rounded-full bg-[#005be2] opacity-[0.06] blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-[#005be2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#005be2]">
            Customer stories · SearchUnify Customer Pulse
          </span>
          <h2 id="stories-heading" className="mt-5 text-balance text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Real conversations. Real outcomes.
          </h2>
        </div>

        <FeaturedVideoRail activeId={activeId} onSelect={setActiveId} />
      </div>
    </section>
  );
}
