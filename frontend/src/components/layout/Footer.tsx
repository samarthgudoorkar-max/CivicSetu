import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Landmark, ShieldAlert, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800" aria-label="Site Footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Identity & Purpose */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center border border-navy-400">
                <Landmark className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">CivicSetu</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('footer.aboutText')}
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-saffron-300">
              <span className="w-2 h-2 rounded-full bg-govgreen animate-pulse"></span>
              <span>100% Free & Open Citizen Utility</span>
            </div>
          </div>

          {/* Col 2: Discovery */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Scheme Discovery
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/schemes" className="hover:text-white transition-colors">
                  All Central & State Schemes
                </Link>
              </li>
              <li>
                <Link to="/schemes?level=central" className="hover:text-white transition-colors">
                  Central Government Initiatives
                </Link>
              </li>
              <li>
                <Link to="/schemes?category=Agriculture" className="hover:text-white transition-colors">
                  Farmer & Agriculture Schemes
                </Link>
              </li>
              <li>
                <Link to="/schemes?category=Education" className="hover:text-white transition-colors">
                  Student Scholarships
                </Link>
              </li>
              <li>
                <Link to="/schemes?category=Healthcare" className="hover:text-white transition-colors">
                  Healthcare & Hospitalization
                </Link>
              </li>
              <li>
                <Link to="/schemes?category=Women%20%26%20Child%20Welfare" className="hover:text-white transition-colors">
                  Women & Child Welfare
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Citizen Tools */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Citizen Tools
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/eligibility" className="hover:text-white transition-colors flex items-center gap-1.5 text-saffron-400 font-medium">
                  Eligibility Assessment Engine
                </Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-white transition-colors">
                  Document Checklist Tracker
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Citizen Dashboard
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How CivicSetu Works
                </Link>
              </li>
              <li>
                <a
                  href="https://www.myscheme.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1 text-slate-400"
                >
                  myScheme Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Transparency */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Trust & Transparency
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy & Zero-Aadhaar Guarantee
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="hover:text-white transition-colors">
                  Accessibility Statement (WCAG 2.2)
                </Link>
              </li>
              <li>
                <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 mt-3 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Non-Affiliation Notice</span>
                  </div>
                  {t('app.disclaimer')}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="leading-relaxed text-center md:text-left">
            © {new Date().getFullYear()} {t('footer.copyright')} All scheme data verified from official gazettes and departmental portals.
          </p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted for Indian Citizens with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
