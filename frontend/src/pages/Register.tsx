import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfileData } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName) {
      await updateProfileData({ full_name: fullName });
    }
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center">
        <div className="w-12 h-12 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
          <Landmark className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-navy">Create Citizen Account</h1>
        <p className="text-xs text-slate-500 mt-1">
          Save your preferences and organize scheme applications privately
        </p>
      </div>

      <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xs space-y-5">
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ramesh Reddy"
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-navy focus:bg-white"
              required
            />
          </div>

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
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Create Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-navy focus:bg-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-navy hover:bg-navy-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
          >
            Create Free Account
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <Link to="/login" className="text-navy font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
