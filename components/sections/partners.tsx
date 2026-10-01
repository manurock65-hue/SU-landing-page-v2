import { SITE } from "@/lib/nav-data";
import { cn } from "@/lib/utils";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Chapter 10 — "Our Partners". Partner logos (from the live carousel) orbit the
// SearchUnify mark on two counter-rotating rings; each logo counter-spins so it
// stays upright. Pauses on hover. Small screens get a plain logo grid.
type Partner = { name: string; src: string };

const P = "/assets/partners";
const INNER: Partner[] = [
  { name: "Salesforce", src: `${P}/salesforce.webp` },
  { name: "Microsoft", src: `${P}/microsoft.webp` },
  { name: "ServiceNow", src: `${P}/servicenow.webp` },
  { name: "Khoros", src: `${P}/khoros.webp` },
];
const OUTER: Partner[] = [
  { name: "TSIA", src: `${P}/tsia.webp` },
  { name: "Adobe Experience Manager", src: `${P}/aem.webp` },
  { name: "Higher Logic", src: `${P}/higher-logic.webp` },
  { name: "Heretto", src: `${P}/heretto.webp` },
  { name: "Thought Industries", src: `${P}/thought-industries.webp` },
  { name: "Klever Insight", src: `${P}/klever-insight.webp` },
  { name: "Appinium", src: `${P}/appinium.webp` },
];

export function Partners() {
  return (
    <section aria-labelledby="partners-heading" className="relative overflow-hidden bg-slate-50 px-6 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <span className="inline-block rounded-full bg-[#005be2]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#005be2]">
            Ecosystem
          </span>
          <h2 id="partners-heading" className="mt-5 text-balance text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Our Partners
          </h2>
          <p className="mt-5 max-w-md text-pretty text-lg text-slate-600">
            Technology, platform and industry partners that bring SearchUnify into the tools your support teams already use.
          </p>
          <p className="mt-6 text-sm text-slate-500">
            {INNER.map((p) => p.name).join(" · ")} and more
          </p>
          <Link
            href={`${SITE}/company/partner-network/`}
            className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-link hover:underline focus-visible:outline-none focus-visible:underline"
          >
            Explore our partner network
            <MoveRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Orbit (desktop) */}
        <div className="group relative mx-auto hidden aspect-square w-full max-w-[640px] lg:block">
          <div aria-hidden="true" className="absolute inset-[6%] rounded-full border border-dashed border-slate-300/80" />
          <div aria-hidden="true" className="absolute inset-[27%] rounded-full border border-dashed border-slate-300/80" />
          <div aria-hidden="true" className="absolute inset-[27%] rounded-full bg-[#005be2] opacity-[0.07] blur-3xl" />

          <Ring partners={OUTER} radius={44} slow />
          <Ring partners={INNER} radius={23} />

          {/* Hub */}
          <div className="absolute left-1/2 top-1/2 grid size-40 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white shadow-[0_20px_60px_-20px_rgba(0,91,226,0.45)] ring-1 ring-slate-200">
            <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full ring-2 ring-[#005be2]/20 [animation-duration:3s] motion-reduce:animate-none" />
            <Image src="/assets/searchunify-logo.webp" alt="SearchUnify" width={227} height={40} className="h-auto w-28" />
          </div>
        </div>

        {/* Grid (mobile / tablet) */}
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
          {[...INNER, ...OUTER].map((p) => (
            <li key={p.name}>
              <LogoChip partner={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* One ring of logos. `radius` is a % of the orbit box, measured from its centre. */
function Ring({ partners, radius, slow = false }: { partners: Partner[]; radius: number; slow?: boolean }) {
  return (
    <ul
      className={cn(
        "absolute inset-0 group-hover:[animation-play-state:paused] motion-reduce:animate-none",
        slow ? "animate-orbit-slow" : "animate-orbit",
      )}
    >
      {partners.map((p, i) => {
        const a = (i / partners.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <li
            key={p.name}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${50 + Math.cos(a) * radius}%`, top: `${50 + Math.sin(a) * radius}%` }}
          >
            <div
              className={cn(
                "group-hover:[animation-play-state:paused] motion-reduce:animate-none",
                slow ? "animate-orbit-slow-reverse" : "animate-orbit-reverse",
              )}
            >
              <LogoChip partner={p} className="w-36 transition-transform duration-300 hover:scale-110" />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function LogoChip({ partner, className }: { partner: Partner; className?: string }) {
  return (
    <div
      className={cn(
        "relative h-14 rounded-2xl bg-white shadow-[0_10px_30px_-14px_rgba(15,23,42,0.3)] ring-1 ring-slate-200",
        className,
      )}
    >
      <Image src={partner.src} alt={partner.name} fill sizes="144px" className="object-contain p-1.5" />
    </div>
  );
}
