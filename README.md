# Real-Time System Metrics Dashboard

## Overview
Real-Time System Metrics Dashboard** that monitors your computer's performance and provides useful daily widgets.

**Features:**
- 📊 **System Metrics**: Live CPU Load, Memory Usage with **Historical Area Graphs**.
- 🎮 **GPU Monitoring**: Real-time GPU information including model, vendor, and VRAM capacity.
- ⚡ **Top Processes**: 
    - Real-time list of top 50 resource-consuming applications.
    - **Visual Bar Chart** for Top 10 apps.
    - **Searchable** by name or PID.
    - **Timeline** column showing when processes started.
    - **System Filter**: Toggle "Show/Hide System" to declutter the workspace.
- 🎯 **Daily Goals Widget**: 
    - Add up to 10 daily goals with progress tracking.
    - **Click-to-Edit**: Inline editing of goal text.
    - **Clear Done**: One-click removal of completed tasks.
    - **Achievement System**: Visual celebration (⭐⭐⭐ "Perfect Day!") at 100% completion.
- 🕒 **Digital Clock**: Premium Neon design with gradient text and seconds indicator.
- ☀️ **Weather**: Live weather updates using auto-detected location (Open-Meteo).
- 📉 **Network Sparklines**: Real-time Download/Upload traffic monitoring.
- 💿 **Disk Usage**: Interactive donut chart for storage tracking.
- ✨ **Premium UI**: Hover animations with lift and glow effects on all widgets.
- 🗄️ **History & Persistence**: All metrics are logged every 5s to a local **SQLite** database.
- 📂 **Historical Reports**: Export system performance data as **CSV** via the new "Reports" link.
- ⚙️ **Windows Service**: Run as a background service that starts automatically with Windows.
- 🧹 **Auto-Purge**: Intelligent database cleanup logs older than 30 days are automatically deleted every 24h to save space.
- 🐳 **Docker Support**: Containerized components with Docker Compose for instant deployment.
- ☁️ **Cloud Ready**: Dynamic backend connectivity allows hosting the dashboard anywhere.
- 🌐 **Custom Local Domain**: Mapping `systempulse.local` for a more professional local experience.
- 🔒 **Local HTTPS (SSL)**: Secure, encrypted communication via self-signed certificates.

## Architecture
- **Backend (Node.js)**: Uses `systeminformation` for complex metrics and the native `os` module for ultra-fast vital stats. Served over **HTTPS**.
- **Frontend (React + Vite)**: Listens for Secure WebSocket (WSS) events. Served over **HTTPS**.
- **Performance**: Optimized with a global broadcast loop, reducing WMI overhead from 20s to ~500ms.

## How to Run

### Local Development
1. Open your terminal in the **project root directory** (where `package.json` is located).
2. Run: `npm start`
   - *Alternative (if npm is blocked):* `node server/index.js` (for backend) and `npm run client` separately.
3. Open in browser: **https://systempulse.local:5173**

### Docker Deployment
1. Ensure Docker Desktop is installed and running
2. Build and start containers:
   ```bash
   docker compose build
   docker compose up -d
   ```
3. View logs:
   ```bash
   docker compose logs -f
   ```
4. Stop containers:
   ```bash
   docker compose down
   ```
5. Access dashboard: **https://systempulse.local** (ports 80/443)

## Interactive Dashboard & Utilities
- **High-Precision Clock**: 24-hour digital clock with real-time date.
- **Dynamic Weather**: Localized weather reporting.
- **Customizable Layout**: Full drag-and-drop and resize support with `react-grid-layout`.
- **Layout Persistence**: Automatically saves your dashboard arrangement to local storage.
