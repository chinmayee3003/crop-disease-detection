import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Leaf,
  Bug,
  Droplets,
  Layers,
  Printer,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ScanLine,
  Activity,
  Flame,
  Info,
} from 'lucide-react';
import DiseaseSeverityBadge from '../components/DiseaseSeverityBadge';
import { getDetectionHistory, analyzeSample } from '../api/api';

export default function AnalysisResultsPage({ currentAnalysis, setCurrentAnalysis }) {
  const navigate = useNavigate();
  const [report, setReport] = useState(currentAnalysis);
  const [activeImageView, setActiveImageView] = useState('affected_regions'); // 'original', 'segmented', 'affected_regions', 'heatmap'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!report) {
      const saved = localStorage.getItem('currentAnalysis');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setReport(parsed);
          return;
        } catch (_) {}
      }

      setLoading(true);
      getDetectionHistory()
        .then((res) => {
          if (res.success && res.data && res.data.length > 0) {
            setReport(res.data[0]);
            if (setCurrentAnalysis) setCurrentAnalysis(res.data[0]);
          } else {
            // Auto-load benchmark sample
            analyzeSample('sample_tomato_early_blight.jpg', 'tomato', 'leaf')
              .then((sRes) => {
                if (sRes.success && sRes.data) {
                  setReport(sRes.data);
                  if (setCurrentAnalysis) setCurrentAnalysis(sRes.data);
                }
              })
              .catch((e) => console.log('Sample run error:', e));
          }
        })
        .catch((e) => console.log('History load error:', e))
        .finally(() => setLoading(false));
    }
  }, [currentAnalysis]);

  if (loading) {
    return (
      <div className="p-16 text-center bg-white rounded-3xl border border-slate-200">
        <Sparkles className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-700">Loading pathological diagnostic report...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 max-w-lg mx-auto">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Analysis Report Available</h3>
        <p className="text-xs text-slate-500 mt-1 mb-5 leading-relaxed">
          Upload or select a crop image to run the digital image processing pipeline and produce a disease report.
        </p>
        <Link
          to="/detect"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
        >
          <ScanLine className="w-4 h-4" />
          <span>Launch Scanner</span>
        </Link>
      </div>
    );
  }

  const classification = report.classification || {};
  const isHealthy = classification.status === 'Healthy';
  const affectedPct = classification.affected_area_percentage || 0;
  const features = report.features || {};

  // Image source based on active tab
  const getActiveImageSrc = () => {
    const artifacts = report.visual_artifacts || {};
    switch (activeImageView) {
      case 'original':
        return artifacts.acquired || report.original_image;
      case 'segmented':
        return artifacts.segmented_plant || artifacts.acquired;
      case 'affected_regions':
        return artifacts.affected_regions || artifacts.acquired;
      case 'heatmap':
        return artifacts.severity_heatmap || artifacts.acquired;
      default:
        return artifacts.affected_regions || artifacts.acquired;
    }
  };

  return (
    <div className="space-y-10 py-6 max-w-6xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-mono text-emerald-700 font-semibold">
              Scan ID: {report.id?.substring(0, 13)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {new Date(report.createdAt || Date.now()).toLocaleString()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Agricultural Pathology & Disease Analysis Report
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <Link
            to="/detect"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Scan Another</span>
          </Link>
        </div>
      </div>

      {/* Main Diagnostic Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100 overflow-hidden p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Interactive Image Viewer */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
              <div className="aspect-square w-full flex items-center justify-center p-2">
                <img
                  src={getActiveImageSrc()}
                  alt="Pathology Specimen"
                  className="max-h-full max-w-full object-contain rounded-xl"
                />
              </div>
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10 uppercase tracking-wider">
                {activeImageView.replace('_', ' ')}
              </div>
            </div>

            {/* View Mode Buttons */}
            <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl text-center">
              {[
                { id: 'original', label: 'Original' },
                { id: 'segmented', label: 'Plant' },
                { id: 'affected_regions', label: 'Lesions' },
                { id: 'heatmap', label: 'Heatmap' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveImageView(tab.id)}
                  className={`py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    activeImageView === tab.id
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Pathological Diagnosis */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {classification.crop || report.crop_name} Specimen
                </span>
                <DiseaseSeverityBadge
                  status={classification.status}
                  severity={classification.severity_level}
                  percentage={affectedPct}
                />
                <span className="text-xs text-slate-500 font-medium">
                  {report.part_type === 'root' ? 'Root System' : 'Foliage lamina'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {classification.disease_name || report.disease_detected}
              </h2>

              <p className="text-xs sm:text-sm font-mono text-slate-500 mt-1">
                Etiological Agent: <span className="font-semibold text-slate-700">{classification.pathogen || 'None (Physiologically Normal)'}</span>
              </p>
            </div>

            {/* Severity & Affected Area Gauge */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider">
                  Affected Tissue Percentage (Segmentation Analysis)
                </span>
                <span className="font-mono font-bold text-emerald-900 text-sm">
                  {affectedPct}% of leaf area
                </span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isHealthy
                      ? 'bg-emerald-500'
                      : affectedPct < 15
                      ? 'bg-amber-500'
                      : affectedPct < 35
                      ? 'bg-orange-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(Math.max(affectedPct, isHealthy ? 5 : 8), 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>0% Healthy</span>
                <span>10% Mild</span>
                <span>25% Moderate</span>
                <span>50%+ Critical Necrosis</span>
              </div>
            </div>

            {/* Confidence & Classification Methodology */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[11px] text-slate-500 block mb-0.5">Statistical Model Confidence</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-slate-900">
                    {classification.confidence || 0}%
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    Distance-calibrated Softmax
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[11px] text-slate-500 block mb-0.5">Classification Engine</span>
                <span className="font-bold text-slate-800 block text-xs">
                  {classification.classification_method || 'DIP Metric Vector & Pathological Matching'}
                </span>
                <span className="text-[11px] text-slate-500">OpenCV Spatial & GLCM Features</span>
              </div>
            </div>

            {/* Quick Link to DIP stages */}
            <div className="pt-2">
              <Link
                to="/processing"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>View all 8 DIP intermediate stages for this scan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Symptoms & Disease Causes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Symptoms */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Bug className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Pathological Symptoms</h3>
              <p className="text-[11px] text-slate-500">Observable diagnostic morphological markers</p>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700">
            {classification.symptoms && classification.symptoms.length > 0 ? (
              classification.symptoms.map((symptom, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{symptom}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500 italic">No disease symptoms observed. Specimen shows normal healthy tissue.</li>
            )}
          </ul>
        </div>

        {/* Causes & Etiology */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Environmental Causes & Vectors</h3>
              <p className="text-[11px] text-slate-500">Climatic factors contributing to disease outbreak</p>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700">
            {classification.causes && classification.causes.length > 0 ? (
              classification.causes.map((cause, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{cause}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500 italic">Optimal growing environment with balanced soil nutrients and moisture.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Comprehensive Treatment Recommendations */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Agronomic Action Plan
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Pathology Treatment & Control Recommendations
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Standard operating procedures for managing and preventing infection spread.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Preventive Cultural Measures */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                1
              </span>
              <h3 className="text-sm font-bold text-emerald-950">Preventive Agronomy</h3>
            </div>
            <ul className="space-y-2 text-xs text-emerald-900">
              {classification.preventive_measures && classification.preventive_measures.length > 0 ? (
                classification.preventive_measures.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))
              ) : (
                <li>Continue standard preventive crop scouting and hygiene.</li>
              )}
            </ul>
          </div>

          {/* Organic / Biological Controls */}
          <div className="p-5 rounded-2xl bg-green-50/60 border border-green-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-green-700 text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              <h3 className="text-sm font-bold text-green-950">Organic Biocontrols</h3>
            </div>
            <ul className="space-y-2 text-xs text-green-900">
              {classification.organic_treatments && classification.organic_treatments.length > 0 ? (
                classification.organic_treatments.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))
              ) : (
                <li>No organic intervention needed for healthy foliage.</li>
              )}
            </ul>
          </div>

          {/* Chemical Control Recommendations */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-bold">
                3
              </span>
              <h3 className="text-sm font-bold text-amber-950">Chemical Fungicide Control</h3>
            </div>
            <ul className="space-y-2 text-xs text-amber-900">
              {classification.chemical_controls && classification.chemical_controls.length > 0 ? (
                classification.chemical_controls.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))
              ) : (
                <li>No chemical intervention required.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Top Alternative Candidate Predictions */}
      {classification.top_predictions && classification.top_predictions.length > 1 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Candidate Diagnostic Hypotheses</h3>
            <p className="text-xs text-slate-500">
              Ranked mathematical candidates evaluated by Euclidean distance in normalized feature space.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Disease Candidate</th>
                  <th className="py-2.5 px-3">Crop</th>
                  <th className="py-2.5 px-3">Pathology Status</th>
                  <th className="py-2.5 px-3">Metric Distance</th>
                  <th className="py-2.5 px-3">Relative Probability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classification.top_predictions.map((pred, idx) => (
                  <tr key={pred.id} className={idx === 0 ? 'bg-emerald-50/40 font-semibold' : ''}>
                    <td className="py-2.5 px-3 text-slate-900 flex items-center gap-2">
                      {idx === 0 && (
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center">
                          1
                        </span>
                      )}
                      <span>{pred.disease_name}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{pred.crop}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          pred.status === 'Healthy'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {pred.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{pred.distance_metric}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-900">
                      {pred.confidence_score}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Extracted Biometric Features Summary Table */}
      {features.color_moments && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Extracted Biometric Descriptors</h3>
            <p className="text-xs text-slate-500">
              Quantitative physical metrics derived from digital image processing stages.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Mean HSV Vector</span>
              <span className="font-mono font-bold text-slate-900">
                [{features.color_moments.mean_hsv?.join(', ')}]
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">GLCM Homogeneity</span>
              <span className="font-mono font-bold text-slate-900">
                {features.texture_features?.homogeneity}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">GLCM Contrast</span>
              <span className="font-mono font-bold text-slate-900">
                {features.texture_features?.contrast}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Leaf Circularity</span>
              <span className="font-mono font-bold text-slate-900">
                {features.morphology?.leaf_circularity}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
