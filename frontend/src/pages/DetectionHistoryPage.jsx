import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  Trash2,
  FileText,
  ExternalLink,
  Layers,
  Calendar,
  ScanLine,
  Leaf,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import DiseaseSeverityBadge from '../components/DiseaseSeverityBadge';
import { getDetectionHistory, deleteDetection } from '../api/api';

export default function DetectionHistoryPage({ setCurrentAnalysis }) {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cropFilter, setCropFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadHistory = () => {
    setLoading(true);
    getDetectionHistory({ crop: cropFilter, status: statusFilter })
      .then((res) => {
        if (res.success && res.data) {
          setHistory(res.data);
        }
      })
      .catch((err) => console.log('History load error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHistory();
  }, [cropFilter, statusFilter]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this detection record?')) {
      try {
        await deleteDetection(id);
        setHistory(history.filter((item) => item.id !== id));
      } catch (err) {
        alert('Failed to delete detection record.');
      }
    }
  };

  const handleViewReport = (record) => {
    if (setCurrentAnalysis) {
      setCurrentAnalysis(record);
    }
    localStorage.setItem('currentAnalysis', JSON.stringify(record));
    navigate('/results');
  };

  // Filter history by search query
  const filteredHistory = history.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.crop_name?.toLowerCase().includes(q) ||
      item.disease_detected?.toLowerCase().includes(q) ||
      item.id?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
            <History className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audit Trail & Scan Log</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Crop Disease Detection History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Persistent log of all agricultural specimens analyzed. Access previous digital image processing artifacts, feature vectors, and treatment reports.
          </p>
        </div>

        <Link
          to="/detect"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
        >
          <ScanLine className="w-3.5 h-3.5" />
          <span>New Analysis</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by crop, disease, or scan ID..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              <option value="all">All Crops</option>
              <option value="tomato">Tomato</option>
              <option value="potato">Potato</option>
              <option value="corn">Corn</option>
              <option value="apple">Apple</option>
              <option value="grape">Grape</option>
              <option value="rice">Rice</option>
              <option value="pepper">Bell Pepper</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="infected">Infected Only</option>
              <option value="healthy">Healthy Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table / Cards */}
      {loading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200">
          <History className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">Loading detection history...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <History className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">No Detection Records Found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            No crop analyses match your current filter or have been performed yet.
          </p>
          <Link
            to="/detect"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Run First Analysis</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const classification = item.classification || {};
            const isHealthy = item.healthy_status === 'Healthy';
            const dateStr = item.createdAt
              ? new Date(item.createdAt).toLocaleString()
              : 'Recently';

            return (
              <div
                key={item.id}
                onClick={() => handleViewReport(item)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-950 overflow-hidden shrink-0 border border-slate-200 relative">
                    <img
                      src={item.visual_artifacts?.affected_regions || item.original_image}
                      alt={item.crop_name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {item.crop_name}
                      </span>
                      <DiseaseSeverityBadge
                        status={item.healthy_status}
                        severity={classification.severity_level}
                        percentage={classification.affected_area_percentage}
                      />
                      <span className="text-[11px] text-slate-400 font-mono">
                        ID: {item.id?.substring(0, 8)}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {item.disease_detected}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {dateStr}
                      </span>
                      <span>•</span>
                      <span>
                        Affected: <strong className="font-mono text-slate-800">{classification.affected_area_percentage || 0}%</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Confidence: <strong className="font-mono text-slate-800">{classification.confidence || 0}%</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewReport(item);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-semibold transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Report</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
