import Image from "next/image";

// Client logos from the live searchunify.com "Our Esteemed Clients" strip,
// renamed and given real alt text (the live site uses "Container-4" etc.).
const CLIENTS = [
  { name: "Netskope", src: "/assets/clients/netskope.webp", w: 209, h: 33 },
  { name: "Raintree", src: "/assets/clients/raintree.png", w: 104, h: 33 },
  { name: "Accela", src: "/assets/clients/accela.svg", w: 180, h: 48 },
  { name: "Fortinet", src: "/assets/clients/fortinet.svg", w: 140, h: 42 },
  { name: "Flexera", src: "/assets/clients/flexera.svg", w: 140, h: 42 },
  { name: "Reltio", src: "/assets/clients/reltio.svg", w: 180, h: 48 },
  { name: "Rubrik", src: "/assets/clients/rubrik.svg", w: 180, h: 48 },
  { name: "ABBYY", src: "/assets/clients/abbyy.svg", w: 179, h: 47 },
  { name: "Acquia", src: "/assets/clients/acquia.svg", w: 179, h: 47 },
  { name: "Cornerstone", src: "/assets/clients/cornerstone.svg", w: 179, h: 47 },
  { name: "D2L", src: "/assets/clients/d2l.svg", w: 179, h: 47 },
  { name: "GE Appliances", src: "/assets/clients/ge-appliances.svg", w: 185, h: 47 },
  { name: "Hunter Industries", src: "/assets/clients/hunter.svg", w: 179, h: 47 },
  { name: "Kantata", src: "/assets/clients/kantata.svg", w: 179, h: 47 },
  { name: "NETSCOUT", src: "/assets/clients/netscout.svg", w: 179, h: 47 },
  { name: "SafeBreach", src: "/assets/clients/safebreach.svg", w: 179, h: 47 },
  { name: "Saviynt", src: "/assets/clients/saviynt.svg", w: 179, h: 47 },
  { name: "Syntellis", src: "/assets/clients/syntellis.svg", w: 179, h: 47 },
  { name: "TechnologyOne", src: "/assets/clients/technologyone.svg", w: 179, h: 47 },
  { name: "Trintech", src: "/assets/clients/trintech.svg", w: 296, h: 48 },
  { name: "WellSky", src: "/assets/clients/wellsky.svg", w: 179, h: 47 },
  { name: "nCino", src: "/assets/clients/ncino.svg", w: 174, h: 48 },
  { name: "Command Alkon", src: "/assets/clients/command-alkon.webp", w: 149, h: 32 },
];

function LogoRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-16 pr-16" aria-hidden={hidden || undefined}>
      {CLIENTS.map((c) => (
        <li key={c.name} className="shrink-0">
          <Image
            src={c.src}
            alt={hidden ? "" : c.name}
            width={c.w}
            height={c.h}
            // Eager: lazy-loading would make logos pop in as they scroll into the marquee.
            loading="eager"
            className="h-9 w-auto max-w-[170px] object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
          />
        </li>
      ))}
    </ul>
  );
}

// Chapter 1b — client proof strip, directly under the hero.
export function Clients() {
  return (
    <section aria-labelledby="clients-heading" className="bg-white pb-20 pt-2">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 id="clients-heading" className="text-2xl font-semibold leading-tight tracking-tight sm:text-[28px]">
          <span className="block text-slate-400">Trusted by global enterprises.</span>
          <span className="block text-slate-950">Our Esteemed Clients.</span>
        </h2>
      </div>

      <div className="relative mx-auto mt-6 max-w-7xl">
        {/* Hairlines that fade out at both ends, as in the reference. */}
        <div aria-hidden="true" className="mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <div className="group relative overflow-hidden py-10 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max animate-marquee-right group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            <LogoRow />
            <LogoRow hidden />
          </div>
        </div>

        <div aria-hidden="true" className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
    </section>
  );
}
