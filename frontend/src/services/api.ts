import axios from 'axios';
import {
  Location, Connection, ConnectivityResult, MSTResult, ShortestPathResult,
  VulnerabilityReport, FailureSimulationResult, CapacityReport, ScenarioResult,
  ExecutiveSummary
} from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getLocations = async (): Promise<Location[]> => {
  const res = await api.get('/locations');
  return res.data;
};

export const createLocation = async (loc: Omit<Location, 'id'> & { id?: string }): Promise<Location> => {
  const locData = {
    ...loc,
    id: loc.id || `LOC-${Date.now().toString().slice(-4)}`
  };
  const res = await api.post('/locations', locData);
  return res.data;
};

export const updateLocation = async (id: string, loc: Location): Promise<Location> => {
  const res = await api.put(`/locations/${id}`, loc);
  return res.data;
};

export const deleteLocation = async (id: string): Promise<void> => {
  await api.delete(`/locations/${id}`);
};

export const getConnections = async (): Promise<Connection[]> => {
  const res = await api.get('/connections');
  return res.data;
};

export const createConnection = async (conn: Omit<Connection, 'id'> & { id?: string }): Promise<Connection> => {
  const connData = {
    ...conn,
    id: conn.id || `${conn.infrastructure_type[0].toUpperCase()}-${Date.now().toString().slice(-4)}`
  };
  const res = await api.post('/connections', connData);
  return res.data;
};

export const updateConnection = async (id: string, conn: Connection): Promise<Connection> => {
  const res = await api.put(`/connections/${id}`, conn);
  return res.data;
};

export const deleteConnection = async (id: string): Promise<void> => {
  await api.delete(`/connections/${id}`);
};

export const seedDemoCity = async (): Promise<{ message: string; location_count: number; connection_count: number }> => {
  const res = await api.post('/demo/seed');
  return res.data;
};

export const runConnectivityAnalysis = async (): Promise<ConnectivityResult> => {
  const res = await api.post('/analysis/connectivity');
  return res.data;
};

export const runMSTAnalysis = async (infraFilter: string = 'All'): Promise<MSTResult> => {
  const res = await api.post(`/analysis/mst?infra_filter=${infraFilter}`);
  return res.data;
};

export const runShortestPath = async (
  sourceId: string,
  targetId: string,
  metric: string = 'cost',
  infraFilter: string = 'All'
): Promise<ShortestPathResult> => {
  const res = await api.post('/analysis/shortest-path', {
    source_id: sourceId,
    target_id: targetId,
    metric,
    infrastructure_filter: infraFilter,
  });
  return res.data;
};

export const runVulnerabilityAnalysis = async (): Promise<VulnerabilityReport> => {
  const res = await api.post('/analysis/vulnerability');
  return res.data;
};

export const runFailureSimulation = async (
  failedConnIds: string[],
  failedNodeIds: string[]
): Promise<FailureSimulationResult> => {
  const res = await api.post('/analysis/failure-simulation', {
    failed_connection_ids: failedConnIds,
    failed_node_ids: failedNodeIds,
  });
  return res.data;
};

export const runCapacityAnalysis = async (): Promise<CapacityReport> => {
  const res = await api.post('/analysis/capacity');
  return res.data;
};

export const runScenarioPlanning = async (params: {
  scenario_name: string;
  population: number;
  electricity_demand_mw: number;
  water_demand_mld: number;
  traffic_demand_vpd: number;
  target_location_type: string;
}): Promise<ScenarioResult> => {
  const res = await api.post('/analysis/scenario', params);
  return res.data;
};

export const getExecutiveSummary = async (): Promise<ExecutiveSummary> => {
  const res = await api.get('/reports/summary');
  return res.data;
};

export const getPDFReportUrl = (): string => `${API_BASE_URL}/reports/pdf`;
