# SmartSurround

**AI-Enabled IoT-Based Real-Time Environmental and Surrounding Safety Monitoring System**

Software Engineering Laboratory — Team ABISKAR

> Intelligent Monitoring · Detection · Prediction · Safety

Live site: `https://rhitambiswas.github.io/Smartsurround/`

---

## Overview

Traditional environmental monitoring is reactive — manual checks, delayed detection, and warnings that only arrive *after* an unsafe condition has already occurred. SmartSurround takes a different approach: continuous sensing, on-device analysis, and proactive alerts, so risks are flagged before they escalate.

The system combines physical sensors, GPS location intelligence, live camera monitoring, and a real-time web dashboard into a single connected platform — built around two ESP32 boards that communicate with each other and a React-based web app.

---

## Features

### Public site
- Animated landing page — hero, capability walkthrough, step-by-step "How It Works" sequence, AI section, and contact
- In-page PDF/PPT viewer (Team ABISKAR whitepaper) with a full-screen toggle — opens inline, never redirects away from the site
- Responsive design across desktop, tablet, and mobile

### Dashboard (post-login)
- **Overview** — live IAQ gauge, PM1.0/2.5/10, temperature, humidity, CO2
- **Air Quality** — interactive trend chart with adjustable time range
- **Environment** — temperature/humidity/IAQ detail with a comfort score
- **Camera** — live MJPEG feed from the ESP32-CAM, auto-discovered (no manual IP entry needed)
- **Location** — live GPS fix from the NEO-8M module: latitude, longitude, altitude, speed, course, satellites, HDOP, fix type, UTC time
- **Data Log** — start/stop recording, adjustable interval, and export to Excel
- **Alerts** — live alerts generated from sensor thresholds, with an editable threshold panel
- **No simulated data** — every value on the dashboard comes directly from the connected ESP32; fields show `--` until real data arrives, rather than fabricating numbers

---

## Tech Stack

**Frontend**
- React + Vite
- Framer Motion (animation)
- Lucide React (icons)
- Tailwind CSS

**Firmware**
- Arduino / ESP32 (C++)
- Two independent boards, communicating over WiFi

---

## Hardware

| Component | Role | Connection |
|---|---|---|
| ESP32 (main) | Sensor hub, WiFi API server | — |
| ESP32-CAM (AI-Thinker) | Live video stream | — |
| BME680 | Temperature, humidity, gas/IAQ | I2C — SDA → GPIO 22, SCL → GPIO 21 |
| PMS7003 | PM1.0 / PM2.5 / PM10 | UART — RX → GPIO 26, TX → GPIO 27 |
| NEO-8M GPS | Location, speed, altitude, satellites | UART (Serial2) — TX2/RX2, GPIO 16/17 |

### How the two ESP32s work together

The main sensor board and the camera board are separate physical devices on the same WiFi network:

1. The **ESP32-CAM** streams MJPEG video at `/stream` and sends an HTTP heartbeat (`POST /camera-status`) to the main board every few seconds, reporting its own IP.
2. The **main ESP32** stores that IP and folds it into its own `/api/readings` response (`camIp`, `cameraOnline`).
3. The **web dashboard** only ever needs the main board's IP — it discovers the camera automatically through that heartbeat relationship, rather than requiring a second IP to be entered manually.

Firmware source: `/firmware/SmartSurround_MainSensor/` and `/firmware/SmartSurround_CamNode/`

---

## Getting Started (Web App)

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal. The dashboard's ESP32 connection panel lets you enter your main board's local IP (e.g. `192.168.1.42`) to pull live readings.

### Build & Deploy (GitHub Pages)

```bash
npm run build      # outputs to /dist
npm run deploy      # publishes /dist to the gh-pages branch
```

`vite.config.js` must have `base` set to match the exact repository name (case-sensitive), e.g.:

```js
base: '/Smartsurround/'
```

GitHub → repo **Settings → Pages** → Source: *Deploy from a branch* → Branch: `gh-pages` / `root`.

---

## Firmware Setup

1. Open the relevant `.ino` file in Arduino IDE.
2. Install the required libraries (listed in comments at the top of each file): Adafruit BME680, Adafruit Unified Sensor, TinyGPSPlus, ArduinoJson.
3. Set `WIFI_SSID` and `WIFI_PASSWORD`.
4. On the camera board, set `MAIN_ESP32_IP` to the sensor board's IP once known (from its Serial Monitor output after first boot).
5. Flash each board separately, on the same WiFi network.

> **Note:** the BME680's IAQ/CO2-equivalent/VOC-equivalent values use a simplified gas-resistance heuristic for relative trending — not Bosch's official BSEC algorithm, which is closed-source and requires separate licensing/SDK integration.

---

## Known Limitation: Live Data on GitHub Pages

GitHub Pages serves the site over HTTPS. The ESP32 serves data over plain HTTP on your local network. Browsers block HTTPS pages from fetching HTTP resources ("mixed content"), so **live sensor data will not load when the site is accessed via the GitHub Pages URL** — even on the same WiFi network as the ESP32.

- The site itself (navigation, login, PPT viewer, UI) works from anywhere, always.
- Live ESP32 data currently only works when running the dashboard locally (`npm run dev`) on the same network as the hardware.
- A cloud relay (ESP32 → HTTPS backend → dashboard) is the planned fix for live data to work from the hosted GitHub Pages link as well.

---

## Security Notes

The current build is prototype-grade, not production-hardened:

- Login is a client-side demo check, not a real authentication backend
- ESP32 API endpoints (`/api/readings`, `/api/gps`, `/camera-status`) have no authentication
- CORS is open (`*`) on both boards
- Data is transmitted over plain HTTP on the local network
- WiFi credentials are stored directly in the firmware source

Recommended before any public/production deployment: API key authentication on all device endpoints, heartbeat validation on `/camera-status`, TLS on the relay layer, and moving WiFi/API secrets out of version control.

---

## Roadmap

- Advanced AI models and edge AI deployment
- Multi-post control center and companion mobile app
- Smart-city integration and cloud deployment
- Digital map of all monitoring posts and incidents
- Cloud relay for live data access from anywhere

---

## Team

**Team ABISKAR** — Software Engineering Laboratory

*"SmartSurround transforms environmental monitoring from simple data collection into intelligent sensing, detection, prediction, and safety management."*