from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class LocationBase(BaseModel):
    id: str
    name: str
    type: str
    lat: float
    lng: float
    population: int = 0
    priority: str = "Medium"
    electricity_demand: float = 0.0
    water_demand: float = 0.0
    traffic_demand: float = 0.0
    criticality: float = 50.0

class LocationCreate(LocationBase):
    pass

class LocationSchema(LocationBase):
    class Config:
        from_attributes = True

class ConnectionBase(BaseModel):
    id: str
    source_id: str
    target_id: str
    infrastructure_type: str
    cost: float
    distance: float
    capacity: float
    utilization: float = 50.0
    reliability: float = 95.0
    construction_time: int = 6
    status: str = "Active"

class ConnectionCreate(ConnectionBase):
    pass

class ConnectionSchema(ConnectionBase):
    class Config:
        from_attributes = True

class GraphData(BaseModel):
    locations: List[LocationSchema]
    connections: List[ConnectionSchema]

# Algorithm Schemas
class ConnectivityComponent(BaseModel):
    id: int
    node_ids: List[str]
    node_names: List[str]
    population_affected: int
    critical_facilities: List[str]
    edge_count: int

class ConnectivityResult(BaseModel):
    total_components: int
    largest_component_size: int
    isolated_nodes: List[str]
    components: List[ConnectivityComponent]
    disconnected_facilities: List[str]
    execution_steps: List[str]

class MSTEdgeDetail(BaseModel):
    id: str
    source_id: str
    target_id: str
    source_name: str
    target_name: str
    cost: float
    infrastructure_type: str
    reason: str

class MSTResult(BaseModel):
    original_cost: float
    optimized_cost: float
    potential_savings: float
    savings_percentage: float
    selected_edges: List[MSTEdgeDetail]
    rejected_edges: List[MSTEdgeDetail]
    execution_steps: List[str]

class ShortestPathRequest(BaseModel):
    source_id: str
    target_id: str
    metric: str = "cost"  # cost, distance, travel_time
    infrastructure_filter: Optional[str] = "All"

class ShortestPathStep(BaseModel):
    step_index: int
    current_node: str
    tentative_distances: Dict[str, float]
    visited_nodes: List[str]
    action_description: str

class ShortestPathResult(BaseModel):
    found: bool
    source_id: str
    target_id: str
    route_node_ids: List[str]
    route_node_names: List[str]
    edge_ids: List[str]
    total_cost: float
    total_distance: float
    estimated_travel_time: float
    number_of_hops: int
    execution_steps: List[ShortestPathStep]

class VulnerableNodeDetail(BaseModel):
    location_id: str
    name: str
    type: str
    priority: str
    vulnerability_score: float
    risk_factors: List[str]
    incoming_outgoing_count: int
    alternative_routes_count: int

class SinglePointOfFailure(BaseModel):
    connection_id: str
    source_name: str
    target_name: str
    infrastructure_type: str
    impact_population: int
    affected_hospitals: int
    affected_schools: int
    affected_industrial: int
    impact_description: str

class VulnerabilityReport(BaseModel):
    overall_resilience_score: float
    vulnerable_locations: List[VulnerableNodeDetail]
    single_points_of_failure: List[SinglePointOfFailure]
    high_risk_count: int

class FailureSimulationRequest(BaseModel):
    failed_connection_ids: List[str] = []
    failed_node_ids: List[str] = []

class FailureSimulationResult(BaseModel):
    before_component_count: int
    after_component_count: int
    disconnected_population: int
    critical_facilities_isolated: List[str]
    alternative_routes_available: bool
    affected_components: List[ConnectivityComponent]
    summary_message: str

class CapacityDetail(BaseModel):
    connection_id: str
    source_name: str
    target_name: str
    infrastructure_type: str
    capacity: float
    utilization_rate: float
    status: str  # Healthy, Monitor, Warning, Critical
    recommendation: str

class CapacityReport(BaseModel):
    healthy_count: int
    monitor_count: int
    warning_count: int
    critical_count: int
    overloaded_connections: List[CapacityDetail]

class ScenarioRequest(BaseModel):
    scenario_name: str
    population: int
    electricity_demand_mw: float
    water_demand_mld: float
    traffic_demand_vpd: float
    target_location_type: str = "Industrial Zone"

class ScenarioResult(BaseModel):
    scenario_name: str
    additional_locations_required: int
    recommended_new_connections: List[Dict[str, Any]]
    estimated_construction_cost: float
    estimated_maintenance_cost: float
    potential_bottlenecks: List[str]
    infrastructure_upgrade_recommendations: List[str]
