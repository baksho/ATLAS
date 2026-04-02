# Skill: atlas-review (Code Review)

## Purpose
Perform a full ATLAS-style review of recent changes or a specific file/module. Combines Critic analysis with confidence assessment and memory update.

## When This Skill Runs
- Automatically: when user says "review", "check", "audit", "look at this"
- Manually: via `/atlas_review`

## Execution Steps

### Step 1 — Identify Scope
Determine what to review:
- If user specifies a file → review that file
- If user says "recent changes" → review files modified in the last session (from memory)
- If no scope given → ask: "What would you like me to review?"

### Step 2 — Load Context
Read `.atlas/memory.json` to understand:
- Is this a critical or fragile file?
- What decisions were made here previously?
- Any known gotchas in this area?

### Step 3 — Critic Review
Adopt the Critic persona and assess:
- Logic correctness
- Edge case handling
- Error handling completeness
- Reversibility of changes
- Test coverage gaps

### Step 4 — Confidence Assessment
For each significant block of code reviewed:
- Rate confidence in its correctness: CERTAIN / UNCERTAIN / RISKY
- Flag anything that should be moved to `fragile` in memory

### Step 5 — Output Review

```
ATLAS REVIEW — [file or scope]
───────────────────────────────
Memory context: [relevant notes from .atlas/memory.json]

Issues found:
[severity: HIGH/MEDIUM/LOW] [issue description]
[severity: HIGH/MEDIUM/LOW] [issue description]

Confidence flags:
- [code area] → UNCERTAIN: [reason]
- [code area] → RISKY: [reason]

Memory updates recommended:
- Mark [X] as fragile: [reason]
- Add gotcha: [description]

Overall verdict: CLEAN / NEEDS ATTENTION / ACTION REQUIRED
```

### Step 6 — Update Memory
If issues are found or fragile areas identified, update `.atlas/memory.json` accordingly.
