export interface Location {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  population: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low' | string;
  electricity_demand: number;
  water_demand: number;
  traffic_demand: number;
  criticality: number;
}

export interface Connection {
  id: string;
  source_id: string;
  target_id: string;
  infrastructure_type: 'Electricity' | 'Water' | 'Road' | string;
  cost: number;
  distance: number;
  capacity: number;
  utilization: number;
  reliability: number;
  construction_time: number;
  status: 'Active' | 'Maintenance' | 'Failed' | 'Proposed' | string;
}

export interface ConnectivityComponent {
  id: number;
  node_ids: string[];
  node_names: string[];
  population_affected: number;
  critical_facilities: string[];
  edge_count: number;
}

export interface ConnectivityResult {
  total_components: number;
  largest_component_size: number;
  isolated_nodes: string[];
  components: ConnectivityComponent[];
  disconnected_facilities: string[];
  execution_steps: string[];
}

export interface MSTEdgeDetail {
  id: string;
  source_id: string;
  target_id: string;
  source_name: string;
  target_name: string;
  cost: number;
  infrastructure_type: string;
  reason: string;
}

export interface MSTResult {
  original_cost: number;
  optimized_cost: number;
  potential_savings: number;
  savings_percentage: number;
  selected_edges: MSTEdgeDetail[];
  rejected_edges: MSTEdgeDetail[];
  execution_steps: string[];
}

export interface ShortestPathStep {
  step_index: number;
  current_node: string;
  tentative_distances: Record<string, number>;
  visited_nodes: string[];
  action_description: string;
}

export interface ShortestPathResult {
  found: boolean;
  source_id: string;
  target_id: string;
  route_node_ids: string[];
  route_node_names: string[];
  edge_ids: string[];
  total_cost: number;
  total_distance: number;
  estimated_travel_time: number;
  number_of_hops: number;
  execution_steps: ShortestPathStep[];
}

export interface VulnerableNodeDetail {
  location_id: string;
  name: string;
  type: string;
  priority: string;
  vulnerability_score: number;
  risk_factors: string[];
  incoming_outgoing_count: number;
  alternative_routes_count: number;
}

export interface SinglePointOfFailure {
  connection_id: string;
  source_name: string;
  target_name: string;
  infrastructure_type: string;
  impact_population: number;
  affected_hospitals: number;
  affected_schools: number;
  affected_industrial: number;
  impact_description: string;
}

export interface VulnerabilityReport {
  overall_resilience_score: number;
  vulnerable_locations: VulnerableNodeDetail[];
  single_points_of_failure: SinglePointOfFailure[];
  high_risk_count: number;
}

export interface FailureSimulationResult {
  before_component_count: number;
  after_component_count: number;
  disconnected_population: number;
  critical_facilities_isolated: string[];
  alternative_routes_available: boolean;
  affected_components: ConnectivityComponent[];
  summary_message: string;
}

export interface CapacityDetail {
  connection_id: string;
  source_name: string;
  target_name: string;
  infrastructure_type: string;
  capacity: number;
  utilization_rate: number;
  status: 'Healthy' | 'Monitor' | 'Warning' | 'Critical' | string;
  recommendation: string;
}

export interface CapacityReport {
  healthy_count: number;
  monitor_count: number;
  warning_count: number;
  critical_count: number;
  overloaded_connections: CapacityDetail[];
}

export interface ScenarioResult {
  scenario_name: string;
  additional_locations_required: number;
  recommended_new_connections: {
    infrastructure: string;
    source: string;
    target: string;
    capacity: string;
    estimated_cost: string;
  }[];
  estimated_construction_cost: number;
  estimated_maintenance_cost: number;
  potential_bottlenecks: string[];
  infrastructure_upgrade_recommendations: string[];
}

export interface ExecutiveSummary {
  location_count: number;
  connection_count: number;
  total_population: number;
  total_infrastructure_cost_lakhs: number;
  connected_components: number;
  mst_optimized_cost_lakhs: number;
  mst_savings_lakhs: number;
  mst_savings_percentage: number;
  resilience_score: number;
  single_points_of_failure_count: number;
  high_risk_locations_count: number;
  overloaded_connections_count: number;
}
