# /atlas:confidence

Rate the confidence level of the current plan before execution.

Checks:
- Have the relevant files been read?
- Is the user's intent unambiguous?
- Are fragile areas (from memory) involved?
- Is the action destructive or hard to reverse?
- Are there unresolved Socratic concerns?

Returns:
- CERTAIN → proceed immediately
- UNCERTAIN → surface assumptions, ask for confirmation
- RISKY → full Socratic summary + explicit user approval required

Use this when you want to explicitly check whether it is safe to proceed.
