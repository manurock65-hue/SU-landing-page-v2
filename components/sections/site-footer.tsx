"use client";

import { AgentNetworkBackground } from "@/components/ui/agent-network-background";
import { ComplianceBadges } from "@/components/ui/compliance-badges";
import { CONTACT_HREF, DEMO_HREF, SITE } from "@/lib/nav-data";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowUpRight, Mail, MapPin, Phone, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

// Site footer. Columns, contact details and legal links mirror the live site.
// Adds an "Ask AI" row (one-click summaries of SearchUnify in popular AI
// assistants), a compliance strip and an oversized wordmark with an AI hover.
const COLUMNS = [
  {
    title: "Products",
    links: [
      { label: "Agent Helper", href: `${SITE}/products/agent-helper/` },
      { label: "Agentic AI Suite", href: `${SITE}/platform/agentic-ai-suite/` },
      { label: "Cognitive Search", href: `${SITE}/products/cognitive-search/` },
      { label: "Knowbler", href: `${SITE}/products/knowbler/` },
      { label: "SearchUnifyGPT™", href: `${SITE}/searchunify-gpt/` },
      { label: "Virtual Assistant", href: `${SITE}/products/searchunify-virtual-assistant/` },
    ],
  },
  {
    title: "Integrations",
    links: [
      { label: "Agentforce", href: `${SITE}/platform/searchunify-for-agentforce/` },
      { label: "Salesforce", href: `${SITE}/platform/searchunify-for-salesforce/` },
      { label: "Zendesk", href: `${SITE}/platform/searchunify-for-zendesk/` },
      { label: "Khoros", href: `${SITE}/platform/searchunify-for-khoros/` },
      { label: "SharePoint", href: `${SITE}/platform/searchunify-for-sharepoint/` },
      { label: "Slack", href: `${SITE}/platform/searchunify-for-slack/` },
      { label: "Madcap Flare", href: `${SITE}/platform/madcap-flare-search/` },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: `${SITE}/company/about-us/` },
      { label: "Awards and Recognitions", href: `${SITE}/company/recognitions/` },
      { label: "Leadership", href: `${SITE}/company/leadership/` },
      { label: "Newsroom", href: `${SITE}/company/press-releases/` },
      { label: "Partners", href: `${SITE}/company/partner-network/` },
    ],
  },
  {
    title: "Get Started",
    links: [
      { label: "Book a Demo", href: DEMO_HREF },
      { label: "Talk to an Expert", href: CONTACT_HREF },
      { label: "Contact Us", href: CONTACT_HREF },
    ],
  },
];

const LEGAL = [
  { label: "Sitemap", href: `${SITE}/su/sitemap/` },
  { label: "Privacy Policy", href: `${SITE}/privacy-policy/` },
  { label: "EUSA", href: `${SITE}/GRZ_EUSA_SUF_vJan.01.2022.pdf` },
  { label: "Terms & Conditions", href: `${SITE}/terms-and-conditions/` },
];

// Brand marks are Simple Icons paths (lucide no longer ships brand logos).
const SOCIAL = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/showcase/25048226/",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "X (Twitter)",
    href: "https://twitter.com/SearchUnify",
    path: "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCHQdHTFzWRKj5xg1nFoZPTg",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
];

// One-click "summarise SearchUnify" in each assistant, prompt prefilled.
const AI_PROMPT = encodeURIComponent(
  "Give me a summary of SearchUnify (https://www.searchunify.com): what its Agentic AI suite does for enterprise customer support, its key products, and why companies choose it.",
);
const ASK_AI = [
  {
    name: "ChatGPT",
    href: `https://chatgpt.com/?q=${AI_PROMPT}`,
    path: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
  },
  {
    name: "Perplexity",
    href: `https://www.perplexity.ai/search?q=${AI_PROMPT}`,
    path: "M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904 0v7.0896H1.6023v10.3976h2.8882V24l6.932-6.3591v6.2005h1.1554v-6.0469l6.9318 6.1807v-6.4879h2.8882V7.0896zm-3.4657-4.531v4.531h-5.355l5.355-4.531zm-13.2862.0676 4.8691 4.4634H5.6458V2.6262zM2.7576 16.332V8.245h7.8476l-6.1149 6.1147v1.9723H2.7576zm2.8882 5.0404v-3.8852h.0001v-2.6488l5.7763-5.7764v7.0111l-5.7764 5.2993zm12.7086.0248-5.7766-5.1509V9.0618l5.7766 5.7766v6.5588zm2.8882-5.0652h-1.733v-1.9723L13.3948 8.245h7.8478v8.087z",
  },
  {
    name: "Claude",
    href: `https://claude.ai/new?q=${AI_PROMPT}`,
    path: "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z",
  },
  {
    name: "Google AI Mode",
    href: `https://www.google.com/search?udm=50&q=${AI_PROMPT}`,
    path: "M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81",
  },
];

