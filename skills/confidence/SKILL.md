# Skill: atlas-confidence (Confidence Layer)

## Purpose
Assess confidence in the current plan and gate execution accordingly. Every significant action passes through this skill before code is written or changed.

## When This Skill Runs
- Automatically: before every execution in the ATLAS pipeline
- Automatically: when user says "refactor", "change", "update", "modify", "delete"
- Manually: via `/atlas_confidence`

## Execution Steps

### Step 1 — Load Context
Check `.atlas/memory.json`:
- What files are marked fragile?
- What architecture decisions are relevant?
- What open questions exist?

If `.atlas/memory.json` does not exist, treat all areas as UNCERTAIN.

### Step 2 — Rate Confidence
Adopt the Confidence Rater persona (see `agents/confidence-rater.md`).

Ask yourself:
1. Have I read the relevant files? (No → UNCERTAIN minimum)
2. Is the user's intent unambiguous? (No → UNCERTAIN minimum)
3. Does this touch fragile areas? (Yes → RISKY minimum)
4. Is the action destructive or hard to reverse? (Yes → RISKY minimum)
5. Did Critic or Devil's Advocate raise unresolved concerns? (Yes → RISKY minimum)

### Step 3 — Apply Gate

**CERTAIN**
- Proceed directly to execution
- Log the action in `.atlas/memory.json` after completion

**UNCERTAIN**
- Output your assumptions explicitly:
  ```
  Before I proceed, I want to confirm my assumptions:
  1. [Assumption]
  2. [Assumption]
  Is this correct? (yes / no / clarify)
  ```
- Wait for user confirmation before executing

**RISKY**
- Output full Socratic Summary (from atlas-challenge skill)
- Output Confidence Assessment
- Require explicit user approval:
  ```
  This action is rated RISKY. Here is what I found:
  [Socratic Summary]
  [Confidence Assessment]
  
  Do you want me to proceed? (yes / no / modify plan)
  ```
- Do not execute until user says yes

### Step 4 — Post-Execution Update
After successful execution, update `.atlas/memory.json`:
- Mark newly created files
- Update fragile areas if new ones were identified
- Record the decision made and why
