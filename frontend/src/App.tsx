import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { SavedSchemesProvider } from './context/SavedSchemesContext';
import { Layout } from './components/layout/Layout';

// Pages
import { Home } from './pages/Home';
import { Schemes } from './pages/Schemes';
import { SchemeDetail } from './pages/SchemeDetail';
import { Eligibility } from './pages/Eligibility';
import { Results } from './pages/Results';
import { Dashboard } from './pages/Dashboard';
import { Saved } from './pages/Saved';
import { Applications } from './pages/Applications';
import { HowItWorks } from './pages/HowItWorks';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Privacy } from './pages/Privacy';
import { Accessibility } from './pages/Accessibility';
import { NotFound } from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SavedSchemesProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="schemes" element={<Schemes />} />
                <Route path="schemes/:slug" element={<SchemeDetail />} />
                <Route path="eligibility" element={<Eligibility />} />
                <Route path="results" element={<Results />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="saved" element={<Saved />} />
                <Route path="applications" element={<Applications />} />
                <Route path="how-it-works" element={<HowItWorks />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="profile" element={<Profile />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="accessibility" element={<Accessibility />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </HashRouter>
        </SavedSchemesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
