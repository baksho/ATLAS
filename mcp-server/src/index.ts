import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs";
import * as path from "path";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ArchitectureDecision {
  date: string;
  decision: string;
  reason: string;
}

interface Session {
  date: string;
  summary: string;
  filesChanged: string[];
}

interface AtlasMemory {
  project: {
    name: string;
    description: string;
    stack: string[];
    entrypoints: string[];
  };
  architecture: {
    overview: string;
    key_modules: string[];
    patterns_used: string[];
    decisions: ArchitectureDecision[];
  };
  files: {
    critical: string[];
    fragile: string[];
    stable: string[];
  };
  knowledge: {
    solved_problems: string[];
    open_questions: string[];
    known_gotchas: string[];
  };
  sessions: Session[];
}

// ─── Memory helpers ───────────────────────────────────────────────────────────

function getMemoryPath(projectRoot: string): string {
  return path.join(projectRoot, ".atlas", "memory.json");
}

function ensureAtlasDir(projectRoot: string): void {
  const atlasDir = path.join(projectRoot, ".atlas");
  if (!fs.existsSync(atlasDir)) {
    fs.mkdirSync(atlasDir, { recursive: true });
  }
}

function readMemory(projectRoot: string): AtlasMemory | null {
  const memPath = getMemoryPath(projectRoot);
  if (!fs.existsSync(memPath)) return null;
  try {
    const raw = fs.readFileSync(memPath, "utf-8");
    return JSON.parse(raw) as AtlasMemory;
  } catch {
    return null;
  }
}

function writeMemory(projectRoot: string, memory: AtlasMemory): void {
  ensureAtlasDir(projectRoot);
  const memPath = getMemoryPath(projectRoot);
  fs.writeFileSync(memPath, JSON.stringify(memory, null, 2), "utf-8");
}

function emptyMemory(): AtlasMemory {
  return {
    project: {
      name: "",
      description: "",
      stack: [],
      entrypoints: [],
    },
    architecture: {
      overview: "",
      key_modules: [],
      patterns_used: [],
      decisions: [],
    },
    files: {
      critical: [],
      fragile: [],
      stable: [],
    },
    knowledge: {
      solved_problems: [],
      open_questions: [],
      known_gotchas: [],
    },
    sessions: [],
  };
}

// ─── Server ───────────────────────────────────────────────────────────────────

const server = new Server(
  {
    name: "atlas-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ─── Tool definitions ─────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "atlas_memory_read",
        description:
          "Read the ATLAS Living Document memory for the current project. Returns the full memory or a specific section.",
        inputSchema: {
          type: "object",
          properties: {
            project_root: {
              type: "string",
              description: "Absolute path to the project root directory",
            },
            section: {
              type: "string",
              description:
                "Optional: specific section to read (project, architecture, files, knowledge, sessions). Omit for full memory.",
              enum: [
                "project",
                "architecture",
                "files",
                "knowledge",
                "sessions",
                "all",
              ],
            },
          },
          required: ["project_root"],
        },
      },
      {
        name: "atlas_memory_write",
        description:
          "Update a section of the ATLAS Living Document memory. Merges with existing data rather than overwriting.",
        inputSchema: {
          type: "object",
          properties: {
            project_root: {
              type: "string",
              description: "Absolute path to the project root directory",
            },
            section: {
              type: "string",
              description:
                "Section to update (project, architecture, files, knowledge, sessions)",
              enum: [
                "project",
                "architecture",
                "files",
                "knowledge",
                "sessions",
              ],
            },
            data: {
              type: "object",
              description:
                "Data to merge into the section. For array fields, items are appended. For string fields, value is replaced.",
            },
          },
          required: ["project_root", "section", "data"],
        },
      },
      {
        name: "atlas_memory_query",
        description:
          "Search ATLAS memory by keyword. Returns all matching entries across all sections.",
        inputSchema: {
          type: "object",
          properties: {
            project_root: {
              type: "string",
              description: "Absolute path to the project root directory",
            },
            keyword: {
              type: "string",
              description: "Keyword to search for across all memory sections",
            },
          },
          required: ["project_root", "keyword"],
        },
      },
      {
        name: "atlas_memory_init",
        description:
          "Initialize ATLAS memory for a new project. Creates .atlas/memory.json with the provided project information.",
        inputSchema: {
          type: "object",
          properties: {
            project_root: {
              type: "string",
              description: "Absolute path to the project root directory",
            },
            project_name: {
              type: "string",
              description: "Name of the project",
            },
            project_description: {
              type: "string",
              description: "Brief description of what the project does",
            },
            stack: {
              type: "array",
              items: { type: "string" },
              description:
                "Technology stack (e.g. ['TypeScript', 'React', 'Node.js'])",
            },
            entrypoints: {
              type: "array",
              items: { type: "string" },
              description: "Main entry files (e.g. ['src/index.ts', 'app.js'])",
            },
            fragile_areas: {
              type: "array",
              items: { type: "string" },
              description: "Files or modules to treat as fragile",
            },
            architecture_overview: {
              type: "string",
              description: "Brief description of the architecture",
            },
          },
          required: [
            "project_root",
            "project_name",
            "project_description",
            "stack",
          ],
        },
      },
    ],
  };
});

