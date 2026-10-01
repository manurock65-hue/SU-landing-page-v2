// Summaries for the "Summarize this section" assistant, keyed by each
// section's heading id. Written from the section's own content (there is no
// live model behind the assistant); keep them in sync when copy changes.
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
    id: "pillars-heading",
    title: "Embed Agentic AI Across Your Enterprise",
    summary: "Five building blocks take you from scattered knowledge to trusted AI agents in production.",
    points: [
      "Unified data with SearchUnifyFRAG™ and your choice of LLMs (BYOLLM)",
      "Multilayered security plus guardrails that check every answer",
      "Pre-built agents so you can deploy with confidence",
    ],
  },
  {
    id: "functions-heading",
    title: "AI Agents Engineered for Your Business Functions",
    summary: "The same agentic platform serves IT, Marketing, Customer Support, Sales and HR, each with agents that pick up a task and close it out.",
    points: [
      "IT: correlate logs, find the root cause, roll back",
      "Support: retrieve sources, draft a grounded answer, pass guardrails",
      "Sales, Marketing and HR: qualify leads, optimize campaigns, answer policy questions",
    ],
  },
  {
    id: "suite-heading",
    title: "AI Agents for Customer Support",
    summary: "Ten prebuilt AI agents cover the whole support journey, all connected via MCP and powered by SearchUnifyFRAG™.",
    points: [
      "Self-service: AI Support Agent and Proactive Support Agent",
      "Agent assist: Agent Partner, Competency Agent, Workflow Automation",
      "Knowledge and quality: Knowledge Agent, Feedback Analyst, Classification, Escalation Manager, Case Quality Auditor",
    ],
  },
  {
    id: "arch-heading",
    title: "SearchUnify Agentic AI Suite Architecture",
    summary: "A ticket flows through five layers, from the team that raised it to the tools that resolve it.",
    points: [
      "Enterprise functions → AI agents that coordinate the work",
      "LLM intelligence (BYOLLM) plans and reasons; FRAG™ and the Insights Engine act as memory",
      "SearchUnify MCP connects to Zendesk, Salesforce, Slack and 100+ tools to act",
    ],
  },
  {
    id: "outcomes-heading",
    title: "Transform Customer Support Outcomes",
    summary: "Six outcomes SearchUnify drives to raise CSAT, from better self-service to measurable ROI.",
    points: [
      "Better self-service, empathetic AI support and smarter ticket routing",
      "Consistent service at scale and knowledge-centered support (KCS)",
      "Save ~$1 million in support cost within three months of deployment",
    ],
  },
  {
    id: "stories-heading",
    title: "Real-World Customer Success Stories",
    summary: "Customers report measurable gains in resolution speed, self-service and knowledge creation.",
    points: [
      "Accela: 92.7% faster first response, 77.5% more cases closed",
      "Cornerstone OnDemand: 98% self-service resolution rate",
      "Automation Anywhere: 57% boost in knowledge creation; EBSCO: 125.8% growth in academy views",
    ],
  },
  {
    id: "recognitions-heading",
    title: "Industry Recognitions",
    summary: "Leading analysts consistently recognize SearchUnify for enterprise search and knowledge management.",
    points: [
      "G2 Leader for 25 consecutive quarters",
      "Forrester Strong Performer, IDC Major Player, Everest Group Major Contender",
      "SoftwareReviews Champion and Gold Medalist",
    ],
  },
  {
    id: "transform-heading",
    title: "Begin Your AI Transformation",
    summary: "Two ways to get started: see the agents work in a demo, or talk to an expert about your use case.",
    points: ["Book a Demo to watch AI agents streamline real workflows", "Talk to an Expert for tailored use cases and technical depth"],
  },
  {
    id: "resources-heading",
    title: "Featured Resources",
    summary: "Playbooks, research and walkthroughs to go deeper on agentic AI for support.",
    points: [
      "Blogs, webinars, analyst reports, datasheets, e-books and videos",
      "Start with The AI Agent Adoption Playbook and Top 5 AI Agent Use Cases",
    ],
  },
  {
    id: "partners-heading",
    title: "Our Partners",
    summary: "Technology, platform and industry partners bring SearchUnify into the tools support teams already use.",
    points: ["Salesforce, Microsoft, ServiceNow and Khoros", "Plus TSIA, Adobe Experience Manager, Higher Logic, Heretto and more"],
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
