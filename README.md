# DiskOH - Modern Disk Space Analyzer

[![Build Status](https://github.com/BeardedTech0o/DISK-OH/actions/workflows/test.yml/badge.svg)](https://github.com/BeardedTech0o/DISK-OH/actions)

A modern, beautiful disk space analyzer for Windows built with Electron, React, and TypeScript.

## Features

- **Interactive Treemap Visualization** - See your disk usage at a glance with drill-down exploration
- **Dark Mode Support** - System theme detection and manual toggle
- **Multi-Drive Analysis** - Compare usage across multiple drives
- **File Deletion** - Safely delete folders with confirmation dialogs
- **Auto-Updates** - Automatic dependency and app updates with safety checks
- **Windows Native** - NSIS installer, UAC elevation, full drive access

## Installation

Download the latest `DiskOH-Setup.exe` from [Releases](https://github.com/BeardedTech0o/DISK-OH/releases) and run it.

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
npm install
```

### Commands
```bash
# Start development server with hot reload
npm run dev

# Build React bundle
npm run build

# Run Electron app with built bundle
npm run electron-dev

# Run smoke tests
npm test

# Build Windows installer (.exe)
npm run dist
```

## Architecture

- **Main Process** (Node.js) - Handles file system access, disk scanning, updates
- **Renderer Process** (React) - UI with treemap visualization and settings
- **IPC Communication** - Safe bridge between main and renderer processes

## Project Structure

```
src/
├── main/              # Electron main process
│   ├── main.ts       # App entry point
│   ├── preload.ts    # IPC bridge
│   ├── scanner.ts    # Disk scanning logic
│   ├── drive-utils.ts # Windows drive enumeration
│   ├── file-ops.ts   # File deletion
│   ├── updater.ts    # Auto-updates
│   └── smoke-tests.ts # Post-update validation
├── renderer/          # React UI
│   ├── App.tsx
│   ├── components/    # UI components
│   └── main.tsx      # React entry
└── shared/            # Shared types & constants
```

## Update Strategy

**npm Dependencies**: Uses caret ranges (^) allowing minor/patch updates only. Major versions are pinned and require manual updates.

**App Updates**: electron-updater checks GitHub releases on startup. Updates are silent and installed on next launch.

**Safety**: Smoke tests run after updates validate core functionality.

## CI/CD

- **test.yml** - Runs on every push: type checking, tests, build
- **release.yml** - Runs on version tags: builds installer and creates GitHub release

## License

MIT
