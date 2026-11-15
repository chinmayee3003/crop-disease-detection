import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileImage,
  X,
  RefreshCw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Leaf,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { getSamples } from '../api/api';

export default function ImageUploader({
  onAnalyze,
  onAnalyzeSample,
  isProcessing,
  processingStep,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cropHint, setCropHint] = useState('auto');
  const [partType, setPartType] = useState('leaf');
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState(null);

  const fileInputRef = useRef(null);

  // Load sample crops from API
  useEffect(() => {
    getSamples()
      .then((res) => {
        if (res.success && res.data) {
          setSamples(res.data);
        }
      })
      .catch((err) => console.log('Sample load error:', err));
  }, []);

  const handleFileValidation = (file) => {
    setErrorMessage(null);
    setSelectedSample(null);

    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const validExtensions = ['.jpg', '.jpeg', '.png'];
    const hasValidExt = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );

    if (!validTypes.includes(file.type) && !hasValidExt) {
      setErrorMessage(
        'Invalid format. Only JPG, JPEG, and PNG images are supported.'
      );
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 10MB limit. Please upload a smaller image.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileValidation(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileValidation(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    if (previewUrl && !selectedSample) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedSample(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectSample = (sample) => {
    setSelectedFile(null);
    setSelectedSample(sample);
    setPreviewUrl(sample.url);
    setErrorMessage(null);
    setCropHint(sample.crop.toLowerCase().includes('tomato') ? 'tomato' : sample.crop.toLowerCase());
    setPartType(sample.part || 'leaf');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isProcessing) return;

    if (selectedSample) {
      onAnalyzeSample(selectedSample.filename, cropHint, partType);
    } else if (selectedFile) {
      onAnalyze(selectedFile, cropHint, partType);
    } else {
      setErrorMessage('Please select or upload a crop image first.');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100 p-6 md:p-8">
      {/* Parameter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            1. Plant Specimen Type
          </label>
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setPartType('leaf')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                partType === 'leaf'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Foliage / Leaf</span>
            </button>
            <button
              type="button"
              onClick={() => setPartType('root')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                partType === 'root'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>Root System</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            2. Crop Variety Hint
          </label>
          <select
            value={cropHint}
            onChange={(e) => setCropHint(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          >
            <option value="auto">Auto-Detect / General Pathology</option>
            <option value="tomato">Tomato (Solanum lycopersicum)</option>
            <option value="potato">Potato (Solanum tuberosum)</option>
            <option value="corn">Corn / Maize (Zea mays)</option>
            <option value="apple">Apple (Malus domestica)</option>
            <option value="grape">Grape (Vitis vinifera)</option>
            <option value="rice">Rice (Oryza sativa)</option>
            <option value="pepper">Bell Pepper (Capsicum annuum)</option>
          </select>
        </div>
      </div>

      {/* Upload Drag & Drop Area */}
      {!previewUrl ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]'
              : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/20'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-base font-bold text-slate-800 mb-1">
            Drag & drop crop image here, or <span className="text-emerald-600 underline">browse</span>
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-3">
            Supported formats: JPG, JPEG, and PNG. Maximum resolution: 4K (file size up to 10MB).
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Optimal results with clear, single-leaf or root close-ups</span>
          </div>
        </div>
      ) : (
        /* Image Preview Box */
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-inner">
          <div className="aspect-video max-h-96 w-full flex items-center justify-center bg-slate-950/80 relative">
            <img
              src={previewUrl}
              alt="Crop Preview"
              className="max-h-96 max-w-full object-contain mx-auto"
            />

            {/* Scanning line animation during processing */}
            {isProcessing && <div className="animate-scan" />}

            {/* Overlay Status Pill */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10">
                <FileImage className="w-3.5 h-3.5 text-emerald-400" />
                {selectedSample ? selectedSample.title : selectedFile?.name}
              </span>
              {selectedFile && (
                <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-slate-300 text-[11px] font-mono border border-white/10">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </span>
              )}
            </div>

            {/* Action Buttons Top Right */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="p-2 rounded-xl bg-black/60 backdrop-blur-md hover:bg-black/80 text-white text-xs font-medium border border-white/10 transition-colors"
                title="Replace Image"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={isProcessing}
                className="p-2 rounded-xl bg-rose-600/80 backdrop-blur-md hover:bg-rose-700 text-white text-xs font-medium transition-colors"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error alert */}
      {errorMessage && (
        <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Processing Pipeline Tracker */}
      {isProcessing && (
        <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              Executing DIP Pipeline...
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700">
              {processingStep || 'Processing Image'}
            </span>
          </div>
          <div className="w-full bg-emerald-200 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-600 h-2 rounded-full animate-pulse w-full" />
          </div>
          <p className="text-[11px] text-emerald-800 mt-2">
            Analyzing the plant photo using OpenCV filtering, contrast enhancement, colour segmentation, and disease profile matching.
          </p>
        </div>
      )}

      {/* Quick-Try Sample Images Tray */}
      <div className="mt-6 pt-6 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Quick Test Samples
          </p>
          <span className="text-[11px] text-slate-500">Test immediately with a preloaded sample</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {samples.map((sample) => (
            <button
              key={sample.filename}
              type="button"
              disabled={isProcessing}
              onClick={() => handleSelectSample(sample)}
              className={`group text-left p-2 rounded-xl border transition-all ${
                selectedSample?.filename === sample.filename
                  ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/30'
                  : 'border-slate-200 hover:border-emerald-300 bg-slate-50 hover:bg-white'
              }`}
            >
              <div className="w-full aspect-square rounded-lg bg-slate-200 overflow-hidden mb-1.5 relative">
                <img
                  src={sample.url}
                  alt={sample.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/60 text-white backdrop-blur-xs">
                  {sample.part}
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-800 truncate">{sample.title}</p>
              <p className="text-[10px] text-slate-500 truncate">{sample.crop}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isProcessing || !previewUrl}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs tracking-wide transition-all shadow-md ${
            isProcessing || !previewUrl
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isProcessing ? 'Analyzing Image...' : 'Analyse Crop Image'}</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
