import { Headset, Megaphone, Server, TrendingUp, Users, type LucideIcon } from "lucide-react";

// Business functions the agents serve. Shared by the hero deck and chapter 4a.
// Descriptions mirror the live site; the agent runs are illustrative.
export type Fn = {
  name: string;
  icon: LucideIcon;
  description: string;
  trigger: string;
  steps: string[];
  result: string;
};

export const FUNCTIONS: Fn[] = [
  {
    name: "IT",
    icon: Server,
    description:
      "AI-powered agents for proactive IT support and infrastructure monitoring—resolving incidents faster, enhancing security, and ensuring uptime.",
    trigger: "Alert · API latency > 2s on prod-eu",
    steps: ["Correlating logs with recent deploys", "Root cause: release 4.12.3", "Rolling back and verifying health"],
    result: "Uptime restored in 3m 12s",
  },
  {
    name: "Marketing",
    icon: Megaphone,
    description:
      "Drive higher ROI with AI agents that power hyper-personalized campaigns and real-time performance optimization.",
    trigger: "Campaign “Q4 launch” CTR down 18%",
    steps: ["Segmenting audience by intent", "Generating 3 personalized variants", "Shifting budget to the best performer"],
    result: "A/B test live · CTR +11%",
  },
  {
    name: "Customer Support",
    icon: Headset,
    description:
      "Deliver exceptional support with scalable Agentic AI-faster resolutions, higher CSAT, and lower operational costs from first contact to close.",
    trigger: "New case #48213 · “SSO users not syncing”",
    steps: ["Retrieving 12 sources via SearchUnifyFRAG™", "Drafting a grounded answer", "Guardrails passed · confidence 94%"],
    result: "Resolved · zero human touches",
  },
  {
    name: "Sales",
    icon: TrendingUp,
    description:
      "Accelerate your sales funnel with AI-driven lead qualification, deal acceleration and actionable insights for smarter selling.",
    trigger: "Inbound lead · VP Support, 5k seats",
    steps: ["Enriching account and intent signals", "Lead score 92 · strong fit", "Routing to the right account executive"],
    result: "Meeting booked for Tuesday",
  },
  {
    name: "Human Resource",
    icon: Users,
    description:
      "Transform HR with intelligent agents that optimize talent acquisition, boost retention, and enable data-driven workforce management.",
    trigger: "Employee · “How do I add a dependent?”",
    steps: ["Checking the 2026 benefits policy", "Pre-filling the enrollment form", "Sending answer with next steps"],
    result: "Answered · ticket avoided",
  },
];

export const SUPPORT_INDEX = 2; // Customer Support — support-first positioning.
