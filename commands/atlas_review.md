# /atlas:review

Run a full ATLAS-style review of recent changes or a specific file.

Steps:
1. Identify scope (specific file, or recent session changes from memory)
2. Load context from `.atlas/memory.json`
3. Critic review: logic, edge cases, error handling, test gaps
4. Confidence flags: tag any uncertain or risky code blocks
5. Recommend memory updates (new fragile areas, gotchas)
6. Output overall verdict: CLEAN / NEEDS ATTENTION / ACTION REQUIRED

Use this after implementing something significant, or before merging/shipping.
