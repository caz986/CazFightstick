# CazFightstick — GP2040 Configurator (Windows-first)

This is a ready-to-run Tauri + React desktop app template for configuring GP2040-based fightstick firmware and flashing UF2 firmware.

Features included:
- Read/write GP2040 config via HTTP (/api/config and /api/save)
- Visual editor for button mapping, LEDs, system settings
- Live OLED preview that updates when you change button mapping
- Firmware flash tab with auto-detect RPI-RP2 drive, progress animation
- Download latest firmware from GitHub releases
- Backup & restore config (.json)
- Windows-first detection logic (but cross-platform code included)
- Placeholder hooks/comments for serial / WebUSB integration

## Quick start (Windows)

Prerequisites:
- Node.js >= 18
- Rust + Cargo (via rustup)
- Tauri prerequisites (see https://tauri.app for Windows dev setup)

Steps:
```bash
# 1. Install dependencies
npm install

# 2. Run in dev mode (this opens a native window)
npm run tauri

# 3. Build distributables (after testing)
npm run tauri:build
```

## CI Build
A GitHub Actions workflow `.github/workflows/windows-build.yml` is included to build Windows installers automatically when you push to `main`.

