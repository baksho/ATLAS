# Skill: atlas-plan (Strategic Planning)

## Purpose
Run a structured planning session that combines Living Document context with a full Socratic round to produce a verified, confidence-rated execution plan.

## When This Skill Runs
- Automatically: when user says "plan", "let's think about", "how should I", "design"
- Manually: via `/atlas_plan`

## Execution Steps

### Step 1 — Load Memory
Read `.atlas/memory.json`. Summarize relevant context in one paragraph before planning.

### Step 2 — Draft Plan
Based on the user's goal and memory context, draft an initial plan:
- Break the goal into concrete steps
- Identify which files will be touched
- Estimate complexity: Simple / Medium / Complex

### Step 3 — Socratic Round
Run full Socratic challenge on the draft plan (see `skills/socratic/SKILL.md`):
- Critic round
- Devil's Advocate round
- Synthesize findings

### Step 4 — Revise Plan
Incorporate any valid concerns from the Socratic round into the plan.
Mark steps that touch fragile areas.
Mark steps that are UNCERTAIN or RISKY.

### Step 5 — Output Final Plan

```
ATLAS PLAN
───────────
Goal: [user's goal]
Context from memory: [1-2 sentences]

Steps:
1. [Step] — [Confidence: CERTAIN/UNCERTAIN/RISKY]
2. [Step] — [Confidence: CERTAIN/UNCERTAIN/RISKY]
...

Fragile areas involved: [list or "none"]
Estimated complexity: Simple / Medium / Complex

Socratic verdict: PROCEED / PROCEED WITH CAUTION / REDESIGN
Key concern: [one sentence if any]

Ready to execute? (yes / modify / cancel)
```

### Step 6 — Gate
Wait for user confirmation before handing off to execution.
