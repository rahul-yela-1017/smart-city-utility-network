import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import { Location, Connection } from '../types';
import { Zap, Droplets, Car, X, ShieldAlert, Building2 } from 'lucide-react';

interface GoogleNetworkMapProps {
  locations: Location[];
  connections: Connection[];
  apiKey: string;
  highlightRouteNodeIds?: string[];
  highlightRouteEdgeIds?: string[];
  highlightMstEdgeIds?: string[];
}

const mapContainerStyle = {
  width: '100%',
  height: '650px',
  borderRadius: '1rem',
};

const defaultCenter = {
  lat: 12.9680,
  lng: 77.6000,
};

// Dark style for Google Maps
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#4b687a' }] },
  { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#64779e' }] },
  { featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{ color: '#4b687a' }] },
  { featureType: 'landscape.man_made', elementType: 'geometry.stroke', stylers: [{ color: '#334e68' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#023e58' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#283d6a' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6f9ba5' }] },
  { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#023e58' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2c4591' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2d5a' }] },
  { featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4e6d96' }] },
];

export const GoogleNetworkMap: React.FC<GoogleNetworkMapProps> = ({
  locations,
  connections,
  apiKey,
  highlightRouteNodeIds = [],
  highlightRouteEdgeIds = [],
  highlightMstEdgeIds = [],
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });

  const [selectedLoc, setSelectedLoc] = useState<Location | null>(null);
  const [selectedConn, setSelectedConn] = useState<Connection | null>(null);
  const [infraFilter, setInfraFilter] = useState<string>('All');
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');

  if (loadError) {
    return (
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center text-rose-400">
        Error loading Google Maps API. Please verify network connection or API key validity.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-[650px] bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
        <span>Loading Real Google Maps Tiles...</span>
      </div>
    );
  }

  const locMap = new Map(locations.map(l => [l.id, l]));

  const filteredConns = infraFilter === 'All'
    ? connections
    : connections.filter(c => c.infrastructure_type === infraFilter);

  const routeNodeSet = new Set(highlightRouteNodeIds);
  const routeEdgeSet = new Set(highlightRouteEdgeIds);
  const mstEdgeSet = new Set(highlightMstEdgeIds);

  return (
    <div className="relative w-full h-[650px] rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      {/* Top Map Controls Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-800 shadow-lg text-xs">
        <div className="flex items-center space-x-1 border-r border-slate-800 pr-2">
          <button
            onClick={() => setInfraFilter('All')}
            className={`px-2.5 py-1 font-semibold rounded-lg transition ${
              infraFilter === 'All' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Grid
          </button>
          <button
            onClick={() => setInfraFilter('Electricity')}
            className={`flex items-center space-x-1 px-2.5 py-1 font-semibold rounded-lg transition ${
              infraFilter === 'Electricity' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Power</span>
          </button>
          <button
            onClick={() => setInfraFilter('Water')}
            className={`flex items-center space-x-1 px-2.5 py-1 font-semibold rounded-lg transition ${
              infraFilter === 'Water' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-cyan-400'
            }`}
          >
            <Droplets className="h-3.5 w-3.5" />
            <span>Water</span>
          </button>
          <button
            onClick={() => setInfraFilter('Road')}
            className={`flex items-center space-x-1 px-2.5 py-1 font-semibold rounded-lg transition ${
              infraFilter === 'Road' ? 'bg-slate-300 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Car className="h-3.5 w-3.5" />
            <span>Road</span>
          </button>
        </div>

        {/* Map Type Switcher */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setMapType('roadmap')}
            className={`px-2 py-1 font-semibold rounded-lg transition ${
              mapType === 'roadmap' ? 'bg-slate-700 text-white' : 'text-slate-400'
            }`}
          >
            Dark Vector
          </button>
          <button
            onClick={() => setMapType('satellite')}
            className={`px-2 py-1 font-semibold rounded-lg transition ${
              mapType === 'satellite' ? 'bg-slate-700 text-white' : 'text-slate-400'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setMapType('hybrid')}
            className={`px-2 py-1 font-semibold rounded-lg transition ${
              mapType === 'hybrid' ? 'bg-slate-700 text-white' : 'text-slate-400'
            }`}
          >
            Hybrid
          </button>
        </div>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={12.5}
        mapTypeId={mapType}
        options={{
          styles: mapType === 'roadmap' ? darkMapStyle : undefined,
          disableDefaultUI: false,
          zoomControl: true,
        }}
      >
        {/* Render Connection Polylines */}
        {filteredConns.map((conn) => {
          const src = locMap.get(conn.source_id);
          const tgt = locMap.get(conn.target_id);
          if (!src || !tgt) return null;

          const isRouteEdge = routeEdgeSet.has(conn.id);
          const isMstEdge = mstEdgeSet.has(conn.id);

          let strokeColor = '#64748b'; // slate
          let strokeWeight = 2;
          let opacity = 0.6;

          if (conn.infrastructure_type === 'Electricity') strokeColor = '#f59e0b';
          else if (conn.infrastructure_type === 'Water') strokeColor = '#06b6d4';
          else if (conn.infrastructure_type === 'Road') strokeColor = '#94a3b8';

          if (isRouteEdge) {
            strokeColor = '#10b981'; // neon green
            strokeWeight = 6;
            opacity = 1.0;
          } else if (mstEdgeSet.size > 0) {
            if (isMstEdge) {
              strokeColor = '#10b981';
              strokeWeight = 5;
              opacity = 1.0;
            } else {
              opacity = 0.2;
              strokeWeight = 1;
            }
          }

          return (
            <Polyline
              key={conn.id}
              path={[
                { lat: src.lat, lng: src.lng },
                { lat: tgt.lat, lng: tgt.lng },
              ]}
              options={{
                strokeColor,
                strokeWeight,
                strokeOpacity: opacity,
              }}
              onClick={() => {
                setSelectedConn(conn);
                setSelectedLoc(null);
              }}
            />
          );
        })}

        {/* Render Location Markers */}
        {locations.map((loc) => {
          const isRouteNode = routeNodeSet.has(loc.id);

          let markerColor = '#3b82f6';
          if (loc.priority === 'Critical') markerColor = '#ef4444';
          else if (loc.priority === 'High') markerColor = '#f59e0b';
          else if (loc.type === 'Village') markerColor = '#a855f7';

          if (isRouteNode) markerColor = '#10b981';

          return (
            <Marker
              key={loc.id}
              position={{ lat: loc.lat, lng: loc.lng }}
              title={`${loc.name} (${loc.type})`}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: markerColor,
                fillOpacity: 0.9,
                strokeColor: '#ffffff',
                strokeWeight: isRouteNode ? 3 : 1.5,
                scale: isRouteNode ? 9 : 6.5,
              }}
              onClick={() => {
                setSelectedLoc(loc);
                setSelectedConn(null);
              }}
            />
          );
        })}

        {/* Location InfoWindow */}
        {selectedLoc && (
          <InfoWindow
            position={{ lat: selectedLoc.lat, lng: selectedLoc.lng }}
            onCloseClick={() => setSelectedLoc(null)}
          >
            <div className="p-2 text-slate-900 text-xs font-sans max-w-xs space-y-1">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                selectedLoc.priority === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {selectedLoc.priority} Priority
              </span>
              <h4 className="font-extrabold text-sm">{selectedLoc.name}</h4>
              <p className="text-slate-600 font-medium">{selectedLoc.type} • ID: {selectedLoc.id}</p>
              <div className="pt-1 text-[11px] border-t border-slate-200 space-y-0.5">
                <p>Population: <b>{selectedLoc.population.toLocaleString()}</b></p>
                <p>Power Demand: <b>{selectedLoc.electricity_demand} MW</b></p>
                <p>Water Demand: <b>{selectedLoc.water_demand} ML/day</b></p>
                <p>Traffic Demand: <b>{selectedLoc.traffic_demand.toLocaleString()} vpd</b></p>
              </div>
            </div>
          </InfoWindow>
        )}

        {/* Connection InfoWindow */}
        {selectedConn && (
          <InfoWindow
            position={{
              lat: ((locMap.get(selectedConn.source_id)?.lat ?? defaultCenter.lat) + (locMap.get(selectedConn.target_id)?.lat ?? defaultCenter.lat)) / 2,
              lng: ((locMap.get(selectedConn.source_id)?.lng ?? defaultCenter.lng) + (locMap.get(selectedConn.target_id)?.lng ?? defaultCenter.lng)) / 2,
            }}
            onCloseClick={() => setSelectedConn(null)}
          >
            <div className="p-2 text-slate-900 text-xs font-sans max-w-xs space-y-1">
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded uppercase">
                {selectedConn.infrastructure_type} Link
              </span>
              <h4 className="font-extrabold text-sm">Connection {selectedConn.id}</h4>
              <p className="text-slate-600">{selectedConn.source_id} ↔ {selectedConn.target_id}</p>
              <div className="pt-1 text-[11px] border-t border-slate-200 space-y-0.5">
                <p>Cost: <b>₹{selectedConn.cost} Lakhs</b></p>
                <p>Distance: <b>{selectedConn.distance} km</b></p>
                <p>Capacity Utilization: <b>{selectedConn.utilization}%</b></p>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};
