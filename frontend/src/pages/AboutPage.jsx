import React from 'react';
import {
  Sprout,
  Cpu,
  Layers,
  ShieldCheck,
  Code2,
  FileCode,
  Terminal,
  Activity,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-12 py-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-forest-light to-emerald-900 rounded-3xl p-8 sm:p-12 text-white border border-emerald-800 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30 mb-4">
          <Sprout className="w-3.5 h-3.5" />
          <span>Research & Engineering Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Crop Disease Detection Using Digital Image Processing Technique
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100/90 mt-3 max-w-3xl leading-relaxed">
          An end-to-end full-stack computer vision platform engineered to diagnose plant pathologies via 8-stage spatial transformations, color space conversions, morphological segmentation, and GLCM texture classification.
        </p>
      </div>

      {/* Project Objective */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Project Objective</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Agricultural yields worldwide are severely compromised by plant diseases, with fungal blights, bacterial spots, and root rots causing catastrophic crop loss when detected late. Traditional manual diagnosis requires expert plant pathologists and is prone to subjective human error.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          This system provides an automated, objective, and reproducible diagnostic framework. By applying genuine Digital Image Processing (DIP) techniques, it extracts quantifiable anatomical markers—such as lesion surface percentage, circularity, color moments, and second-order textural roughness—to distinguish healthy foliage from infected specimens and deliver clinical agronomic recommendations.
        </p>
      </section>

      {/* 8-Stage DIP Algorithmic Formulation */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Mathematical Principles
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Digital Image Processing Pipeline Architecture
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Detailed breakdown of the mathematical equations governing the 8 processing stages.
          </p>
        </div>

        <div className="space-y-4 text-xs">
          {/* Stage 1 & 2 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <h3 className="font-bold text-slate-900 mb-1">
              1. Image Acquisition & 2. Standardization
            </h3>
            <p className="text-slate-600 mb-2">
              Optical ingestion of 24-bit RGB arrays verified across 3 channels. Resized to a uniform 512x512 matrix using bicubic interpolation over 4x4 pixel neighborhoods to ensure scale invariance:
            </p>
            <div className="font-mono bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800">
              f(x, y) = Σᵢ₌₀³ Σⱼ₌₀³ aᵢⱼ xⁱ yʲ
            </div>
          </div>

          {/* Stage 3 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <h3 className="font-bold text-slate-900 mb-1">
              3. Noise Removal (Gaussian vs. Median Filtering)
            </h3>
            <p className="text-slate-600 mb-2">
              Gaussian spatial convolution suppresses sensor Gaussian noise with standard deviation σ=1.2:
            </p>
            <div className="font-mono bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800 mb-2">
              G(x, y) = (1 / 2πσ²) · exp(-(x² + y²) / (2σ²))
            </div>
            <p className="text-slate-600">
              In parallel, a non-linear 5x5 Median Filter takes the local rank median to remove salt-and-pepper impulses while strictly preserving sharp leaf contours.
            </p>
          </div>

          {/* Stage 4 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <h3 className="font-bold text-slate-900 mb-1">
              4. CLAHE Image Enhancement in CIE-LAB Space
            </h3>
            <p className="text-slate-600 mb-2">
              To enhance subtle pustules without saturating colors, the image is mapped into CIE-LAB space. Contrast Limited Adaptive Histogram Equalization (clip limit 2.5, 8x8 contextual tiles) is applied exclusively to the Lightness (L*) channel:
            </p>
            <div className="font-mono bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800">
              L_enhanced = CLAHE(L*, clip=2.5, grid=8x8), followed by unsharp masking: I_sharp = I + 1.25(I - G*I)
            </div>
          </div>

          {/* Stage 5 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <h3 className="font-bold text-slate-900 mb-1">
              5. RGB to HSV Color Space Transformation
            </h3>
            <p className="text-slate-600 mb-2">
              Cylindrical HSV decomposition decouples illumination (Value) from chromatic spectral purity (Hue and Saturation), making chlorotic yellowing and necrosis invariant to shade:
            </p>
            <div className="font-mono bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800">
              H = arccos(0.5 · ((R - G) + (R - B)) / √((R - G)² + (R - B)(G - B)))
            </div>
          </div>

          {/* Stage 6 & 7 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <h3 className="font-bold text-slate-900 mb-1">
              6. Excess Green Segmentation & 7. Disease Lesion Extraction
            </h3>
            <p className="text-slate-600 mb-2">
              Plant tissue is isolated using the agronomic Excess Green Index combined with Otsu thresholding:
            </p>
            <div className="font-mono bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800 mb-2">
              ExG = 2 · G - R - B, &nbsp; Mask_plant = (ExG &gt; θ) ∩ (HSV_leaf) ∘ B_ellipse
            </div>
            <p className="text-slate-600">
              Infected lesion pixels are isolated within the plant mask by detecting low-Hue brownish rust (H: 0-25) and yellow chlorosis (H: 22-34). Affected area percentage is mathematically computed:
            </p>
            <div className="font-mono bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800">
              Affected_Area_% = (Total_Lesion_Pixels / Total_Leaf_Pixels) × 100
            </div>
          </div>

          {/* Stage 8 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <h3 className="font-bold text-slate-900 mb-1">
              8. GLCM Texture & Biometric Classification
            </h3>
            <p className="text-slate-600 mb-2">
              Gray Level Co-occurrence Matrices (GLCM) capture second-order joint probabilities P(i, j) along displacement vectors:
            </p>
            <div className="font-mono bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800">
              Contrast = Σ |i - j|² P(i, j) &nbsp;|&nbsp; Homogeneity = Σ P(i, j) / (1 + |i - j|²) &nbsp;|&nbsp; Entropy = -Σ P(i, j) log₂(P(i, j))
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Matrix */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-emerald-600" />
          <span>Full-Stack Technology Stack</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <span className="font-bold text-slate-900 text-sm block">Frontend</span>
            <ul className="space-y-1 text-slate-600">
              <li>• React.js 18.3 (Single Page App)</li>
              <li>• Vite 6.0 (Build system & dev server)</li>
              <li>• Tailwind CSS 3.4 (Modern green theme)</li>
              <li>• React Router 6.28</li>
              <li>• Lucide React Icons</li>
              <li>• Axios for REST communication</li>
              <li>• Canvas Confetti</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <span className="font-bold text-slate-900 text-sm block">Backend API</span>
            <ul className="space-y-1 text-slate-600">
              <li>• Node.js 25.2</li>
              <li>• Express.js 4.21</li>
              <li>• Multer (File uploads & validation)</li>
              <li>• Morgan logger & CORS</li>
              <li>• JSON / MongoDB persistence engine</li>
              <li>• Subprocess IPC bridge to Python</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <span className="font-bold text-slate-900 text-sm block">Vision & Machine Learning</span>
            <ul className="space-y-1 text-slate-600">
              <li>• Python 3.9 + Isolated venv</li>
              <li>• OpenCV (cv2) 5.0.0</li>
              <li>• NumPy 2.0 (Vector linear algebra)</li>
              <li>• Pillow (PIL) 11.3</li>
              <li>• Softmax distance probability</li>
              <li>• 22+ Pathological knowledge profiles</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Execution Commands */}
      <section className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-slate-200 shadow-xl space-y-4 border border-slate-800">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Terminal className="w-4 h-4" />
          <span>macOS Local Execution Instructions</span>
        </div>
        <h3 className="text-lg font-bold text-white">How to Run Locally on macOS</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The application is fully configured to execute inside the <code className="text-emerald-300">Crop-Disease-Detection</code> folder.
        </p>

        <div className="space-y-3 font-mono text-xs">
          <div>
            <p className="text-slate-400 text-[11px] mb-1 font-sans">1. Start Backend API Server (Port 5001):</p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-emerald-400 select-all">
              cd Crop-Disease-Detection/backend && npm start
            </div>
          </div>

          <div>
            <p className="text-slate-400 text-[11px] mb-1 font-sans">2. Start Frontend Dev Server (Port 3000):</p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-emerald-400 select-all">
              cd Crop-Disease-Detection/frontend && npm run dev
            </div>
          </div>

          <div>
            <p className="text-slate-400 text-[11px] mb-1 font-sans">3. Open Browser:</p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-emerald-400 select-all">
              http://localhost:3000
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
