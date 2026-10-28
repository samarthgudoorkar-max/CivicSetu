import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server, Database } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-govgreen-50 text-govgreen-800 text-xs font-bold mb-3 border border-govgreen-200">
          <ShieldCheck className="w-4 h-4 text-govgreen" />
          <span>Privacy & Data Protection Policy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight">
          Your Privacy is Our Sovereign Trust
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Effective Date: October 2026 • CivicSetu Citizen Charter
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-navy flex items-center gap-2">
            <Lock className="w-4 h-4 text-govgreen" />
            1. Zero-Aadhaar & Zero-Document Guarantee
          </h2>
          <p>
            CivicSetu is designed from the ground up for safe discovery. <strong>We do not request, store, or process:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>12-digit Aadhaar numbers or Aadhaar biometric data</li>
            <li>Permanent Account Numbers (PAN)</li>
            <li>Bank account numbers or IFSC credentials</li>
            <li>Uploaded scans of identity documents or ration cards</li>
          </ul>
          <p>
            All actual identity checks and document submissions take place solely on authorized Government of India or State Government portals (e.g. pmkisan.gov.in, scholarships.gov.in).
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-navy flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-navy" />
            2. Minimal Data Collection Principle
          </h2>
          <p>
            We only collect basic demographic ranges (such as state, broad age, occupation, and approximate income bracket) strictly to run the deterministic eligibility rule evaluator. This data is never rented, monetized, or sold to third-party commercial brokers or advertisers.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-navy flex items-center gap-2">
            <Server className="w-4 h-4 text-saffron" />
            3. Local Storage & Ephemeral Guest Sessions
          </h2>
          <p>
            By default, your saved schemes and preparation checklists are stored in your browser's local cache or private guest session. You can clear all stored preferences instantly at any time from your Profile page.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-navy flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-700" />
            4. Official-Source Integrity
          </h2>
          <p>
            Every government scheme featured on CivicSetu is accompanied by its authentic ministerial department source URL and last verified date. We maintain documentation integrity and never invent government programs or subsidies.
          </p>
        </section>
      </div>
    </div>
  );
};
