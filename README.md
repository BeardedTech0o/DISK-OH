![Banner](https://github.com/BeardedTech0o/DISK-OH/blob/main/banner.png?raw=true)

A modern disk space analyzer for Windows. Built with Electron, React, and TypeScript.

## Features

Interactive treemap visualization showing folder sizes at a glance. Click to zoom into directories, use breadcrumbs to navigate back. Dark mode support with system theme detection. Multi-drive comparison. Safe file deletion to Recycle Bin. Automatic app and dependency updates. System integration with UAC elevation for full drive access.

## Installation

Download DiskOH-Setup.exe from [Releases](https://github.com/BeardedTech0o/DISK-OH/releases) and run it. The installer will create Start Menu shortcuts and request administrator privileges on first launch.

## Usage

Launch from Start Menu. Select a drive from the sidebar to scan it. Click any folder in the treemap to zoom in. Use breadcrumbs or back button to navigate. Toggle dark mode in the Settings panel.

## Development

```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build React bundle
npm run electron-dev # Run Electron app with built bundle
npm test             # Run smoke tests
npm run dist         # Build Windows installer
```

## Architecture

Main process (Node.js) handles file system access and disk scanning. Renderer process (React) displays the UI. IPC communication bridges the two. TypeScript throughout for type safety.

src/main contains Electron entry point, file scanning, drive enumeration, file operations, and auto-updates. src/renderer contains React components and hooks. src/shared contains shared types and constants.

## CI/CD

GitHub Actions automatically runs tests on every push. Type checking, smoke tests, and full build validation. Release workflow builds installer when you push a version tag.

## License

MIT
