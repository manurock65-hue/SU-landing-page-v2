import {
  AlertTriangle,
  BookOpenCheck,
  Headset,
  Route,
  ShieldCheck,
  UserCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

// Agent runs shared across the hero deck, the dark "purpose-built agents"
// chapter, and the transform CTA. Trigger/steps/result are illustrative;
// names and framing mirror the live site's three hero examples and its
// "Purpose-built AI Agents" harness component.
export type Fn = {
  name: string;
  icon: LucideIcon;
  description: string;
  trigger: string;
  steps: string[];
  result: string;
};

// The hero's three live examples: front door, beside the rep, behind the queue.
export const HERO_EXAMPLES: Fn[] = [
  {
    name: "L1 Support AI Agent",
    icon: Headset,
    description:
      "Answers at the front door — retrieves from the knowledge base before it ever replies, and hands off the moment it can't find a source.",
    trigger: "Help center · session 8f2a · “SSO login keeps failing on SAML”",
    steps: ["Retrieving SAML setup docs and past cases", "Drafting a grounded answer with citations", "Confidence check passed · no human needed"],
    result: "Deflected · zero human touches",
  },
  {
    name: "AI Agent Partner",
    icon: UserCheck,
    description:
      "Works beside the rep — drafts the reply, pulls the right sources, and leaves the call to resolve with the human.",
    trigger: "Case #48213 · assigned to Priya R.",
    steps: ["Reading the data-export job logs", "Drafting a reply grounded in the runbook", "Flagging for Priya's approval"],
    result: "Draft ready · Priya sends in one click",
  },
  {
    name: "Intelligent Routing Agent",
    icon: Route,
    description:
      "Works behind the queue — routes the case, scores the resolution, and feeds what it learns back to the front door.",
    trigger: "Case #48390 · one case, three agents behind the queue",
    steps: ["Classifying intent and urgency", "Routing to the right queue and rep", "QA scoring the closed case"],
    result: "Routed, resolved, and scored — loop closed",
  },
];

export const HERO_DEFAULT_INDEX = 0;

// The six purpose-built agent types from "AI Agents harnessed for resolution."
export const AGENT_TYPES: Fn[] = [
  {
    name: "L1 Support",
    icon: Headset,
    description: "Answers the front door first, retrieving before it ever replies.",
    trigger: "New case · “Can't access the admin console”",
    steps: ["Retrieving 9 sources via agentic RAG", "Drafting a grounded answer", "Guardrails passed · citing 3 sources"],
    result: "Resolved · zero human touches",
  },
  {
    name: "L2 Troubleshooting",
    icon: Wrench,
    description: "Digs into the harder technical cases a front-door agent hands off.",
    trigger: "Escalated · “Data export job stuck at 80%”",
    steps: ["Correlating job logs with recent releases", "Root cause: queue worker timeout", "Applying the documented fix"],
    result: "Resolved · root cause logged",
  },
  {
    name: "Agent Partner",
    icon: UserCheck,
    description: "Drafts beside the rep and leaves the send decision to them.",
    trigger: "Case #48213 · assigned to Priya R.",
    steps: ["Reading the case thread and prior notes", "Drafting a grounded reply", "Flagged for one-click approval"],
    result: "Draft ready for review",
  },
  {
    name: "Escalation",
    icon: AlertTriangle,
    description: "Flags at-risk cases before they blow up, with the evidence attached.",
    trigger: "Case #49102 · sentiment trending negative",
    steps: ["Scoring sentiment and SLA risk", "Checking account tier and history", "Notifying the escalation queue"],
    result: "Escalated · manager notified",
  },
  {
    name: "Knowledge",
    icon: BookOpenCheck,
    description: "Turns every resolved case into an article, so the next one has a source.",
    trigger: "Case #48213 · resolved, no matching article",
    steps: ["Drafting an article from the resolution", "Checking for duplicate knowledge", "Publishing for review"],
    result: "Published · KCS flow complete",
  },
  {
    name: "Case Quality",
    icon: ShieldCheck,
    description: "Scores every closed case against policy, not a sample.",
    trigger: "Case #48390 · closed 4m ago",
    steps: ["Checking tone, accuracy and sources cited", "Scoring against the QA rubric", "Logging the score to the trace"],
    result: "100% QA · score 96/100",
  },
];

export const AGENT_DEFAULT_INDEX = 0;
