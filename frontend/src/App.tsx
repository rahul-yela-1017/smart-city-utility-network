import React, { useEffect, useState } from 'react';
import { Location, Connection, ExecutiveSummary } from './types';
import { getLocations, getConnections, getExecutiveSummary, seedDemoCity } from './services/api';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { DashboardOverview } from './components/DashboardOverview';
import { NetworkMap } from './components/NetworkMap';
import { GoogleNetworkMap } from './components/GoogleNetworkMap';
import { AnalysisCenter } from './components/AnalysisCenter';
import { ScenarioPlanner } from './components/ScenarioPlanner';
import { DataManager } from './components/DataManager';
import { ReportGenerator } from './components/ReportGenerator';
import { AlgorithmDetailsModal } from './components/AlgorithmDetailsModal';
import { Cpu, MapPin, Globe } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBmrdlmo-0MOYiK_TEJUnGA3jPAMhQhPac';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mapMode, setMapMode] = useState<'google' | 'cytoscape'>('google');
  
  const [locations, setLocations] = useState<Location[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [summary, setSummary] = useState<ExecutiveSummary | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [showAlgoDetails, setShowAlgoDetails] = useState(false);

  // Map highlights
  const [routeNodeIds, setRouteNodeIds] = useState<string[]>([]);
  const [routeEdgeIds, setRouteEdgeIds] = useState<string[]>([]);
  const [mstEdgeIds, setMstEdgeIds] = useState<string[]>([]);

  const refreshData = async () => {
    try {
      const [locs, conns, sum] = await Promise.all([
        getLocations(),
        getConnections(),
        getExecutiveSummary(),
      ]);
      setLocations(locs);
      setConnections(conns);
      setSummary(sum);
    } catch (err) {
      console.error('Error fetching grid data:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleLoadDemo = async () => {
    setIsSeeding(true);
    try {
      await seedDemoCity();
      await refreshData();
    } catch (err) {
      console.error('Error seeding demo city:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleHighlightRoute = (nodeIds: string[], edgeIds: string[]) => {
    setRouteNodeIds(nodeIds);
    setRouteEdgeIds(edgeIds);
    setMstEdgeIds([]);
    setActiveTab('network');
  };

  const handleHighlightMst = (edgeIds: string[]) => {
    setMstEdgeIds(edgeIds);
    setRouteNodeIds([]);
    setRouteEdgeIds([]);
    setActiveTab('network');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLoadDemo={handleLoadDemo}
        isSeeding={isSeeding}
        alertCount={summary?.single_points_of_failure_count || 11}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'landing' && (
          <LandingPage
            onExplore={() => setActiveTab('overview')}
            onLoadDemo={handleLoadDemo}
          />
        )}

        {activeTab === 'overview' && (
          <DashboardOverview
            summary={summary}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'network' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-400" /> Interactive City Utility Map
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {locations.length} locations & {connections.length} connections loaded. Real Google Maps API active with custom Dark vector/Satellite layer.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {/* Map Engine Toggle */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
                  <button
                    onClick={() => setMapMode('google')}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition ${
                      mapMode === 'google'
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Globe className="h-3.5 w-3.5" />
                    <span>Google Maps</span>
                  </button>
                  <button
                    onClick={() => setMapMode('cytoscape')}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition ${
                      mapMode === 'cytoscape'
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Cytoscape Graph</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowAlgoDetails(true)}
                  className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition"
                >
                  <Cpu className="h-4 w-4" />
                  <span>Algorithm Details</span>
                </button>
              </div>
            </div>

            {mapMode === 'google' ? (
              <GoogleNetworkMap
                locations={locations}
                connections={connections}
                apiKey={GOOGLE_MAPS_API_KEY}
                highlightRouteNodeIds={routeNodeIds}
                highlightRouteEdgeIds={routeEdgeIds}
                highlightMstEdgeIds={mstEdgeIds}
              />
            ) : (
              <NetworkMap
                locations={locations}
                connections={connections}
                highlightRouteNodeIds={routeNodeIds}
                highlightRouteEdgeIds={routeEdgeIds}
                highlightMstEdgeIds={mstEdgeIds}
              />
            )}
          </div>
        )}

        {activeTab === 'analysis' && (
          <AnalysisCenter
            locations={locations}
            connections={connections}
            onHighlightRoute={handleHighlightRoute}
            onHighlightMst={handleHighlightMst}
          />
        )}

        {activeTab === 'scenarios' && (
          <ScenarioPlanner />
        )}

        {activeTab === 'data' && (
          <DataManager
            locations={locations}
            connections={connections}
            onDataChanged={refreshData}
          />
        )}

        {activeTab === 'reports' && (
          <ReportGenerator />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 mt-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CITYGRID AI © 2026 — Smart City Utility Intelligence & Optimization Platform</span>
          <button
            onClick={() => setShowAlgoDetails(true)}
            className="text-blue-400 hover:underline flex items-center gap-1"
          >
            <Cpu className="h-3.5 w-3.5" /> DAA Algorithm Complexity Specs
          </button>
        </div>
      </footer>

      <AlgorithmDetailsModal
        isOpen={showAlgoDetails}
        onClose={() => setShowAlgoDetails(false)}
      />
    </div>
  );
}

export default App;
