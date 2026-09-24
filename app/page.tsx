import { AgentFunctions } from "@/components/sections/agent-functions";
import { AgentSuite } from "@/components/sections/agent-suite";
import { ArchStack } from "@/components/sections/arch-stack";
import { Clients } from "@/components/sections/clients";
import { Hero } from "@/components/sections/hero";
import { PlatformPillars } from "@/components/sections/platform-pillars";
import { Header1 } from "@/components/ui/header";

export default function Home() {
  return (
    <>
      <Header1 />
      <main className="flex-1">
        <Hero />
        <Clients />
        <PlatformPillars />

        {/* Dark "agents" chapter (PRD: dark-first product chapters). */}
        {/* overflow-clip (not hidden) so the pinned architecture section can stay sticky. */}
        <div className="relative isolate overflow-clip rounded-t-[2.5rem] bg-[#050b1f] sm:rounded-t-[3.5rem]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]"
          />
          <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-[#005be2] opacity-25 blur-[120px]" />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-40 right-0 -z-10 size-[36rem] rounded-full bg-cyan-500 opacity-10 blur-[140px]" />
          <AgentFunctions />
          <AgentSuite />
          <ArchStack />
        </div>
      </main>
    </>
  );
}
