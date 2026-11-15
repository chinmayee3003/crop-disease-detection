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
  Info,
  HeartPulse,
} from 'lucide-react';
import { getDetectionHistory, analyzeSample } from '../api/api';

export default function AnalysisResultsPage({ currentAnalysis, setCurrentAnalysis }) {
  const navigate = useNavigate();
  const [report, setReport] = useState(currentAnalysis);
  const [activeImageView, setActiveImageView] = useState('affected_regions');
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
            // Run default sample if database is empty
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
        <p className="text-sm font-semibold text-slate-700">Loading analysis report...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 max-w-lg mx-auto">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Analysis Report Available</h3>
        <p className="text-xs text-slate-500 mt-1 mb-5 leading-relaxed">
          Please upload a crop image in the scanner to generate an image-processing disease report.
        </p>
        <Link
          to="/detect"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
        >
          <ScanLine className="w-4 h-4" />
          <span>Go to Scanner</span>
        </Link>
      </div>
    );
  }

  const classification = report.classification || {};
  const isHealthy = classification.status === 'Healthy';
  const affectedPct = classification.affected_area_percentage || 0;
  const severityLevel = classification.severity_level || (isHealthy ? 'Healthy' : 'Mild');

  // Human-friendly description of the affected area and severity
  const getAffectedAreaDescription = () => {
    if (isHealthy || affectedPct < 1.0) {
      return 'The plant appears healthy with uniform green color. No visible disease-affected spots were detected.';
    }
    return `About ${affectedPct}% of the plant area appears to be affected by visible spots or discoloration. The condition appears to be at a ${severityLevel.toLowerCase()} stage.`;
  };

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
    <div className="space-y-10 py-6 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-mono text-emerald-700 font-semibold">
              Analysis ID: {report.id?.substring(0, 10)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {new Date(report.createdAt || Date.now()).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Crop Health & Disease Analysis Report
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

      {/* Main Diagnostic Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100 overflow-hidden p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Image Viewer with View Switcher */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
              <div className="aspect-square w-full flex items-center justify-center p-2">
                <img
                  src={getActiveImageSrc()}
                  alt="Crop Specimen"
                  className="max-h-full max-w-full object-contain rounded-xl"
                />
              </div>
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10 capitalize">
                {activeImageView === 'affected_regions'
                  ? 'Affected Areas Highlighted'
                  : activeImageView === 'segmented'
                  ? 'Isolated Plant'
                  : activeImageView === 'heatmap'
                  ? 'Infection Heatmap'
                  : 'Original Photo'}
              </div>
            </div>

            {/* View Mode Buttons */}
            <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl text-center">
              {[
                { id: 'original', label: 'Original' },
                { id: 'segmented', label: 'Plant' },
                { id: 'affected_regions', label: 'Spots' },
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

          {/* Right Column: Farmer-Friendly Diagnostic Details */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {classification.crop || report.crop_name}
                </span>

                {isHealthy ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Healthy Plant
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Possible Disease Detected ({severityLevel})
                  </span>
                )}

                <span className="text-xs text-slate-500 font-medium">
                  {report.part_type === 'root' ? 'Root Sample' : 'Leaf Sample'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {isHealthy
                  ? `${classification.crop || report.crop_name} - Appears Healthy`
                  : `Possible ${classification.disease_name || report.disease_detected}`}
              </h2>

              {!isHealthy && classification.pathogen && (
                <p className="text-xs text-slate-500 mt-1">
                  Associated Pathogen: <span className="font-medium text-slate-700">{classification.pathogen}</span>
                </p>
              )}
            </div>

            {/* Affected Area & Severity Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">
                  Estimated Affected Area
                </span>
                <span className="font-bold font-mono text-emerald-900 text-sm">
                  {affectedPct}% of leaf area
                </span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isHealthy
                      ? 'bg-emerald-500'
                      : affectedPct < 15
                      ? 'bg-amber-500'
                      : affectedPct < 35
                      ? 'bg-orange-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(Math.max(affectedPct, isHealthy ? 0 : 5), 100)}%` }}
                />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {getAffectedAreaDescription()}
              </p>
            </div>

            {/* Quick summary notes */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-[11px] text-slate-500 block mb-0.5">Condition Status</span>
                <span className="font-bold text-slate-900 text-sm">
                  {isHealthy ? 'Healthy Plant' : 'Possible Infection'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-[11px] text-slate-500 block mb-0.5">Severity Level</span>
                <span className="font-bold text-slate-900 text-sm">
                  {severityLevel}
                </span>
              </div>
            </div>

            {/* Link to DIP stages */}
            <div className="pt-1">
              <Link
                to="/processing"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>View step-by-step image processing stages for this scan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Visible Symptoms & Likely Causes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visible Symptoms */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Bug className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Visible Symptoms</h3>
              <p className="text-[11px] text-slate-500">What is visible on the plant leaf or root</p>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700">
            {classification.symptoms && classification.symptoms.length > 0 ? (
              classification.symptoms.map((symptom, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{symptom}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500 italic">
                No disease spots observed. The foliage has natural, healthy green color.
              </li>
            )}
          </ul>
        </div>

        {/* Likely Causes */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Possible Causes</h3>
              <p className="text-[11px] text-slate-500">Weather and environmental conditions</p>
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
              <li className="text-slate-500 italic">
                Good growing conditions with balanced sunlight, soil moisture, and nutrition.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Practical Agronomic Action Plan */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            What Should You Do?
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Practical Management and Treatment Suggestions
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Steps you can take to prevent the disease from spreading and help the plant recover.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Prevention */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                1
              </span>
              <h3 className="text-sm font-bold text-emerald-950">Prevention & Farm Care</h3>
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
                <li>Maintain regular crop inspection and balanced watering.</li>
              )}
            </ul>
          </div>

          {/* Organic Solutions */}
          <div className="p-5 rounded-2xl bg-green-50/60 border border-green-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-green-700 text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              <h3 className="text-sm font-bold text-green-950">Organic Treatment Options</h3>
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
                <li>No organic treatment needed for healthy foliage.</li>
              )}
            </ul>
          </div>

          {/* Chemical Solutions */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-bold">
                3
              </span>
              <h3 className="text-sm font-bold text-amber-950">Chemical Treatment Options</h3>
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
                <li>No chemical treatment required.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Important Advisory Note */}
      <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-start gap-3 text-xs leading-relaxed">
        <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 block font-bold mb-0.5">Important Advisory Note</strong>
          <p>
            This image analysis is a preliminary screening produced through digital image processing. It indicates possible signs of disease based on visible surface spots and discoloration. If symptoms persist or spread across your field, please consult a local agricultural extension officer, agronomist, or plant pathology clinic for on-field physical confirmation before applying extensive treatments.
          </p>
        </div>
      </div>
    </div>
  );
}