// ─── Tool handlers ────────────────────────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    return { content: [{ type: "text", text: "Error: No arguments provided" }] };
  }

  // ── atlas_memory_read ──────────────────────────────────────────────────────
  if (name === "atlas_memory_read") {
    const projectRoot = args.project_root as string;
    const section = (args.section as string) || "all";

    const memory = readMemory(projectRoot);

    if (!memory) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              status: "not_initialized",
              message:
                "ATLAS memory not found for this project. Run atlas_memory_init to initialize.",
              project_root: projectRoot,
            }),
          },
        ],
      };
    }

    const result = section === "all" ? memory : memory[section as keyof AtlasMemory];

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ status: "ok", section, data: result }, null, 2),
        },
      ],
    };
  }

  // ── atlas_memory_write ─────────────────────────────────────────────────────
  if (name === "atlas_memory_write") {
    const projectRoot = args.project_root as string;
    const section = args.section as keyof AtlasMemory;
    const data = args.data as Record<string, unknown>;

    let memory = readMemory(projectRoot);
    if (!memory) {
      memory = emptyMemory();
    }

    const current = memory[section] as Record<string, unknown>;

    // Merge: arrays are appended, strings/primitives are replaced
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(current[key]) && Array.isArray(value)) {
        (current[key] as unknown[]).push(...(value as unknown[]));
      } else {
        current[key] = value;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (memory as any)[section] = current;
    writeMemory(projectRoot, memory);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            status: "ok",
            message: `Section '${section}' updated successfully`,
          }),
        },
      ],
    };
  }

  // ── atlas_memory_query ─────────────────────────────────────────────────────
  if (name === "atlas_memory_query") {
    const projectRoot = args.project_root as string;
    const keyword = (args.keyword as string).toLowerCase();

    const memory = readMemory(projectRoot);
    if (!memory) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              status: "not_initialized",
              message: "ATLAS memory not found. Run atlas_memory_init first.",
            }),
          },
        ],
      };
    }

    const matches: { section: string; field: string; value: string }[] = [];

    function searchValue(section: string, field: string, value: unknown): void {
      if (typeof value === "string" && value.toLowerCase().includes(keyword)) {
        matches.push({ section, field, value });
      } else if (Array.isArray(value)) {
        value.forEach((item) => {
          if (typeof item === "string" && item.toLowerCase().includes(keyword)) {
            matches.push({ section, field, value: item });
          } else if (typeof item === "object" && item !== null) {
            const str = JSON.stringify(item).toLowerCase();
            if (str.includes(keyword)) {
              matches.push({ section, field, value: JSON.stringify(item) });
            }
          }
        });
      }
    }

    for (const [sectionKey, sectionData] of Object.entries(memory)) {
      if (typeof sectionData === "object" && sectionData !== null) {
        for (const [fieldKey, fieldValue] of Object.entries(sectionData)) {
          searchValue(sectionKey, fieldKey, fieldValue);
        }
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              status: "ok",
              keyword,
              matches_found: matches.length,
              matches,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  // ── atlas_memory_init ──────────────────────────────────────────────────────
  if (name === "atlas_memory_init") {
    const projectRoot = args.project_root as string;

    const existing = readMemory(projectRoot);
    if (existing) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              status: "already_initialized",
              message:
                "ATLAS memory already exists for this project. Use atlas_memory_write to update it.",
              project_name: existing.project.name,
            }),
          },
        ],
      };
    }

    const memory = emptyMemory();
    memory.project.name = args.project_name as string;
    memory.project.description = args.project_description as string;
    memory.project.stack = (args.stack as string[]) || [];
    memory.project.entrypoints = (args.entrypoints as string[]) || [];

    if (args.fragile_areas) {
      memory.files.fragile = args.fragile_areas as string[];
    }

    if (args.architecture_overview) {
      memory.architecture.overview = args.architecture_overview as string;
    }

    memory.sessions.push({
      date: new Date().toISOString(),
      summary: "ATLAS memory initialized",
      filesChanged: [],
    });

    writeMemory(projectRoot, memory);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              status: "ok",
              message: `ATLAS memory initialized for '${memory.project.name}'`,
              memory_path: getMemoryPath(projectRoot),
              project: memory.project,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  return {
    content: [{ type: "text", text: `Error: Unknown tool '${name}'` }],
  };
});

// ─── Start ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ATLAS MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
