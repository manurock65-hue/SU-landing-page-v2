import { BookOpenCheck, Headset, Route, ShieldCheck, UserCheck, type LucideIcon } from "lucide-react";

export type PanelVariant = "default" | "dashed" | "highlight";

export type SourceRow = {
  name: string;
  tag?: string;
  status: string;
  statusTone: "ok" | "off";
  detail: string;
};

export type ChecklistRow = {
  label: string;
  tag?: string;
  detail: string;
};

export type Decision = {
  primary: string;
  secondary?: string[];
  meta?: string;
};

export type Panel = {
  index?: number;
  icon: LucideIcon;
  agent: string;
  status: string;
  variant?: PanelVariant;
  chips?: string[];
  decision?: Decision;
  // \n-separated lines; each parsed with parseInline (**bold**, [[highlight]]).
  body?: string;
  sources?: SourceRow[];
  checklist?: ChecklistRow[];
  footChips?: string[];
};

export type AgentRun = {
  tab: "DEFLECT" | "ASSIST" | "OPERATE";
  chromeTitle: string;
  context: { eyebrow: string; body: string };
  panels: Panel[];
  footer: { text: string; tone?: "green" }[];
};

// Index-aligned with HERO_EXAMPLES in functions-data.ts: L1 Support AI Agent,
// AI Agent Partner, Intelligent Routing Agent.
export const HERO_RUNS: AgentRun[] = [
  {
    tab: "DEFLECT",
    chromeTitle: "L1 Support AI Agent · help center · session 8f2a",
    context: {
      eyebrow: "Customer",
      body: "SSO login started failing after we rotated our IdP certificate. Getting “SAML assertion invalid”.",
    },
    panels: [
      {
        icon: Headset,
        agent: "L1 Support AI Agent",
        status: "Intent detected",
        chips: ["type troubleshoot", "topic SSO / SAML", "plan Enterprise", "tone calm"],
        decision: {
          primary: "→ self-serve",
          secondary: ["route to rep", "escalate"],
          meta: "known topic · no outage · not billing/legal",
        },
      },
      {
        icon: Headset,
        agent: "L1 Support AI Agent",
        status: "Retrieving…",
        variant: "dashed",
        sources: [
          { name: "Salesforce KB", status: "entitled", statusTone: "ok", detail: "KB-1182 “Rotating IdP certificates”" },
          { name: "Docs", status: "public", statusTone: "ok", detail: "auth-guide#saml-troubleshooting" },
          { name: "Jira", status: "internal · withheld", statusTone: "off", detail: "ENG-4471" },
        ],
      },
      {
        icon: Headset,
        agent: "L1 Support AI Agent",
        status: "Answer",
        variant: "highlight",
        body:
          "After a rotation, the SP metadata still points at the old cert. Re-upload the new IdP certificate under **Setup → SSO → Identity Provider** and re-save — the assertion validates on next login.",
        footChips: ["KB-1182", "auth-guide#saml"],
      },
    ],
    footer: [
      { text: "confidence 0.91 / threshold 0.80", tone: "green" },
      { text: "handoff not required" },
    ],
  },
  {
    tab: "ASSIST",
    chromeTitle: "AI Agent Partner · inside Salesforce · case #48213",
    context: {
      eyebrow: "Case #48213 · assigned to Priya R.",
      body: "Enterprise, P2. 27-message thread. Data export job stalls at 80% for accounts >2M rows.",
    },
    panels: [
      {
        icon: UserCheck,
        agent: "AI Agent Partner",
        status: "Case read",
        chips: ["timeline 27 → 5 events", "type defect · workaround", "ready? logs missing"],
        decision: {
          primary: "→ partner · draft for rep",
          secondary: ["autonomous · Competency", "escalate"],
          meta: "precedent found · rep owns send",
        },
      },
      {
        icon: UserCheck,
        agent: "AI Agent Partner",
        status: "Retrieving & collecting…",
        variant: "dashed",
        sources: [
          { name: "Salesforce", status: "precedent", statusTone: "ok", detail: "case #41077 “export stalls at 80%”" },
          { name: "ELK", tag: "MCP", status: "collected", statusTone: "ok", detail: "pulled customer logs · batch 41 → OOM" },
        ],
      },
      {
        icon: UserCheck,
        agent: "AI Agent Partner",
        status: "Swarming via MCP",
        variant: "highlight",
        checklist: [
          { label: "Jira", tag: "MCP", detail: "ENG-4471 created · linked · logs attached" },
          { label: "Slack", tag: "MCP", detail: "#eng-data swarm · timeline posted · @on-call" },
          { label: "Salesforce", tag: "MCP", detail: "status → Engineering engaged" },
        ],
      },
      {
        icon: UserCheck,
        agent: "AI Agent Partner",
        status: "For Priya",
        body:
          "**Timeline:** reported 12 Aug → repro 13 → workaround failed 15 → logs today.\n**Root cause (ELK):** 2M-row batch ceiling — #41077 fix: chunked export.\n**Draft reply:** “Enable Chunked Export under Admin → Data…”",
        footChips: ["case #41077", "ELK logs", "ENG-4471"],
      },
    ],
    footer: [
      { text: "ticket readiness complete", tone: "green" },
      { text: "rep approves before send" },
    ],
  },
  {
    tab: "OPERATE",
    chromeTitle: "Operate · Routing → Case QA → Knowledge · case #48390",
    context: {
      eyebrow: "Case #48390 · one case, three agents behind the queue",
      body: "P3 · SSO/SAML · German · 3 reassignments · customer replied 4× in 24h · $1.2M ARR, renewal in 41 days.",
    },
    panels: [
      {
        index: 1,
        icon: Route,
        agent: "Intelligent Routing Agent",
        status: "While open",
        chips: ["risk 0.84 · escalation likely", "needs SAML · DE", "roster 1 match · available"],
        body:
          "**Assigned** to [[M. Chen]] · Tier-2 · SAML 92% · DE native · load 4/8 · CSM notified. Why: 9 of 14 cases with this pattern escalated; Chen is the only available rep with the skill and the language.",
      },
      {
        index: 2,
        icon: ShieldCheck,
        agent: "Case QA Agent",
        status: "On close",
        variant: "highlight",
        chips: ["accuracy 5/5", "complete 4/5", "tone 5/5", "process 3/5", "resolution 5/5"],
        body:
          "Scored 22/25 · process gap: no KB linked before close — same pattern in 6 of Chen's last 20 cases → [[coaching plan updated]]",
      },
      {
        index: 3,
        icon: BookOpenCheck,
        agent: "AI Knowledge Agent",
        status: "After close",
        chips: ["gap IdP cert rotation · DE", "duplicate? KB-1182 EN only", "format KCS"],
        body:
          "Drafted [[KB-1182-DE]] from the resolution · reviewer: Chen · published to help center + agents' retrieval layer. Next German SSO question: the L1 agent has a source.",
      },
    ],
    footer: [
      { text: "routed · no manager triage", tone: "green" },
      { text: "QA 100% coverage", tone: "green" },
      { text: "KB loop closed", tone: "green" },
    ],
  },
];
