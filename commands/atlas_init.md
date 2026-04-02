# /atlas:init

Initialize ATLAS memory for this project.

Steps:
1. Scan project structure (top 2 levels)
2. Read package.json, README.md, or equivalent config
3. Ask the user 3 questions:
   - What is this project's primary purpose?
   - Are there any areas I should treat as especially fragile?
   - Any architecture decisions I should know about?
4. Write `.atlas/memory.json` via the atlas-mcp MCP server
5. Confirm initialization with a summary

Run this once when starting ATLAS on a new project.
