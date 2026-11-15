import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Sparkles,
  ScanLine,
  FileText,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Eye,
  Sliders,
  Scissors,
  BarChart3,
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
            Examine step-by-step transformations computed by the OpenCV pipeline: noise filtering, contrast enhancement, color segmentation, and lesion extraction.
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
            <span>View Analysis Results</span>
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

      {/* DIP Algorithm Specifications Section */}
      <section className="bg-slate-50 rounded-3xl border border-slate-200/80 p-6 md:p-10 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            DIP Algorithm Specifications
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Understanding the 8-Stage Image-Processing Workflow
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            A clear explanation of each step in the OpenCV pipeline, from initial upload to final disease classification.
          </p>
        </div>

        {/* 8-Stage Workflow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stage 1 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Stage 01
              </span>
              <span className="text-[11px] text-slate-400 font-medium">OpenCV cv2.imread</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">1. Image Acquisition</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The system accepts a crop image uploaded by the user. It verifies the image format (JPG or PNG) and checks that all color channels and pixel arrays are correctly loaded.
            </p>
            <div className="pt-1.5 text-[11px] text-slate-500 flex items-center gap-1">
              <span className="font-semibold text-emerald-800">Technique:</span>
              <span>Input verification, 24-bit RGB validation, and metadata extraction.</span>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Stage 02
              </span>
              <span className="text-[11px] text-slate-400 font-medium">cv2.INTER_AREA</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">2. Image Resizing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The image is resized to a standard size (512×512 pixels) for consistent processing. This ensures that calculations like spot size and leaf area remain comparable regardless of the camera used.
            </p>
            <div className="pt-1.5 text-[11px] text-slate-500 flex items-center gap-1">
              <span className="font-semibold text-emerald-800">Technique:</span>
              <span>Bicubic and area interpolation for scale-consistent matrix normalization.</span>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Stage 03
              </span>
              <span className="text-[11px] text-slate-400 font-medium">cv2.GaussianBlur & Median</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">3. Noise Removal</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gaussian and Median filters help reduce unwanted noise. A 5×5 Median filter cleans up random camera speckles while keeping leaf borders and spot edges sharp, supported by bilateral smoothing.
            </p>
            <div className="pt-1.5 text-[11px] text-slate-500 flex items-center gap-1">
              <span className="font-semibold text-emerald-800">Technique:</span>
              <span>Gaussian filter (sigma=1.2) and Median filter (5×5 window) comparison.</span>
            </div>
          </div>

          {/* Stage 4 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Stage 04
              </span>
              <span className="text-[11px] text-slate-400 font-medium">cv2.createCLAHE</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">4. Image Enhancement</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              CLAHE (Contrast Limited Adaptive Histogram Equalization) improves image contrast so that visible details are easier to identify. It enhances the lightness channel so faint spots and early symptoms stand out clearly.
            </p>
            <div className="pt-1.5 text-[11px] text-slate-500 flex items-center gap-1">
              <span className="font-semibold text-emerald-800">Technique:</span>
              <span>Adaptive histogram equalization in CIE-LAB space with unsharp masking.</span>
            </div>
          </div>

          {/* Stage 5 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Stage 05
              </span>
              <span className="text-[11px] text-slate-400 font-medium">COLOR_BGR2HSV</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">5. RGB to HSV Conversion</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The image is converted into HSV colour format to help identify different colours in the plant. This separates lighting brightness from actual color hue, making yellowing and brown spots easy to detect.
            </p>
            <div className="pt-1.5 text-[11px] text-slate-500 flex items-center gap-1">
              <span className="font-semibold text-emerald-800">Technique:</span>
              <span>Hue-Saturation-Value cylindrical conversion to isolate chlorophyll from lesions.</span>
            </div>
          </div>

          {/* Stage 6 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Stage 06
              </span>
              <span className="text-[11px] text-slate-400 font-medium">ExG & Morphology</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">6. Image Segmentation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thresholding and morphological operations help separate the plant from its background and identify affected areas. The Excess Green index identifies active plant tissue while background paper or soil is filtered out.
            </p>
            <div className="pt-1.5 text-[11px] text-slate-500 flex items-center gap-1">
              <span className="font-semibold text-emerald-800">Technique:</span>
              <span>Excess Green Index (ExG = 2G - R - B) combined with morphological opening and closing.</span>
            </div>
          </div>

          {/* Stage 7 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Stage 07
              </span>
              <span className="text-[11px] text-slate-400 font-medium">cv2.findContours</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">7. Disease Region Extraction</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The system identifies visible spots and damaged regions in the plant. It outlines affected spots with bounding boxes, marks boundaries in red, and generates a color-coded heatmap showing infection intensity.
            </p>
            <div className="pt-1.5 text-[11px] text-slate-500 flex items-center gap-1">
              <span className="font-semibold text-emerald-800">Technique:</span>
              <span>Chromatic delta masking, contour extraction, and continuous density heatmap generation.</span>
            </div>
          </div>

          {/* Stage 8 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Stage 08
              </span>
              <span className="text-[11px] text-slate-400 font-medium">GLCM & Feature Vector</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">8. Feature Extraction and Classification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Colour, texture and shape information are extracted and compared with the existing disease profiles to produce a possible classification. The system computes the affected area percentage and provides practical advice.
            </p>
            <div className="pt-1.5 text-[11px] text-slate-500 flex items-center gap-1">
              <span className="font-semibold text-emerald-800">Technique:</span>
              <span>GLCM Haralick texture metrics (contrast, homogeneity), color moments, and distance matching.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
