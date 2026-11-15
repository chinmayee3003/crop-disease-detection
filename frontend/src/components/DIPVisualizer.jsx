import React, { useState } from 'react';
import {
  Layers,
  Eye,
  Sliders,
  CheckCircle,
  Maximize2,
  Info,
  Sparkles,
  BarChart3,
  Binary,
  Flame,
} from 'lucide-react';

export default function DIPVisualizer({ stages, visualArtifacts, features }) {
  const [activeStage, setActiveStage] = useState(1);
  const [zoomModalImage, setZoomModalImage] = useState(null);

  if (!stages || stages.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
        <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-sm text-slate-500 font-medium">
          No image processing data available yet. Upload a crop image to view stages.
        </p>
      </div>
    );
  }

  const currentStageData = stages.find((s) => s.stage_number === activeStage) || stages[0];

  const stageDescriptions = {
    1: {
      technique: 'Image Acquisition & Format Verification',
      algorithmNote: 'OpenCV cv2.imread(), 24-bit RGB validation, and dimensions check',
      summary: 'Loads the uploaded image, verifies file format and channels, and reads resolution metadata.',
    },
    2: {
      technique: 'Standard Spatial Resizing',
      algorithmNote: 'cv2.resize() with standard bicubic area interpolation (512x512)',
      summary: 'Normalizes the image to a standard 512x512 matrix so processing is consistent regardless of camera resolution.',
    },
    3: {
      technique: 'Gaussian and Median Noise Removal',
      algorithmNote: 'cv2.GaussianBlur(sigma=1.2) and cv2.medianBlur(k=5) edge-preserving filtering',
      summary: 'Reduces unwanted sensor noise while keeping leaf boundaries and vein outlines crisp.',
    },
    4: {
      technique: 'Contrast Enhancement (CLAHE)',
      algorithmNote: 'CIE-LAB conversion, cv2.createCLAHE(clip=2.5), and edge sharpening',
      summary: 'Improves lightness contrast so subtle spots and discoloration are easier to distinguish.',
    },
    5: {
      technique: 'RGB to HSV Colour Conversion',
      algorithmNote: 'cv2.cvtColor(cv2.COLOR_BGR2HSV) to decouple brightness from color hue',
      summary: 'Converts colours into Hue, Saturation, and Value to separate plant green and disease brown from shadows.',
    },
    6: {
      technique: 'Plant Tissue Segmentation',
      algorithmNote: 'Excess Green (ExG) index thresholding and morphological cleanup',
      summary: 'Separates the plant leaf or root from the background paper or soil.',
    },
    7: {
      technique: 'Disease Region & Lesion Extraction',
      algorithmNote: 'Chromatic delta masking, cv2.findContours(), and intensity heatmap',
      summary: 'Locates visible spots and damaged regions, marks boundaries, and creates a density heatmap.',
    },
    8: {
      technique: 'Feature Extraction & Classification',
      algorithmNote: 'GLCM texture descriptors, color moments, and pathology profile matching',
      summary: 'Extracts quantitative colour, texture, and shape values to compare with existing disease profiles.',
    },
  };

  const currentDesc = stageDescriptions[activeStage] || stageDescriptions[1];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-emerald-900 via-forest-light to-emerald-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider border border-emerald-400/30">
              Pipeline Inspector
            </span>
            <span className="text-xs text-emerald-200">Stage {activeStage} of 8</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight mt-1">
            Digital Image Processing Laboratory
          </h2>
        </div>

        <div className="text-xs text-emerald-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Real-time OpenCV intermediate representations</span>
        </div>
      </div>

      {/* Stage Tab Navigation */}
      <div className="border-b border-slate-200 bg-slate-50/80 p-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 min-w-max">
          {stages.map((stage) => {
            const isSelected = stage.stage_number === activeStage;
            return (
              <button
                key={stage.stage_number}
                type="button"
                onClick={() => setActiveStage(stage.stage_number)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {stage.stage_number}
                </span>
                <span>{stage.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Stage Display Area */}
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Visual Area (Image Artifacts) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg group">
              <div className="aspect-square max-h-[480px] w-full flex items-center justify-center relative">
                <img
                  src={currentStageData.artifact_image}
                  alt={currentStageData.name}
                  className="max-h-full max-w-full object-contain cursor-zoom-in"
                  onClick={() => setZoomModalImage(currentStageData.artifact_image)}
                />

                {/* Quick Expand Button */}
                <button
                  type="button"
                  onClick={() => setZoomModalImage(currentStageData.artifact_image)}
                  className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-black/90 transition-colors opacity-80 group-hover:opacity-100"
                  title="Expand to Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
                  {currentStageData.name}
                </div>
              </div>
            </div>

            {/* If stage has supplementary masks or heatmaps, show thumbnails */}
            {(currentStageData.mask_image || currentStageData.heatmap_image) && (
              <div className="grid grid-cols-2 gap-3">
                {currentStageData.mask_image && (
                  <div
                    onClick={() => setZoomModalImage(currentStageData.mask_image)}
                    className="cursor-pointer p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 transition-colors"
                  >
                    <p className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                      <Binary className="w-3.5 h-3.5 text-emerald-400" />
                      Binary Segmentation Mask
                    </p>
                    <img
                      src={currentStageData.mask_image}
                      alt="Mask"
                      className="w-full h-24 object-contain rounded-lg bg-black"
                    />
                  </div>
                )}
                {currentStageData.heatmap_image && (
                  <div
                    onClick={() => setZoomModalImage(currentStageData.heatmap_image)}
                    className="cursor-pointer p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 transition-colors"
                  >
                    <p className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      Continuous Lesion Heatmap
                    </p>
                    <img
                      src={currentStageData.heatmap_image}
                      alt="Heatmap"
                      className="w-full h-24 object-contain rounded-lg bg-black"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Information & Metrics Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Stage {currentStageData.stage_number} Architecture</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {currentStageData.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                {currentDesc.technique}
              </p>
            </div>

            {/* Description Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-600" />
                Algorithm Methodology
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {currentStageData.description}
              </p>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] font-mono text-emerald-900 overflow-x-auto">
                <span className="text-slate-400 mr-2">Method:</span>
                <code>{currentDesc.algorithmNote}</code>
              </div>
            </div>

            {/* Stage Output Metrics Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                Stage Measurements & Parameters
              </h4>
              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                {currentStageData.metrics &&
                  Object.entries(currentStageData.metrics).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between px-4 py-2.5 text-xs">
                      <span className="font-medium text-slate-600">{key}</span>
                      <span className="font-bold font-mono text-slate-900">{val}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Stage 8 Special Feature Vectors View */}
            {activeStage === 8 && features && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <p className="text-xs font-bold text-emerald-900 mb-2">
                  Extracted Features Summary
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white p-2 rounded-lg border border-emerald-100">
                    <span className="text-slate-500 block">GLCM Contrast</span>
                    <span className="font-bold text-emerald-950 font-mono">
                      {features.texture_features?.contrast}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-emerald-100">
                    <span className="text-slate-500 block">GLCM Homogeneity</span>
                    <span className="font-bold text-emerald-950 font-mono">
                      {features.texture_features?.homogeneity}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-emerald-100">
                    <span className="text-slate-500 block">Excess Green (ExG)</span>
                    <span className="font-bold text-emerald-950 font-mono">
                      {features.color_moments?.exg_index}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-emerald-100">
                    <span className="text-slate-500 block">Necrosis Ratio</span>
                    <span className="font-bold text-emerald-950 font-mono">
                      {(features.color_moments?.brown_ratio * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {zoomModalImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomModalImage(null)}
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <img
              src={zoomModalImage}
              alt="Zoomed DIP Stage"
              className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
            <p className="text-center text-xs text-white/70 mt-3">Click anywhere to close full view</p>
          </div>
        </div>
      )}
    </div>
  );
}
