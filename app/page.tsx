import { Clients } from "@/components/sections/clients";
import { Faq } from "@/components/sections/faq";
import { Governance } from "@/components/sections/governance";
import { HarnessStack } from "@/components/sections/harness-stack";
import { Hero } from "@/components/sections/hero";
import { PlatformPillars } from "@/components/sections/platform-pillars";
import { Recognitions } from "@/components/sections/recognitions";
import { SiteFooter } from "@/components/sections/site-footer";
import { SuccessStories } from "@/components/sections/success-stories";
import { SupportOutcomes } from "@/components/sections/support-outcomes";
import { TheGap } from "@/components/sections/the-gap";
import { TransformCta } from "@/components/sections/transform-cta";
import { Header1 } from "@/components/ui/header";
import { SectionAssistant } from "@/components/ui/section-assistant";

// Section order follows the live searchunify.com homepage: Hero → Clients →
// Customer stories → Industry recognition → The Gap → How It Works →
// Harness architecture → Outcomes → Governance → Final CTA → FAQ → Footer.
export default function Home() {
  return (
    <>
      <Header1 />
      <main className="flex-1">
        <Hero />
        <Clients />
        <SuccessStories />
        <Recognitions />
        <TheGap />
        <PlatformPillars />

        {/* Dark "agents" chapter (PRD: dark-first product chapters). */}
        {/* overflow-clip (not hidden) so the pinned harness section can stay sticky. */}
        <div className="relative isolate overflow-clip rounded-t-[2.5rem] bg-[#050b1f] sm:rounded-t-[3.5rem]">
          <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-[#005be2] opacity-25 blur-[120px]" />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-40 right-0 -z-10 size-[36rem] rounded-full bg-cyan-500 opacity-10 blur-[140px]" />
          <HarnessStack />
        </div>

        <SupportOutcomes />
        <Governance />
        <TransformCta />
        <Faq />
      </main>
      <SiteFooter />
      <SectionAssistant />
    </>
  );
}
