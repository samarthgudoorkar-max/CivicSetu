import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Landmark,
  Globe,
  Menu,
  X,
  Compass,
  CheckCircle2,
  HelpCircle,
  Bookmark,
  FileCheck,
  User,
  LayoutDashboard
} from 'lucide-react';
import { TricolorBar } from './TricolorBar';
import { useAuth, DEMO_PERSONAS } from '../../context/AuthContext';
import { useSavedSchemes } from '../../context/SavedSchemesContext';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { profile, userId, switchPersona } = useAuth();
  const { savedIds } = useSavedSchemes();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [personaMenuOpen, setPersonaMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const navLinks = [
    { to: '/schemes', label: t('nav.explore'), icon: Compass },
    { to: '/eligibility', label: t('nav.checkEligibility'), icon: CheckCircle2 },
    { to: '/how-it-works', label: t('nav.howItWorks'), icon: HelpCircle },
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
  ];

  const currentPersona = DEMO_PERSONAS.find((p) => p.id === userId);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Brand Identity */}
          <Link
            to="/"
            className="flex items-center gap-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 rounded-xl group"
            aria-label="CivicSetu Home"
          >
            {/* Government-building icon inside navy rounded square */}
            <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center shadow-sm group-hover:bg-navy-800 transition-colors">
              <Landmark className="w-7 h-7 text-white" strokeWidth={2.2} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-navy">CivicSetu</span>
                <span className="w-2 h-2 rounded-full bg-saffron inline-block"></span>
              </div>
              <span className="text-xs font-medium text-slate-500 tracking-wide">
                {t('app.tagline')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-navy text-white shadow-sm'
                      : 'text-slate-700 hover:text-navy hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-3">
            {/* Saved Schemes Counter */}
            <Link
              to="/saved"
              className="relative p-2.5 rounded-lg text-slate-700 hover:text-navy hover:bg-slate-100 transition-colors"
              title="Saved Schemes"
              aria-label="Saved Schemes"
            >
              <Bookmark className="w-5 h-5" />
              {savedIds.size > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-saffron text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {savedIds.size}
                </span>
              )}
            </Link>

            {/* Application Checklists */}
            <Link
              to="/applications"
              className="p-2.5 rounded-lg text-slate-700 hover:text-navy hover:bg-slate-100 transition-colors"
              title="Application Checklists"
              aria-label="Application Checklists"
            >
              <FileCheck className="w-5 h-5" />
            </Link>

            {/* Language Selector */}
            <div className="relative flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 rounded transition-colors ${
                  i18n.language.startsWith('en')
                    ? 'bg-white text-navy shadow-xs font-bold'
                    : 'text-slate-600 hover:text-navy'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('hi')}
                className={`px-2 py-1 rounded transition-colors ${
                  i18n.language.startsWith('hi')
                    ? 'bg-white text-navy shadow-xs font-bold'
                    : 'text-slate-600 hover:text-navy'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => changeLanguage('te')}
                className={`px-2 py-1 rounded transition-colors ${
                  i18n.language.startsWith('te')
                    ? 'bg-white text-navy shadow-xs font-bold'
                    : 'text-slate-600 hover:text-navy'
                }`}
              >
                తెలుగు
              </button>
            </div>

            {/* Citizen Persona Dropdown / Quick Switch */}
            <div className="relative">
              <button
                onClick={() => setPersonaMenuOpen(!personaMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-navy-300 rounded-xl text-left transition-colors focus:outline-none focus:ring-2 focus:ring-navy"
                aria-expanded={personaMenuOpen}
                aria-label="Citizen Persona Switcher"
              >
                <div className="w-8 h-8 rounded-lg bg-navy-100 text-navy font-bold text-xs flex items-center justify-center">
                  {profile?.full_name ? profile.full_name.charAt(0) : 'C'}
                </div>
                <div className="hidden lg:block text-xs">
                  <div className="font-semibold text-slate-900 leading-tight">
                    {profile?.full_name || 'Citizen User'}
                  </div>
                  <div className="text-slate-500 text-[11px] leading-tight">
                    {profile?.state_code ? `${profile.state_code} Resident` : 'Citizen Demo'}
                  </div>
                </div>
              </button>

              {personaMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Demo Citizen Personas
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Switch personas to test real-world eligibility scenarios:
                    </p>
                  </div>
                  <div className="py-1">
                    {DEMO_PERSONAS.map((persona) => (
                      <button
                        key={persona.id}
                        onClick={() => {
                          switchPersona(persona.id);
                          setPersonaMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs hover:bg-slate-50 flex items-start justify-between ${
                          userId === persona.id ? 'bg-navy-50 text-navy font-semibold' : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{persona.name}</div>
                          <div className="text-slate-500 text-[11px]">{persona.role} • {persona.state}</div>
                        </div>
                        {userId === persona.id && (
                          <span className="w-2 h-2 rounded-full bg-govgreen mt-1"></span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 px-4 py-2 flex items-center justify-between">
                    <Link
                      to="/profile"
                      onClick={() => setPersonaMenuOpen(false)}
                      className="text-xs font-medium text-navy hover:underline flex items-center gap-1"
                    >
                      <User className="w-3.5 h-3.5" />
                      Edit My Profile
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setPersonaMenuOpen(false)}
                      className="text-xs font-medium text-slate-500 hover:text-slate-700"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/saved"
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 relative"
              aria-label="Saved Schemes"
            >
              <Bookmark className="w-5 h-5" />
              {savedIds.size > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-saffron text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {savedIds.size}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-navy hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-navy"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Tricolor Accent Bar */}
      <TricolorBar />

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
          {/* Language selector for mobile */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-slate-500" /> Language:
            </span>
            <div className="flex gap-1 text-xs">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2.5 py-1 rounded font-semibold ${
                  i18n.language.startsWith('en') ? 'bg-navy text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                English
              </button>
              <button
                onClick={() => changeLanguage('hi')}
                className={`px-2.5 py-1 rounded font-semibold ${
                  i18n.language.startsWith('hi') ? 'bg-navy text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => changeLanguage('te')}
                className={`px-2.5 py-1 rounded font-semibold ${
                  i18n.language.startsWith('te') ? 'bg-navy text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                తెలుగు
              </button>
            </div>
          </div>

          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                    isActive ? 'bg-navy text-white' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/saved"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              <Bookmark className="w-5 h-5" />
              {t('nav.saved')} ({savedIds.size})
            </Link>
            <Link
              to="/applications"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              <FileCheck className="w-5 h-5" />
              {t('nav.applications')}
            </Link>
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              <User className="w-5 h-5" />
              {t('nav.profile')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
