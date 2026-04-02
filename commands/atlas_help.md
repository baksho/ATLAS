# /atlas_help

Display all available ATLAS commands and magic keywords.

Output the following:

```
ATLAS — Adaptive Thinking Layer for Agentic Systems
─────────────────────────────────────────────────────

COMMANDS
  /atlas_run          Full ATLAS pipeline (Socratic → Confidence → Execute → Memory)
  /atlas_init         Initialize ATLAS memory for this project
  /atlas_memory       Show what ATLAS knows about this codebase
  /atlas_challenge    Socratic challenge on a plan (no execution)
  /atlas_confidence   Rate confidence on the current plan
  /atlas_plan         Strategic planning with Socratic round
  /atlas_review       Review recent changes or a specific file
  /atlas_help         Show this help

MAGIC KEYWORDS (automatic activation)
  "build", "implement", "create"     → Full ATLAS pipeline
  "refactor", "change", "update"     → Confidence check first
  "plan", "think about", "design"    → Socratic round
  "remember", "what do you know"     → Living Document query
  "review", "check", "audit"         → ATLAS review
  "risky", "not sure", "careful"     → Forced RISKY pipeline

CONFIDENCE LEVELS
  CERTAIN    → Execute immediately
  UNCERTAIN  → Confirm assumptions first
  RISKY      → Socratic summary + explicit approval required

LIVING DOCUMENT
  Memory stored in: .atlas/memory.json
  MCP server:       atlas-mcp (runs automatically)
```
