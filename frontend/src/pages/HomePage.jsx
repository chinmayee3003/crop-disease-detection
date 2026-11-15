import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ScanLine,
  Layers,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Sparkles,
  Activity,
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { getStats } from '../api/api';

export default function HomePage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats()
      .then((statsRes) => {
        if (statsRes.success) setStats(statsRes.data);
      })
      .catch((err) => console.log('Home stats error:', err));
  }, []);

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-forest-light to-emerald-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-emerald-800/60">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#052e16_1px,transparent_1px),linear-gradient(to_bottom,#052e16_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30 mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Digital Image Processing (DIP) Technique</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
            Crop Disease Detection Using <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-200 to-white">Digital Image Processing</span>
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed mb-8 max-w-2xl font-normal">
            AgriVision helps identify possible crop diseases by analysing pictures of plant leaves and roots. Upload a crop image to check whether the plant appears healthy or shows signs of disease. The system also provides information about visible symptoms, affected areas and possible ways to manage the disease.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/detect"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-100"
            >
              <ScanLine className="w-4 h-4" />
              <span>Upload & Check Crop</span>
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

        {/* Floating summary badge */}
        <div className="hidden lg:flex absolute bottom-8 right-8 p-4 rounded-2xl bg-emerald-900/80 backdrop-blur-md border border-emerald-700/50 flex-col gap-1 max-w-xs shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
            <Activity className="w-4 h-4" />
            <span>8-Stage Image Processing</span>
          </div>
          <p className="text-[11px] text-emerald-200/80 leading-normal">
            Noise filtering, contrast enhancement, color segmentation, and feature extraction running locally.
          </p>
        </div>
      </section>

      {/* Live System Metric Cards */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <MetricCard
            title="Total Analyses Logged"
            value={stats ? stats.totalDetections : '—'}
            subtitle="Analyzed crop specimens"
            icon={ScanLine}
            color="green"
            trend="Stored in database history"
          />
          <MetricCard
            title="Cataloged Plant Diseases"
            value={stats ? stats.catalogedDiseasesCount : '22+'}
            subtitle="Diseases with management guides"
            icon={BookOpen}
            color="blue"
            trend="Tomato, Potato, Corn, Apple, etc."
          />
          <MetricCard
            title="DIP Pipeline Stages"
            value="8 Stages"
            subtitle="Filtering, enhancement, segmentation"
            icon={Layers}
            color="amber"
            trend="OpenCV image processing workflow"
          />
          <MetricCard
            title="Specimen Health Rate"
            value={stats ? `${stats.healthyRate}%` : '100%'}
            subtitle="Healthy leaf & root ratio"
            icon={ShieldCheck}
            color="purple"
            trend="Based on analyzed scans"
          />
        </div>
      </section>

      {/* 8-Stage Digital Image Processing Pipeline Overview */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-sm">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Image Processing Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            8-Stage Digital Image Processing Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            Every uploaded crop image passes through our sequential digital image processing workflow to extract visible plant features and identify signs of disease.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              num: '01',
              title: 'Image Acquisition',
              desc: 'The system accepts a crop image uploaded by the user and checks file format and quality.',
            },
            {
              num: '02',
              title: 'Image Resizing',
              desc: 'The image is resized to a standard 512×512 size for consistent and reliable processing.',
            },
            {
              num: '03',
              title: 'Noise Removal',
              desc: 'Gaussian and Median filters help reduce unwanted camera noise while keeping leaf edges clear.',
            },
            {
              num: '04',
              title: 'Image Enhancement',
              desc: 'CLAHE improves image contrast so that visible disease details and spots are easier to identify.',
            },
            {
              num: '05',
              title: 'RGB to HSV Conversion',
              desc: 'The image is converted to HSV colour format to better separate lighting from natural plant colours.',
            },
            {
              num: '06',
              title: 'Image Segmentation',
              desc: 'Colour thresholding and morphological operations separate the plant from its background.',
            },
            {
              num: '07',
              title: 'Disease Region Extraction',
              desc: 'The system locates visible spots, marks boundaries, and calculates the affected percentage.',
            },
            {
              num: '08',
              title: 'Feature Extraction & Classification',
              desc: 'Colour, texture, and shape details are extracted and compared with disease profiles to suggest a result.',
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
            Want to see how the image looks at each stage of processing?
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
    </div>
  );
}
