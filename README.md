````markdown
# ⚡ PowerQ: Real-time Energy Intelligence

![Project Status](https://img.shields.io/badge/STATUS-ACTIVE-brightgreen)
![Tech Stack](https://img.shields.io/badge/STACK-MEARN%20Stack-blue)
![Hardware](https://img.shields.io/badge/HARDWARE-ESP32%20%2B%20ZMCT103C-orange)

## 🎯 Mission Objective
PowerQ is an advanced, real-time energy intelligence system. Designed with strict **Clean Code** principles, it leverages a robust **MVC architecture** to process, archive, and visualize measurement data in real-time.

The system acts as a digital mirror to the power grid: every fluctuation is instantly observed and reflected.

---

## 🏗️ Architecture (The Blueprint)

The system consists of three distinct layers communicating via secure channels:

1.  **The Agent (Hardware):** An ESP32 equipped with a ZMCT103C sensor measures current (Amps) and transmits this intel via a secured REST API.
2.  **The Mainframe (Backend):** A Node.js API that buffers, validates, and stores data in **TimescaleDB** (PostgreSQL) for historical analysis, while simultaneously broadcasting live data via WebSockets.
3.  **The Dashboard (Frontend):** A Vue.js 3 application acting as the Mission Control Center, featuring real-time data visualization.

### Data Flow
```mermaid
graph LR
    A[ESP32 Sensor] -- JSON (POST) --> B(Node.js API)
    B -- Buffer/Save --> C[(TimescaleDB)]
    B -- Socket.io (Emit) --> D[Vue.js Frontend]
    D -- Fetch History (GET) --> B
    B -- Query --> C
````

-----

## 🧰 Tech Stack (The Gadgets)

### 🔌 Hardware

  * **MCU:** ESP32 Development Board
  * **Sensor:** ZMCT103C (Active Module with Op-Amp)
  * **Connection:** WiFi (802.11 b/g/n)

### 🖥️ Backend (The Archive)

  * **Runtime:** Node.js (Express)
  * **Real-time:** Socket.io
  * **Database:** PostgreSQL + TimescaleDB (via Docker)
  * **ORM:** Sequelize
  * **Pattern:** MVC + Service Layer

### 📊 Frontend (Mission Control)

  * **Framework:** Vue.js 3 (Composition API)
  * **Build Tool:** Vite
  * **Visuals:** Chart.js
  * **Styling:** Dark Mode / Terminal Style

-----

## 🚀 Installation Protocol

### 1\. Database Initialization

Deploy the TimescaleDB instance via Docker:

```bash
docker run -d --name powerq-db -p 5432:5432 \
  -e POSTGRES_PASSWORD=secret \
  timescale/timescaledb:latest-pg14
```

### 2\. Backend Deployment

```bash
cd energy-backend
npm install
# Configure your .env file (see Security section)
npm run dev
```

*Server listens on port 3000.*

### 3\. Frontend Deployment

```bash
cd energy-frontend
npm install
npm run dev
```

*Dashboard accessible via http://localhost:5173*

-----

## 🔐 Security Clearance

This project is fortified against unauthorized access. Both the ESP32 Agent and the Dashboard Operator must provide valid credentials.

Create a `.env` file in the backend root directory:

```env
PORT=3000
DB_NAME=postgres
DB_USER=postgres
DB_PASS=secret
DB_HOST=localhost
API_SECRET_KEY=MI6_License_To_Kill_Reflector_5_2_X99
```

*Note:* The Frontend will request the `API_SECRET_KEY` upon initial launch.

-----

## 📡 API Reference

### `POST /api/measurements`

*Inbound intel from the ESP32 Agent.*
**Headers:** `Authorization: Bearer <API_SECRET_KEY>`

```json
{
  "deviceId": "METER_01",
  "current": 0.45,
  "voltage": 230.0
}
```

### `GET /api/measurements`

*Retrieve historical data (last 50 records).*
**Headers:** `Authorization: <API_SECRET_KEY>`

-----

## 🕵️ Author

**Pieter Leek**

```