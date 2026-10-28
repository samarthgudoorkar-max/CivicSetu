import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Save, RotateCcw, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchStates } from '../services/api';
import { StateInfo } from '../types';

export const Profile: React.FC = () => {
  const { i18n } = useTranslation();
  const { profile, updateProfileData, logout } = useAuth();
  const [states, setStates] = useState<StateInfo[]>([]);

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [preferredLanguage, setPreferredLanguage] = useState(profile?.preferred_language || 'en');
  const [stateCode, setStateCode] = useState(profile?.state_code || 'TG');
  const [age, setAge] = useState<number | ''>(profile?.age ?? 30);
  const [gender, setGender] = useState(profile?.gender || 'Male');
  const [occupation, setOccupation] = useState(profile?.occupation || 'Farmer');
  const [isFarmer, setIsFarmer] = useState(profile?.is_farmer ?? true);
  const [isStudent, setIsStudent] = useState(profile?.is_student ?? false);
  const [annualIncome, setAnnualIncome] = useState<number | ''>(profile?.annual_income ?? 150000);
  const [category, setCategory] = useState(profile?.category || 'General');

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadStates() {
      try {
        const sts = await fetchStates();
        setStates(sts);
      } catch (e) {
        console.error(e);
      }
    }
    loadStates();
  }, []);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPreferredLanguage(profile.preferred_language || 'en');
      setStateCode(profile.state_code || 'TG');
      if (profile.age !== undefined) setAge(profile.age);
      if (profile.gender) setGender(profile.gender);
      if (profile.occupation) setOccupation(profile.occupation);
      if (profile.is_farmer !== undefined) setIsFarmer(profile.is_farmer);
      if (profile.is_student !== undefined) setIsStudent(profile.is_student);
      if (profile.annual_income !== undefined) setAnnualIncome(profile.annual_income);
      if (profile.category) setCategory(profile.category);
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileData({
      full_name: fullName,
      preferred_language: preferredLanguage,
      state_code: stateCode,
      age: age === '' ? undefined : Number(age),
      gender,
      occupation,
      is_farmer: isFarmer,
      is_student: isStudent,
      annual_income: annualIncome === '' ? undefined : Number(annualIncome),
      category,
    });
    i18n.changeLanguage(preferredLanguage);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    if (confirm('Clear local profile and start as a new anonymous guest?')) {
      logout();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-navy uppercase tracking-wider mb-2">
          <User className="w-4 h-4 text-saffron" />
          <span>Citizen Settings</span>
        </div>
        <h1 className="text-3xl font-extrabold text-navy tracking-tight">
          Citizen Preferences & Profile
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Customize your default state, language, and criteria for instant scheme evaluation.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Preferred Interface Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-navy focus:bg-white"
              >
                <option value="en">English (English)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Default State of Residence
              </label>
              <select
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-navy focus:bg-white"
              >
                {states.filter((s) => !s.is_central).map((st) => (
                  <option key={st.code} value={st.code}>
                    {st.name} ({st.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Age
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-navy focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-navy focus:bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender">Transgender</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Occupation
              </label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-navy focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Annual Household Income (₹)
              </label>
              <input
                type="number"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value ? Number(e.target.value) : '')}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-navy focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Social Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-navy focus:bg-white"
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2.5 bg-navy hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-govgreen" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Preferences Saved!' : 'Save Preferences'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Profile Data</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
