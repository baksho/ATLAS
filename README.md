# ATLAS — Adaptive Thinking Layer for Agentic Systems

> **Multi-agent orchestration for Claude Code. Think before you build.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)
[![Platform](https://img.shields.io/badge/platform-Windows-blue)](https://github.com/Baksho/ATLAS)
[![Claude Code](https://img.shields.io/badge/Claude-Code-orange)](https://docs.anthropic.com/claude-code)

---

## What Is ATLAS?

Most AI coding tools optimize for **doing things faster**. ATLAS optimizes for **doing the right things**.

ATLAS is an orchestration layer for [Claude Code](https://docs.anthropic.com/claude-code) built around three ideas that other tools ignore:

| Layer | What it does | Problem it solves |
|---|---|---|
| **Socratic Layer** | Challenges every plan before execution with a Critic and Devil's Advocate | *You stop building the wrong thing* |
| **Living Document** | Maintains a persistent knowledge graph of your codebase across sessions | *Claude remembers like a teammate, not a goldfish* |
| **Confidence Layer** | Gates execution by certainty — fast when sure, careful when not | *Claude moves fast where it knows, slows down where it doesn't* |

ATLAS is not a fork of Claude Code. It hooks into Claude Code's native extension points, so you always stay on upstream.

---

## How It Works

Every task flows through the ATLAS pipeline:

```
User Prompt
    │
    ▼
[1. CONSULT]      Read .atlas/memory.json for codebase context
    │
    ▼
[2. SOCRATIC]     Critic + Devil's Advocate challenge the plan
    │
    ▼
[3. CONFIDENCE]   Rate plan: CERTAIN / UNCERTAIN / RISKY
    │
    ├── CERTAIN   → Execute immediately
    ├── UNCERTAIN → Confirm assumptions first
    └── RISKY     → Full Socratic summary + explicit approval
    │
    ▼
[4. EXECUTE]      Carry out the approved plan
    │
    ▼
[5. UPDATE]       Write what was learned to .atlas/memory.json
```

---

## The Three Layers Explained

### 🔴 Socratic Layer
Before Claude writes a line of code, it argues with itself.

- **Critic**: finds flaws, missing edge cases, hidden assumptions, test gaps
- **Devil's Advocate**: proposes an alternative approach and argues for it

Only when the plan survives both agents does execution begin. For risky tasks, the findings are surfaced to you visibly — ATLAS never skips this step silently.

### 🟢 Living Document
A persistent, structured memory of your codebase stored in `.atlas/memory.json`.

It tracks:
- Project stack and architecture overview
- Critical, fragile, and stable files
- Architecture decisions and why they were made
- Known gotchas and open questions
- Session-by-session history

The Living Document is powered by an MCP server (`atlas-mcp`) so it is queryable, updateable, and survives across every session. You never re-explain your project to Claude again.

### 🟡 Confidence Layer
Every significant action is rated before execution:

| Level | Meaning | Gate |
|---|---|---|
| **CERTAIN** | Files read, intent clear, reversible, no fragile areas touched | Execute immediately |
| **UNCERTAIN** | Assumptions being made, intent ambiguous, unfamiliar territory | Surface assumptions, confirm first |
| **RISKY** | Destructive action, fragile areas, wide blast radius, unresolved Critic concerns | Full Socratic summary + explicit approval |

Speed is earned, not assumed.

---

## Agents

ATLAS uses three internal agents:

| Agent | Role |
|---|---|
| **Critic** | Finds flaws, edge cases, and risks in a plan |
| **Devil's Advocate** | Proposes alternatives and challenges the chosen approach |
| **Confidence Rater** | Assesses certainty and gates execution accordingly |

---

## Commands

| Command | What it does |
|---|---|
| `/atlas_run` | Full ATLAS pipeline on the current task |
| `/atlas_init` | Initialize ATLAS memory for this project |
| `/atlas_memory` | Show what ATLAS knows about this codebase |
| `/atlas_challenge` | Socratic challenge on a plan (no execution) |
| `/atlas_confidence` | Rate confidence on the current plan |
| `/atlas_plan` | Strategic planning with Socratic round |
| `/atlas_review` | Review recent changes or a specific file |
| `/atlas_help` | Show all commands and keywords |

---

## Magic Keywords

ATLAS detects natural language and activates automatically — no commands required:

| Say this... | ATLAS activates |
|---|---|
| "build", "implement", "create" | Full ATLAS pipeline |
| "refactor", "change", "update" | Confidence check first |
| "plan", "think about", "design" | Socratic round |
| "remember", "what do you know" | Living Document query |
| "review", "check", "audit" | ATLAS review |
| "risky", "not sure", "careful" | Forced RISKY pipeline |

---

## Requirements

- **Windows** (macOS/Linux support planned)
- **Node.js** >= 20
- **Claude Code** installed and working in VS Code
- **Claude Max** subscription or **Anthropic API key**

---

## Installation

### Step 1 — Clone the repository

Open **PowerShell** and run:

```powershell
git clone https://github.com/Baksho/ATLAS.git
cd ATLAS
```

### Step 2 — Run the setup script

```powershell
powershell -ExecutionPolicy Bypass -File scripts/setup.ps1
```

This will:
1. Check your Node.js version
2. Build the ATLAS MCP server
3. Install slash commands into Claude Code
4. Register the `atlas-mcp` MCP server in Claude Code's config

### Step 3 — Copy CLAUDE.md into your project

For every project you want ATLAS to manage, copy the orchestration brain into the project root:

```powershell
copy templates\CLAUDE.md C:\path\to\your\project\CLAUDE.md
```

Replace `C:\path\to\your\project` with the actual path to your project.

### Step 4 — Open Claude Code in VS Code

1. Open your project folder in VS Code
2. Open Claude Code: press `Ctrl+Shift+P`, type `Claude Code`, press Enter
3. You should see Claude Code open in the sidebar or panel

### Step 5 — Initialize ATLAS memory for your project

In the Claude Code chat, type:

```
/atlas_init
```

ATLAS will scan your project, ask you three questions, and write `.atlas/memory.json`.

**You are ready.** ATLAS now runs automatically on every task.

---

## Usage

### Starting a new task (automatic)

Just describe what you want. ATLAS activates automatically:

```
build a REST API for user authentication
```

ATLAS will: load memory → challenge the plan → rate confidence → wait for your approval if risky → execute → update memory.

### Explicit commands

```
/atlas_plan    design the database schema for a multi-tenant SaaS app
/atlas_challenge    should I use JWT or session-based auth?
/atlas_review  src/auth.ts
/atlas_memory
```

### Check what ATLAS remembers

```
/atlas_memory
```

### Run a full pipeline manually

```
/atlas_run    refactor the payment processing module
```

---

## Project Structure

```
ATLAS/
├── agents/
│   ├── critic.md              # Critic agent prompt
│   ├── devils-advocate.md     # Devil's Advocate agent prompt
│   └── confidence-rater.md    # Confidence Rater agent prompt
│
├── commands/
│   ├── atlas:run.md           # /atlas_run command
│   ├── atlas:init.md          # /atlas_init command
│   ├── atlas:memory.md        # /atlas_memory command
│   ├── atlas:challenge.md     # /atlas_challenge command
│   ├── atlas:confidence.md    # /atlas_confidence command
│   ├── atlas:plan.md          # /atlas_plan command
│   ├── atlas:review.md        # /atlas_review command
│   └── atlas:help.md          # /atlas_help command
│
├── skills/
│   ├── socratic/SKILL.md      # Socratic round workflow
│   ├── confidence/SKILL.md    # Confidence gating workflow
│   ├── living-doc/SKILL.md    # Living Document read/write workflow
│   ├── atlas-plan/SKILL.md    # Strategic planning workflow
│   └── atlas-review/SKILL.md  # Code review workflow
│
├── mcp-server/
│   ├── src/index.ts           # Living Document MCP server (TypeScript)
│   ├── package.json
│   └── tsconfig.json
│
├── scripts/
│   └── setup.ps1              # Windows setup script
│
├── templates/
│   └── CLAUDE.md              # Orchestration brain (copy to your project)
│
├── package.json
├── LICENSE
└── README.md
```

---

## The Living Document: `.atlas/memory.json`

ATLAS stores codebase knowledge in `.atlas/memory.json` in your project root. This file is updated automatically after every significant action.

Example:

```json
{
  "project": {
    "name": "my-saas-app",
    "description": "Multi-tenant SaaS platform",
    "stack": ["TypeScript", "React", "Node.js", "PostgreSQL"],
    "entrypoints": ["src/index.ts", "src/app.tsx"]
  },
  "architecture": {
    "overview": "Monorepo with separate frontend and backend packages",
    "decisions": [
      {
        "date": "2026-04-01",
        "decision": "Use JWT for auth",
        "reason": "Stateless, scales across multiple servers"
      }
    ]
  },
  "files": {
    "critical": ["src/index.ts", "src/db/schema.ts"],
    "fragile": ["src/auth/tokens.ts", "src/payments/stripe.ts"],
    "stable": ["src/utils/logger.ts"]
  },
  "knowledge": {
    "known_gotchas": ["Stripe webhooks must be verified before processing"],
    "open_questions": ["Should we cache user permissions in Redis?"]
  }
}
```

**Add `.atlas/` to your `.gitignore`** if you do not want to commit this file, or commit it to share context with your team.

---

## Uploading to GitHub

### Step 1 — Create a new repository on GitHub

1. Go to [https://github.com/new](https://github.com/new)
2. Repository name: `ATLAS`
3. Set it to **Public** or **Private** as you prefer
4. **Do not** initialize with a README, .gitignore, or license (we have these already)
5. Click **Create repository**

### Step 2 — Initialize git and push

Open PowerShell in the ATLAS directory:

```powershell
cd C:\path\to\ATLAS
git init
git add .
git commit -m "Initial release: ATLAS v1.0.0"
git branch -M main
git remote add origin https://github.com/Baksho/ATLAS.git
git push -u origin main
```

That's it. Your repository is live at `https://github.com/Baksho/ATLAS`.

---

## Roadmap

- [ ] macOS and Linux support
- [ ] Standalone CLI (tool-agnostic: works with Codex CLI, Gemini CLI, and others)
- [ ] Living Document visualization (web UI to browse memory graph)
- [ ] Team memory sharing (shared `.atlas/memory.json` via git)
- [ ] Agent learning — extract reusable patterns from sessions automatically

---

## Philosophy

ATLAS is built on one belief: **the bottleneck in AI-assisted development is not speed, it is judgment**.

Other orchestration tools make Claude faster. ATLAS makes Claude more thoughtful. A plan challenged and verified before execution is worth ten plans executed at full speed in the wrong direction.

---

## Contributing

Contributions are welcome. Please open an issue before submitting a pull request so we can discuss the change first.

---

## License

MIT © [Baksho](https://github.com/Baksho)
