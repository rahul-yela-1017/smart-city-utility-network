import React from 'react';
import { Cpu, ShieldCheck, Zap, Layers, ArrowRight, Play, CheckCircle2, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onExplore: () => void;
  onLoadDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onExplore, onLoadDemo }) => {
  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <div className="relative text-center space-y-6 max-w-4xl mx-auto pt-8">
        <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3.5 py-1.5 rounded-full text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Smart City Infrastructure Decision Support System</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          CITYGRID AI
        </h1>

        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Smart city utility network intelligence and optimization platform powered by real-world DAA graph algorithms. Connect locations, optimize capital expenditure, and protect critical urban infrastructure.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={onExplore}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-xl shadow-blue-600/30 transition text-sm"
          >
            <span>Explore Command Center</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={onLoadDemo}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold px-6 py-3.5 rounded-xl border border-slate-800 transition text-sm"
          >
            <Play className="h-4 w-4 text-emerald-400 fill-current" />
            <span>Load Demo City Grid</span>
          </button>
        </div>
      </div>

      {/* 3 Core Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 w-fit">
            <Layers className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">CONNECT</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            DFS/BFS Connected Components traversal detects isolated nodes, disconnected regions, and quantifies affected population clusters across multi-utility networks.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">OPTIMIZE</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Kruskal's MST algorithm eliminates redundant cost cycles, saving up to 59% capital expenditure while keeping 100% required locations connected.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 w-fit">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">PROTECT</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tarjan's bridge algorithm identifies Single Points of Failure (SPOFs) and calculates the 0-100 CITYGRID Risk Score to safeguard critical hospitals and power grids.
          </p>
        </div>
      </div>
    </div>
  );
};
