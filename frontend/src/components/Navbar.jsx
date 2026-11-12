import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Sprout,
  ScanLine,
  Layers,
  FileText,
  BookOpen,
  History,
  Info,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: Sprout },
    { name: 'Disease Detection', path: '/detect', icon: ScanLine },
    { name: 'Image Processing', path: '/processing', icon: Layers },
    { name: 'Analysis Results', path: '/results', icon: FileText },
    { name: 'Disease Information', path: '/diseases', icon: BookOpen },
    { name: 'Detection History', path: '/history', icon: History },
    { name: 'About Project', path: '/about', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                AgriVision <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">DIP</span>
              </span>
              <p className="text-[11px] font-medium text-slate-500 -mt-0.5">
                Crop Disease Detection Engine
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 shadow-xs'
                        : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          {/* CTA Button & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <Link
              to="/detect"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all hover:shadow-lg hover:shadow-emerald-600/30 active:scale-95"
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span>Scan Crop</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-1 shadow-xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-700'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-emerald-600" />
                  <span>{link.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </NavLink>
            );
          })}
          <div className="pt-2">
            <Link
              to="/detect"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow-md shadow-emerald-600/20"
            >
              <ScanLine className="w-4 h-4" />
              <span>Launch Disease Detection</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
