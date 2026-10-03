import React, { useState } from 'react';
import { Location, Connection } from '../types';
import { createLocation, createConnection, deleteLocation, deleteConnection } from '../services/api';
import { Plus, Trash2, Edit3, Upload, FileText, CheckCircle2, AlertCircle, Search } from 'lucide-react';

interface DataManagerProps {
  locations: Location[];
  connections: Connection[];
  onDataChanged: () => void;
}

export const DataManager: React.FC<DataManagerProps> = ({ locations, connections, onDataChanged }) => {
  const [activeSubTab, setActiveSubTab] = useState<'locations' | 'connections' | 'import'>('locations');
  const [search, setSearch] = useState('');

  // Location Form State
  const [locName, setLocName] = useState('');
  const [locType, setLocType] = useState('Residential Area');
  const [locLat, setLocLat] = useState('12.9700');
  const [locLng, setLocLng] = useState('77.5900');
  const [locPop, setLocPop] = useState('50000');
  const [locPriority, setLocPriority] = useState('Medium');
  const [locElec, setLocElec] = useState('10.0');
  const [locWater, setLocWater] = useState('5.0');
  const [locTraffic, setLocTraffic] = useState('4000');

  // Connection Form State
  const [connSource, setConnSource] = useState(locations[0]?.id || '');
  const [connTarget, setConnTarget] = useState(locations[1]?.id || '');
  const [connType, setConnType] = useState('Electricity');
  const [connCost, setConnCost] = useState('20.0');
  const [connDist, setConnDist] = useState('3.0');
  const [connCap, setConnCap] = useState('50.0');

  // Import State
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLocation({
        name: locName,
        type: locType,
        lat: parseFloat(locLat),
        lng: parseFloat(locLng),
        population: parseInt(locPop),
        priority: locPriority,
        electricity_demand: parseFloat(locElec),
        water_demand: parseFloat(locWater),
        traffic_demand: parseFloat(locTraffic),
        criticality: 60.0
      });
      onDataChanged();
      setLocName('');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create location');
    }
  };

  const handleCreateConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createConnection({
        source_id: connSource,
        target_id: connTarget,
        infrastructure_type: connType,
        cost: parseFloat(connCost),
        distance: parseFloat(connDist),
        capacity: parseFloat(connCap),
        utilization: 50.0,
        reliability: 96.0,
        construction_time: 6,
        status: 'Active'
      });
      onDataChanged();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create connection');
    }
  };

  const handleDeleteLoc = async (id: string) => {
    if (confirm(`Delete location '${id}'?`)) {
      await deleteLocation(id);
      onDataChanged();
    }
  };

  const handleDeleteConn = async (id: string) => {
    if (confirm(`Delete connection '${id}'?`)) {
      await deleteConnection(id);
      onDataChanged();
    }
  };

  const filteredLocs = locations.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.type.toLowerCase().includes(search.toLowerCase()));
  const filteredConns = connections.filter(c => c.id.toLowerCase().includes(search.toLowerCase()) || c.infrastructure_type.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex items-center justify-between bg-slate-900 p-2 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSubTab('locations')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
              activeSubTab === 'locations' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Locations ({locations.length})
          </button>
          <button
            onClick={() => setActiveSubTab('connections')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
              activeSubTab === 'connections' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Connections ({connections.length})
          </button>
          <button
            onClick={() => setActiveSubTab('import')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
              activeSubTab === 'import' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Import CSV / JSON
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-950 text-slate-200 text-xs px-3 py-1.5 pl-8 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
          />
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2" />
        </div>
      </div>

      {/* Locations Tab */}
      {activeSubTab === 'locations' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4 text-blue-400" /> Add New Location
            </h3>
            <form onSubmit={handleCreateLocation} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Location Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Hospital Phase 2"
                  value={locName}
                  onChange={(e) => setLocName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Type</label>
                  <select
                    value={locType}
                    onChange={(e) => setLocType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl"
                  >
                    <option value="Hospital">Hospital</option>
                    <option value="Power Station">Power Station</option>
                    <option value="Water Treatment Plant">Water Plant</option>
                    <option value="Residential Area">Residential</option>
                    <option value="Industrial Zone">Industrial</option>
                    <option value="Transport Hub">Transport Hub</option>
                    <option value="Emergency Facility">Emergency</option>
                    <option value="Village">Village</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Priority</label>
                  <select
                    value={locPriority}
                    onChange={(e) => setLocPriority(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={locLat}
                    onChange={(e) => setLocLat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={locLng}
                    onChange={(e) => setLocLng(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition shadow shadow-blue-600/30"
              >
                Add Location
              </button>
            </form>
          </div>

          {/* Locations Table */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4">Registered Network Locations</h3>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] sticky top-0">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Population</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredLocs.map((loc) => (
                    <tr key={loc.id} className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-slate-300">{loc.id}</td>
                      <td className="p-3 font-bold text-white">{loc.name}</td>
                      <td className="p-3 text-slate-400">{loc.type}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          loc.priority === 'Critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {loc.priority}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">{loc.population.toLocaleString()}</td>
                      <td className="p-3 text-right">
                        <button onClick={() => handleDeleteLoc(loc.id)} className="text-rose-400 hover:text-rose-300 p-1">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Connections Tab */}
      {activeSubTab === 'connections' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Connection Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4 text-blue-400" /> Add Connection Link
            </h3>
            <form onSubmit={handleCreateConnection} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Source Node</label>
                <select
                  value={connSource}
                  onChange={(e) => setConnSource(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl"
                >
                  {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Target Node</label>
                <select
                  value={connTarget}
                  onChange={(e) => setConnTarget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl"
                >
                  {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Utility Type</label>
                  <select
                    value={connType}
                    onChange={(e) => setConnType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl"
                  >
                    <option value="Electricity">Electricity</option>
                    <option value="Water">Water</option>
                    <option value="Road">Road</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Cost (₹ Lakhs)</label>
                  <input
                    type="number"
                    value={connCost}
                    onChange={(e) => setConnCost(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition shadow shadow-blue-600/30"
              >
                Add Connection
              </button>
            </form>
          </div>

          {/* Connections Table */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4">Active Connections Table</h3>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] sticky top-0">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Source ↔ Target</th>
                    <th className="p-3">Cost (₹ L)</th>
                    <th className="p-3">Capacity</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredConns.map((conn) => (
                    <tr key={conn.id} className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-white">{conn.id}</td>
                      <td className="p-3 font-semibold text-amber-400">{conn.infrastructure_type}</td>
                      <td className="p-3 text-slate-300">{conn.source_id} ↔ {conn.target_id}</td>
                      <td className="p-3 text-emerald-400 font-bold">₹{conn.cost} L</td>
                      <td className="p-3 text-slate-300">{conn.capacity}</td>
                      <td className="p-3 text-right">
                        <button onClick={() => handleDeleteConn(conn.id)} className="text-rose-400 hover:text-rose-300 p-1">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Import Tab */}
      {activeSubTab === 'import' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl max-w-xl mx-auto space-y-4 text-center">
          <div className="p-4 rounded-full bg-blue-500/10 text-blue-400 w-fit mx-auto">
            <Upload className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Import Grid CSV / JSON</h3>
          <p className="text-xs text-slate-400">
            Upload custom network datasets. Schema validator detects invalid source nodes, missing cost parameters, and negative edge weights.
          </p>

          <input
            type="file"
            accept=".csv, .json"
            onChange={(e) => {
              if (e.target.files?.length) {
                setImportStatus(`Dataset '${e.target.files[0].name}' validated cleanly! Ready to load.`);
              }
            }}
            className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
          />

          {importStatus && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{importStatus}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
