// Navigation content mirrored from the live searchunify.com header
// (captured 23 Sep 2026). Labels and destinations match the live site;
// _gl / utm tracking params are stripped per the redesign PRD.

export const SITE = "https://www.searchunify.com";

// Resource Center filters on the live site are query-string URLs. Kept as-is
// so links keep working until the new clean /resources/... URLs exist.
const RC_UID = "138a0c28-5680-11f0-9274-0242ac120012";
export function resourceCenter(type: string) {
  const aggregations = encodeURIComponent(
    JSON.stringify([{ type: "_index", filter: [type] }]),
  );
  return (
    `${SITE}/resource-center/?searchString=&activeType=${type}&from=0&sortby=post_time` +
    `&orderBy=desc&pageNo=1&aggregations=${aggregations}&uid=${RC_UID}` +
    `&resultsPerPage=12&exactPhrase=&withOneOrMore=&withoutTheWords=&pageSize=12` +
    `&language=en&suCaseCreate=false`
  );
}

// Site search goes to the Resource Center, using the live site's URL format.
export function siteSearchUrl(query: string) {
  return (
    `${SITE}/resource-center/?searchString=${encodeURIComponent(query)}&activeType=all&from=0` +
    `&sortby=_score&orderBy=desc&pageNo=1&aggregations=%5B%5D&uid=${RC_UID}` +
    `&resultsPerPage=10&exactPhrase=&withOneOrMore=&withoutTheWords=&pageSize=10` +
    `&language=en&suCaseCreate=false`
  );
}

export type NavLink = { title: string; href: string };
export type NavSection = {
  heading?: { title: string; href?: string };
  links: NavLink[];
};
export type NavMenu = {
  title: string;
  description: string;
  overview?: NavLink;
  columns: NavSection[][];
};

export const DEMO_HREF = `${SITE}/request-demo/`;
export const CONTACT_HREF = `${SITE}/company/contact-us/`;

