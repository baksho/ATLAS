# Skill: atlas-challenge (Socratic Round)

## Purpose
Run a full Socratic challenge on a plan before execution. Activates the Critic and Devil's Advocate agents internally.

## When This Skill Runs
- Automatically: when the task is tagged RISKY by the Confidence Rater
- Automatically: when user says "plan", "think about", "design", "should I", "is it a good idea"
- Manually: via `/atlas_challenge`

## Execution Steps

### Step 1 — Understand the Plan
Read the user's request carefully. If ambiguous, ask one clarifying question before proceeding.

### Step 2 — Critic Round
Internally adopt the Critic persona (see `agents/critic.md`):
- Find missing edge cases
- Surface hidden assumptions
- Assess reversibility
- Identify test gaps
- Deliver a verdict: APPROVE / APPROVE WITH CONDITIONS / REJECT

### Step 3 — Devil's Advocate Round
Internally adopt the Devil's Advocate persona (see `agents/devils-advocate.md`):
- Propose a concrete alternative approach
- Argue why it may be better
- State what it sacrifices
- Deliver a recommendation: STICK / CONSIDER / STRONGLY RECONSIDER

### Step 4 — Synthesize
After both rounds, produce a synthesis:

```
ATLAS SOCRATIC SUMMARY
───────────────────────
Plan: [one-line summary of what was evaluated]

Critic verdict: [APPROVE / APPROVE WITH CONDITIONS / REJECT]
Key concern: [one sentence]

Devil's Advocate: [STICK / CONSIDER / STRONGLY RECONSIDER]
Key challenge: [one sentence]

Overall recommendation: PROCEED / PROCEED WITH CAUTION / REDESIGN

Next step: [What should happen now]
```

### Step 5 — Gate
- PROCEED → hand off to Confidence Rater → execution
- PROCEED WITH CAUTION → show findings to user, ask for explicit go-ahead
- REDESIGN → stop execution, work with user to redesign the plan

## Output Format
Always surface the full Socratic Summary to the user. Never silently skip it for RISKY tasks.
