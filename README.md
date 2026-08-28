# 🛠️ FixIt Campus — Report → Track → Resolve

> **Track:** Open Innovation  
> **Tagline:** *"From noticing a problem to proving it's fixed."*  
> **Mission:** FixIt Campus brings students, administrators, maintenance teams, and autonomous IoT devices into one transparent, AI-prioritized, and accountable campus maintenance platform.

---

## ⚡ Quick Start & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(FixIt Campus includes a reactive local engine preloaded with 25+ complaints, users, and IoT sensors so you can immediately run without external API keys).*

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🔑 Demo Accounts (1-Click Judge Access)

FixIt Campus features a sticky **Hackathon Quick Access Banner** at the top of the screen with 1-click authentication:

| Role | Demo Email | Password | Primary Capabilities |
|---|---|---|---|
| **👨‍🎓 Student** | `student@fixitcampus.demo` | *(Any / 1-Click)* | Report issues, AI classification, GPS tagging, before/after inspection, verify resolution (`CLOSED` / `REOPENED`), upvote complaints. |
| **👩‍💼 Admin** | `admin@fixitcampus.demo` | *(Any / 1-Click)* | Executive KPI metrics, emergency dispatch, interactive campus map, problem analytics, CSV export, IoT monitoring. |
| **👷 Maintenance** | `maintenance@fixitcampus.demo` | *(Any / 1-Click)* | Task queue, "Accept" → "Start Work" → "Upload After Proof & Note" → "Mark Resolved". |

---

## 🚀 The 15-Step Hackathon Demo Walkthrough

Follow this exact flow during judging to demonstrate the full lifecycle:

1. **Student Login**: Click **Student Demo** on the top banner or login as `student@fixitcampus.demo`.
2. **Report Issue**: Navigate to **Report Issue** (`/student/report`).
3. **Upload Photo**: Click one of the quick test presets (e.g. *Water Leakage*) or upload a custom image.
4. **Enter Description**: *"Water is leaking from the ceiling in Room 204."*
5. **AI Analysis**: Observe the neural vision card auto-detecting:
   - **Category**: `Plumbing`
   - **Priority**: `Critical`
   - **Suggested Department**: `Plumbing & Hydraulic Infrastructure`
   - **Confidence**: `97%`
6. **Submit**: Click **Submit Issue** to generate `FIX-1042` with celebration confetti.
7. **Admin Login**: Click **Admin Demo** on the top banner.
8. **Dashboard Inspection**: View `FIX-1042` highlighted under **Critical Incidents**.
9. **Dispatch Technician**: Click **+ Assign Staff** and choose `Rajesh Kumar (Senior Technician)`.
10. **Maintenance Login**: Click **Maintenance Demo** on the top banner.
11. **Start Task**: Open the assigned task and click **Accept & Start Work** (`IN_PROGRESS`).
12. **Upload After-Repair Proof**: Click **Upload Proof & Resolve**, attach after-repair photo and resolution note (*"Replaced siphon seal and pressure tested"*), and click **Mark Resolved**.
13. **Student Login**: Switch back to **Student Demo**.
14. **Inspect Resolution**: Notice the banner: *"Action Required: Issue Ready for Verification"*. Review before and after repair photos side-by-side.
15. **Verify Fix**: Click **Yes, Issue Fixed** → Status updates to `CLOSED ✅` and triggers closed ticket audit log!

---

## 📡 Autonomous IoT Hardware Integration

```
Physical Sensors (Water Leak, DHT22, LDR)
                   ↓
         ESP32 Microcontroller
                   ↓ (Wi-Fi 802.11 b/g/n)
        FixIt Ingestion Router
                   ↓
  Real-Time Webhook Anomaly Evaluator
                   ↓
 Automatic Emergency Incident Dispatch (FIX-IOT-xxx)
```

### Hardware Live Demo Simulation:
1. Navigate to **Admin → IoT Monitoring** (`/admin/iot`).
2. Observe live telemetry stream (Temperature, Humidity, Light level) updating every 4 seconds.
3. Click **"🚨 Simulate Water Leakage"**.
4. The system immediately registers a conductivity breach, sets node status to `ALERT`, triggers a critical toast alert, and **automatically creates emergency complaint `FIX-IOT-xxx`** on the admin dashboard and geospatial map.

### ESP32 REST API Endpoint Specification:
- **POST** `/api/iot/sensor-data`
```json
{
  "deviceId": "ESP32-CAMPUS-001",
  "location": "Block A — Room 204 (Ceiling Grid)",
  "temperature": 24.2,
  "humidity": 58,
  "waterLeak": false,
  "lightLevel": 450,
  "timestamp": "2026-08-26T14:05:00Z"
}
```

- **POST** `/api/iot/alert`
```json
{
  "deviceId": "ESP32-CAMPUS-001",
  "type": "WATER_LEAK",
  "location": "Block A — Room 204",
  "severity": "CRITICAL"
}
```
*(Arduino sketch source code is located in [`hardware/esp32_firmware.ino`](file:///c:/Users/syed/Downloads/nexora/hardware/esp32_firmware.ino)).*

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Recharts, Canvas-Confetti.
- **State & Persistence**: Reactive event-driven store synchronized to `LocalStorage` with Firebase schema compatibility.
- **AI Service Abstraction**: Multimodal heuristic classifier, priority matrix engine, and semantic duplicate detection.
- **Geospatial Engine**: Interactive SVG campus map with building hotspots, active filters, and pulsing emergency markers.
- **Reporting**: Dynamic CSV export engine.

---

## 🏆 Innovation Highlights for Judges

1. **AI-Powered Triage**: Automatic category, priority, and department recommendations.
2. **Duplicate Prevention**: Detects existing open reports in the same room/area and enables community upvotes instead of cluttering the queue.
3. **True Two-Way Accountability**: Mandatory before/after repair photographic proof; tickets cannot be closed without student reporter inspection.
4. **Geospatial & IoT Ready**: Live ESP32 hardware grid integration with autonomous emergency ticket generation.
5. **Actionable Analytics**: Institutional SLA tracking and recurring problem identification.
