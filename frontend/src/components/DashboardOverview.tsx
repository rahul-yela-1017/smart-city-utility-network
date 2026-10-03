import React from 'react';
import { ExecutiveSummary } from '../types';
import {
  Building2, GitBranch, Layers, ShieldAlert, Activity,
  IndianRupee, TrendingDown, ShieldCheck, Zap, Droplets, Car, ArrowRight, Play
} from 'lucide-react';

interface DashboardOverviewProps {
  summary: ExecutiveSummary | null;
  onNavigate: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ summary, onNavigate }) => {
  if (!summary) {
    return (
      <div className="p-8 flex items-center justify-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
        <span>Calculating real-time grid metrics...</span>
      </div>
    );
  }

  const costCr = (summary.total_infrastructure_cost_lakhs / 100).toFixed(2);
  const mstCostCr = (summary.mst_optimized_cost_lakhs / 100).toFixed(2);
  const mstSavingsCr = (summary.mst_savings_lakhs / 100).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-ping"></span>
              <span>Command Center Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Metro Grid Infrastructure Intelligence
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Algorithmic DAA optimization engine performing real-time graph connectivity analysis, Kruskal MST minimum cost network design, Dijkstra least-cost routing, and Tarjan SPOF vulnerability assessment.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate('network')}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition"
            >
              <span>Explore Network Map</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate('analysis')}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition"
            >
              <Play className="h-4 w-4 text-emerald-400" />
              <span>Run Graph Algorithms</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Network Nodes Card */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Network Locations</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{summary.location_count}</span>
            <span className="text-xs text-slate-400 ml-2">nodes</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-400 font-medium">{summary.total_population.toLocaleString()}</span> residents served
          </p>
        </div>

        {/* Connections Card */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Infrastructure Edges</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <GitBranch className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{summary.connection_count}</span>
            <span className="text-xs text-slate-400 ml-2">multi-utility links</span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400">
            <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-amber-400" /> Power</span>
            <span className="flex items-center gap-1"><Droplets className="h-3 w-3 text-cyan-400" /> Water</span>
            <span className="flex items-center gap-1"><Car className="h-3 w-3 text-slate-300" /> Road</span>
          </div>
        </div>

        {/* Connected Components Card */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Connected Regions</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white">{summary.connected_components}</span>
            <span className="text-xs text-slate-400 ml-2">clusters</span>
          </div>
          <p className="text-[11px] text-amber-400 mt-2 font-medium">
            {summary.connected_components > 1 ? `⚠️ ${summary.connected_components - 1} disconnected sub-networks` : '✓ 100% Fully Connected Grid'}
          </p>
        </div>

        {/* Single Points of Failure Card */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">SPOF Vulnerabilities</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-rose-400">{summary.single_points_of_failure_count}</span>
            <span className="text-xs text-slate-400 ml-2">bridge links</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Resilience Index: <span className="font-bold text-amber-400">{summary.resilience_score}/100</span>
          </p>
        </div>
      </div>

      {/* Financial & Optimization Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Network Capital Cost Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <IndianRupee className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Total Estimated Construction Cost</h3>
                <p className="text-xs text-slate-400">Current Full Grid Baseline Capital</p>
              </div>
            </div>
            <span className="text-2xl font-black text-amber-400">₹{costCr} Cr</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 w-full"></div>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Includes all {summary.connection_count} transmission lines, water pipelines, and road arterial links in current database.
          </p>
        </div>

        {/* Kruskal MST Optimization Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <TrendingDown className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Kruskal MST Optimized Cost</h3>
                <p className="text-xs text-slate-400">Minimum Spanning Tree Topology</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-400">₹{mstCostCr} Cr</span>
              <span className="block text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded mt-0.5">
                Save ₹{mstSavingsCr} Cr ({summary.mst_savings_percentage}%)
              </span>
            </div>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex">
            <div style={{ width: `${100 - summary.mst_savings_percentage}%` }} className="h-full bg-emerald-500"></div>
            <div style={{ width: `${summary.mst_savings_percentage}%` }} className="h-full bg-slate-700 opacity-40"></div>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            DAA Kruskal Algorithm eliminates redundant cost cycles while keeping 100% required nodes connected.
          </p>
        </div>
      </div>
    </div>
  );
};
