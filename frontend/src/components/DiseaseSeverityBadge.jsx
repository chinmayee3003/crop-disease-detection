import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, AlertOctagon, CheckCircle2 } from 'lucide-react';

export default function DiseaseSeverityBadge({ status, severity, percentage }) {
  const isHealthy = status === 'Healthy' || severity?.includes('Healthy');

  if (isHealthy) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        Healthy Specimen
      </span>
    );
  }

  // Determine styling based on severity level or affected percentage
  const pct = typeof percentage === 'number' ? percentage : 0;
  
  if (pct < 10 || severity?.includes('Mild')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 shadow-sm">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        Mild Severity ({pct}%)
      </span>
    );
  }

  if (pct < 25 || severity?.includes('Moderate')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-300 shadow-sm">
        <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
        Moderate Severity ({pct}%)
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300 shadow-sm">
      <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
      Severe / Critical ({pct}%)
    </span>
  );
}
