from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import LocationModel, ConnectionModel
from ..schemas import (
    ConnectivityResult, MSTResult, ShortestPathResult, ShortestPathRequest,
    VulnerabilityReport, FailureSimulationRequest, FailureSimulationResult,
    CapacityReport, ScenarioRequest, ScenarioResult
)
from ..algorithms.connectivity import run_connectivity_analysis
from ..algorithms.mst import run_kruskal_mst
from ..algorithms.shortest_path import run_dijkstra
from ..algorithms.vulnerability import run_vulnerability_analysis
from ..algorithms.simulation import run_failure_simulation
from ..algorithms.capacity import run_capacity_analysis
from ..algorithms.scenario import run_scenario_planning

router = APIRouter(prefix="/api/analysis", tags=["Analysis"])

def _get_network_dicts(db: Session):
    locs = [
        {
            "id": l.id, "name": l.name, "type": l.type, "lat": l.lat, "lng": l.lng,
            "population": l.population, "priority": l.priority, "electricity_demand": l.electricity_demand,
            "water_demand": l.water_demand, "traffic_demand": l.traffic_demand, "criticality": l.criticality
        }
        for l in db.query(LocationModel).all()
    ]
    conns = [
        {
            "id": c.id, "source_id": c.source_id, "target_id": c.target_id,
            "infrastructure_type": c.infrastructure_type, "cost": c.cost, "distance": c.distance,
            "capacity": c.capacity, "utilization": c.utilization, "reliability": c.reliability,
            "construction_time": c.construction_time, "status": c.status
        }
        for c in db.query(ConnectionModel).all()
    ]
    return locs, conns


@router.post("/connectivity", response_model=ConnectivityResult)
def analyze_connectivity(db: Session = Depends(get_db)):
    locs, conns = _get_network_dicts(db)
    return run_connectivity_analysis(locs, conns)


@router.post("/mst", response_model=MSTResult)
def analyze_mst(infra_filter: Optional[str] = Query("All"), db: Session = Depends(get_db)):
    locs, conns = _get_network_dicts(db)
    return run_kruskal_mst(locs, conns, infra_filter)


@router.post("/shortest-path", response_model=ShortestPathResult)
def analyze_shortest_path(req: ShortestPathRequest, db: Session = Depends(get_db)):
    locs, conns = _get_network_dicts(db)
    return run_dijkstra(locs, conns, req.source_id, req.target_id, req.metric, req.infrastructure_filter)


@router.post("/vulnerability", response_model=VulnerabilityReport)
def analyze_vulnerability(db: Session = Depends(get_db)):
    locs, conns = _get_network_dicts(db)
    return run_vulnerability_analysis(locs, conns)


@router.post("/failure-simulation", response_model=FailureSimulationResult)
def simulate_failure(req: FailureSimulationRequest, db: Session = Depends(get_db)):
    locs, conns = _get_network_dicts(db)
    return run_failure_simulation(locs, conns, req.failed_connection_ids, req.failed_node_ids)


@router.post("/capacity", response_model=CapacityReport)
def analyze_capacity(db: Session = Depends(get_db)):
    locs, conns = _get_network_dicts(db)
    return run_capacity_analysis(conns, locs)


@router.post("/scenario", response_model=ScenarioResult)
def plan_scenario(req: ScenarioRequest, db: Session = Depends(get_db)):
    locs, conns = _get_network_dicts(db)
    return run_scenario_planning(
        locs, conns, req.scenario_name, req.population,
        req.electricity_demand_mw, req.water_demand_mld, req.traffic_demand_vpd,
        req.target_location_type
    )
