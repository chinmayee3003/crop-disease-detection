import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Cpu, Code2, Layers, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/30">
                <Sprout className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">AgriVision DIP</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Precision agricultural pathology powered by digital image processing, mathematical feature extraction, and adaptive color-texture segmentation.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Full 8-Stage Digital Image Processing Pipeline</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Platform Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home Dashboard</Link></li>
              <li><Link to="/detect" className="hover:text-emerald-400 transition-colors">Crop Disease Detection</Link></li>
              <li><Link to="/processing" className="hover:text-emerald-400 transition-colors">Image Processing Stages</Link></li>
              <li><Link to="/results" className="hover:text-emerald-400 transition-colors">Analysis Results & Pathology</Link></li>
              <li><Link to="/diseases" className="hover:text-emerald-400 transition-colors">Disease Encyclopedia</Link></li>
              <li><Link to="/history" className="hover:text-emerald-400 transition-colors">Detection History Log</Link></li>
            </ul>
          </div>

          {/* Image Processing Techniques */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">DIP Techniques</h4>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-emerald-500" /> Gaussian & Median Noise Removal</li>
              <li className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-emerald-500" /> LAB CLAHE Histogram Equalization</li>
              <li className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-emerald-500" /> RGB to HSV Cylindrical Transform</li>
              <li className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-emerald-500" /> Excess Green (ExG) Plant Segmentation</li>
              <li className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-emerald-500" /> GLCM Texture Haralick Matrices</li>
              <li className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-emerald-500" /> Lesion Density Heatmap Mapping</li>
            </ul>
          </div>

          {/* System Spec */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Architecture</h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Full-Stack Application built with React.js, Tailwind CSS, Node.js Express API, and Python OpenCV image-processing services.
            </p>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Environment:</span>
                <span className="text-emerald-400 font-mono">macOS Local Node + PyVenv</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">OpenCV Engine:</span>
                <span className="text-emerald-400 font-mono">cv2 5.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Database:</span>
                <span className="text-emerald-400 font-mono">JSON / MongoDB Bridge</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AgriVision DIP. Crop Disease Detection Using Digital Image Processing Technique.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Built for precision agriculture & academic pathological research
          </p>
        </div>
      </div>
    </footer>
  );
}
