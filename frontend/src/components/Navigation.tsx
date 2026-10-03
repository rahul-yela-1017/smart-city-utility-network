import React, { useState } from 'react';
import {
  Activity, MapPin, Database, Cpu, Layers, FileText, RefreshCw,
  Bell, Search, ShieldAlert, Sparkles, CheckCircle2
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLoadDemo: () => void;
  isSeeding: boolean;
  alertCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  onLoadDemo,
  isSeeding,
  alertCount
}) => {
  const [showAlerts, setShowAlerts] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'network', label: 'Network Map', icon: MapPin },
    { id: 'analysis', label: 'Analysis Center', icon: Cpu },
    { id: 'scenarios', label: 'Scenario Planner', icon: Layers },
    { id: 'data', label: 'Data Manager', icon: Database },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="h-5 w-5 text-blue-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                  CITYGRID
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">
                  AI v1.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">Smart City Utility Intelligence</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center space-x-3">
            {/* Load Demo City Button */}
            <button
              onClick={onLoadDemo}
              disabled={isSeeding}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-semibold hover:from-indigo-500 hover:to-blue-500 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
              <span>{isSeeding ? 'Seeding Grid...' : 'Load Demo City'}</span>
            </button>

            {/* Notification Alerts Bell */}
            <div className="relative">
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition relative"
                title="Alerts & Notifications"
              >
                <Bell className="h-5 w-5" />
                {alertCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                    {alertCount}
                  </span>
                )}
              </button>

              {/* Alerts Dropdown Modal */}
              {showAlerts && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4 text-rose-400" /> Infrastructure Alerts
                    </span>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-semibold">
                      {alertCount} Active
                    </span>
                  </div>
                  <div className="mt-3 space-y-2 max-h-60 overflow-y-auto text-xs">
                    <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
                      <p className="font-semibold flex items-center justify-between">
                        <span>Single Point of Failure</span>
                        <span className="text-[10px] text-rose-400">HIGH</span>
                      </p>
                      <p className="text-[11px] text-slate-300 mt-1">
                        11 critical electricity & water connections identified with zero alternative bypass routes.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
                      <p className="font-semibold flex items-center justify-between">
                        <span>Capacity Bottlenecks</span>
                        <span className="text-[10px] text-amber-400">WARN</span>
                      </p>
                      <p className="text-[11px] text-slate-300 mt-1">
                        16 utility lines operating above 85% capacity threshold.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      <p className="font-semibold flex items-center justify-between">
                        <span>Graph Engine Sync</span>
                        <span className="text-[10px] text-emerald-400">OK</span>
                      </p>
                      <p className="text-[11px] text-slate-300 mt-1">
                        FastAPI backend connected cleanly. 52 nodes ready for DAA analysis.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-blue-400">
                MP
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
