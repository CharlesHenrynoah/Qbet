import React, { useState, useEffect } from 'react';
import { X, Building2, Phone } from 'lucide-react';
import { SubscriptionSidebar } from './SubscriptionSidebar';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onSignup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    company: string,
    phone: string,
    plan: string
  ) => void;
  initialMode?: boolean;
}

export function AuthModal({ isOpen, onClose, onLogin, onSignup, initialMode = true }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [error, setError] = useState('');
  const [showPlans, setShowPlans] = useState(false);

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

              <div className="flex items-center justify-between pt-4">
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
                <button
                  type="submit"
                  className="px-8 py-3 bg-mono-50 text-mono-900 rounded-lg hover:bg-mono-200 transition-colors font-orbitron min-w-[200px]"
                >
                  {isLoginMode ? 'Login' : 'Continue to select plan'}
                </button>
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