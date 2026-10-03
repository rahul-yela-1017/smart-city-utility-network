import React from 'react';
import { X, Cpu, GitBranch, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AlgorithmDetailsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlgorithmDetailsModal: React.FC<AlgorithmDetailsProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-extrabold text-white">DAA Graph Algorithm Specifications & Transparency</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* BFS/DFS */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-400 text-sm">BFS / DFS Connectivity</span>
              <span className="bg-blue-500/20 text-blue-300 font-mono px-2 py-0.5 rounded text-[10px]">O(V + E)</span>
            </div>
            <p className="text-slate-300">
              <b>Purpose:</b> Decomposes graph into disjoint connected components and isolated vertices.
            </p>
            <p className="text-slate-400">
              <b>Data Structures:</b> Adjacency List, Visited Set, Queue (BFS).
            </p>
          </div>

          {/* Kruskal */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 text-sm">Kruskal's MST</span>
              <span className="bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded text-[10px]">O(E log E)</span>
            </div>
            <p className="text-slate-300">
              <b>Purpose:</b> Connects all required nodes with minimum total capital cost without forming cycles.
            </p>
            <p className="text-slate-400">
              <b>Data Structures:</b> Sorted Edge Array, Disjoint Set Union (DSU) with Path Compression & Union-by-Rank.
            </p>
          </div>

          {/* Dijkstra */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-400 text-sm">Dijkstra Shortest Path</span>
              <span className="bg-cyan-500/20 text-cyan-300 font-mono px-2 py-0.5 rounded text-[10px]">O((V+E) log V)</span>
            </div>
            <p className="text-slate-300">
              <b>Purpose:</b> Calculates least-cost route between source & target nodes.
            </p>
            <p className="text-slate-400">
              <b>Data Structures:</b> Priority Queue (Min-Heap `heapq`), Distance Array, Parent Pointer Map.
            </p>
          </div>

          {/* Tarjan */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-400 text-sm">Tarjan's Bridge SPOF</span>
              <span className="bg-rose-500/20 text-rose-300 font-mono px-2 py-0.5 rounded text-[10px]">O(V + E)</span>
            </div>
            <p className="text-slate-300">
              <b>Purpose:</b> Detects single point of failure connections whose destruction splits the network.
            </p>
            <p className="text-slate-400">
              <b>Data Structures:</b> Discovery Array `tin[u]`, Low-link Array `low[u]`, DFS Call Stack.
            </p>
          </div>
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2 rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