const MAPS = "https://www.google.com/maps/search/?api=1&query=340+E.+Middlefield+Road,+Mountain+View,+CA+94043";

// Underline grows from the left on hover.
const linkClass =
  "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 text-sm text-slate-600 transition-[background-size,color] duration-300 hover:bg-[length:100%_1px] hover:text-slate-950 focus-visible:bg-[length:100%_1px] focus-visible:outline-none";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-white">
      <AgentNetworkBackground />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff7400]/60 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-[#ff7400] opacity-[0.08] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 pt-20">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <Link href="/" aria-label="SearchUnify home" className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005be2]/50">
              <Image src="/assets/searchunify-logo.svg" alt="SearchUnify" width={227} height={40} className="h-8 w-auto" />
            </Link>
            <p className="mt-5 max-w-sm text-pretty text-[15px] leading-relaxed text-slate-600">
              Agentic AI for enterprise customer support—optimized, autonomous, trusted and proven to deliver results.
            </p>

            <AskAi />

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Follow us on</p>
            <ul className="mt-3 flex gap-2">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={`SearchUnify on ${s.label}`}
                    className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#005be2] hover:bg-[#005be2] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005be2]/50"
                  >
                    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {COLUMNS.map((c) => (
              <div key={c.title}>
                <p className="text-sm font-semibold text-slate-950">{c.title}</p>
                <ul className="mt-5 space-y-3">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className={linkClass}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Contact tiles */}
        <div className="mt-16 grid gap-3 md:grid-cols-3">
          <ContactTile icon={MapPin} title="Visit us">
            <a href={MAPS} className={linkClass}>
              340 E. Middlefield Road, Mountain View, CA 94043, USA
            </a>
          </ContactTile>
          <ContactTile icon={Mail} title="Email us">
            <a href="mailto:info@searchunify.com" className={linkClass}>info@searchunify.com</a>
            <a href="mailto:sales@searchunify.com" className={linkClass}>sales@searchunify.com</a>
          </ContactTile>
          <ContactTile icon={Phone} title="Call us">
            <a href="tel:+1-650-844-3031" className={linkClass}>+1-650-844-3031</a>
            <a href="tel:+91-977-934-9321" className={linkClass}>+91-977-934-9321</a>
          </ContactTile>
        </div>

        {/* Compliance strip */}
        <div className="mt-3 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-950">Secure &amp; compliant</p>
              <p className="text-xs text-slate-500">Enterprise-grade governance, zero data retention, full audit trail.</p>
            </div>
          </div>
          <ComplianceBadges variant="seals" />
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2017-2026 SearchUnify. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {LEGAL.map((l) => (
              <Link key={l.label} href={l.href} className={linkClass}>
                {l.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005be2]/50"
            >
              <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" /> Back to top
            </button>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="footer-color-stripe mt-2 h-[3px] w-full motion-reduce:animate-none" />
    </footer>
  );
}

function AskAi() {
  return (
    <div className="ask-ai-bg mt-8 max-w-sm rounded-2xl border border-slate-200 p-4 motion-reduce:animate-none">
      <p className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <Sparkles className="size-4 text-[#ff7400]" />
        Ask AI for a summary about SearchUnify
      </p>
      <ul className="mt-3 flex gap-2">
        {ASK_AI.map((a) => (
          <li key={a.name}>
            <a
              href={a.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ask ${a.name} for a summary of SearchUnify (opens in a new tab)`}
              className="group relative grid size-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-950 hover:bg-slate-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005be2]/50"
            >
              <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
                <path d={a.path} />
              </svg>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-slate-950 px-2 py-1 text-[11px] font-medium text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
              >
                {a.name}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactTile({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <div className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-[#005be2]/30">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#005be2]/[0.08] text-[#005be2] transition-colors group-hover:bg-[#005be2] group-hover:text-white">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="flex items-center gap-1 text-sm font-semibold text-slate-950">
          {title}
          <ArrowUpRight className="size-3.5 text-slate-300" />
        </p>
        <div className={cn("mt-1.5 flex flex-col items-start gap-1")}>{children}</div>
      </div>
    </div>
  );
}
