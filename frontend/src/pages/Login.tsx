import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth, DEMO_PERSONAS } from '../context/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { switchPersona } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login and navigate to dashboard
    navigate('/dashboard');
  };

  const handleDemoSelect = async (personaId: string) => {
    await switchPersona(personaId);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Brand Header */}
      <div className="text-center">
        <div className="w-12 h-12 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
          <Landmark className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-navy">Sign In to CivicSetu</h1>
        <p className="text-xs text-slate-500 mt-1">
          Access your saved schemes, application checklists, and eligibility profiles
        </p>
      </div>

      {/* One-Click Demo Personas for Quick Evaluation */}
      <div className="bg-saffron-50/60 border border-saffron-200 rounded-3xl p-5 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-saffron-900 uppercase tracking-wider">
          <User className="w-4 h-4 text-saffron-700" />
          <span>Instant Evaluator Demo Personas</span>
        </div>
        <p className="text-[11px] text-slate-600">
          No sign-up required. Choose a test profile to see tailored eligibility results:
        </p>

        <div className="space-y-2 pt-1">
          {DEMO_PERSONAS.map((persona) => (
            <button
              key={persona.id}
              onClick={() => handleDemoSelect(persona.id)}
              className="w-full text-left p-3 rounded-xl bg-white border border-saffron-200 hover:border-navy hover:shadow-xs transition-all flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-navy">
                  {persona.name}
                </div>
                <div className="text-[11px] text-slate-500">
                  {persona.role} • {persona.state}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-navy transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Standard Form */}
      <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xs space-y-5">
        <form onSubmit={handleStandardLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="citizen@example.in"
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-navy focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-navy focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-navy hover:bg-navy-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
          >
            Sign In with Email
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account?{' '}
          <Link to="/register" className="text-navy font-bold hover:underline">
            Register for Free
          </Link>
        </div>
      </div>
    </div>
  );
};
