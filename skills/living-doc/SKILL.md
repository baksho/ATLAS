# Skill: atlas-living-doc (Living Document)

## Purpose
Maintain, query, and update the persistent knowledge graph of the codebase stored in `.atlas/memory.json`. This is ATLAS's long-term memory — it survives across sessions.

## When This Skill Runs
- Automatically: at the start of every session (read)
- Automatically: at the end of every significant action (write)
- Automatically: when user says "remember", "what do you know", "what's fragile"
- Manually: via `/atlas_memory` (query) or `/atlas_init` (initialize)

---

## Memory Schema

`.atlas/memory.json` follows this structure:

```json
{
  "project": {
    "name": "",
    "description": "",
    "stack": [],
    "entrypoints": []
  },
  "architecture": {
    "overview": "",
    "key_modules": [],
    "patterns_used": [],
    "decisions": []
  },
  "files": {
    "critical": [],
    "fragile": [],
    "stable": []
  },
  "knowledge": {
    "solved_problems": [],
    "open_questions": [],
    "known_gotchas": []
  },
  "sessions": []
}
```

---

## Initialization (`/atlas_init`)

When run on a new project:

1. Scan the project directory structure (top 2 levels)
2. Read `package.json`, `README.md`, or equivalent config files
3. Identify the tech stack
4. Identify entrypoints (main files, index files, app entry)
5. Ask the user 3 questions:
   - "What is this project's primary purpose?"
   - "Are there any areas I should treat as especially fragile?"
   - "Any architecture decisions I should know about?"
6. Write the initial `.atlas/memory.json`
7. Confirm: "ATLAS memory initialized. I now know: [summary]"

---

## Query (`/atlas_memory`)

Display the current memory in a readable format:

```
ATLAS MEMORY — [project name]
──────────────────────────────
Stack: [stack]
Architecture: [overview]

Critical files: [list]
Fragile areas: [list]

Known gotchas:
- [gotcha]

Open questions:
- [question]

Last session: [date + summary]
```

---

## Update Protocol

After every significant action, append to `.atlas/memory.json`:

**Files changed** → update `files` section (move to fragile if touched core logic)
**Decision made** → append to `architecture.decisions`
**Problem solved** → append to `knowledge.solved_problems`
**New gotcha found** → append to `knowledge.known_gotchas`
**New question raised** → append to `knowledge.open_questions`
**Session summary** → append to `sessions` array

Keep entries concise — one or two sentences each. The memory is meant to be fast to read, not exhaustive.

---

## MCP Integration

When the ATLAS MCP server is running (via `atlas-mcp`), all reads and writes go through the MCP server instead of direct file access. This enables:
- Multi-session persistence with proper locking
- Query by keyword or file name
- Memory accessible from any MCP-compatible tool

The MCP server exposes these tools:
- `atlas_memory_read` — read full memory or by section
- `atlas_memory_write` — update a section
- `atlas_memory_query` — search memory by keyword
- `atlas_memory_init` — initialize memory for a new project
