from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .models import LocationModel, ConnectionModel
from .seed_data import DEMO_LOCATIONS, DEMO_CONNECTIONS
from .routers import locations, connections, analysis, demo, reports

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CITYGRID AI API",
    description="Smart City Utility Network Intelligence & Optimization Platform API",
    version="1.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auto-seed database if empty
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        loc_count = db.query(LocationModel).count()
        if loc_count == 0:
            print("Database empty. Seeding initial 50+ node demo city grid...")
            for loc in DEMO_LOCATIONS:
                db.add(LocationModel(**loc))
            for conn in DEMO_CONNECTIONS:
                db.add(ConnectionModel(**conn))
            db.commit()
            print("Auto-seeding complete!")
    finally:
        db.close()

# Include routers
app.include_router(locations.router)
app.include_router(connections.router)
app.include_router(analysis.router)
app.include_router(demo.router)
app.include_router(reports.router)

@app.get("/")
def root():
    return {
        "platform": "CITYGRID AI",
        "status": "Online",
        "documentation": "/docs"
    }
