import React, { useState } from 'react';
import { ScenarioResult } from '../types';
import { runScenarioPlanning } from '../services/api';
import { Layers, Play, IndianRupee, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';

export const ScenarioPlanner: React.FC = () => {
  const [scenarioName, setScenarioName] = useState('East Satellite Township Phase 2');
  const [population, setPopulation] = useState(65000);
  const [elecDemand, setElecDemand] = useState(25.0);
  const [waterDemand, setWaterDemand] = useState(12.0);
  const [trafficDemand, setTrafficDemand] = useState(18000);
  const [targetType, setTargetType] = useState('Industrial Zone');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScenarioResult | null>(null);

  const handlePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await runScenarioPlanning({
        scenario_name: scenarioName,
        population,
        electricity_demand_mw: elecDemand,
        water_demand_mld: waterDemand,
        traffic_demand_vpd: trafficDemand,
        target_location_type: targetType
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">
          <Layers className="h-4 w-4" />
          <span>What-If Urban Growth Calculator</span>
        </div>
        <h2 className="text-xl font-extrabold text-white">Urban Expansion Scenario Planner</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Simulates adding new industrial zones, commercial hubs, or residential satellite cities. Calculates additional infrastructure requirements, cost estimates in ₹ Lakhs, and potential grid bottlenecks.
        </p>

        <form onSubmit={handlePlan} className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Scenario Title</label>
            <input
              type="text"
              required
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2.5 rounded-xl focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Projected Population</label>
            <input
              type="number"
              value={population}
              onChange={(e) => setPopulation(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2.5 rounded-xl focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Electricity Demand (MW)</label>
            <input
              type="number"
              step="0.5"
              value={elecDemand}
              onChange={(e) => setElecDemand(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2.5 rounded-xl focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Water Demand (ML/day)</label>
            <input
              type="number"
              step="0.5"
              value={waterDemand}
              onChange={(e) => setWaterDemand(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2.5 rounded-xl focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Traffic Demand (vehicles/day)</label>
            <input
              type="number"
              value={trafficDemand}
              onChange={(e) => setTrafficDemand(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2.5 rounded-xl focus:border-indigo-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>{loading ? 'Simulating...' : 'Calculate Scenario Impact'}</span>
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
              <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">Estimated Construction Cost</span>
              <span className="text-3xl font-black text-amber-400">₹{result.estimated_construction_cost} Lakhs</span>
              <span className="text-xs text-slate-400 block mt-1">(₹{(result.estimated_construction_cost / 100).toFixed(2)} Crores)</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
              <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">Annual Maintenance Budget</span>
              <span className="text-3xl font-black text-emerald-400">₹{result.estimated_maintenance_cost} Lakhs/yr</span>
            </div>
          </div>

          {/* Recommended Connections */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4">Recommended New Infrastructure Connections</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.recommended_new_connections.map((c, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                  <span className="font-bold text-indigo-400">{c.infrastructure} Link</span>
                  <p className="font-semibold text-white">{c.source} → {c.target}</p>
                  <p className="text-slate-400">Capacity: <b className="text-white">{c.capacity}</b></p>
                  <p className="text-amber-400 font-bold">{c.estimated_cost}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottlenecks & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-rose-400 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Grid Bottleneck Warnings
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {result.potential_bottlenecks.map((b, idx) => (
                  <li key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" /> Recommended Grid Changes
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {result.infrastructure_upgrade_recommendations.map((r, idx) => (
                  <li key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
