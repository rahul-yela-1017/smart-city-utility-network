# CITYGRID AI — Smart City Utility Network Intelligence Platform

## 🌆 Overview
CITYGRID AI is a full-stack, production-grade urban infrastructure planning & optimization platform built with:

- **Backend**: Python FastAPI + SQLite + 8 graph algorithm modules
- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS 4 + Google Maps API

The demo dataset contains **55 real Hyderabad locations** and **100+ connections** covering:
- Electricity grid substations & power stations
- Water treatment plants & reservoirs
- Transport hubs (airports, railway stations, metro)
- IT parks, hospitals, government buildings, residential areas
- Peripheral rural villages for disconnected-region testing

---

## 🚀 Quick Start

### Step 1 — Start the Backend API
Double-click `START_BACKEND.bat` or run:
```powershell
cd backend
.\venv\Scripts\uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Backend runs at: http://localhost:8000  
API Docs: http://localhost:8000/docs

### Step 2 — Start the Frontend
Double-click `START_FRONTEND.bat` or run:
```powershell
cd frontend
npm run dev
```
App runs at: http://localhost:5173

---

## 🗺️ Features

| Feature | Technology |
|---------|-----------|
| Real Google Maps integration | @react-google-maps/api |
| Dark vector + Satellite + Hybrid map modes | Google Maps Styling API |
| Connectivity Analysis (BFS/DFS) | Python algorithm module |
| Minimum Spanning Tree (Kruskal's + DSU) | Python algorithm module |
| Least-Cost Routing (Dijkstra's heap) | Python algorithm module |
| Vulnerability / Bridge Detection (Tarjan's) | Python algorithm module |
| What-If Failure Simulation | Python algorithm module |
| Capacity Analysis | Python algorithm module |
| Scenario Planning | Python algorithm module |
| Executive Report Generation (PDF/CSV) | ReportLab + CSV |
| Interactive Cytoscape Graph | cytoscape.js |
| Data Manager (CSV import/export) | React + Axios |

---

## 📁 Project Structure

```
citygrid-ai/
├── backend/
│   ├── app/
│   │   ├── algorithms/        # Graph algorithm modules
│   │   │   ├── connectivity.py  (BFS/DFS Connected Components)
│   │   │   ├── mst.py           (Kruskal + DSU MST)
│   │   │   ├── shortest_path.py (Dijkstra's Algorithm)
│   │   │   ├── vulnerability.py (Tarjan Bridge/SPOF Detection)
│   │   │   ├── simulation.py    (What-If Failure Simulator)
│   │   │   ├── capacity.py      (Capacity Analysis)
│   │   │   ├── scenario.py      (Scenario Planner)
│   │   │   └── report.py        (PDF/CSV Report Generator)
│   │   ├── routers/           # FastAPI routers
│   │   ├── models.py          # SQLAlchemy ORM models
│   │   ├── schemas.py         # Pydantic schemas
│   │   ├── database.py        # SQLite connection
│   │   ├── seed_data.py       # 55-node Hyderabad dataset
│   │   └── main.py            # FastAPI app entry
│   ├── requirements.txt
│   └── venv/
├── frontend/
│   ├── src/
│   │   ├── components/        # React UI components
│   │   │   ├── GoogleNetworkMap.tsx  (Real Google Maps)
│   │   │   ├── NetworkMap.tsx        (Cytoscape Graph)
│   │   │   ├── AnalysisCenter.tsx    (All 8 algorithms)
│   │   │   ├── DashboardOverview.tsx (KPI Dashboard)
│   │   │   ├── DataManager.tsx       (CRUD + CSV)
│   │   │   ├── ScenarioPlanner.tsx   (What-If Planner)
│   │   │   └── ReportGenerator.tsx   (PDF/CSV Reports)
│   │   ├── services/api.ts    # Axios API calls
│   │   ├── types/index.ts     # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── START_BACKEND.bat
├── START_FRONTEND.bat
└── README.md
```

---

## 🔑 API Key
Google Maps API Key: `AIzaSyBmrdlmo-0MOYiK_TEJUnGA3jPAMhQhPac`
(pre-configured in `frontend/src/App.tsx`)

---

## 📊 Algorithm Complexity

| Algorithm | Time Complexity | Space Complexity |
|-----------|----------------|-----------------|
| BFS/DFS Connected Components | O(V + E) | O(V + E) |
| Kruskal's MST (Kruskal + DSU) | O(E log E) | O(V) |
| Dijkstra's Shortest Path | O((V+E) log V) | O(V + E) |
| Tarjan Bridge/SPOF Detection | O(V + E) | O(V) |
| What-If Failure Simulation | O(V + E) | O(V + E) |
| Capacity Analysis | O(E) | O(E) |
