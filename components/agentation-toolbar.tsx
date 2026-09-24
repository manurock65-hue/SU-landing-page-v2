"use client";

import { Agentation } from "agentation";

// Dev-only visual feedback toolbar (bottom-right corner). Annotations sync to
// the local agentation-mcp server so Claude Code can read them.
export function AgentationToolbar() {
  if (process.env.NODE_ENV !== "development") return null;
  return <Agentation endpoint="http://localhost:4747" appName="SearchUnify landing page" />;
}
