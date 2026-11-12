import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Sparkles,
  ScanLine,
  Sliders,
  Maximize2,
  FileText,
  Activity,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import DIPVisualizer from '../components/DIPVisualizer';
import { getDetectionHistory, analyzeSample } from '../api/api';

export default function ImageProcessingPage({ currentAnalysis, setCurrentAnalysis }) {
  const [analysisData, setAnalysisData] = useState(currentAnalysis);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!analysisData) {
      // Try local storage
      const saved = localStorage.getItem('currentAnalysis');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnalysisData(parsed);
          return;
        } catch (_) {}
      }

      // Try fetching latest from history or run default sample
      setLoading(true);
      getDetectionHistory()
        .then((res) => {
          if (res.success && res.data && res.data.length > 0) {
            setAnalysisData(res.data[0]);
            if (setCurrentAnalysis) setCurrentAnalysis(res.data[0]);
          } else {
            // Auto run first sample
            analyzeSample('sample_tomato_early_blight.jpg', 'tomato', 'leaf')
              .then((sampleRes) => {
                if (sampleRes.success && sampleRes.data) {
                  setAnalysisData(sampleRes.data);
                  if (setCurrentAnalysis) setCurrentAnalysis(sampleRes.data);
                }
              })
              .catch((e) => console.log('Sample run error:', e));
          }
        })
        .catch((err) => console.log('History load error:', err))
        .finally(() => setLoading(false));
    }
  }, [currentAnalysis]);

  return (
    <div className="space-y-12 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Digital Image Processing (DIP) Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Image Processing Stages & Visual Comparison
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Examine step-by-step transformations computed by the OpenCV pipeline: spatial filtering, CLAHE contrast enhancement, HSV color isolation, ExG thresholding, and lesion contour extraction.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/detect"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Process New Crop</span>
          </Link>
          <Link
            to="/results"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 text-xs font-semibold shadow-xs transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Pathology Report</span>
          </Link>
        </div>
      </div>

      {/* Main DIP Visualizer Component */}
      {loading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200">
          <Sparkles className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">Loading DIP intermediate artifacts...</p>
        </div>
      ) : analysisData ? (
        <DIPVisualizer
          stages={analysisData.stages}
          visualArtifacts={analysisData.visual_artifacts}
          features={analysisData.features}
        />
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Image Processed Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto mb-4">
            Upload a leaf or root image in the Disease Detection scanner to generate step-by-step image processing stages.
          </p>
          <Link
            to="/detect"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
          >
            <ScanLine className="w-4 h-4" />
            <span>Go to Scanner</span>
          </Link>
        </div>
      )}

      {/* Deep-Dive Technical Explanation Cards */}
      <section className="bg-slate-50 rounded-3xl border border-slate-200/80 p-6 md:p-10 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            DIP Algorithmic Specifications
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Mathematical Formulation of the 8 Stages
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Principles of computer vision and spatial filtering applied to agricultural diagnostics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 text-[11px] font-bold">1</span>
              <span>Gaussian vs. Median Noise Filtering</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standard 2D Gaussian convolution computes weighted local neighbor averages:
              <span className="block my-1 font-mono text-[11px] bg-slate-50 p-2 rounded border border-slate-100 text-slate-800">
                G(x, y) = (1 / 2πσ²) * exp(-(x² + y²) / 2σ²)
              </span>
              While effective for high-frequency white noise, it blurs critical leaf veins. The non-linear 5x5 Median filter replaces pixel values with neighborhood medians, completely removing salt-and-pepper artifacts while preserving crisp lesion boundaries.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 text-[11px] font-bold">2</span>
              <span>CLAHE in CIE-LAB Color Space</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Traditional RGB histogram equalization distorts natural color fidelity. AgriVision transforms the RGB array into CIE-LAB, isolating the L* (Lightness) channel:
              <span className="block my-1 font-mono text-[11px] bg-slate-50 p-2 rounded border border-slate-100 text-slate-800">
                ClipLimit = 2.5, TileGridSize = (8 x 8)
              </span>
              Adaptive equalization redistributes contrast within localized 8x8 contextual tiles, accentuating tiny necrotic lesions without overamplifying background noise.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 text-[11px] font-bold">3</span>
              <span>Excess Green (ExG) Plant Segmentation</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              To robustly isolate green foliage from background surfaces regardless of ambient illumination:
              <span className="block my-1 font-mono text-[11px] bg-slate-50 p-2 rounded border border-slate-100 text-slate-800">
                ExG = 2 * Green - Red - Blue
              </span>
              Pixels with ExG &gt; 5.0 and HSV Hue in [20°, 95°] are segmented. Morphological opening with an elliptical kernel removes stray background specks, and morphological closing seals internal vein gaps.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 text-[11px] font-bold">4</span>
              <span>Haralick GLCM Texture Descriptors</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              The Gray-Level Co-occurrence Matrix (GLCM) quantizes second-order spatial gray level joint distributions P(i, j):
              <span className="block my-1 font-mono text-[11px] bg-slate-50 p-2 rounded border border-slate-100 text-slate-800">
                Contrast = Σ |i - j|² P(i, j), Homogeneity = Σ P(i, j) / (1 + |i - j|²)
              </span>
              Fungal blights cause jagged, irregular roughness (high Contrast, low Homogeneity), while healthy leaves feature smooth, uniform co-occurrence (Homogeneity &gt; 0.85).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
