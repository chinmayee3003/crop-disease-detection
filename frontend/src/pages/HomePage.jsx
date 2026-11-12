import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ScanLine,
  Layers,
  ShieldCheck,
  Cpu,
  BarChart2,
  FileCheck2,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Flame,
  Activity,
  History,
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { getStats, getSamples } from '../api/api';

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStats(), getSamples()])
      .then(([statsRes, samplesRes]) => {
        if (statsRes.success) setStats(statsRes.data);
        if (samplesRes.success) setSamples(samplesRes.data.slice(0, 4));
      })
      .catch((err) => console.log('Home stats error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-forest-light to-emerald-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-emerald-800/60">
        {/* Subtle grid pattern backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#052e16_1px,transparent_1px),linear-gradient(to_bottom,#052e16_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30 mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Digital Image Processing (DIP) Precision AgTech</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
            Crop Disease Detection Using <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-200 to-white">Digital Image Processing</span>
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed mb-8 max-w-2xl font-normal">
            Automated botanical pathology system utilizing 8-stage image processing pipelines: spatial Gaussian and Median noise suppression, LAB CLAHE enhancement, HSV color segmentation, and GLCM texture classification to diagnose foliar and root diseases with clinical precision.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/detect"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-100"
            >
              <ScanLine className="w-4 h-4" />
              <span>Launch Disease Detection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/processing"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm tracking-wide border border-white/20 backdrop-blur-md transition-all"
            >
              <Layers className="w-4 h-4 text-emerald-300" />
              <span>Explore DIP Stages</span>
            </Link>

            <Link
              to="/diseases"
              className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-transparent hover:bg-white/10 text-emerald-200 text-xs sm:text-sm font-semibold transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Disease Encyclopedia</span>
            </Link>
          </div>
        </div>

        {/* Floating summary badge bottom right */}
        <div className="hidden lg:flex absolute bottom-8 right-8 p-4 rounded-2xl bg-emerald-900/80 backdrop-blur-md border border-emerald-700/50 flex-col gap-1 max-w-xs shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
            <Activity className="w-4 h-4" />
            <span>OpenCV 5.0 Vision Pipeline</span>
          </div>
          <p className="text-[11px] text-emerald-200/80 leading-normal">
            Gaussian, Median, CLAHE, HSV, Otsu & GLCM feature extraction running on native macOS architecture.
          </p>
        </div>
      </section>

      {/* Live System Metric Cards */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <MetricCard
            title="Total Detections Logged"
            value={stats ? stats.totalDetections : '—'}
            subtitle="Analyzed crop specimens"
            icon={ScanLine}
            color="green"
            trend="Persistent audit history"
          />
          <MetricCard
            title="Cataloged Plant Diseases"
            value={stats ? stats.catalogedDiseasesCount : '22+'}
            subtitle="Pathogens with treatment guides"
            icon={BookOpen}
            color="blue"
            trend="Solanaceous, cereals, roots"
          />
          <MetricCard
            title="DIP Pipeline Stages"
            value="8 Stages"
            subtitle="Noise, enhancement, segmentation"
            icon={Layers}
            color="amber"
            trend="Mathematical biometric vectors"
          />
          <MetricCard
            title="Specimen Health Rate"
            value={stats ? `${stats.healthyRate}%` : '100%'}
            subtitle="Healthy leaf & root ratio"
            icon={ShieldCheck}
            color="purple"
            trend="Empirical classification"
          />
        </div>
      </section>

      {/* 8-Stage Digital Image Processing Pipeline Overview */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-sm">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Architectural Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            8-Stage Digital Image Processing Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            Every uploaded crop image passes through our sequential digital image processing workflow to extract anatomical features without fabricated heuristics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              num: '01',
              title: 'Image Acquisition',
              desc: 'Optical verification of JPG/PNG matrix integrity, 24-bit RGB bit depth, and coordinate arrays.',
            },
            {
              num: '02',
              title: 'Image Resizing',
              desc: 'Spatial normalization to 512x512 with bicubic interpolation for scale-invariant analysis.',
            },
            {
              num: '03',
              title: 'Noise Removal',
              desc: 'Gaussian filter (sigma=1.2) & Median filter (k=5) comparison to suppress sensor artifacts.',
            },
            {
              num: '04',
              title: 'Image Enhancement',
              desc: 'CLAHE adaptive histogram equalization on Lightness channel in CIE-LAB space with unsharp masking.',
            },
            {
              num: '05',
              title: 'RGB to HSV Conversion',
              desc: 'Separation of chrominance (Hue & Saturation) from luminance (Value) to neutralize lighting shifts.',
            },
            {
              num: '06',
              title: 'Image Segmentation',
              desc: 'Excess Green (ExG = 2G - R - B) thresholding & morphological closing to isolate clean foliage.',
            },
            {
              num: '07',
              title: 'Disease Region Extraction',
              desc: 'Necrotic lesion isolation, contour bounding boxes, and continuous density heatmaps.',
            },
            {
              num: '08',
              title: 'Feature Extraction & Classification',
              desc: 'Computation of GLCM texture metrics, color moments, and empirical distance pathology matching.',
            },
          ].map((item) => (
            <div
              key={item.num}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
            >
              <span className="text-xs font-mono font-bold text-emerald-600 bg-white px-2 py-0.5 rounded-md border border-emerald-100 shadow-xs">
                {item.num}
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-emerald-700 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            Want to inspect visual comparisons and mathematical formulations of each stage?
          </p>
          <Link
            to="/processing"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-4"
          >
            <span>Open Interactive Image Processing Laboratory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Quick Try Sample Crops */}
      {samples.length > 0 && (
        <section className="bg-slate-50 rounded-3xl border border-slate-200/80 p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Immediate Demonstration
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
                Benchmark Sample Crop Library
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Test the detection pipeline instantly with these preloaded agricultural specimens.
              </p>
            </div>
            <Link
              to="/detect"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 shadow-xs transition-colors self-start sm:self-auto"
            >
              <span>View All Samples in Scanner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {samples.map((sample) => (
              <div
                key={sample.filename}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col"
              >
                <div className="aspect-video w-full bg-slate-950 overflow-hidden relative">
                  <img
                    src={sample.url}
                    alt={sample.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                    {sample.part}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">
                      {sample.crop}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{sample.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{sample.description}</p>
                  </div>
                  <Link
                    to="/detect"
                    className="mt-4 w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
                  >
                    <ScanLine className="w-3.5 h-3.5" />
                    <span>Scan this Crop</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Diagnostic & Treatment Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">Authentic Biometric Extraction</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Measures actual affected area percentage using Otsu and HSV thresholding. Calculates GLCM homogeneity, contrast, and color moments rather than fabricating results.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">Comprehensive Agronomic Protocols</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Detailed symptoms, causal vectors, preventive sanitation, organic biocontrols (Trichoderma, Bacillus subtilis), and exact chemical spray dosages (Mancozeb, Chlorothalonil).
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">Persistent Diagnostic History</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every analysis is stored with timestamp, original file, crop type, severity classification, and all generated image artifacts for historical audit and comparative analysis.
          </p>
        </div>
      </section>
    </div>
  );
}
