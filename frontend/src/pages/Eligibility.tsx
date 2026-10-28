import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  MapPin,
  User,
  Briefcase,
  IndianRupee,
  Lock,
  Sparkles,
  Info
} from 'lucide-react';
import { fetchStates, checkEligibility } from '../services/api';
import { StateInfo, CitizenProfile } from '../types';
import { useAuth } from '../context/AuthContext';

export const Eligibility: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetSchemeSlug = searchParams.get('scheme') || undefined;

  const { profile, updateProfileData, userId } = useAuth();
  const [states, setStates] = useState<StateInfo[]>([]);

  // Step state: 1 to 4
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [stateCode, setStateCode] = useState(profile?.state_code || 'TG');
  const [age, setAge] = useState<number | ''>(profile?.age || 30);
  const [gender, setGender] = useState(profile?.gender || 'Male');
  const [occupation, setOccupation] = useState(profile?.occupation || 'Farmer');
  const [isStudent, setIsStudent] = useState<boolean>(profile?.is_student ?? false);
  const [isFarmer, setIsFarmer] = useState<boolean>(profile?.is_farmer ?? true);
  const [annualIncome, setAnnualIncome] = useState<number | ''>(profile?.annual_income || 150000);
  const [category, setCategory] = useState(profile?.category || 'General');

  useEffect(() => {
    async function loadStates() {
      try {
        const sts = await fetchStates();
        setStates(sts);
      } catch (err) {
        console.error('Failed to load states', err);
      }
    }
    loadStates();
  }, []);

  // Update local state when profile changes
  useEffect(() => {
    if (profile) {
      if (profile.state_code) setStateCode(profile.state_code);
      if (profile.age !== undefined) setAge(profile.age);
      if (profile.gender) setGender(profile.gender);
      if (profile.occupation) setOccupation(profile.occupation);
      if (profile.is_student !== undefined) setIsStudent(profile.is_student);
      if (profile.is_farmer !== undefined) setIsFarmer(profile.is_farmer);
      if (profile.annual_income !== undefined) setAnnualIncome(profile.annual_income);
      if (profile.category) setCategory(profile.category);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submissionData: Partial<CitizenProfile> = {
      state_code: stateCode,
      age: age === '' ? undefined : Number(age),
      gender,
      occupation,
      is_student: isStudent,
      is_farmer: isFarmer,
      annual_income: annualIncome === '' ? undefined : Number(annualIncome),
      category,
    };

    // Save profile preferences in background
    try {
      await updateProfileData(submissionData);
    } catch (e) {
      console.warn('Profile update silent error', e);
    }

    try {
      // Evaluate against backend deterministic rule engine
      const results = await checkEligibility(submissionData, targetSchemeSlug, userId);
      // Pass results in history state
      navigate('/results', {
        state: {
          results,
          profileData: submissionData,
          targetSchemeSlug,
        },
      });
    } catch (err) {
      console.error(err);
      navigate('/results', {
        state: {
          profileData: submissionData,
          targetSchemeSlug,
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, title: 'Residence', icon: MapPin },
    { num: 2, title: 'Demographics', icon: User },
    { num: 3, title: 'Occupation', icon: Briefcase },
    { num: 4, title: 'Income & Social', icon: IndianRupee },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 border border-saffron-200 text-saffron-800 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-saffron" />
          <span>Deterministic Eligibility Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-navy tracking-tight">
          {t('eligibility.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed">
          {t('eligibility.subtitle')}
        </p>

        {targetSchemeSlug && (
          <div className="mt-4 inline-flex items-center gap-2 bg-navy-50 text-navy text-xs font-semibold px-3 py-1.5 rounded-lg border border-navy-200">
            <span>Evaluating specifically for scheme: <strong>{targetSchemeSlug}</strong></span>
          </div>
        )}
      </div>

      {/* Zero Aadhaar Trust Guarantee Banner */}
      <div className="bg-govgreen-50 border border-govgreen-200 rounded-2xl p-4 mb-8 flex items-center justify-between text-xs text-govgreen-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-govgreen shrink-0" />
          <span>
            <strong>Zero-Aadhaar Privacy Commitment:</strong> We never request Aadhaar numbers, bank account numbers, or upload documents during eligibility discovery.
          </span>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-navy -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${((step - 1) / (stepsList.length - 1)) * 100}%` }}
          />

          {stepsList.map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => s.num < step && setStep(s.num)}
                  disabled={s.num > step}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-govgreen text-white shadow-xs'
                      : isCurrent
                      ? 'bg-navy text-white ring-4 ring-navy-100 shadow-sm'
                      : 'bg-white text-slate-400 border-2 border-slate-300'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </button>
                <span
                  className={`text-[11px] font-semibold mt-2 hidden sm:block ${
                    isCurrent ? 'text-navy font-bold' : 'text-slate-500'
                  }`}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit}>
          {/* STEP 1: RESIDENCE */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-lg font-bold text-navy mb-1 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-saffron" />
                  Where do you reside?
                </h2>
                <p className="text-xs text-slate-500">
                  Many welfare schemes have state-specific benefits or domicile criteria.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  State or Union Territory
                </label>
                <select
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-navy focus:bg-white text-slate-800"
                >
                  {states.filter((s) => !s.is_central).map((st) => (
                    <option key={st.code} value={st.code}>
                      {st.name} ({st.code})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-2">
                  Note: Central Government schemes apply uniformly regardless of state.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: DEMOGRAPHICS */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-lg font-bold text-navy mb-1 flex items-center gap-2">
                  <User className="w-5 h-5 text-saffron" />
                  Your Age & Gender
                </h2>
                <p className="text-xs text-slate-500">
                  Several pension, youth, and child-welfare schemes enforce specific age eligibility windows.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Current Age (in completed years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="110"
                    value={age}
                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                    className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-navy focus:bg-white text-slate-800"
                    placeholder="e.g. 24"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-navy focus:bg-white text-slate-800"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: OCCUPATION & STATUS */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-lg font-bold text-navy mb-1 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-saffron" />
                  Occupation & Academic Status
                </h2>
                <p className="text-xs text-slate-500">
                  Select your primary occupation. We use this to evaluate targeted agricultural, student, or self-employment programs.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Primary Occupation
                </label>
                <select
                  value={occupation}
                  onChange={(e) => {
                    const val = e.target.value;
                    setOccupation(val);
                    if (val === 'Farmer') setIsFarmer(true);
                    if (val === 'Student') setIsStudent(true);
                  }}
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-navy focus:bg-white text-slate-800"
                >
                  <option value="Farmer">Farmer / Agricultural Landholder</option>
                  <option value="Agricultural Labourer">Agricultural Labourer</option>
                  <option value="Student">Actively Enrolled Student</option>
                  <option value="Street Vendor">Street Vendor / Micro-merchant</option>
                  <option value="Small Business Owner">Small Business Owner / Artisan</option>
                  <option value="Unemployed Graduate">Unemployed Graduate / Seeking Employment</option>
                  <option value="Homemaker">Homemaker</option>
                  <option value="Salaried Employee">Salaried / Private Worker</option>
                  <option value="Other">Other / Self-employed</option>
                </select>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={isFarmer}
                    onChange={(e) => setIsFarmer(e.target.checked)}
                    className="w-4 h-4 text-navy rounded border-slate-300 focus:ring-navy"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">Cultivable Landholder / Farmer</span>
                    <span className="text-slate-500">I or my family hold agricultural land in revenue records.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={isStudent}
                    onChange={(e) => setIsStudent(e.target.checked)}
                    className="w-4 h-4 text-navy rounded border-slate-300 focus:ring-navy"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">Currently Enrolled Student</span>
                    <span className="text-slate-500">Enrolled in school, college, diploma, or higher university degree.</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: INCOME & SOCIAL CATEGORY */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-lg font-bold text-navy mb-1 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-saffron" />
                  Household Income & Category
                </h2>
                <p className="text-xs text-slate-500">
                  Many welfare schemes have annual income ceilings or are reserved for specific social categories.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Approximate Annual Household Income (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value ? Number(e.target.value) : '')}
                    className="w-full pl-8 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-navy focus:bg-white text-slate-800"
                    placeholder="e.g. 150000"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {[100000, 200000, 300000, 500000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAnnualIncome(preset)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-600 transition-colors"
                    >
                      ₹{(preset / 100000).toFixed(0)} Lakh
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Social Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-navy focus:bg-white text-slate-800"
                >
                  <option value="General">General / Open</option>
                  <option value="OBC">Other Backward Class (OBC)</option>
                  <option value="SC">Scheduled Caste (SC)</option>
                  <option value="ST">Scheduled Tribe (ST)</option>
                  <option value="EWS">Economically Weaker Section (EWS)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-2">
                  Category is strictly used to evaluate targeted scholarships and social welfare schemes.
                </p>
              </div>
            </div>
          )}

          {/* Stepper Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('eligibility.back')}</span>
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 bg-navy hover:bg-navy-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>{t('eligibility.next')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-3 bg-govgreen hover:bg-govgreen-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t('eligibility.calculating')}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('eligibility.submit')}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
