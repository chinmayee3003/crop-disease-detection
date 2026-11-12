import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import DetectionPage from './pages/DetectionPage';
import ImageProcessingPage from './pages/ImageProcessingPage';
import AnalysisResultsPage from './pages/AnalysisResultsPage';
import DiseaseInfoPage from './pages/DiseaseInfoPage';
import DetectionHistoryPage from './pages/DetectionHistoryPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);

  // Restore cached scan if available
  useEffect(() => {
    const cached = localStorage.getItem('currentAnalysis');
    if (cached) {
      try {
        setCurrentAnalysis(JSON.parse(cached));
      } catch (e) {
        console.error('Failed to parse cached analysis:', e);
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-emerald-500 selection:text-white">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/detect"
              element={<DetectionPage setCurrentAnalysis={setCurrentAnalysis} />}
            />
            <Route
              path="/processing"
              element={
                <ImageProcessingPage
                  currentAnalysis={currentAnalysis}
                  setCurrentAnalysis={setCurrentAnalysis}
                />
              }
            />
            <Route
              path="/results"
              element={
                <AnalysisResultsPage
                  currentAnalysis={currentAnalysis}
                  setCurrentAnalysis={setCurrentAnalysis}
                />
              }
            />
            <Route path="/diseases" element={<DiseaseInfoPage />} />
            <Route
              path="/history"
              element={<DetectionHistoryPage setCurrentAnalysis={setCurrentAnalysis} />}
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
