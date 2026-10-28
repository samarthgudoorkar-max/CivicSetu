import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchSavedSchemes, toggleSaveScheme } from '../services/api';
import { Scheme } from '../types';

interface SavedSchemesContextType {
  savedIds: Set<string>;
  savedSchemes: Scheme[];
  isLoading: boolean;
  isSaved: (schemeId: string, slug?: string) => boolean;
  toggleSave: (schemeId: string, schemeSlug?: string) => Promise<boolean>;
  refreshSaved: () => Promise<void>;
}

const SavedSchemesContext = createContext<SavedSchemesContextType | undefined>(undefined);

export const SavedSchemesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId } = useAuth();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [savedSlugs, setSavedSlugs] = useState<Set<string>>(new Set());
  const [savedSchemes, setSavedSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshSaved = async () => {
    setIsLoading(true);
    try {
      const schemes = await fetchSavedSchemes(userId);
      setSavedSchemes(schemes);
      setSavedIds(new Set(schemes.map((s) => s.id)));
      setSavedSlugs(new Set(schemes.map((s) => s.slug)));
    } catch (e) {
      console.warn('Failed to load saved schemes', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSaved();
  }, [userId]);

  const isSaved = (schemeId: string, slug?: string) => {
    if (savedIds.has(schemeId)) return true;
    if (slug && savedSlugs.has(slug)) return true;
    return false;
  };

  const toggleSave = async (schemeId: string, schemeSlug?: string): Promise<boolean> => {
    // Optimistic update
    const alreadySaved = isSaved(schemeId, schemeSlug);
    const nextSaved = !alreadySaved;

    const newIds = new Set(savedIds);
    const newSlugs = new Set(savedSlugs);

    if (nextSaved) {
      newIds.add(schemeId);
      if (schemeSlug) newSlugs.add(schemeSlug);
    } else {
      newIds.delete(schemeId);
      if (schemeSlug) newSlugs.delete(schemeSlug);
    }

    setSavedIds(newIds);
    setSavedSlugs(newSlugs);

    try {
      const res = await toggleSaveScheme(schemeId, userId);
      // Background refresh list to keep full records in sync
      refreshSaved();
      return res.saved;
    } catch {
      // Revert if error
      refreshSaved();
      return alreadySaved;
    }
  };

  return (
    <SavedSchemesContext.Provider
      value={{
        savedIds,
        savedSchemes,
        isLoading,
        isSaved,
        toggleSave,
        refreshSaved,
      }}
    >
      {children}
    </SavedSchemesContext.Provider>
  );
};

export const useSavedSchemes = () => {
  const context = useContext(SavedSchemesContext);
  if (!context) throw new Error('useSavedSchemes must be used within SavedSchemesProvider');
  return context;
};