export const NAV_MENUS: NavMenu[] = [
  {
    title: "Platform",
    description:
      "The agentic foundation that unifies your content and powers every SearchUnify experience.",
    overview: { title: "Platform overview", href: `${SITE}/platform/` },
    columns: [
      [
        {
          links: [
            { title: "Agentic AI Suite", href: `${SITE}/platform/agentic-ai-suite/` },
            { title: "Agentic RAG", href: `${SITE}/platform/agentic-rag/` },
            { title: "MCP", href: `${SITE}/platform/model-context-protocols/` },
            { title: "Analytics", href: `${SITE}/platform/search-analytics/` },
            { title: "Faceted Search", href: `${SITE}/platform/faceted-search/` },
            { title: "Search Tuning", href: `${SITE}/platform/search-tuning/` },
            { title: "Governance", href: `${SITE}/platform/governance/` },
          ],
        },
      ],
      [
        {
          heading: { title: "Integrations", href: `${SITE}/platform/connectors/` },
          links: [
            { title: "Agentforce", href: `${SITE}/platform/searchunify-for-agentforce/` },
            { title: "Salesforce", href: `${SITE}/platform/searchunify-for-salesforce/` },
            { title: "Zendesk", href: `${SITE}/platform/searchunify-for-zendesk/` },
            { title: "Khoros", href: `${SITE}/platform/searchunify-for-khoros/` },
            { title: "SharePoint", href: `${SITE}/platform/searchunify-for-sharepoint/` },
            { title: "Slack", href: `${SITE}/platform/searchunify-for-slack/` },
            { title: "Madcap Flare", href: `${SITE}/platform/madcap-flare-search/` },
            { title: "Other Integrations", href: `${SITE}/platform/connectors/` },
          ],
        },
      ],
    ],
  },
  {
    title: "Products",
    description:
      "AI agents and experiences for search, self-service, knowledge and agent productivity.",
    columns: [
      [
        {
          heading: { title: "AI Agents", href: `${SITE}/platform/agentic-ai-suite/` },
          links: [
            { title: "AI Support Agent", href: `${SITE}/products/ai-agents/ai-support-agent/` },
            { title: "AI SupportPlus Agent", href: `${SITE}/products/ai-agents/ai-supportplus-agent/` },
            { title: "AI Knowledge Agent", href: `${SITE}/products/ai-agents/ai-knowledge-agent/` },
            { title: "AI Agent Partner", href: `${SITE}/products/ai-agents/ai-agent-partner/` },
            { title: "AI Escalation Manager", href: `${SITE}/products/ai-agents/ai-escalation-manager/` },
            { title: "AI Case Quality Auditor", href: `${SITE}/products/ai-agents/ai-case-quality-auditor/` },
            { title: "AI Classification Agent", href: `${SITE}/products/ai-agents/ai-classification-agent/` },
            { title: "AI Competency Agent", href: `${SITE}/products/ai-agents/ai-competency-agent/` },
          ],
        },
      ],
      [
        {
          heading: { title: "Virtual Assistant", href: `${SITE}/products/searchunify-virtual-assistant/` },
          links: [
            { title: "SUVA for Customer Support and Self-service", href: `${SITE}/products/searchunify-virtual-assistant/suva-for-customer-support-and-self-service/` },
            { title: "SUVA for HR Operations", href: `${SITE}/products/searchunify-virtual-assistant/suva-for-hr-operations/` },
            { title: "SUVA Analytics", href: `${SITE}/products/searchunify-virtual-assistant/suva-analytics/` },
            { title: "Why SUVA", href: `${SITE}/products/searchunify-virtual-assistant/why-suva/` },
          ],
        },
        {
          heading: { title: "Knowbler", href: `${SITE}/products/knowbler/` },
          links: [
            { title: "Knowbler for Knowledge Centered Service", href: `${SITE}/products/knowbler/knowbler-for-knowledge-centered-service/` },
            { title: "Gamification", href: `${SITE}/products/knowbler/gamification/` },
          ],
        },
      ],
      [
        {
          heading: { title: "Agent Helper", href: `${SITE}/products/agent-helper/` },
          links: [{ title: "Features", href: `${SITE}/products/agent-helper/features/` }],
        },
        {
          heading: { title: "Search", href: `${SITE}/products/cognitive-search/` },
          links: [
            { title: "Cognitive Search", href: `${SITE}/products/cognitive-search/` },
            { title: "SearchUnifyGPT™", href: `${SITE}/searchunify-gpt/` },
          ],
        },
      ],
    ],
  },
  {
    title: "Industries",
    description: "Purpose-built AI search and support for regulated industries.",
    columns: [
      [
        {
          heading: { title: "BFSI", href: `${SITE}/industries/bfsi/` },
          links: [
            { title: "Banking", href: `${SITE}/industries/bfsi/banking/` },
            { title: "Insurance", href: `${SITE}/industries/bfsi/insurance/` },
          ],
        },
      ],
    ],
  },
  {
    title: "Resources",
    description: "Reports, stories and ideas from the world of AI-powered customer support.",
    columns: [
      [
        {
          links: [
            { title: "Analyst Reports", href: resourceCenter("1_22_rc_analyst_report") },
            { title: "Case Studies", href: resourceCenter("1_26_rc_success_story") },
            { title: "Customer Pulse", href: `${SITE}/resource-center/searchunify-customer-pulse/` },
            { title: "Webinars", href: resourceCenter("1_28_rc_webinar") },
            { title: "Events", href: `${SITE}/resource-center/events/` },
            { title: "Videos", href: `${SITE}/resource-center/videos/` },
            { title: "Expert Hub", href: `${SITE}/expert-hub/` },
            { title: "Glossary", href: "https://docs.searchunify.com/Content/Getting-Started/Gen-AI-and-LLM.htm" },
          ],
        },
      ],
      [
        {
          heading: { title: "Content Library", href: `${SITE}/resource-center/` },
          links: [
            { title: "Blogs", href: `${SITE}/resource-center/blog/` },
            { title: "eBooks", href: resourceCenter("1_25_rc_e_book") },
            { title: "Whitepapers", href: resourceCenter("1_21_rc_white_paper") },
            { title: "Datasheets", href: resourceCenter("1_23_rc_datasheet") },
            { title: "Brochures", href: resourceCenter("1_24_rc_brochure") },
            { title: "Infographics", href: resourceCenter("1_20_rc_infographic") },
            { title: "Short Articles", href: `${SITE}/resource-center/short-articles/` },
          ],
        },
      ],
      [
        {
          heading: { title: "The Customer Service Show", href: `${SITE}/resource-center/the-customer-service-show/` },
          links: [
            { title: "Season 1", href: `${SITE}/resource-center/the-customer-service-show/season-1/` },
            { title: "Season 2", href: `${SITE}/resource-center/the-customer-service-show/season-2/` },
            { title: "Season 3", href: `${SITE}/resource-center/the-customer-service-show/season-3/` },
            { title: "Season 4", href: `${SITE}/resource-center/the-customer-service-show/season-4/` },
          ],
        },
      ],
    ],
  },
  {
    title: "Company",
    description: "The team, partners and community behind SearchUnify.",
    columns: [
      [
        {
          links: [
            { title: "About Us", href: `${SITE}/company/about-us/` },
            { title: "Leadership", href: `${SITE}/company/leadership/` },
            { title: "Advisory Board", href: `${SITE}/company/product-advisory-board/` },
            { title: "Awards & Recognitions", href: `${SITE}/company/recognitions/` },
            { title: "Testimonials", href: `${SITE}/company/testimonials/` },
            { title: "Newsroom", href: `${SITE}/company/press-releases/` },
            { title: "Careers", href: "https://www.grazitti.com/company/careers/" },
            { title: "Contact Us", href: CONTACT_HREF },
          ],
        },
      ],
      [
        {
          heading: { title: "Partners", href: `${SITE}/company/partner-network/` },
          links: [
            { title: "Salesforce", href: `${SITE}/company/partner-network/salesforce/` },
            { title: "ServiceNow", href: `${SITE}/company/partner-network/servicenow/` },
            { title: "Zendesk", href: `${SITE}/company/partner-network/zendesk/` },
            { title: "BetterMode", href: `${SITE}/company/partner-network/bettermode/` },
          ],
        },
        {
          heading: { title: "Learn & connect" },
          links: [
            { title: "SU Academy", href: "https://academy.searchunify.com/" },
            { title: "SU Community", href: "https://community.searchunify.com/hc/en-us" },
            { title: "SU Consulting Services", href: `${SITE}/company/consulting` },
          ],
        },
      ],
    ],
  },
];
