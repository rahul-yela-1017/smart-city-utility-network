import React, { useEffect, useState } from 'react';
import { ExecutiveSummary } from '../types';
import { getExecutiveSummary, getPDFReportUrl } from '../services/api';
import { FileText, Download, Printer, CheckCircle2, ShieldAlert, IndianRupee, Layers } from 'lucide-react';

export const ReportGenerator: React.FC = () => {
  const [summary, setSummary] = useState<ExecutiveSummary | null>(null);

  useEffect(() => {
    getExecutiveSummary().then(setSummary).catch(console.error);
  }, []);

  const handleDownloadCSV = () => {
    if (!summary) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Locations,${summary.location_count}\n`
      + `Total Connections,${summary.connection_count}\n`
      + `Connected Components,${summary.connected_components}\n`
      + `Baseline Cost (Lakhs),${summary.total_infrastructure_cost_lakhs}\n`
      + `MST Optimized Cost (Lakhs),${summary.mst_optimized_cost_lakhs}\n`
      + `MST Capital Savings (Lakhs),${summary.mst_savings_lakhs}\n`
      + `Resilience Score,${summary.resilience_score}\n`
      + `Single Points of Failure,${summary.single_points_of_failure_count}\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "CITYGRID_Executive_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!summary) {
    return <div className="p-8 text-center text-slate-400">Loading Report Data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Download Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" /> Executive Report Generator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generates formal urban infrastructure intelligence report compiled from real-time DAA graph algorithms.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={getPDFReportUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF Report</span>
          </a>
          <button
            onClick={handleDownloadCSV}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition"
          >
            <Printer className="h-4 w-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6 print:bg-white print:text-black">
        {/* Header */}
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-black text-white print:text-black">CITYGRID AI — Smart City Executive Report</h1>
          <p className="text-xs text-slate-400 print:text-slate-600 mt-1">Comprehensive Utility Network Optimization & Resilience Audit</p>
        </div>

        {/* Section 1 */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-blue-400 print:text-blue-700 uppercase tracking-wider">1. Executive Overview</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-950 print:bg-slate-100 p-3 rounded-xl">
              <span className="text-slate-400 print:text-slate-600 block">Total Locations</span>
              <span className="font-extrabold text-white print:text-black text-lg">{summary.location_count}</span>
            </div>
            <div className="bg-slate-950 print:bg-slate-100 p-3 rounded-xl">
              <span className="text-slate-400 print:text-slate-600 block">Network Edges</span>
              <span className="font-extrabold text-white print:text-black text-lg">{summary.connection_count}</span>
            </div>
            <div className="bg-slate-950 print:bg-slate-100 p-3 rounded-xl">
              <span className="text-slate-400 print:text-slate-600 block">Baseline Cost</span>
              <span className="font-extrabold text-amber-400 print:text-amber-700 text-lg">₹{(summary.total_infrastructure_cost_lakhs / 100).toFixed(2)} Cr</span>
            </div>
            <div className="bg-slate-950 print:bg-slate-100 p-3 rounded-xl">
              <span className="text-slate-400 print:text-slate-600 block">MST Cost</span>
              <span className="font-extrabold text-emerald-400 print:text-emerald-700 text-lg">₹{(summary.mst_optimized_cost_lakhs / 100).toFixed(2)} Cr</span>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-blue-400 print:text-blue-700 uppercase tracking-wider">2. DAA Optimization Audit</h3>
          <p className="text-xs text-slate-300 print:text-slate-800 leading-relaxed">
            Kruskal MST algorithm reduced total graph expenditure by <b>₹{(summary.mst_savings_lakhs / 100).toFixed(2)} Crores ({summary.mst_savings_percentage}%)</b>. The connectivity decomposition audit identified <b>{summary.connected_components} connected components</b>.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-rose-400 print:text-rose-700 uppercase tracking-wider">3. Vulnerability & Risk Summary</h3>
          <p className="text-xs text-slate-300 print:text-slate-800 leading-relaxed">
            Tarjan's bridge algorithm detected <b>{summary.single_points_of_failure_count} single points of failure</b> whose disruption splits the network. Overall grid resilience index is rated at <b>{summary.resilience_score}/100</b>.
          </p>
        </div>

        {/* Action Plan */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-emerald-400 print:text-emerald-700 uppercase tracking-wider">4. Recommended Action Roadmap</h3>
          <ul className="text-xs text-slate-300 print:text-slate-800 space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span><b>Immediate (0-3 mo):</b> Construct bypass backup feeder links for {summary.single_points_of_failure_count} single point of failure bridges.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span><b>Short-Term (3-12 mo):</b> Expand pipeline/transformer capacity on {summary.overloaded_connections_count} warning/critical utility lines.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span><b>Long-Term (1-3 yrs):</b> Implement Kruskal minimum-cost layout for all new satellite expansion projects.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
