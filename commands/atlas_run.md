# /atlas:run

Activate the full ATLAS pipeline on the current task.

Steps:
1. Load `.atlas/memory.json` for project context
2. Run Socratic round (Critic + Devil's Advocate) on the plan
3. Rate confidence (CERTAIN / UNCERTAIN / RISKY)
4. Gate execution based on confidence level
5. Execute the approved plan
6. Update `.atlas/memory.json` with what was learned

Use this when you want the full ATLAS treatment on any task.
