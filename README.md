<p align="center">
  <img src="https://github.com/BeardedTech0o/DISK-OH/blob/main/banner.png?raw=true" alt="DISK-OH Banner" width="100%">
</p>

[![Build Status](https://github.com/BeardedTech0o/DISK-OH/actions/workflows/test.yml/badge.svg)](https://github.com/BeardedTech0o/DISK-OH/actions)

DiskOH is a modern disk space analyzer for Windows that helps you understand and manage your storage usage. Built with Electron, React, and TypeScript, it combines powerful disk analysis with an intuitive visual interface.

## Overview

DiskOH replaces aging disk analysis tools with a contemporary alternative designed for how people actually use computers today. Instead of lists and percentages, DiskOH shows you a visual treemap that makes it instantly clear where your disk space is going. Every folder is color-coded by size, and you can click to zoom into any directory to find those hidden space hogs.

The app runs with system-level permissions to analyze all drives, including protected system directories. It automatically checks for updates to both the app itself and its dependencies, ensuring you always have the latest features and security fixes without any manual intervention.

## Features

Interactive Treemap Visualization

See your entire disk at a glance with a color-coded treemap visualization. Each folder is displayed as a rectangle sized proportional to its disk usage. Red indicates large folders, yellow for medium, green for small. Click any folder to zoom in and explore its contents. Use breadcrumb navigation to move back up the hierarchy. The visualization updates in real time as you navigate deeper into your directory structure.

Drill Down Navigation

Navigate through your folder hierarchy with instant feedback. Each level loads quickly, showing the largest subfolders first. The app caches previously scanned directories so navigation is snappy. Use the back button or breadcrumbs to move up the tree. As you explore, the app continuously tracks which folders you have already analyzed to minimize redundant scanning.

Dark Mode Support

The entire interface adapts to your system theme preference or your manual selection. All components including the treemap, sidebar, settings panel, and buttons automatically adjust colors for readability in low light. Your preference is saved and persists across app restarts. The treemap color gradient remains distinct in both light and dark modes for accessibility.

Multi-Drive Comparison

Analyze multiple drives side by side. Select which drives to compare and view their usage patterns simultaneously. See at a glance which drive is filling up fastest. The comparison view shows total capacity, used space, and free space for each drive with accurate percentages. Future versions will include temporal comparisons to track how your usage changes over time.

Safe File Deletion

Delete folders directly from the app with built-in safety features. Right click any folder in the treemap to delete it. A confirmation dialog shows the folder name, total size, and file count before deletion. Deleted items go to the Recycle Bin, so they remain recoverable. A progress bar shows deletion status for large folders. The treemap updates automatically after deletion to show your newly freed space.

System Integration

DiskOH integrates deeply with Windows through UAC elevation, requesting administrator privileges on startup. This grants access to all drive letters and protected system directories that normal user-level apps cannot see. The installer creates Start Menu shortcuts and properly registers the app with Windows. Users can uninstall through Control Panel like any standard Windows application.

Automatic Updates

The app checks for new releases on startup and downloads them silently in the background. Updates install on next launch without interrupting your work. Your npm dependencies are automatically checked for available updates. When you choose to update dependencies, smoke tests validate that critical features still work before restarting the app. If an update breaks something, the app rolls back and notifies you.

Performance Optimized

Initial disk scans complete quickly even on large drives. The app uses hybrid scanning that loads the entire directory tree first, then lazy loads subdirectories on demand as you click into them. Results are cached in memory for instant navigation. TypeScript ensures type safety across the entire codebase, catching errors at development time rather than runtime.

## Installation

Download the latest DiskOH-Setup.exe from the Releases page. Run the installer and follow the prompts. The app will request administrator privileges during first launch. Once installed, you can launch DiskOH from the Start Menu or desktop shortcut.

For portable usage, advanced users can extract the app files directly without running the installer.

## Getting Started

Launch DiskOH from the Start Menu. The sidebar shows all available drives on your system. Select a drive and the app begins scanning it. A progress indicator shows scan completion percentage and the current directory being analyzed. Once the scan completes, the main view displays a full treemap of that drive.

Click any folder in the treemap to zoom into it. The breadcrumb trail at the top shows your current location and lets you navigate back. Use the Settings panel to toggle dark mode, check for updates, or view app information.

## Development

Prerequisites

Node.js version 18 or later with npm. A modern code editor such as VS Code is recommended but not required.

Initial Setup

Clone the repository and install dependencies with npm install. This downloads all required packages including Electron, React, and build tools. The initial install takes about one minute.

Development Commands

npm run dev starts the Vite development server on http://localhost:5173 with hot module reloading. Changes to React components appear instantly.

npm run build compiles the React code and assets into the dist/renderer directory.

npm run electron-build runs the full build pipeline and launches the Electron app using the built bundle.

npm test runs the smoke test suite validating that core functionality works. Tests check drive enumeration, directory scanning, and file operations.

npm run dist packages the app into a Windows installer (.exe) using electron-builder. The installer is created in the dist directory.

Project Architecture

The application uses Electron's dual process model. The main process runs Node.js code and has full file system access. The renderer process runs React and displays the UI. Communication between the two happens through a secure IPC bridge that prevents the renderer from directly accessing the file system.

The main process handles all disk scanning operations, which happen asynchronously to keep the UI responsive. Progress is streamed to the renderer via IPC events. File deletion operations also run on the main process with UAC elevation.

TypeScript is used throughout for type safety. Shared types live in src/shared/types.ts and are imported by both main and renderer code. This ensures that IPC messages have the correct shape and parameters.

File Structure

Source code lives in the src directory. Within that are three subdirectories.

src/main contains the Electron main process code. main.ts is the entry point that creates the app window. preload.ts exposes safe IPC methods to the renderer. scanner.ts implements the recursive directory scanning algorithm. drive-utils.ts enumerates Windows drives using WMI. file-ops.ts handles safe file deletion to the Recycle Bin. updater.ts orchestrates both app updates and dependency checks. smoke-tests.ts contains validation tests that run after updates.

src/renderer contains the React application. App.tsx is the root component that manages overall state. components contains individual UI components like Sidebar, Treemap, and SettingsPanel. hooks contains custom React hooks for managing scan state and dark mode preferences. main.tsx is the React entry point that mounts the app into the DOM.

src/shared contains code used by both main and renderer. types.ts defines all TypeScript interfaces for drives, folders, and IPC messages. constants.ts defines IPC channel names and configuration constants.

Build artifacts go in dist. dist/renderer contains the compiled React code and assets. electron-builder will add dist/main with the compiled main process code.

The root directory contains configuration files. package.json defines dependencies and build scripts. tsconfig.json and vite.config.ts configure TypeScript and the build system. tailwind.config.js configures the CSS framework. index.html is the HTML template that React mounts into.

Dependency Management

The project uses npm's caret versioning scheme for most dependencies. This allows npm to install newer minor and patch versions automatically while preventing breaking changes from major version upgrades. The line "react": "^18.3.0" in package.json allows updates to any 18.x.x version.

Electron is pinned to a major version without caret. This ensures more stability for a system-level application. When the Electron team releases a new major version, we update it manually after validating compatibility.

When you run npm install, npm compares the versions in package.json against what is installed locally. If newer versions are available that match your version specification, npm downloads and installs them. The exact versions are recorded in package-lock.json to ensure reproducible installs.

Update Safety

Before installing dependency updates, the app runs a full type check with npx tsc --noEmit. This catches incompatibilities at the TypeScript level before runtime. After updates install, smoke tests run to validate that disk scanning, UI rendering, and file deletion still work correctly.

If an update breaks something, the app rolls back node_modules to its previous state and notifies you. You can choose to skip that particular update and wait for a fix.

CI/CD Pipeline

Continuous Integration runs on every push to the repository. The test.yml workflow runs type checking, smoke tests, and a full build. If any step fails, the workflow stops and reports the error in the GitHub UI and sends an email notification.

The release.yml workflow triggers when you push a version tag like v0.2.0. It runs the full test suite, then builds the Windows installer, and creates a GitHub release with the installer as a downloadable asset.

To create a release, commit your changes, then run git tag v0.2.0 && git push --tags. GitHub Actions automatically builds and publishes the installer within a few minutes.

Version Control

The main branch is the current stable code. All development happens on feature branches. When a feature is complete, create a pull request to main. GitHub Actions automatically runs the test suite on the PR, showing results inline before merge.

Commits follow conventional commit format. Use "feat: add feature name" for new features, "fix: bug description" for bug fixes, and "chore: update deps" for maintenance tasks. This keeps the git history clean and searchable.

Building for Distribution

To create a distribution package, run npm run dist. The Electron Builder tool reads the build configuration from package.json and creates a Windows installer in the dist directory. The installer is named DiskOH-Setup.exe.

Before distributing, verify that the app works correctly by running npm run electron-build and manually testing the core features. Check that disk scanning works, dark mode toggles properly, and file deletion prompts appear as expected.

## Architecture Details

Main Process Design

The main process is a Node.js application that runs before and after the renderer process. It creates the application window, manages the window lifecycle, and sets up menu items. The main process runs with full Windows privileges, including UAC elevation if requested.

The main process does not render anything itself. It communicates with the renderer process through IPC. The preload script defines the bridge between the two, exposing only the methods that the renderer should be able to call.

File scanning runs on the main process asynchronously so the UI remains responsive. The scanner recursively walks the directory tree, calculating directory sizes by summing file sizes. It emits progress events as it scans, allowing the UI to show scanning progress.

Renderer Process Design

The renderer process is a standard React application that displays in an Electron window. It receives native window controls from Electron, so minimize, maximize, and close buttons work as expected. The window can be resized and responds to keyboard shortcuts.

React manages the UI state. The App component holds the list of drives, the selected drive, and the current folder hierarchy being displayed. When the user clicks a folder, React updates state and re-renders the treemap with the new data.

Dark mode is managed through a React hook that reads from localStorage. When the user toggles dark mode, the preference is saved to localStorage and persists across restarts. The hook also syncs with the HTML element's dark class, which Tailwind uses to apply dark mode styles.

IPC Communication

Communication between main and renderer uses ipcMain and ipcRenderer from Electron. The preload script exposes safe wrapper functions that hide the complexity of IPC. From the React component perspective, calling window.electron.scanDrive(drive) looks like a normal async function.

The IPC bridge uses invoke for request-response patterns and on for event streams. Scanning emits multiple progress events as it runs, so it uses the on pattern. Deleting a file is a single operation, so it uses invoke.

All IPC data is validated on the main process side. If the renderer sends unexpected data, the main process logs an error and does not act on it. This prevents the renderer from causing crashes or security issues.

TypeScript Types

Shared types live in src/shared/types.ts. DriveInfo describes a Windows drive with capacity and usage. FolderInfo describes a directory with its size and list of subfolders. ScanProgress describes the progress of an ongoing scan. These types are imported in both main and renderer code.

Using shared types prevents type mismatches between IPC sender and receiver. When you define an ipc invoke that returns FolderInfo, TypeScript verifies that the main process actually returns that type, and the renderer code handling the response gets autocomplete based on the actual shape of the data.

## Testing

Smoke Tests

The smoke-tests.ts file contains simple validation tests that run after dependency updates. They verify that critical features still work.

Tests check that getDrives returns an array of drive objects with the correct shape. Tests verify that scanDrive can run without throwing errors on a valid path. Tests confirm that all expected properties exist on the returned objects.

Smoke tests run in Node.js directly using Node's built-in test runner. They do not require Electron or a UI. The npm test command runs them in seconds.

Manual Testing

For more thorough validation, run npm run electron-build to start the app. Test the core workflow: select a drive, verify the scan completes, click a folder to zoom in, use the back button to navigate back, toggle dark mode, check that deletion prompts appear when right clicking.

Test with multiple drives if your system has them. Test with large directories that take a few seconds to scan. Test that the UI remains responsive during scanning.

## Troubleshooting

The app fails to start with a permission error

DiskOH requires administrator privileges to scan system drives. Right click the DiskOH shortcut and select Run as Administrator. Or reinstall the app and accept the UAC prompt during first launch. Once elevated, the app should run normally in future launches.

Scanning is slow on large drives

Scanning speed depends on how many folders your drive contains. A drive with millions of small files will scan more slowly than a drive with fewer large files. Scanning happens in the background and the UI remains responsive, so you can use other windows while DiskOH works.

Disk usage numbers do not match Windows

DiskOH calculates disk usage by summing file sizes. Windows File Explorer may report different numbers if it counts allocated clusters instead of actual file size, or if file compression is involved. The difference is usually small and both numbers are correct, just measuring different things.

The app updates but does not show changes

Some updates may require a full app restart. After updating, close the app completely and reopen it. If the update still does not appear, try uninstalling and reinstalling DiskOH.

## License

MIT
