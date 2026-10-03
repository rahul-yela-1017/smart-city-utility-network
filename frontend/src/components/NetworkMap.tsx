import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
// @ts-ignore
import dagre from 'cytoscape-dagre';
import { Location, Connection } from '../types';
import {
  Zap, Droplets, Car, Search, Maximize2, RefreshCw, X, ShieldAlert,
  Building2, Activity, ArrowRight, Layers
} from 'lucide-react';

if (typeof cytoscape !== 'undefined') {
  try {
    cytoscape.use(dagre);
  } catch (e) {
    // Registered already
  }
}

interface NetworkMapProps {
  locations: Location[];
  connections: Connection[];
  highlightRouteNodeIds?: string[];
  highlightRouteEdgeIds?: string[];
  highlightMstEdgeIds?: string[];
  selectedFilterInfra?: string;
  onSelectNode?: (loc: Location) => void;
  onSelectEdge?: (conn: Connection) => void;
}

export const NetworkMap: React.FC<NetworkMapProps> = ({
  locations,
  connections,
  highlightRouteNodeIds = [],
  highlightRouteEdgeIds = [],
  highlightMstEdgeIds = [],
  selectedFilterInfra = 'All',
  onSelectNode,
  onSelectEdge
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  const [filterInfra, setFilterInfra] = useState<string>(selectedFilterInfra);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLoc, setSelectedLoc] = useState<Location | null>(null);
  const [selectedConn, setSelectedConn] = useState<Connection | null>(null);

  useEffect(() => {
    setFilterInfra(selectedFilterInfra);
  }, [selectedFilterInfra]);

  useEffect(() => {
    if (!containerRef.current || locations.length === 0) return;

    // Filter connections if needed
    const filteredConns = filterInfra === 'All'
      ? connections
      : connections.filter(c => c.infrastructure_type === filterInfra);

    // Build elements array for Cytoscape
    const elements: cytoscape.ElementDefinition[] = [];

    // Add nodes
    locations.forEach((loc) => {
      let color = '#3b82f6'; // default blue
      if (loc.priority === 'Critical') color = '#ef4444'; // rose red
      else if (loc.priority === 'High') color = '#f59e0b'; // amber
      else if (loc.type === 'Village') color = '#a855f7'; // purple

      // Scale lat/lng for canvas layout position
      const posX = (loc.lng - 77.50) * 12000;
      const posY = (13.08 - loc.lat) * 12000;

      elements.push({
        data: {
          id: loc.id,
          label: loc.name,
          type: loc.type,
          priority: loc.priority,
          population: loc.population,
          color: color,
          nodeData: loc
        },
        position: { x: posX, y: posY }
      });
    });

    // Add edges
    filteredConns.forEach((conn) => {
      let lineStyle = 'solid';
      let edgeColor = '#64748b'; // default slate

      if (conn.infrastructure_type === 'Electricity') {
        edgeColor = '#f59e0b'; // gold
      } else if (conn.infrastructure_type === 'Water') {
        edgeColor = '#06b6d4'; // cyan
      } else if (conn.infrastructure_type === 'Road') {
        edgeColor = '#94a3b8'; // slate
        lineStyle = 'dashed';
      }

      elements.push({
        data: {
          id: conn.id,
          source: conn.source_id,
          target: conn.target_id,
          infra: conn.infrastructure_type,
          cost: conn.cost,
          edgeColor: edgeColor,
          lineStyle: lineStyle,
          connData: conn
        }
      });
    });

    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'label': 'data(label)',
            'color': '#f8fafc',
            'font-size': '10px',
            'font-weight': 'bold',
            'text-valign': 'bottom',
            'text-margin-y': 4,
            'width': 22,
            'height': 22,
            'border-width': 2,
            'border-color': '#0f172a',
            'overlay-padding': 4,
            'text-background-opacity': 0.8,
            'text-background-color': '#0f172a',
            'text-background-padding': '3px',
            'text-background-shape': 'roundrectangle'
          }
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 4,
            'border-color': '#38bdf8',
            'width': 28,
            'height': 28,
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2.5,
            'line-color': 'data(edgeColor)',
            'line-style': 'data(lineStyle)' as any,
            'curve-style': 'bezier',
            'opacity': 0.7
          }
        },
        {
          selector: 'edge:selected',
          style: {
            'width': 5,
            'line-color': '#38bdf8',
            'opacity': 1.0
          }
        }
      ],
      layout: {
        name: 'preset',
        fit: true,
        padding: 50
      },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false
    });

    // Apply Route Highlighting if present
    if (highlightRouteNodeIds.length > 0) {
      highlightRouteNodeIds.forEach((nid) => {
        const node = cy.getElementById(nid);
        if (node) {
          node.style({
            'background-color': '#10b981',
            'border-color': '#ffffff',
            'border-width': 4,
            'width': 30,
            'height': 30,
            'z-index': 99
          });
        }
      });

      highlightRouteEdgeIds.forEach((eid) => {
        const edge = cy.getElementById(eid);
        if (edge) {
          edge.style({
            'line-color': '#10b981',
            'width': 6,
            'opacity': 1.0,
            'z-index': 99
          });
        }
      });
    }

    // Apply MST Highlighting if present
    if (highlightMstEdgeIds.length > 0) {
      const mstSet = new Set(highlightMstEdgeIds);
      cy.edges().forEach((edge) => {
        if (mstSet.has(edge.id())) {
          edge.style({
            'line-color': '#10b981',
            'width': 5,
            'opacity': 1.0,
            'z-index': 90
          });
        } else {
          edge.style({
            'line-color': '#475569',
            'line-style': 'dashed',
            'width': 1.5,
            'opacity': 0.25
          });
        }
      });
    }

    // Click Handlers
    cy.on('tap', 'node', (evt) => {
      const nodeObj = evt.target.data('nodeData') as Location;
      setSelectedLoc(nodeObj);
      setSelectedConn(null);
      if (onSelectNode) onSelectNode(nodeObj);
    });

    cy.on('tap', 'edge', (evt) => {
      const connObj = evt.target.data('connData') as Connection;
      setSelectedConn(connObj);
      setSelectedLoc(null);
      if (onSelectEdge) onSelectEdge(connObj);
    });

    cyRef.current = cy;
  }, [locations, connections, filterInfra, highlightRouteNodeIds, highlightRouteEdgeIds, highlightMstEdgeIds]);

  // Search Filter Handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cyRef.current || !searchQuery) return;
    const found = cyRef.current.nodes().filter(n => n.data('label').toLowerCase().includes(searchQuery.toLowerCase()));
    if (found.length > 0) {
      cyRef.current.animate({
        center: { eles: found },
        zoom: 1.5
      }, { duration: 500 });
      found.select();
      setSelectedLoc(found.first().data('nodeData'));
    }
  };

  const handleResetZoom = () => {
    if (cyRef.current) {
      cyRef.current.fit();
      cyRef.current.zoom(1.0);
    }
  };

  return (
    <div className="relative w-full h-[650px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Top Map Controls Bar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-800 shadow-lg">
        {/* Utility Filter Buttons */}
        <div className="flex items-center space-x-1 border-r border-slate-800 pr-2">
          <button
            onClick={() => setFilterInfra('All')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              filterInfra === 'All' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Grid
          </button>
          <button
            onClick={() => setFilterInfra('Electricity')}
            className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              filterInfra === 'Electricity' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Power</span>
          </button>
          <button
            onClick={() => setFilterInfra('Water')}
            className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              filterInfra === 'Water' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-cyan-400'
            }`}
          >
            <Droplets className="h-3.5 w-3.5" />
            <span>Water</span>
          </button>
          <button
            onClick={() => setFilterInfra('Road')}
            className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              filterInfra === 'Road' ? 'bg-slate-300 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Car className="h-3.5 w-3.5" />
            <span>Road</span>
          </button>
        </div>

        {/* Search Node */}
        <form onSubmit={handleSearch} className="flex items-center space-x-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 text-slate-200 text-xs px-3 py-1.5 pl-8 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500 w-40"
            />
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>
        </form>

        <button
          onClick={handleResetZoom}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
          title="Reset Zoom"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* Legend Badge Overlay */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-[11px] space-y-1.5 shadow-lg">
        <span className="font-bold text-slate-300 uppercase tracking-wider block text-[10px] mb-1">Grid Legend</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-rose-400 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block"></span> Critical Facility
          </span>
          <span className="flex items-center gap-1.5 text-amber-400 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block"></span> High Priority
          </span>
          <span className="flex items-center gap-1.5 text-blue-400 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 inline-block"></span> Normal Node
          </span>
          <span className="flex items-center gap-1.5 text-purple-400 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500 inline-block"></span> Village Cluster
          </span>
        </div>
      </div>

      {/* Main Cytoscape Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing bg-slate-950" />

      {/* Node Details Inspection Drawer */}
      {selectedLoc && (
        <div className="absolute top-4 right-4 z-30 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl p-4 shadow-2xl animate-in fade-in slide-in-from-right-4">
          <div className="flex items-start justify-between pb-3 border-b border-slate-800">
            <div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                selectedLoc.priority === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {selectedLoc.priority} Priority
              </span>
              <h3 className="text-base font-extrabold text-white mt-1">{selectedLoc.name}</h3>
              <p className="text-xs text-slate-400 font-medium">{selectedLoc.type} • ID: {selectedLoc.id}</p>
            </div>
            <button onClick={() => setSelectedLoc(null)} className="text-slate-400 hover:text-white p-1">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Population Served:</span>
              <span className="font-bold text-white">{selectedLoc.population.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Electricity Demand:</span>
              <span className="font-bold text-amber-400">{selectedLoc.electricity_demand} MW</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Water Demand:</span>
              <span className="font-bold text-cyan-400">{selectedLoc.water_demand} ML/day</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Traffic Demand:</span>
              <span className="font-bold text-slate-300">{selectedLoc.traffic_demand.toLocaleString()} vpd</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Criticality Index:</span>
              <span className="font-bold text-rose-400">{selectedLoc.criticality}/100</span>
            </div>
          </div>
        </div>
      )}

      {/* Edge Details Inspection Drawer */}
      {selectedConn && (
        <div className="absolute top-4 right-4 z-30 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl p-4 shadow-2xl animate-in fade-in slide-in-from-right-4">
          <div className="flex items-start justify-between pb-3 border-b border-slate-800">
            <div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                selectedConn.infrastructure_type === 'Electricity' ? 'bg-amber-500/20 text-amber-400' :
                selectedConn.infrastructure_type === 'Water' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-500/20 text-slate-300'
              }`}>
                {selectedConn.infrastructure_type} Link
              </span>
              <h3 className="text-base font-extrabold text-white mt-1">Connection {selectedConn.id}</h3>
              <p className="text-xs text-slate-400">{selectedConn.source_id} ↔ {selectedConn.target_id}</p>
            </div>
            <button onClick={() => setSelectedConn(null)} className="text-slate-400 hover:text-white p-1">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Construction Cost:</span>
              <span className="font-bold text-amber-400">₹{selectedConn.cost} Lakhs</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Distance:</span>
              <span className="font-bold text-white">{selectedConn.distance} km</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Capacity Limit:</span>
              <span className="font-bold text-white">{selectedConn.capacity}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Capacity Utilization:</span>
              <span className={`font-bold ${selectedConn.utilization >= 85 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {selectedConn.utilization}%
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Reliability Rating:</span>
              <span className="font-bold text-emerald-400">{selectedConn.reliability}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
