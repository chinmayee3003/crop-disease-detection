# Crop Disease Detection Using Digital Image Processing Technique

[![Version](https://img.shields.io/badge/version-1.0.0-emerald.svg)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/node-v25.2.1-forest.svg)](https://nodejs.org)
[![Python](https://img.shields.io/badge/python-3.9+-blue.svg)](https://python.org)
[![OpenCV](https://img.shields.io/badge/opencv-5.0.0-red.svg)](https://opencv.org)

An advanced, full-stack precision agriculture and computational pathology platform engineered from scratch to detect, segment, and classify crop foliage and root diseases using **Digital Image Processing (DIP)** and mathematical biometric feature extraction.

---

## 🌿 Key Features & Capabilities

- **Dual Plant Specimen Support**: Analyze both aerial crop foliage (leaves) and subterranean root systems (root rots and vascular necroses).
- **Actual 8-Stage Digital Image Processing Engine**:
  1. **Image Acquisition**: Optical matrix verification, dimension parsing, and 24-bit RGB bit depth validation.
  2. **Image Resizing**: Scale-invariant normalization to a uniform 512×512 matrix via bicubic interpolation.
  3. **Noise Removal**: Spatial Gaussian filtering ($\sigma = 1.2$) and non-linear 5×5 Median filtering visual side-by-side comparison.
  4. **Image Enhancement**: Contrast Limited Adaptive Histogram Equalization (CLAHE, clip limit 2.5, 8×8 grid) applied to Lightness ($L^*$) in CIE-LAB space with edge-preserving unsharp masking.
  5. **RGB to HSV Conversion**: Cylindrical coordinate transformation decoupling illumination ($V$) from chrominance ($H$, $S$).
  6. **Image Segmentation**: Plant tissue extraction via the agronomic Excess Green Index ($\text{ExG} = 2G - R - B$) combined with morphological opening and closing to seal leaf venation.
  7. **Disease-Affected Region Extraction**: Chromatic delta lesion segmentation, glowing red contour overlays, bounding rectangles, and continuous Turbo density heatmaps.
  8. **Feature Extraction**: Quantitative measurement of 18 biometric descriptors (1st–3rd order color moments, GLCM Haralick texture matrices, and morphological circularity).
- **Genuine Pathology Classification**:
  - Distance-calibrated Softmax probability scoring across empirical plant pathology centroids.
  - Calculation of exact affected surface percentage ($\frac{\text{Diseased Pixels}}{\text{Total Plant Pixels}} \times 100$).
  - Clinical severity grading: *Mild (< 10%)*, *Moderate (10–25%)*, *Severe (25–50%)*, and *Critical (> 50%)*.
  - Candidate diagnostic hypotheses with relative ranked probabilities.
- **Actionable Treatment Recommendations**:
  - Etiological causes and environmental outbreak triggers.
  - Diagnostic symptoms checklist.
  - Preventive agronomic sanitation and cultural practices.
  - Certified organic biological controls (*Trichoderma harzianum*, *Bacillus subtilis*, copper octanoate, neem extracts).
  - Approved chemical fungicides with application rates (*Mancozeb*, *Chlorothalonil*, *Difenoconazole*).
- **Comprehensive Agricultural Encyclopedia**: Searchable repository of 22+ crop diseases spanning Tomato, Potato, Corn, Apple, Grape, Rice, Bell Pepper, and Root Systems.
- **Persistent Audit History**: Complete scan history database with image previews, severity metrics, and print-ready pathology reports.

---

## 🏛️ System Architecture

```
Crop-Disease-Detection/
├── backend/
│   ├── data/
│   │   ├── diseases.json          # 22+ plant pathology profiles & treatments
│   │   └── detections.json        # Persistent detection scan database
│   ├── python/
│   │   ├── dip_engine.py          # 8-stage OpenCV image processing pipeline
│   │   ├── feature_extractor.py   # Color moments, GLCM texture, and morphology
│   │   ├── classifier.py          # Empirical pathology distance classifier
│   │   └── disease_knowledge.py   # Pathogen knowledge base
│   ├── routes/
│   │   ├── detection.js           # Analyze, history, and single report APIs
│   │   ├── diseases.js            # Disease catalog & search APIs
│   │   └── stats.js               # Dashboard metrics & sample crop library
│   ├── services/
│   │   ├── dbService.js           # Local JSON & MongoDB compatible persistence
│   │   └── dipService.js          # Child process IPC bridge to Python engine
│   ├── uploads/
│   │   └── samples/               # Preloaded benchmark crop leaves & roots
│   ├── processed/                 # Generated intermediate DIP artifact images
│   ├── tests/
│   │   └── api.test.js            # Automated backend integration test suite
│   ├── .env                       # Environment variables
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # Express API server entrypoint (Port 5001)
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js             # Centralized Axios client
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Sticky navigation with active route highlights
│   │   │   ├── Footer.jsx         # Agricultural tech branding footer
│   │   │   ├── ImageUploader.jsx  # Drag-and-drop, format validation & samples tray
│   │   │   ├── DIPVisualizer.jsx  # Interactive 8-stage image comparison laboratory
│   │   │   ├── DiseaseSeverityBadge.jsx
│   │   │   └── MetricCard.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx       # Hero dashboard, workflow & quick metrics
│   │   │   ├── DetectionPage.jsx  # Upload & real-time progress scan portal
│   │   │   ├── ImageProcessingPage.jsx # Deep-dive into intermediate stages
│   │   │   ├── AnalysisResultsPage.jsx # Comprehensive diagnostic pathology report
│   │   │   ├── DiseaseInfoPage.jsx     # Searchable disease encyclopedia
│   │   │   ├── DetectionHistoryPage.jsx # Persistent scan log with delete/view
│   │   │   └── AboutPage.jsx      # Research documentation & mathematical formulas
│   │   ├── App.jsx                # Router & global state management
│   │   ├── index.css              # Custom styling, scanline animations
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js             # Reverse proxy to backend port 5001
│   └── package.json
├── venv/                          # Python virtual environment with cv2, numpy, PIL
├── package.json                   # Root workspace scripts
└── README.md
```

---

## 🧮 Mathematical Formulations of the DIP Pipeline

### 1. Spatial Downsampling & Normalization
Input images are scaled to a standard $512 \times 512$ coordinate grid using bicubic interpolation over 16 neighboring pixels:
$$f(x, y) = \sum_{i=0}^3 \sum_{j=0}^3 a_{ij} x^i y^j$$

### 2. Gaussian vs. Median Spatial Noise Suppression
Gaussian spatial smoothing computes a weighted distance distribution:
$$G(x, y) = \frac{1}{2\pi\sigma^2} \exp\left(-\frac{x^2 + y^2}{2\sigma^2}\right), \quad \sigma = 1.2$$
The non-linear Median filter replaces the center pixel with the statistical median of the $5 \times 5$ window:
$$M(x, y) = \text{median}\left\{ I(x+i, y+j) \mid -2 \le i, j \le 2 \right\}$$

### 3. CLAHE in CIE-LAB Color Space
To avoid chrominance shifts, the RGB matrix is transformed to CIE-LAB:
$$L_{\text{enhanced}} = \text{CLAHE}(L^*, \text{clipLimit}=2.5, \text{tileGrid}=(8, 8))$$
Followed by unsharp masking:
$$I_{\text{sharp}} = I + 1.25 \cdot (I - G * I)$$

### 4. RGB to HSV Chromaticity Decoupling
$$H = \arccos\left(\frac{\frac{1}{2}[(R - G) + (R - B)]}{\sqrt{(R - G)^2 + (R - B)(G - B)}}\right)$$
$$S = 1 - \frac{3 \cdot \min(R, G, B)}{R + G + B}, \quad V = \frac{\max(R, G, B)}{255}$$

### 5. Excess Green (ExG) Plant Segmentation
Active chlorophyll vegetation is isolated from neutral or paper backgrounds using:
$$\text{ExG} = 2G - R - B$$
$$\text{Mask}_{\text{plant}} = (\text{ExG} > 5.0) \cap (18^\circ \le H \le 95^\circ) \circ B_{\text{ellipse}}$$

### 6. Gray-Level Co-occurrence Matrix (GLCM) Texture Descriptors
Textural roughness and lesion irregularity are quantified via second-order joint probabilities $P(i, j)$:
- **Contrast**: $\sum_{i,j} |i - j|^2 P(i, j)$
- **Homogeneity**: $\sum_{i,j} \frac{P(i, j)}{1 + |i - j|^2}$
- **Energy (ASM)**: $\sum_{i,j} P(i, j)^2$
- **Entropy**: $-\sum_{i,j} P(i, j) \log_2(P(i, j) + \epsilon)$
- **Correlation**: $\sum_{i,j} \frac{(i - \mu_i)(j - \mu_j) P(i, j)}{\sigma_i \sigma_j}$

---

## 🚀 Installation & Local macOS Execution

### Prerequisites
- **macOS** (Apple Silicon or Intel)
- **Node.js** v18+ (verified on v25.2.1)
- **Python** 3.9+ (verified on v3.9.6)

### Step 1: Open the Project Directory
```bash
cd /Users/chinmayeemahadeva/Downloads/imageee/Crop-Disease-Detection
```

### Step 2: Install Dependencies
*Dependencies are already pre-installed in the workspace, but if rebuilding from scratch:*
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Return to project root
cd ..
```

### Step 3: Run the Application
Open **two terminal tabs**:

#### Terminal 1 — Start Backend API Server
```bash
cd /Users/chinmayeemahadeva/Downloads/imageee/Crop-Disease-Detection/backend
npm start
```
*The backend API server starts at `http://localhost:5001`.*

#### Terminal 2 — Start Frontend Application
```bash
cd /Users/chinmayeemahadeva/Downloads/imageee/Crop-Disease-Detection/frontend
npm run dev
```
*The frontend Vite dev server will start at `http://localhost:3000`.*

### Step 4: Open in Web Browser
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🧪 Running Automated Tests

Run the full integration test suite verifying all 8 API endpoints and the Python DIP pipeline:
```bash
cd /Users/chinmayeemahadeva/Downloads/imageee/Crop-Disease-Detection/backend
node tests/api.test.js
```
Expected output:
```
🧪 Starting AgriVision DIP API Test Suite...

 ✅ PASS: Health endpoint /api/health
 ✅ PASS: Disease list /api/diseases returns 20+ profiles
 ✅ PASS: Specific disease details /api/diseases/:id
 ✅ PASS: Stats endpoint /api/stats
 ✅ PASS: Sample crop images /api/samples
 ✅ PASS: Analyze sample execution success
 ✅ PASS: 8 DIP stages generated in response
 ✅ PASS: Visual artifacts generated
 ✅ PASS: Affected area percentage computed
 ✅ PASS: Mathematical confidence score provided
 ✅ PASS: History log persistence /api/detection/history
 ✅ PASS: Fetch detection by ID /api/detection/:id

========================================
 Test Results: 12 Passed, 0 Failed
========================================
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/detection/analyze` | Upload crop image (JPG/PNG, up to 10MB) & execute DIP pipeline |
| `POST` | `/api/detection/analyze-sample` | Run DIP pipeline on preloaded benchmark crop specimen |
| `GET` | `/api/detection/history` | Retrieve persistent detection scan history (supports `crop`, `status` filters) |
| `GET` | `/api/detection/:id` | Fetch detailed diagnostic pathology report by scan ID |
| `DELETE` | `/api/detection/:id` | Delete a detection report from audit history |
| `GET` | `/api/diseases` | List all cataloged plant diseases (supports search query & crop filter) |
| `GET` | `/api/diseases/:id` | Fetch full etiology, symptoms, and organic/chemical treatments for a disease |
| `GET` | `/api/stats` | Dashboard statistics, healthy ratios, and recent scan logs |
| `GET` | `/api/samples` | List preloaded benchmark crop leaves and root specimens |

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
