import React from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Globe,
  ArrowRight,
  ExternalLink,
  Lock,
  Search,
  Scale
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Intro */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-navy-50 text-navy text-xs font-bold mb-4 border border-navy-200">
          <HelpCircle className="w-4 h-4 text-saffron" />
          <span>Citizen Empowerment Guide</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-navy tracking-tight leading-tight">
          How CivicSetu Empowers Every Indian Citizen
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed">
          Navigating hundreds of government departments, complex eligibility criteria, and scattered gazette circulars can be overwhelming. CivicSetu simplifies this process into a clear, dignified, and transparent journey.
        </p>
      </div>

      {/* 3 Steps in Detail */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-navy text-white text-xl font-extrabold flex items-center justify-center">
            1
          </div>
          <h2 className="text-lg font-bold text-navy">Provide Minimal Profile</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Answer a few basic questions: your state, age, occupation, and household income. We never ask for Aadhaar numbers, PAN, or confidential bank credentials.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-saffron-300 ring-2 ring-saffron-100 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-saffron text-slate-950 text-xl font-extrabold flex items-center justify-center">
            2
          </div>
          <h2 className="text-lg font-bold text-navy">Deterministic Evaluation</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our engine doesn't guess or fabricate approval probabilities. It audits your profile against actual gazette rules and presents every condition that passed, failed, or requires official portal verification.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-govgreen text-white text-xl font-extrabold flex items-center justify-center">
            3
          </div>
          <h2 className="text-lg font-bold text-navy">Organize & Apply</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Generate an instant preparation checklist of required certificates and documents. Follow clear instructions and access the official government application gateway directly.
          </p>
        </div>
      </div>

      {/* Key Guiding Pillars */}
      <div className="bg-navy rounded-3xl p-8 sm:p-12 text-white space-y-8">
        <div>
          <span className="text-xs font-bold text-saffron uppercase tracking-wider block mb-1">
            Core Design Principles
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Built with Integrity, Privacy, and Accessibility
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-navy-800/80 rounded-2xl p-6 border border-navy-700">
            <Lock className="w-6 h-6 text-saffron mb-3" />
            <h3 className="text-sm font-bold text-white mb-1.5">Zero-Aadhaar Privacy</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We never collect government identity proofs. Your evaluation happens privately without risking identity data.
            </p>
          </div>

          <div className="bg-navy-800/80 rounded-2xl p-6 border border-navy-700">
            <Scale className="w-6 h-6 text-govgreen mb-3" />
            <h3 className="text-sm font-bold text-white mb-1.5">No Fabricated Approvals</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We make it clear that CivicSetu facilitates discovery. Final decision and benefit disbursement remain the sovereign prerogative of the respective ministry.
            </p>
          </div>

          <div className="bg-navy-800/80 rounded-2xl p-6 border border-navy-700">
            <Globe className="w-6 h-6 text-saffron mb-3" />
            <h3 className="text-sm font-bold text-white mb-1.5">Multilingual Access</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Designed for ordinary citizens in English, Hindi, and Telugu, with an architecture ready for all 22 official Indian languages.
            </p>
          </div>
        </div>
      </div>

      {/* Official Government Portals Reference */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-navy">Key Official Government Portals</h2>
          <p className="text-xs text-slate-500 mt-1">
            CivicSetu routes citizens to these authorized national and state portals:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <a
            href="https://www.myscheme.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-navy hover:bg-slate-100/70 transition-all flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-slate-900">myScheme Portal</div>
              <div className="text-slate-500 text-[11px]">National Scheme Aggregator</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>

          <a
            href="https://scholarships.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-navy hover:bg-slate-100/70 transition-all flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-slate-900">National Scholarship Portal (NSP)</div>
              <div className="text-slate-500 text-[11px]">Central & UGC scholarships</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>

          <a
            href="https://beneficiary.nha.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-navy hover:bg-slate-100/70 transition-all flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-slate-900">Ayushman Bharat Portal</div>
              <div className="text-slate-500 text-[11px]">NHA PM-JAY cards</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>

          <a
            href="https://pmkisan.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-navy hover:bg-slate-100/70 transition-all flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-slate-900">PM-KISAN Portal</div>
              <div className="text-slate-500 text-[11px]">Farmer income verification</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>

          <a
            href="https://sevasindhu.karnataka.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-navy hover:bg-slate-100/70 transition-all flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-slate-900">Seva Sindhu (Karnataka)</div>
              <div className="text-slate-500 text-[11px]">Gruha Lakshmi & Yuva Nidhi</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>

          <a
            href="https://rythubandhu.telangana.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-navy hover:bg-slate-100/70 transition-all flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-slate-900">Rythu Bandhu (Telangana)</div>
              <div className="text-slate-500 text-[11px]">Agriculture investment credit</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center pt-4">
        <Link
          to="/eligibility"
          className="inline-flex items-center gap-2 px-8 py-4 bg-navy hover:bg-navy-800 text-white font-bold rounded-2xl shadow-sm transition-all text-sm"
        >
          <span>Find Schemes for Me</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
