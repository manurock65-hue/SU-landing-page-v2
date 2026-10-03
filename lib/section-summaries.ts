// Summaries for the "Summarize this section" assistant, keyed by each
// section's heading id (there is no live model behind the assistant); keep
// these in sync when section copy changes.
export type SectionSummary = {
  id: string; // heading element id
  title: string;
  summary: string;
  points: string[];
};

export const SECTION_SUMMARIES: SectionSummary[] = [
  {
    id: "clients-heading",
    title: "Our Esteemed Clients",
    summary: "SearchUnify is used by global enterprises across software, security, healthcare and industrial sectors.",
    points: ["Customers include Netskope, Fortinet, Flexera, Reltio, Rubrik, Cornerstone and nCino", "20+ enterprise brands rely on it for customer support"],
  },
  {
    id: "stories-heading",
    title: "Real conversations. Real outcomes.",
    summary: "SearchUnify Customer Pulse — video conversations with customers on what changed after deploying the harness.",
    points: [
      "GlobalFoundries: seamless self-service, one place for engineers to find the answer",
      "TechnologyOne: 76% case deflection with SearchUnify AI-powered support",
      "Revenera and Celonis report faster resolution and unified knowledge visibility",
    ],
  },
  {
    id: "recognitions-heading",
    title: "Industry recognition",
    summary: "Leading analysts consistently recognize SearchUnify for enterprise search and knowledge management.",
    points: [
      "G2 Leader for 26 consecutive quarters",
      "KMWorld AI 100 · 2026, Everest Group PEAK Matrix Major Contender",
      "SoftwareReviews Champion, Globee Gold, IDC MarketScape Major Player",
    ],
  },
  {
    id: "gap-heading",
    title: "Most AI support pilots stall for four reasons.",
    summary: "What got sold was a builder instead of an agent, a bot instead of a crew, an answer instead of a resolution, and a guess instead of a source.",
    points: [
      "Purpose-built agents for defined jobs, live on day one — not a builder project",
      "A harness where agents share context and hand off work, not a standalone bot",
      "No source, no action: every answer is retrieved, cited and logged, or it hands off",
    ],
  },
  {
    id: "pillars-heading",
    title: "Connect. Deploy. Resolve.",
    summary: "No model training, no agent building, no knowledge migration — the harness runs on top of what you already use.",
    points: [
      "Connect to CRM, ticketing, KB, docs, community and telemetry",
      "Deploy the purpose-built agents you need, scoped to your topics",
      "Agents resolve with a cited source, and the crew gets smarter every case",
    ],
  },
  {
    id: "arch-heading",
    title: "AI Agents harnessed for resolution.",
    summary: "The harness around the model: channels, agents, orchestration, retrieval, actions, knowledge, data and models working together.",
    points: [
      "Every channel reaches the same harness for a consistent answer",
      "Purpose-built agents are orchestrated with guardrails and a full audit trail",
      "Agentic RAG retrieves from connected, permission-aware data, then acts via MCP",
    ],
  },
  {
    id: "outcomes-heading",
    title: "Customer outcomes",
    summary: "What changes when the harness is on, measured across deflection, escalations, resolution time, CSAT and renewals.",
    points: [
      "60% increase in case deflection, 45% reduction in escalations",
      "35% faster resolution, 40% higher CSAT",
      "20% higher renewals",
    ],
  },
  {
    id: "governance-heading",
    title: "Autonomy you can audit.",
    summary: "Every agent action is scoped, logged, and reversible, with a full trace and certified compliance.",
    points: [
      "Permission-aware retrieval and source citation on every answer",
      "Topic-level guardrails with confidence thresholds for handoff",
      "Full audit trail, meets SOC 2 Type II, ISO 27001:2013, HIPAA and GDPR",
    ],
  },
  {
    id: "transform-heading",
    title: "Bring your hardest ticket.",
    summary: "Not a canned demo — bring a real case and watch the agent retrieve, cite, and answer it live, or talk it through with an expert.",
    points: ["Book a Demo to see the agents work on a real case", "Talk to an Expert for tailored use cases and technical depth"],
  },
  {
    id: "faq-heading",
    title: "Frequently Asked Questions",
    summary: "Quick answers on agentic AI, agentic workflows, SearchUnifyFRAG™ and enterprise security.",
    points: [
      "Agentic AI perceives, reasons, plans and acts toward goals",
      "FRAG™ combines federation, retrieval and augmented generation",
      "Meets ISO 27001, HIPAA and SOC 2 with zero data retention and a full audit trail",
    ],
  },
];
