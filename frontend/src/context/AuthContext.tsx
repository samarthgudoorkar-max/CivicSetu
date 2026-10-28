import React, { createContext, useContext, useState, useEffect } from 'react';
import { CitizenProfile } from '../types';
import { fetchProfile, saveProfile } from '../services/api';

interface DemoPersona {
  id: string;
  name: string;
  role: string;
  state: string;
  profile: Partial<CitizenProfile>;
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: 'demo-farmer-tg',
    name: 'Ramesh Reddy',
    role: 'Small Landholding Farmer',
    state: 'Telangana',
    profile: {
      user_id: 'demo-farmer-tg',
      full_name: 'Ramesh Reddy',
      state_code: 'TG',
      age: 42,
      gender: 'Male',
      occupation: 'Farmer',
      is_farmer: true,
      is_student: false,
      annual_income: 140000,
      category: 'OBC'
    }
  },
  {
    id: 'demo-student-mh',
    name: 'Neha Patil',
    role: 'College Student (Engineering)',
    state: 'Maharashtra',
    profile: {
      user_id: 'demo-student-mh',
      full_name: 'Neha Patil',
      state_code: 'MH',
      age: 20,
      gender: 'Female',
      occupation: 'Student',
      is_farmer: false,
      is_student: true,
      annual_income: 220000,
      category: 'SC'
    }
  },
  {
    id: 'demo-woman-ka',
    name: 'Lakshmi Gowda',
    role: 'Homemaker & Head of Family',
    state: 'Karnataka',
    profile: {
      user_id: 'demo-woman-ka',
      full_name: 'Lakshmi Gowda',
      state_code: 'KA',
      age: 38,
      gender: 'Female',
      occupation: 'Homemaker',
      is_farmer: false,
      is_student: false,
      annual_income: 180000,
      category: 'General'
    }
  },
  {
    id: 'demo-youth-up',
    name: 'Amit Sharma',
    role: 'Micro-entrepreneur / Street Vendor',
    state: 'Uttar Pradesh',
    profile: {
      user_id: 'demo-youth-up',
      full_name: 'Amit Sharma',
      state_code: 'UP',
      age: 26,
      gender: 'Male',
      occupation: 'Street Vendor',
      is_farmer: false,
      is_student: false,
      annual_income: 160000,
      category: 'General'
    }
  }
];

interface AuthContextType {
  userId: string;
  profile: CitizenProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setProfile: (profile: CitizenProfile) => void;
  updateProfileData: (data: Partial<CitizenProfile>) => Promise<CitizenProfile>;
  switchPersona: (personaId: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string>(() => {
    return localStorage.getItem('civicsetu_user_id') || 'demo-farmer-tg';
  });
  const [profile, setProfileState] = useState<CitizenProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initProfile() {
      setIsLoading(true);
      try {
        const p = await fetchProfile(userId);
        if (p) {
          setProfileState(p);
        } else {
          // Initialize demo persona default if matching
          const matched = DEMO_PERSONAS.find((d) => d.id === userId);
          if (matched) {
            const created = await saveProfile({
              user_id: matched.id,
              ...matched.profile,
            } as CitizenProfile);
            setProfileState(created);
          } else {
            setProfileState({ user_id: userId, preferred_language: 'en' });
          }
        }
      } catch (err) {
        console.warn('Using local profile fallback:', err);
        const matched = DEMO_PERSONAS.find((d) => d.id === userId);
        setProfileState((matched ? matched.profile : { user_id: userId }) as CitizenProfile);
      } finally {
        setIsLoading(false);
      }
    }

    localStorage.setItem('civicsetu_user_id', userId);
    initProfile();
  }, [userId]);

  const updateProfileData = async (data: Partial<CitizenProfile>) => {
    const updated: CitizenProfile = {
      ...(profile || { user_id: userId }),
      ...data,
      user_id: userId,
    };
    try {
      const saved = await saveProfile(updated);
      setProfileState(saved);
      return saved;
    } catch {
      setProfileState(updated);
      return updated;
    }
  };

  const switchPersona = async (personaId: string) => {
    const matched = DEMO_PERSONAS.find((d) => d.id === personaId);
    if (matched) {
      setUserId(matched.id);
      localStorage.setItem('civicsetu_user_id', matched.id);
    }
  };

  const logout = () => {
    const newGuest = 'guest-' + Math.random().toString(36).substring(2, 8);
    setUserId(newGuest);
    setProfileState({ user_id: newGuest });
    localStorage.setItem('civicsetu_user_id', newGuest);
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        profile,
        isAuthenticated: true,
        isLoading,
        setProfile: setProfileState,
        updateProfileData,
        switchPersona,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
