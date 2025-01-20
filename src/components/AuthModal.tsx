import React, { useState, useEffect } from 'react';
import { X, Building2, Phone } from 'lucide-react';
import { SubscriptionSidebar } from './SubscriptionSidebar';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onGoogleLogin: () => void;
  onSignup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    company: string,
    sector: string,
    phone: string,
    plan: string
  ) => void;
  initialMode?: boolean;
}

export function AuthModal({ isOpen, onClose, onLogin, onGoogleLogin, onSignup, initialMode = true }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [sector, setSector] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [error, setError] = useState('');
  const [showPlans, setShowPlans] = useState(false);

  const sectors = [
    "Technology",
    "Healthcare",
    "Finance & Banking",
    "Education",
    "Manufacturing",
    "Retail & E-commerce",
    "Media & Entertainment",
    "Real Estate",
    "Travel & Hospitality",
    "Automotive",
    "Energy & Utilities",
    "Agriculture",
    "Construction",
    "Consulting",
    "Legal Services",
    "Transportation & Logistics",
    "Telecommunications",
    "Food & Beverage",
    "Non-Profit",
    "Other"
  ];

  useEffect(() => {
    if (isOpen) {
      setError('');
      setShowPlans(false);
      if (!initialMode) {
        setIsLoginMode(false);
      }
    }
  }, [isOpen, initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLoginMode) {
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }
      try {
        await onLogin(email, password);
      } catch (err) {
        setError('Login error');
      }
    } else {
      if (!email || !password || !confirmPassword || !firstName || !lastName) {
        setError('Please fill in all required fields');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }

      setShowPlans(true);
    }
  };

  const handlePlanConfirm = async () => {
    try {
      await onSignup(
        email,
        password,
        firstName,
        lastName,
        company,
        sector,
        phone,
        selectedPlan
      );
    } catch (err) {
      setError('Registration error');
      setShowPlans(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-40 ${showPlans ? 'pointer-events-none' : ''}`}>
        <div className="bg-mono-800 rounded-lg shadow-xl w-full max-w-5xl relative overflow-hidden">
          <div className="p-6 border-b border-mono-700 flex items-center justify-between">
            <h2 className="text-xl font-orbitron text-mono-50">
              {isLoginMode ? 'Login' : 'Create Account'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-mono-400 hover:text-mono-50 transition-colors rounded-lg hover:bg-mono-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {isLoginMode ? (
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-mono-200 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-mono-900 border border-mono-700 rounded-lg focus:ring-1 focus:ring-mono-600 focus:border-mono-600 text-mono-50"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mono-200 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-mono-900 border border-mono-700 rounded-lg focus:ring-1 focus:ring-mono-600 focus:border-mono-600 text-mono-50"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-mono-200 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-3 py-2 bg-mono-900 border border-mono-700 rounded-lg focus:ring-1 focus:ring-mono-600 focus:border-mono-600 text-mono-50"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-mono-200 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-3 py-2 bg-mono-900 border border-mono-700 rounded-lg focus:ring-1 focus:ring-mono-600 focus:border-mono-600 text-mono-50"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-mono-200 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-mono-900 border border-mono-700 rounded-lg focus:ring-1 focus:ring-mono-600 focus:border-mono-600 text-mono-50"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-mono-200 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-mono-900 border border-mono-700 rounded-lg focus:ring-1 focus:ring-mono-600 focus:border-mono-600 text-mono-50"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-mono-200 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-mono-900 border border-mono-700 rounded-lg focus:ring-1 focus:ring-mono-600 focus:border-mono-600 text-mono-50"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mono-200 mb-1">
                      Company (optional)
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-mono-400" />
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-mono-900 border border-mono-700 rounded-lg focus:ring-1 focus:ring-mono-600 focus:border-mono-600 text-mono-50"
                        placeholder="Company name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mono-200 mb-1">
                      Sector (optional)
                    </label>
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-mono-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <select
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-mono-900 border border-mono-700 rounded-lg focus:ring-1 focus:ring-mono-600 focus:border-mono-600 text-mono-50 appearance-none cursor-pointer"
                      >
                        <option value="">Select a sector</option>
                        {sectors.map((s) => (
                          <option key={s} value={s} className="bg-mono-900">
                            {s}
                          </option>
                        ))}
                      </select>
                      <svg 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-mono-400 pointer-events-none"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mono-200 mb-1">
                      Phone (optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-mono-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-mono-900 border border-mono-700 rounded-lg focus:ring-1 focus:ring-mono-600 focus:border-mono-600 text-mono-50"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <div className="flex flex-col items-center">
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                  <button
                    type="submit"
                    className="w-full sm:w-[200px] px-6 py-3 bg-mono-50 text-mono-900 rounded-lg hover:bg-mono-200 transition-colors font-orbitron"
                  >
                    Continue
                  </button>

                  <div className="hidden sm:flex items-center">
                    <div className="w-px h-8 bg-mono-700"></div>
                  </div>

                  <button
                    type="button"
                    onClick={onGoogleLogin}
                    className="w-full sm:w-[200px] px-6 py-3 bg-mono-900 text-mono-50 rounded-lg border border-mono-700 hover:bg-mono-700 transition-colors font-orbitron flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </button>
                </div>

                <div className="flex items-center justify-center mt-4">
                  <p className="text-sm text-mono-400">
                    {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button
                      type="button"
                      onClick={() => setIsLoginMode(!isLoginMode)}
                      className="text-mono-50 hover:text-mono-200 transition-colors"
                    >
                      {isLoginMode ? 'Sign up' : 'Login'}
                    </button>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <SubscriptionSidebar
        isOpen={showPlans}
        onClose={() => {
          setShowPlans(false);
          setError('');
        }}
        selectedPlan={selectedPlan}
        onSelectPlan={setSelectedPlan}
        onConfirm={handlePlanConfirm}
      />
    </>
  );
}