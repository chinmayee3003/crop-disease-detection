import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Bug,
  Leaf,
  Layers,
  ChevronRight,
  X,
  Droplets,
  ShieldCheck,
  Wind,
} from 'lucide-react';
import { getDiseases } from '../api/api';

export default function DiseaseInfoPage() {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [activeModalDisease, setActiveModalDisease] = useState(null);

  useEffect(() => {
    setLoading(true);
    getDiseases({ crop: selectedCrop, query: searchQuery, type: selectedType })
      .then((res) => {
        if (res.success && res.data) {
          setDiseases(res.data);
        }
      })
      .catch((err) => console.log('Diseases load error:', err))
      .finally(() => setLoading(false));
  }, [searchQuery, selectedCrop, selectedType]);

  const crops = [
    { id: 'all', name: 'All Crops' },
    { id: 'tomato', name: 'Tomato' },
    { id: 'potato', name: 'Potato' },
    { id: 'corn', name: 'Corn (Maize)' },
    { id: 'apple', name: 'Apple' },
    { id: 'grape', name: 'Grape' },
    { id: 'rice', name: 'Rice' },
    { id: 'pepper', name: 'Bell Pepper' },
    { id: 'root', name: 'Root Crops' },
  ];

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>Plant Health Knowledge Base</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Crop Disease Encyclopedia
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Explore common crop diseases, observable symptoms, environmental causes, how diseases spread, and practical ways to manage them using organic and approved treatments.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by disease name, crop, or symptoms..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {/* Crop Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              {crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Selector (Leaf vs Root) */}
          <div className="md:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              <option value="all">All Plant Parts (Leaf & Root)</option>
              <option value="leaf">Leaf Samples</option>
              <option value="root">Root Samples</option>
            </select>
          </div>
        </div>

        {/* Quick Crop Tag Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {crops.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCrop(c.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCrop === c.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Disease Cards Grid */}
      {loading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200">
          <BookOpen className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">Loading disease profiles...</p>
        </div>
      ) : diseases.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <Leaf className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No diseases match your search.</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting the crop filter or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diseases.map((d) => {
            const isHealthy = d.status === 'Healthy';
            return (
              <div
                key={d.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {d.crop}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isHealthy
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isHealthy ? 'Healthy Plant' : 'Infection Profile'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {d.disease_name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-0.5">
                    {d.pathogen}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Bug className="w-3.5 h-3.5 text-amber-600" />
                      Visible Symptoms:
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {d.symptoms && d.symptoms[0]}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                    {d.type === 'root' ? (
                      <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    <span>{d.type === 'root' ? 'Root System' : 'Foliage'}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setActiveModalDisease(d)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>View Full Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Disease Detail Modal */}
      {activeModalDisease && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveModalDisease(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setActiveModalDisease(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {activeModalDisease.crop}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    activeModalDisease.status === 'Healthy'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {activeModalDisease.status === 'Healthy' ? 'Healthy Plant' : 'Plant Disease Profile'}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {activeModalDisease.disease_name}
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                <strong className="text-slate-800">Pathogen:</strong> {activeModalDisease.pathogen}
              </p>
            </div>

            {/* Symptoms */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Bug className="w-4 h-4 text-amber-600" />
                Visible Symptoms
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                {activeModalDisease.symptoms?.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Causes & How it Spreads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  Possible Causes
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 h-full">
                  {activeModalDisease.causes?.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {activeModalDisease.spread && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-sky-600" />
                    How the Disease Spreads
                  </h4>
                  <div className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 h-full flex items-center">
                    <p>{activeModalDisease.spread}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Prevention & Treatments */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Prevention & Practical Treatment Options
              </h4>

              {/* Prevention */}
              {activeModalDisease.preventive_measures && activeModalDisease.preventive_measures.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <span className="font-bold text-slate-900 block">Prevention & Cultural Care</span>
                  <ul className="space-y-1 text-slate-700">
                    {activeModalDisease.preventive_measures.map((pm, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{pm}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-2">
                  <span className="font-bold text-emerald-950 block">Organic Treatment Options</span>
                  <ul className="space-y-1 text-emerald-900">
                    {activeModalDisease.organic_treatments?.map((ot, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{ot}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs space-y-2">
                  <span className="font-bold text-amber-950 block">Chemical Treatment Options</span>
                  <ul className="space-y-1 text-amber-900">
                    {activeModalDisease.chemical_controls?.map((cc, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">✓</span>
                        <span>{cc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
