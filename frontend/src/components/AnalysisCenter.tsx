import React, { useState } from 'react';
import {
  Location, Connection, ConnectivityResult, MSTResult, ShortestPathResult,
  VulnerabilityReport, FailureSimulationResult, CapacityReport
} from '../types';
import {
  runConnectivityAnalysis, runMSTAnalysis, runShortestPath,
  runVulnerabilityAnalysis, runFailureSimulation, runCapacityAnalysis
} from '../services/api';
import {
  Cpu, Layers, TrendingDown, Navigation as RouteIcon, ShieldAlert,
  AlertTriangle, CheckCircle2, Play, RefreshCw, Zap, Droplets, Car, ChevronRight, HelpCircle
} from 'lucide-react';

interface AnalysisCenterProps {
  locations: Location[];
  connections: Connection[];
  onHighlightRoute?: (nodeIds: string[], edgeIds: string[]) => void;
  onHighlightMst?: (edgeIds: string[]) => void;
}

export const AnalysisCenter: React.FC<AnalysisCenterProps> = ({
  locations,
  connections,
  onHighlightRoute,
  onHighlightMst
}) => {
  const [activeTab, setActiveTab] = useState<'connectivity' | 'mst' | 'shortest_path' | 'vulnerability' | 'simulation' | 'capacity'>('connectivity');

  // Algorithm state
  const [connResult, setConnResult] = useState<ConnectivityResult | null>(null);
  const [mstResult, setMstResult] = useState<MSTResult | null>(null);
  const [shortestResult, setShortestResult] = useState<ShortestPathResult | null>(null);
  const [vulnResult, setVulnResult] = useState<VulnerabilityReport | null>(null);
  const [simResult, setSimResult] = useState<FailureSimulationResult | null>(null);
  const [capResult, setCapResult] = useState<CapacityReport | null>(null);

  const [loading, setLoading] = useState(false);

  // Dijkstra inputs
  const [dijkstraSource, setDijkstraSource] = useState<string>(locations[0]?.id || '');
  const [dijkstraTarget, setDijkstraTarget] = useState<string>(locations[1]?.id || '');
  const [dijkstraMetric, setDijkstraMetric] = useState<string>('cost');

  // MST inputs
  const [mstInfra, setMstInfra] = useState<string>('All');

  // Failure Simulation inputs
  const [selectedFailedConns, setSelectedFailedConns] = useState<string[]>([]);

  // Handlers
  const handleRunConnectivity = async () => {
    setLoading(true);
    try {
      const res = await runConnectivityAnalysis();
      setConnResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunMST = async () => {
    setLoading(true);
    try {
      const res = await runMSTAnalysis(mstInfra);
      setMstResult(res);
      if (onHighlightMst) {
        onHighlightMst(res.selected_edges.map(e => e.id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunDijkstra = async () => {
    if (!dijkstraSource || !dijkstraTarget) return;
    setLoading(true);
    try {
      const res = await runShortestPath(dijkstraSource, dijkstraTarget, dijkstraMetric, 'All');
      setShortestResult(res);
      if (onHighlightRoute && res.found) {
        onHighlightRoute(res.route_node_ids, res.edge_ids);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunVulnerability = async () => {
    setLoading(true);
    try {
      const res = await runVulnerabilityAnalysis();
      setVulnResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunFailureSimulation = async () => {
    setLoading(true);
    try {
      const res = await runFailureSimulation(selectedFailedConns, []);
      setSimResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunCapacity = async () => {
    setLoading(true);
    try {
      const res = await runCapacityAnalysis();
      setCapResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Workspace Tabs Header */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-md">
        {[
          { id: 'connectivity', label: '1. Connectivity (DFS/BFS)', icon: Layers },
          { id: 'mst', label: '2. MST Optimization (Kruskal)', icon: TrendingDown },
          { id: 'shortest_path', label: '3. Shortest Path (Dijkstra)', icon: RouteIcon },
          { id: 'vulnerability', label: '4. Vulnerability & SPOF (Tarjan)', icon: ShieldAlert },
          { id: 'simulation', label: '5. Failure Simulator', icon: AlertTriangle },
          { id: 'capacity', label: '6. Capacity Monitor', icon: Cpu },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Connectivity Analysis */}
      {activeTab === 'connectivity' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-widest">
                <span>Breadth-First / Depth-First Traversal</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">Connected Components & Isolation Audit</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Executes graph search (BFS/DFS) to partition the city grid into disjoint connected sub-networks, identify isolated nodes, and quantify affected population clusters.
              </p>
            </div>
            <button
              onClick={handleRunConnectivity}
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>{loading ? 'Executing BFS...' : 'Run Connectivity Analysis'}</span>
            </button>
          </div>

          {connResult && (
            <div className="space-y-6">
              {/* Overview Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Total Components</span>
                  <p className="text-3xl font-black text-white mt-1">{connResult.total_components}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Largest Component Nodes</span>
                  <p className="text-3xl font-black text-emerald-400 mt-1">{connResult.largest_component_size}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Isolated Nodes</span>
                  <p className="text-3xl font-black text-amber-400 mt-1">{connResult.isolated_nodes.length}</p>
                </div>
              </div>

              {/* Components Breakdown Cards */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-4">Partitioned Connected Components</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {connResult.components.map((comp) => (
                    <div key={comp.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">
                          Component #{comp.id}
                        </span>
                        <span className="text-xs text-slate-400">{comp.node_ids.length} Nodes • {comp.edge_count} Edges</span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium">
                        Affected Population: <span className="text-emerald-400 font-bold">{comp.population_affected.toLocaleString()}</span>
                      </p>
                      <div>
                        <span className="text-[11px] text-slate-400 font-semibold block mb-1">Locations in Cluster:</span>
                        <p className="text-xs text-slate-400 line-clamp-2">{comp.node_names.join(', ')}</p>
                      </div>
                      {comp.critical_facilities.length > 0 && (
                        <div className="pt-2 border-t border-slate-900">
                          <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block mb-1">Critical Facilities:</span>
                          <p className="text-[11px] text-rose-300">{comp.critical_facilities.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Minimum Spanning Tree */}
      {activeTab === 'mst' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                <span>Kruskal's DSU Algorithm</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">Minimum-Cost Network Optimization (MST)</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Identifies a minimum total-cost set of infrastructure links that connects all required locations without cycles, calculating exact capital expenditure savings.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={mstInfra}
                onChange={(e) => setMstInfra(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-white text-xs px-3 py-3 rounded-xl focus:outline-none focus:border-emerald-500 font-semibold"
              >
                <option value="All">All Utility Grid</option>
                <option value="Electricity">Electricity Only</option>
                <option value="Water">Water Only</option>
                <option value="Road">Road Only</option>
              </select>
              <button
                onClick={handleRunMST}
                disabled={loading}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>{loading ? 'Calculating MST...' : 'Start MST Optimization'}</span>
              </button>
            </div>
          </div>

          {mstResult && (
            <div className="space-y-6">
              {/* Cost Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Original Full Grid Cost</span>
                  <p className="text-2xl font-black text-slate-300 mt-1">₹{mstResult.original_cost} L</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 border-l-4 border-l-emerald-500">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Optimized MST Cost</span>
                  <p className="text-2xl font-black text-emerald-400 mt-1">₹{mstResult.optimized_cost} L</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Capital Savings</span>
                  <p className="text-2xl font-black text-amber-400 mt-1">₹{mstResult.potential_savings} L</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Cost Reduction %</span>
                  <p className="text-2xl font-black text-blue-400 mt-1">{mstResult.savings_percentage}%</p>
                </div>
              </div>

              {/* Edge Decision Explanations Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-4">Algorithm Decision Log: Selected vs Rejected Edges</h3>
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] sticky top-0">
                      <tr>
                        <th className="p-3">Status</th>
                        <th className="p-3">Edge ID</th>
                        <th className="p-3">Source → Destination</th>
                        <th className="p-3">Cost (₹ L)</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Algorithmic Explanation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {mstResult.selected_edges.map((e) => (
                        <tr key={e.id} className="hover:bg-slate-800/30">
                          <td className="p-3">
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold text-[10px]">
                              ACCEPTED
                            </span>
                          </td>
                          <td className="p-3 font-bold text-white">{e.id}</td>
                          <td className="p-3 text-slate-200">{e.source_name} → {e.target_name}</td>
                          <td className="p-3 text-emerald-400 font-bold">₹{e.cost} L</td>
                          <td className="p-3 text-slate-300">{e.infrastructure_type}</td>
                          <td className="p-3 text-slate-400">{e.reason}</td>
                        </tr>
                      ))}
                      {mstResult.rejected_edges.map((e) => (
                        <tr key={e.id} className="hover:bg-slate-800/30 opacity-60">
                          <td className="p-3">
                            <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded font-bold text-[10px]">
                              REJECTED
                            </span>
                          </td>
                          <td className="p-3 font-bold text-slate-400">{e.id}</td>
                          <td className="p-3 text-slate-400">{e.source_name} → {e.target_name}</td>
                          <td className="p-3 text-slate-400 font-bold">₹{e.cost} L</td>
                          <td className="p-3 text-slate-400">{e.infrastructure_type}</td>
                          <td className="p-3 text-slate-500">{e.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Shortest Path (Dijkstra) */}
      {activeTab === 'shortest_path' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white">Least-Cost Route Analysis (Dijkstra)</h2>
            <p className="text-xs text-slate-400 mt-1">
              Computes optimal route between source and destination using Dijkstra's algorithm with priority queue relaxation.
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Source Location</label>
                <select
                  value={dijkstraSource}
                  onChange={(e) => setDijkstraSource(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-blue-500"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.name} ({loc.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Destination Location</label>
                <select
                  value={dijkstraTarget}
                  onChange={(e) => setDijkstraTarget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-blue-500"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.name} ({loc.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Metric Optimization</label>
                <select
                  value={dijkstraMetric}
                  onChange={(e) => setDijkstraMetric(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-blue-500"
                >
                  <option value="cost">Minimum Construction Cost (₹)</option>
                  <option value="distance">Shortest Physical Distance (km)</option>
                  <option value="travel_time">Fastest Travel Time (min)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleRunDijkstra}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>{loading ? 'Routing...' : 'Find Cheapest Route'}</span>
                </button>
              </div>
            </div>
          </div>

          {shortestResult && (
            <div className="space-y-6">
              {/* Route Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Total Cost</span>
                  <p className="text-2xl font-black text-amber-400 mt-1">₹{shortestResult.total_cost} L</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Total Distance</span>
                  <p className="text-2xl font-black text-cyan-400 mt-1">{shortestResult.total_distance} km</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Estimated Travel Time</span>
                  <p className="text-2xl font-black text-emerald-400 mt-1">{shortestResult.estimated_travel_time} min</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Hop Count</span>
                  <p className="text-2xl font-black text-white mt-1">{shortestResult.number_of_hops} links</p>
                </div>
              </div>

              {/* Route Path Display */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-3">Optimal Route Sequence</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {shortestResult.route_node_names.map((name, idx) => (
                    <React.Fragment key={idx}>
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                        idx === 0 ? 'bg-blue-600 text-white' :
                        idx === shortestResult.route_node_names.length - 1 ? 'bg-emerald-600 text-white' :
                        'bg-slate-800 text-slate-200 border border-slate-700'
                      }`}>
                        {name}
                      </span>
                      {idx < shortestResult.route_node_names.length - 1 && (
                        <ChevronRight className="h-4 w-4 text-slate-500" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Step Visualizer */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-3">Dijkstra Min-Heap Execution Steps</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {shortestResult.execution_steps.map((step) => (
                    <div key={step.step_index} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                      <span className="font-bold text-blue-400 mr-2">Step #{step.step_index}:</span>
                      <span className="text-slate-300">{step.action_description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Vulnerability & SPOF */}
      {activeTab === 'vulnerability' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-rose-400 uppercase tracking-widest">
                <span>Tarjan Articulation Points & Bridges</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">Single Point of Failure (SPOF) & Vulnerability Audit</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Identifies critical utility connections whose failure splits the city grid, and calculates the 0-100 CITYGRID Risk Score for all locations.
              </p>
            </div>
            <button
              onClick={handleRunVulnerability}
              disabled={loading}
              className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-rose-600/30 transition disabled:opacity-50"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>{loading ? 'Auditing Grid...' : 'Run Vulnerability Audit'}</span>
            </button>
          </div>

          {vulnResult && (
            <div className="space-y-6">
              {/* SPOF Cards */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-400" />
                  <span>Detected Single Points of Failure ({vulnResult.single_points_of_failure.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vulnResult.single_points_of_failure.map((sp) => (
                    <div key={sp.connection_id} className="bg-slate-950 border border-rose-500/30 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">
                          CRITICAL BRIDGE: {sp.connection_id}
                        </span>
                        <span className="text-xs font-bold text-amber-400">{sp.infrastructure_type}</span>
                      </div>
                      <p className="text-xs font-bold text-white">{sp.source_name} ↔ {sp.target_name}</p>
                      <p className="text-xs text-slate-300">{sp.impact_description}</p>
                      <div className="pt-2 border-t border-slate-900 flex flex-wrap gap-3 text-[11px] text-slate-400">
                        <span>Pop Impact: <b className="text-rose-400">{sp.impact_population.toLocaleString()}</b></span>
                        <span>Hospitals: <b className="text-rose-400">{sp.affected_hospitals}</b></span>
                        <span>Schools: <b className="text-amber-400">{sp.affected_schools}</b></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vulnerable Node Risk Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-4">CITYGRID Vulnerability Score Ranking (0-100)</h3>
                <div className="overflow-x-auto max-h-80 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] sticky top-0">
                      <tr>
                        <th className="p-3">Risk Score</th>
                        <th className="p-3">Location Name</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Priority</th>
                        <th className="p-3">Risk Factors</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {vulnResult.vulnerable_locations.map((loc) => (
                        <tr key={loc.location_id} className="hover:bg-slate-800/30">
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                              loc.vulnerability_score >= 70 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                              loc.vulnerability_score >= 40 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {loc.vulnerability_score}/100
                            </span>
                          </td>
                          <td className="p-3 font-bold text-white">{loc.name}</td>
                          <td className="p-3 text-slate-300">{loc.type}</td>
                          <td className="p-3 text-slate-300">{loc.priority}</td>
                          <td className="p-3 text-slate-400">{loc.risk_factors.join('; ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Failure Simulation */}
      {activeTab === 'simulation' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white">What-If Infrastructure Failure Simulator</h2>
            <p className="text-xs text-slate-400 mt-1">
              Select utility connections to simulate physical destruction or maintenance outage and observe real-time grid partitioning.
            </p>

            <div className="mt-4 space-y-3">
              <label className="text-xs text-slate-400 font-semibold block">Select Connection(s) to Fail:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
                {connections.slice(0, 30).map((conn) => (
                  <label key={conn.id} className="flex items-center space-x-2 text-xs text-slate-300 p-1.5 hover:bg-slate-900 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFailedConns.includes(conn.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedFailedConns([...selectedFailedConns, conn.id]);
                        else setSelectedFailedConns(selectedFailedConns.filter(id => id !== conn.id));
                      }}
                      className="rounded border-slate-800 text-rose-500 focus:ring-rose-500"
                    />
                    <span className="font-semibold text-white">{conn.id}</span>
                    <span className="text-[10px] text-slate-400">({conn.infrastructure_type})</span>
                  </label>
                ))}
              </div>

              <button
                onClick={handleRunFailureSimulation}
                disabled={loading || selectedFailedConns.length === 0}
                className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-rose-600/30 transition disabled:opacity-50"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>{loading ? 'Simulating...' : 'Simulate Failure'}</span>
              </button>
            </div>
          </div>

          {simResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
                <h3 className="font-extrabold text-sm">{simResult.summary_message}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Before Components:</span>
                  <p className="text-xl font-bold text-white mt-1">{simResult.before_component_count}</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400">After Components:</span>
                  <p className="text-xl font-bold text-rose-400 mt-1">{simResult.after_component_count}</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Alternative Routes Available:</span>
                  <p className={`text-xl font-bold mt-1 ${simResult.alternative_routes_available ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {simResult.alternative_routes_available ? 'YES' : 'NO'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Capacity Monitor */}
      {activeTab === 'capacity' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Capacity & Load Utilization Analysis</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Monitors capacity utilization thresholds (&lt;70% Healthy, 70-85% Monitor, 85-95% Warning, &gt;95% Critical) and generates upgrade recommendations.
              </p>
            </div>
            <button
              onClick={handleRunCapacity}
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>{loading ? 'Evaluating...' : 'Run Capacity Analysis'}</span>
            </button>
          </div>

          {capResult && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-emerald-400 uppercase font-semibold">Healthy (&lt;70%)</span>
                  <p className="text-2xl font-black text-white mt-1">{capResult.healthy_count}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-blue-400 uppercase font-semibold">Monitor (70-85%)</span>
                  <p className="text-2xl font-black text-white mt-1">{capResult.monitor_count}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-amber-400 uppercase font-semibold">Warning (85-95%)</span>
                  <p className="text-2xl font-black text-amber-400 mt-1">{capResult.warning_count}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-rose-400 uppercase font-semibold">Critical (&gt;95%)</span>
                  <p className="text-2xl font-black text-rose-400 mt-1">{capResult.critical_count}</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-4">Overloaded Infrastructure Lines List</h3>
                <div className="space-y-3">
                  {capResult.overloaded_connections.map((c) => (
                    <div key={c.connection_id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                          c.status === 'Critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {c.status} ({c.utilization_rate}%)
                        </span>
                        <h4 className="font-bold text-white mt-1">{c.infrastructure_type} Line {c.connection_id} ({c.source_name} ↔ {c.target_name})</h4>
                        <p className="text-slate-400 mt-0.5">{c.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
