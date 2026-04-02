# ATLAS Setup Script for Windows
# Run this from the root of the ATLAS repository

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   ATLAS Setup for Windows" -ForegroundColor Cyan
Write-Host "   Adaptive Thinking Layer for Agentic" -ForegroundColor Cyan
Write-Host "   Systems -- Claude Code" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# -- Step 1: Check Node.js ---------------------------------------------------
Write-Host "[1/6] Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Node.js is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install Node.js >= 20 from https://nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host "      Node.js found: $nodeVersion" -ForegroundColor Green

# -- Step 2: Build MCP server ------------------------------------------------
Write-Host "[2/6] Building ATLAS MCP server..." -ForegroundColor Yellow
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location (Join-Path $scriptDir "..\mcp-server")
try {
    npm install --silent
    if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "TypeScript build failed" }
    Write-Host "      MCP server built successfully." -ForegroundColor Green
} catch {
    Write-Host "ERROR: $_" -ForegroundColor Red
    exit 1
} finally {
    Pop-Location
}

# -- Step 3: Detect Claude Code config directory -----------------------------
Write-Host "[3/6] Locating Claude Code config directory..." -ForegroundColor Yellow
$claudeConfigDir = "$env:APPDATA\Claude"
$claudeCommandsDir = "$claudeConfigDir\commands"

if (-not (Test-Path $claudeConfigDir)) {
    New-Item -ItemType Directory -Path $claudeConfigDir -Force | Out-Null
    Write-Host "      Created Claude config directory: $claudeConfigDir" -ForegroundColor Green
} else {
    Write-Host "      Found Claude config directory: $claudeConfigDir" -ForegroundColor Green
}

if (-not (Test-Path $claudeCommandsDir)) {
    New-Item -ItemType Directory -Path $claudeCommandsDir -Force | Out-Null
}

# -- Step 4: Install slash commands ------------------------------------------
Write-Host "[4/6] Installing ATLAS slash commands..." -ForegroundColor Yellow
$commandsSource = Join-Path $scriptDir "..\commands"
if (Test-Path $commandsSource) {
    Copy-Item -Path "$commandsSource\*" -Destination $claudeCommandsDir -Recurse -Force
    Write-Host "      Slash commands installed to $claudeCommandsDir" -ForegroundColor Green
} else {
    Write-Host "      No commands directory found, skipping." -ForegroundColor Gray
}

# -- Step 5: Configure MCP server in Claude Code -----------------------------
Write-Host "[5/6] Configuring ATLAS MCP server..." -ForegroundColor Yellow

$mcpServerPath = (Resolve-Path (Join-Path $scriptDir "..\mcp-server\dist\index.js")).Path
$mcpConfigPath = "$claudeConfigDir\claude_desktop_config.json"

$newMcpEntry = @{
    command = "node"
    args    = @($mcpServerPath)
}

if (Test-Path $mcpConfigPath) {
    $config = Get-Content $mcpConfigPath -Raw | ConvertFrom-Json
    if (-not $config.mcpServers) {
        $config | Add-Member -NotePropertyName "mcpServers" -NotePropertyValue @{}
    }
    $config.mcpServers | Add-Member -NotePropertyName "atlas-mcp" -NotePropertyValue $newMcpEntry -Force
    $config | ConvertTo-Json -Depth 10 | Set-Content $mcpConfigPath -Encoding UTF8
} else {
    $config = @{
        mcpServers = @{
            "atlas-mcp" = $newMcpEntry
        }
    }
    $config | ConvertTo-Json -Depth 10 | Set-Content $mcpConfigPath -Encoding UTF8
}

Write-Host "      MCP server configured in $mcpConfigPath" -ForegroundColor Green

# -- Step 6: Done ------------------------------------------------------------
Write-Host "[6/6] Setup complete!" -ForegroundColor Yellow
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  ATLAS is installed. Here is how to use it:" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Cyan
Write-Host "  1. Open your project in VS Code" -ForegroundColor Cyan
Write-Host "  2. Open Claude Code (Ctrl+Shift+P > Claude Code)" -ForegroundColor Cyan
Write-Host "  3. Copy templates\CLAUDE.md into your project root" -ForegroundColor Cyan
Write-Host "  4. Run: /atlas_init  to initialize project memory" -ForegroundColor Cyan
Write-Host "  5. Start working -- ATLAS runs automatically" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Cyan
Write-Host "  Commands: /atlas_run  /atlas_plan  /atlas_memory" -ForegroundColor Cyan
Write-Host "            /atlas_challenge  /atlas_confidence" -ForegroundColor Cyan
Write-Host "            /atlas_review  /atlas_help" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
