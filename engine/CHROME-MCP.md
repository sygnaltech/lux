# Chrome DevTools MCP Configuration for Custom Extensions

## Overview

By default, Chrome MCP launches Chrome in automation mode which disables the Chrome Web Store and prevents extension installation. This document explains how to configure Chrome MCP to support custom extensions with a persistent local profile.

## The Problem

Chrome automation mode applies these restrictions:
- Disables the Chrome Web Store
- Blocks extension installation
- Shows "Installation is not enabled" message

## The Solution

Use a project-local Chrome profile with specific flags to:
1. Create a persistent profile directory
2. Disable automation restrictions
3. Allow manual extension installation

## Configuration

Add the following to your `.mcp.json`:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest",
        "--userDataDir=d:/Projects/Clients/lux/.chrome-profile",
        "--ignoreDefaultChromeArg=--enable-automation",
        "--chromeArg=--disable-blink-features=AutomationControlled",
        "--ignoreDefaultChromeArg=--disable-extensions"
      ]
    }
  }
}
```

### Key Flags Explained

- `--userDataDir=<path>`: Creates a persistent Chrome profile in your project directory
- `--ignoreDefaultChromeArg=--enable-automation`: Removes the automation banner
- `--chromeArg=--disable-blink-features=AutomationControlled`: Hides automation from websites
- `--ignoreDefaultChromeArg=--disable-extensions`: Re-enables extension installation

## Setting Up Extensions

1. **First Launch**: Chrome MCP launches with an empty profile
2. **Install Extensions**: Manually install your required extensions through Chrome's UI
3. **Persistence**: All extensions, settings, and configurations are saved in `.chrome-profile/`
4. **Future Sessions**: Extensions automatically load on subsequent launches

## Important Notes

- The `.chrome-profile/` directory should be added to `.gitignore`
- Extensions only need to be installed once
- The profile persists across Claude Code restarts
- Each project can have its own isolated Chrome profile

## Verification

After restarting Claude Code with this configuration, Chrome should:
- Launch without "controlled by automated test software" message
- Allow access to the Chrome Web Store
- Allow extension installation
- Persist all settings between sessions
