import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  FileText,
  Activity,
  Flame,
  Binary,
} from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import DiseaseSeverityBadge from '../components/DiseaseSeverityBadge';
import { analyzeImage, analyzeSample } from '../api/api';

export default function DetectionPage({ setCurrentAnalysis }) {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [latestResult, setLatestResult] = useState(null);
  const [error, setError] = useState(null);

  const simulateProgressSteps = () => {
    const steps = [
      '1/8 Optical Image Ingestion & Header Verification...',
      '2/8 Normalizing Spatial Dimensions to 512x512...',
      '3/8 Applying Gaussian & Median Noise Filtering...',
      '4/8 Enhancing CLAHE Contrast in LAB Color Space...',
      '5/8 Transforming to HSV Chromatic Cylinders...',
      '6/8 Segmenting Plant Tissue via Excess Green Index...',
      '7/8 Isolating Necrotic Spots & Drawing Bounding Contours...',
      '8/8 Computing GLCM Texture & Biometric Matching...',
    ];

    let current = 0;
    setProcessingStep(steps[0]);

    const interval = setInterval(() => {
      current++;
      if (current < steps.length) {
        setProcessingStep(steps[current]);
      } else {
        clearInterval(interval);
      }
    }, 450);

    return interval;
  };

  const handleAnalyze = async (file, cropHint, partType) => {
    setIsProcessing(true);
    setError(null);
    setLatestResult(null);

    const stepInterval = simulateProgressSteps();

    try {
      const res = await analyzeImage(file, cropHint, partType);
      clearInterval(stepInterval);
      if (res.success && res.data) {
        setLatestResult(res.data);
        if (setCurrentAnalysis) {
          setCurrentAnalysis(res.data);
        }
        localStorage.setItem('currentAnalysis', JSON.stringify(res.data));

        // Confetti celebration for successful scan
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } else {
        setError(res.error || 'Failed to analyze crop image.');
      }
    } catch (err) {
      clearInterval(stepInterval);
      console.error('Detection Error:', err);
      setError(
        err.response?.data?.error ||
          err.message ||
          'Failed to communicate with image processing backend.'
      );
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleAnalyzeSample = async (sampleFilename, cropHint, partType) => {
    setIsProcessing(true);
    setError(null);
    setLatestResult(null);

    const stepInterval = simulateProgressSteps();

    try {
      const res = await analyzeSample(sampleFilename, cropHint, partType);
      clearInterval(stepInterval);
      if (res.success && res.data) {
        setLatestResult(res.data);
        if (setCurrentAnalysis) {
          setCurrentAnalysis(res.data);
        }
        localStorage.setItem('currentAnalysis', JSON.stringify(res.data));

        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } else {
        setError(res.error || 'Failed to process sample image.');
      }
    } catch (err) {
      clearInterval(stepInterval);
      setError(
        err.response?.data?.error ||
          err.message ||
          'Error running DIP engine on sample.'
      );
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
          <ScanLine className="w-3.5 h-3.5 text-emerald-600" />
          <span>Foliage & Root Diagnostic Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Crop Disease Detection Scanner
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Upload leaf or root photographs in JPG or PNG format. The digital image processing engine extracts chromatic lesions, computes percentage affected area, and produces clinical pathological assessments.
        </p>
      </div>

      {/* Image Uploader Component */}
      <ImageUploader
        onAnalyze={handleAnalyze}
        onAnalyzeSample={handleAnalyzeSample}
        isProcessing={isProcessing}
        processingStep={processingStep}
      />

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Image Processing Exception</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Real-time Result Summary Card upon completion */}
      {latestResult && (
        <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl shadow-emerald-500/5 p-6 sm:p-8 animate-fade-in space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Detection Completed
                </span>
                <DiseaseSeverityBadge
                  status={latestResult.classification?.status}
                  severity={latestResult.classification?.severity_level}
                  percentage={latestResult.classification?.affected_area_percentage}
                />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {latestResult.classification?.disease_name || latestResult.disease_detected}
              </h2>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                Pathogen: {latestResult.classification?.pathogen || 'None (Healthy Specimen)'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/results')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide shadow-md shadow-emerald-600/20 transition-all hover:scale-105 active:scale-100"
              >
                <FileText className="w-4 h-4" />
                <span>View Full Pathology & Treatment Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick 3-Panel Vision Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-950 p-2 text-center overflow-hidden">
              <span className="text-[11px] font-bold text-slate-300 block mb-1">Original Specimen</span>
              <img
                src={latestResult.visual_artifacts?.acquired || latestResult.original_image}
                alt="Acquired"
                className="w-full h-40 object-contain rounded-xl bg-black"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-950 p-2 text-center overflow-hidden">
              <span className="text-[11px] font-bold text-slate-300 block mb-1">Segmented Plant Tissue</span>
              <img
                src={latestResult.visual_artifacts?.segmented_plant}
                alt="Segmented Plant"
                className="w-full h-40 object-contain rounded-xl bg-black"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-950 p-2 text-center overflow-hidden">
              <span className="text-[11px] font-bold text-slate-300 block mb-1">Affected Lesions Overlay</span>
              <img
                src={latestResult.visual_artifacts?.affected_regions}
                alt="Affected Regions"
                className="w-full h-40 object-contain rounded-xl bg-black"
              />
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500 block text-[11px]">Affected Surface Area</span>
              <span className="text-lg font-bold text-slate-900 font-mono">
                {latestResult.classification?.affected_area_percentage}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500 block text-[11px]">Model Confidence</span>
              <span className="text-lg font-bold text-slate-900 font-mono">
                {latestResult.classification?.confidence}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500 block text-[11px]">Lesion Spot Count</span>
              <span className="text-lg font-bold text-slate-900 font-mono">
                {latestResult.features?.morphology?.lesion_count || 0} spots
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500 block text-[11px]">Vegetation Index (ExG)</span>
              <span className="text-lg font-bold text-slate-900 font-mono">
                {latestResult.features?.color_moments?.exg_index}
              </span>
            </div>
          </div>

          {/* Direct Navigation to Image Processing Stages */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => navigate('/processing')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Inspect all 8 DIP intermediate stages</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/results')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <span>View Recommended Organic & Chemical Treatments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
