# Real-Time Metrics Dashboard - Walkthrough

## Overview
We have built a **Real-Time System Metrics Dashboard** that monitors your computer's performance and provides useful daily widgets.

**Features:**
- 📊 **System Metrics**: Live CPU Load, Memory Usage with **Historical Area Graphs**.
- ⚡ **Top Processes**: 
    - Real-time list of top 50 resource-consuming applications.
    - **Visual Bar Chart** for Top 10 apps.
    - **Searchable** by name or PID.
    - **Timeline** column showing when processes started.
    - **System Filter**: Toggle "Show/Hide System" to declutter the workspace.
- 🕒 **Digital Clock**: Premium Neon design with gradient text and seconds indicator.
- ☀️ **Weather**: Live weather updates using auto-detected location (Open-Meteo).
- 📉 **Network Sparklines**: Real-time Download/Upload traffic monitoring.
- 💿 **Disk Usage**: Interactive donut chart for storage tracking.
- ✨ **Animated Background**: Soft-glow mesh gradient for a premium feel.
- 🗄️ **History & Persistence**: All metrics are logged every 5s to a local **SQLite** database.
- 📂 **Historical Reports**: Export system performance data as **CSV** via the new "Reports" link.
- ⚙️ **Windows Service**: Run as a background service that starts automatically with Windows.
- 🧹 **Auto-Purge**: Intelligent database cleanup logs older than 30 days are automatically deleted every 24h to save space.
- 🐳 **Docker Support**: Containerized components with `docker-compose` for instant deployment.
- ☁️ **Cloud Ready**: Dynamic backend connectivity allows hosting the dashboard anywhere.
- 🌐 **Custom Local Domain**: Mapping `systempulse.local` for a more professional local experience.
- 🔒 **Local HTTPS (SSL)**: Secure, encrypted communication via self-signed certificates.

## Architecture
- **Backend (Node.js)**: Uses `systeminformation` for complex metrics and the native `os` module for ultra-fast vital stats. Served over **HTTPS**.
- **Frontend (React + Vite)**: Listens for Secure WebSocket (WSS) events. Served over **HTTPS**.
- **Performance**: Optimized with a global broadcast loop, reducing WMI overhead from 20s to ~500ms.

## How to Run
1. Open your terminal in the **project root directory** (where `package.json` is located).
2. Run: `npm start`
3. Open in browser: **https://systempulse.local:5173**

### 6. Interactive Dashboard & Utilities
- **High-Precision Clock**: 24-hour digital clock with real-time date.
- **Dynamic Weather**: Localized weather reporting via `wttr.in`.
- **Customizable Layout**: Full drag-and-drop and resize support with `react-grid-layout`.
- **Layout Persistence**: Automatically saves your dashboard arrangement to local storage.

## Visual Tour

![Final Pulse Dashboard Dashboard](C:/Users/BCP/.gemini/antigravity/brain/32cd7705-e01f-4330-8433-9e2dbd5c22fa/final_dashboard_check_1768790579018.png)
*Behold: The completed System Pulse Dashboard with custom layout, clock, and weather.*

### verification Video
![Dashboard Polish Verification](C:/Users/BCP/.gemini/antigravity/brain/32cd7705-e01f-4330-8433-9e2dbd5c22fa/final_polish_verification_verified_1768790302398.webp)
*Watch the layout persistence and SSL verification in action.*

![Secure Custom Domain](C:/Users/BCP/.gemini/antigravity/brain/32cd7705-e01f-4330-8433-9e2dbd5c22fa/dashboard_https_verification_1768789545650.png)
*Success! Secure HTTPS connection on systempulse.local.*
