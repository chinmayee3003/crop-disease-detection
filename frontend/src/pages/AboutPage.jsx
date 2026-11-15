import React from 'react';
import {
  Sprout,
  ShieldCheck,
  Code2,
  Terminal,
  Activity,
  CheckCircle2,
  FileText,
  Database,
  Layers,
  HelpCircle,
} from 'lucide-react';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <div className="space-y-12 py-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-emerald-950 via-forest-light to-emerald-900 rounded-3xl p-8 sm:p-12 text-white border border-emerald-800 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30 mb-4">
            <Sprout className="w-3.5 h-3.5" />
            <span>Academic Project Overview</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Crop Disease Detection Using Digital Image Processing Technique
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 mt-3 max-w-3xl leading-relaxed">
            A full-stack agricultural assistance web application that helps farmers and agriculture students detect plant diseases from photographs using computer vision, colour segmentation, and feature extraction.
          </p>
        </div>

        {/* Problem Statement & Proposed Solution */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">The Problem</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Plant diseases can damage crops quickly and reduce farm yields if they are not spotted early. Identifying diseases by eye often requires experienced agricultural officers who may not be immediately available in rural areas. Late identification leads to unnecessary crop loss and excessive pesticide use.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Our Proposed Solution</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              AgriVision provides an accessible digital image processing tool where users simply upload a picture of a leaf or root. The system removes background noise, enhances image clarity, highlights visible damaged spots, calculates the percentage of affected area, and gives easy-to-read management tips.
            </p>
          </div>
        </section>

        {/* Main Features */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Key Project Features</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <strong className="text-slate-900 block font-bold">Foliage and Root Analysis</strong>
              <p className="text-slate-600 text-xs leading-relaxed">
                Supports common crop leaf pictures as well as root photographs to detect underground root rot conditions.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <strong className="text-slate-900 block font-bold">8-Stage Image Processing Pipeline</strong>
              <p className="text-slate-600 text-xs leading-relaxed">
                Applies real OpenCV operations including Gaussian and Median noise filtering, CLAHE contrast enhancement, HSV segmentation, and lesion extraction.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <strong className="text-slate-900 block font-bold">Affected Area Calculation</strong>
              <p className="text-slate-600 text-xs leading-relaxed">
                Measures the actual percentage of the plant surface that shows signs of spots or discoloration.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <strong className="text-slate-900 block font-bold">Practical Treatment & Prevention Guide</strong>
              <p className="text-slate-600 text-xs leading-relaxed">
                Provides simple, understandable agronomic advice including crop rotation, biological solutions, and approved spray recommendations.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <strong className="text-slate-900 block font-bold">Comprehensive Disease Encyclopedia</strong>
              <p className="text-slate-600 text-xs leading-relaxed">
                Searchable repository of 22+ agricultural diseases across Tomato, Potato, Corn, Apple, Grape, Rice, Bell Pepper, and root crops.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <strong className="text-slate-900 block font-bold">Persistent Audit History (DBMS)</strong>
              <p className="text-slate-600 text-xs leading-relaxed">
                Stores previous scans with images, timestamps, severity status, and results for comparative tracking and demonstration.
              </p>
            </div>
          </div>
        </section>

        {/* Full-Stack Technology Stack */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-600" />
              <span>Full-Stack Technology Stack</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Every technology listed here is actively used in the application.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Frontend */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <span className="font-bold text-slate-900 text-sm block">Frontend</span>
              <ul className="space-y-1.5 text-slate-600 text-xs">
                <li><strong className="text-slate-800">React.js:</strong> Builds the responsive single-page user interface and handles view routing.</li>
                <li><strong className="text-slate-800">JavaScript (ES6+):</strong> Powers client-side state management and asynchronous API calls.</li>
                <li><strong className="text-slate-800">Tailwind CSS:</strong> Provides clean green-and-white agricultural styling and responsive layouts.</li>
                <li><strong className="text-slate-800">Axios:</strong> Sends image uploads and requests to the backend server.</li>
              </ul>
            </div>

            {/* Backend */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <span className="font-bold text-slate-900 text-sm block">Backend API</span>
              <ul className="space-y-1.5 text-slate-600 text-xs">
                <li><strong className="text-slate-800">Node.js:</strong> Serves as the cross-platform runtime environment for the server.</li>
                <li><strong className="text-slate-800">Express.js:</strong> Implements RESTful API endpoints for image analysis, diseases, and stats.</li>
                <li><strong className="text-slate-800">Multer:</strong> Handles multipart image uploads and file format validation.</li>
                <li><strong className="text-slate-800">Child Process:</strong> Bridges the Express backend with the Python OpenCV image processing service.</li>
              </ul>
            </div>

            {/* Image Processing */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <span className="font-bold text-slate-900 text-sm block">Image Processing</span>
              <ul className="space-y-1.5 text-slate-600 text-xs">
                <li><strong className="text-slate-800">Python 3:</strong> Executes the digital image processing and feature calculation scripts.</li>
                <li><strong className="text-slate-800">OpenCV (cv2):</strong> Applies spatial filters, CLAHE enhancement, HSV color masks, and contours.</li>
                <li><strong className="text-slate-800">NumPy:</strong> Performs fast array operations on image pixel matrices and color channels.</li>
                <li><strong className="text-slate-800">Pillow (PIL):</strong> Validates raw image file headers and bit depths.</li>
              </ul>
            </div>

            {/* Database */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <span className="font-bold text-slate-900 text-sm block">Database & Storage</span>
              <ul className="space-y-1.5 text-slate-600 text-xs">
                <li><strong className="text-slate-800">JSON File Database:</strong> Provides persistent disk storage for detection scan records and disease encyclopedia data.</li>
                <li><strong className="text-slate-800">Atomic Disk Writes:</strong> Ensures database records are saved safely without data corruption.</li>
                <li><strong className="text-slate-800">Static File Storage:</strong> Organizes uploaded crop photos and processed stage images in dedicated folders.</li>
                <li><strong className="text-slate-800">MongoDB Bridge:</strong> Fully compatible with MongoDB via environment configuration when needed.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Academic Project Components (Viva Guide) */}
        <section className="bg-emerald-50/70 rounded-3xl border border-emerald-200 p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-700" />
            <span>Academic Demonstration Highlights</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
            This project covers four core areas of computer science and agricultural informatics:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3.5 rounded-xl border border-emerald-200">
              <strong className="text-emerald-950 block font-bold mb-1">1. Digital Image Processing (DIP)</strong>
              <p className="text-slate-600">
                Demonstrated through the 8-stage pipeline: Gaussian & Median filtering, CLAHE contrast equalization, HSV conversion, Excess Green segmentation, and contour masking.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-emerald-200">
              <strong className="text-emerald-950 block font-bold mb-1">2. Feature Extraction & Classification</strong>
              <p className="text-slate-600">
                Demonstrated through color moment statistics (Mean, Std Dev, Skewness), GLCM texture matrices (Contrast, Homogeneity), and distance-based signature matching against verified disease profiles.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-emerald-200">
              <strong className="text-emerald-950 block font-bold mb-1">3. Database Management (DBMS)</strong>
              <p className="text-slate-600">
                Demonstrated through persistent scan records, timestamp logging, query filtering by crop or status, record retrieval by ID, and deletion operations.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-emerald-200">
              <strong className="text-emerald-950 block font-bold mb-1">4. Full-Stack Web Development</strong>
              <p className="text-slate-600">
                Demonstrated through a modular React single-page frontend, asynchronous REST APIs with Express.js, and inter-process communication with Python.
              </p>
            </div>
          </div>
        </section>

        {/* Execution Guide */}
        <section className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-slate-200 shadow-xl space-y-4 border border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Terminal className="w-4 h-4" />
            <span>Running the Project Locally</span>
          </div>
          <h3 className="text-lg font-bold text-white">Execution Instructions for macOS</h3>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <p className="text-slate-400 text-[11px] mb-1 font-sans">1. Start Backend API Server (Port 5001):</p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-emerald-400 select-all">
                cd Crop-Disease-Detection/backend && npm start
              </div>
            </div>

            <div>
              <p className="text-slate-400 text-[11px] mb-1 font-sans">2. Start Frontend Dev Server (Port 3001):</p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-emerald-400 select-all">
                cd Crop-Disease-Detection/frontend && npm run dev
              </div>
            </div>

            <div>
              <p className="text-slate-400 text-[11px] mb-1 font-sans">3. Open in Browser:</p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-emerald-400 select-all">
                http://localhost:3001
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Complete Footer Component (displayed only on the About Project page) */}
      <Footer />
    </div>
  );
}
