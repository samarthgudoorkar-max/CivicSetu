import React from 'react';
import { Eye, Keyboard, Type, Contrast, CheckCircle2 } from 'lucide-react';

export const Accessibility: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-50 text-navy text-xs font-bold mb-3 border border-navy-200">
          <Eye className="w-4 h-4 text-saffron" />
          <span>WCAG 2.2 AA Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight">
          Accessibility Statement
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          CivicSetu is dedicated to digital inclusion for all Indian citizens, regardless of technical literacy or device capability.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-navy flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-govgreen" />
            Our Digital Accessibility Standards
          </h2>
          <p>
            We target the <strong>Web Content Accessibility Guidelines (WCAG) 2.2 Level AA</strong> standards across all public user flows. The interface is engineered to operate comfortably for citizens using screen readers, keyboard-only navigation, and high-contrast settings.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-navy">
              <Keyboard className="w-4 h-4 text-saffron" />
              <span>Full Keyboard Navigation</span>
            </div>
            <p className="text-xs text-slate-600">
              All interactive cards, tabs, form inputs, modal dialogs, and filters are fully navigable via standard Tab, Shift+Tab, and Enter keys with clear visible focus rings.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-navy">
              <Contrast className="w-4 h-4 text-govgreen" />
              <span>Sufficient Text Contrast</span>
            </div>
            <p className="text-xs text-slate-600">
              Interface colors strictly respect 4.5:1 minimum contrast ratios for body copy and 3:1 for large headers and interactive components. We never rely solely on color to communicate eligibility status.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-navy">
              <Type className="w-4 h-4 text-navy" />
              <span>Regional Script Typography</span>
            </div>
            <p className="text-xs text-slate-600">
              We utilize Google Noto Sans Devanagari and Noto Sans Telugu fonts to ensure high legibility and correct rendering of complex ligatures across Indian regional languages.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-navy">
              <Eye className="w-4 h-4 text-slate-700" />
              <span>Screen Reader Semantic ARIA</span>
            </div>
            <p className="text-xs text-slate-600">
              Form controls include associated labels, live regions announce status changes, and descriptive button titles ensure screen readers clearly express purpose.
            </p>
          </div>
        </div>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-navy">Feedback & Reporting</h2>
          <p>
            If you encounter any barrier while accessing government scheme information on CivicSetu, please let us know so we can promptly address it.
          </p>
        </section>
      </div>
    </div>
  );
};
