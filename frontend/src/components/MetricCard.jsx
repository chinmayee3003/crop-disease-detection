import React from 'react';

export default function MetricCard({ title, value, subtitle, icon: Icon, color = 'green', trend }) {
  const colorMap = {
    green: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      iconBg: 'bg-emerald-600 text-white',
      textColor: 'text-emerald-950',
    },
    blue: {
      bg: 'bg-sky-50',
      border: 'border-sky-100',
      iconBg: 'bg-sky-600 text-white',
      textColor: 'text-sky-950',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      iconBg: 'bg-amber-600 text-white',
      textColor: 'text-amber-950',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      iconBg: 'bg-purple-600 text-white',
      textColor: 'text-purple-950',
    },
  };

  const scheme = colorMap[color] || colorMap.green;

  return (
    <div className={`p-5 rounded-2xl bg-white border ${scheme.border} shadow-sm hover:shadow-md transition-shadow relative overflow-hidden`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
          <p className={`text-2xl font-bold tracking-tight ${scheme.textColor}`}>{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center text-xs font-medium text-slate-600">
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}
