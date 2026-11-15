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
      '1/8 Reading and checking the uploaded image...',
      '2/8 Resizing image to standard 512x512 dimensions...',
      '3/8 Removing noise with Gaussian and Median filters...',
      '4/8 Improving contrast using CLAHE enhancement...',
      '5/8 Converting to HSV colour format to isolate plant colours...',
      '6/8 Separating plant from background via Excess Green index...',
      '7/8 Locating visible spots and calculating affected areas...',
      '8/8 Comparing features with disease profiles...',
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
          <span>Foliage & Root Scanner</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Crop Disease Detection Scanner
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Upload a photo of a crop leaf or root (JPG or PNG). The image-processing engine will analyze the image, detect affected areas, and provide visible symptoms and treatment suggestions.
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
                  Analysis Completed
                </span>
                <DiseaseSeverityBadge
                  status={latestResult.classification?.status}
                  severity={latestResult.classification?.severity_level}
                  percentage={latestResult.classification?.affected_area_percentage}
                />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {latestResult.classification?.status === 'Healthy'
                  ? `${latestResult.classification?.crop || latestResult.crop_name} - Appears Healthy`
                  : `Possible ${latestResult.classification?.disease_name || latestResult.disease_detected}`}
              </h2>
              {latestResult.classification?.pathogen && latestResult.classification?.status !== 'Healthy' && (
                <p className="text-xs text-slate-500 mt-0.5">
                  Pathogen: {latestResult.classification?.pathogen}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/results')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide shadow-md shadow-emerald-600/20 transition-all hover:scale-105 active:scale-100"
              >
                <FileText className="w-4 h-4" />
                <span>View Full Analysis & Treatment Suggestions</span>
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
              <span className="text-slate-500 block text-[11px]">Condition Status</span>
              <span className="text-base font-bold text-slate-900">
                {latestResult.classification?.status === 'Healthy' ? 'Healthy Plant' : 'Possible Disease'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500 block text-[11px]">Visible Spots Count</span>
              <span className="text-lg font-bold text-slate-900 font-mono">
                {latestResult.features?.morphology?.lesion_count || 0} spots
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500 block text-[11px]">Severity Level</span>
              <span className="text-base font-bold text-slate-900">
                {latestResult.classification?.severity_level || 'Mild'}
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
