import React, { useState, useEffect } from 'react';
import { X, Building2, Phone, Upload, UserCircle } from 'lucide-react';

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
    plan: string,
    profilePicture?: File
  ) => void;
  initialMode?: boolean;
}

const plans = [
  {
    name: 'Free',
    price: 0,
    features: ['1 user', '1GB storage', 'Limited features'],
    isPopular: false,
  },
  {
    name: 'Pro',
    price: 9.99,
    features: ['5 users', '10GB storage', 'All features'],
    isPopular: true,
  },
  {
    name: 'Enterprise',
    price: 49.99,
    features: ['Unlimited users', '100GB storage', 'All features'],
    isPopular: false,
  },
];

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
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
        selectedPlan,
        profilePicture
      );
    } catch (err) {
      setError('Registration error');
      setShowPlans(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-mono-900 rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-mono-400 hover:text-mono-50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-4">
          <h2 className="text-base font-orbitron text-mono-50 mb-3">
            {isLoginMode ? 'Login' : showPlans ? 'Choose your plan' : 'Create Account'}
          </h2>

          {showPlans ? (
            <div>
              <div className="grid grid-cols-1 gap-2">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`relative p-3 rounded border ${
                      selectedPlan === plan.name
                        ? 'border-mono-50 bg-mono-800'
                        : 'border-mono-700 bg-mono-800/50 hover:border-mono-600'
                    } cursor-pointer transition-all`}
                    onClick={() => setSelectedPlan(plan.name)}
                  >
                    {plan.isPopular && (
                      <span className="absolute right-2 top-2 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 font-medium">
                        Populaire
                      </span>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-mono-50">{plan.name}</span>
                      <div className="flex items-baseline gap-0.5 mt-1 mb-2">
                        <span className="text-xl font-bold text-mono-50">{plan.price}€</span>
                        <span className="text-[10px] text-mono-400">/mois</span>
                      </div>
                      <ul className="space-y-1.5">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-1.5">
                            <svg
                              viewBox="0 0 24 24"
                              className="w-3 h-3 text-mono-400"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span className="text-xs text-mono-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => setShowPlans(false)}
                  className="px-3 py-1.5 bg-mono-800 text-mono-50 rounded hover:bg-mono-700 transition-colors font-medium text-xs"
                >
                  Back
                </button>
                <button
                  onClick={handlePlanConfirm}
                  disabled={!selectedPlan}
                  className="flex-1 py-1.5 bg-mono-50 text-mono-900 rounded hover:bg-mono-200 transition-colors font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedPlan ? `Complete registration with ${selectedPlan}` : 'Select a plan to continue'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {!isLoginMode && !showPlans && (
                <>
                  {/* Photo de profil */}
                  <div className="flex flex-col items-center mb-3">
                    <div className="relative w-14 h-14 mb-1">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Profile preview"
                          className="w-full h-full rounded-full object-cover border border-mono-800"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-mono-800 flex items-center justify-center border border-mono-700">
                          <UserCircle className="w-7 h-7 text-mono-400" />
                        </div>
                      )}
                      <label
                        htmlFor="profile-picture"
                        className="absolute -bottom-0.5 -right-0.5 bg-mono-800 rounded-full p-1 cursor-pointer hover:bg-mono-700 transition-colors border border-mono-700"
                      >
                        <Upload className="w-2.5 h-2.5 text-mono-50" />
                      </label>
                      <input
                        type="file"
                        id="profile-picture"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                    <p className="text-[10px] text-mono-400">
                      Add a profile picture
                    </p>
                  </div>

                  {/* Champs du formulaire */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-mono-400 mb-0.5">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-2 py-1 bg-mono-800 rounded text-mono-50 focus:outline-none focus:ring-1 focus:ring-mono-700 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-mono-400 mb-0.5">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-2 py-1 bg-mono-800 rounded text-mono-50 focus:outline-none focus:ring-1 focus:ring-mono-700 text-xs"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] text-mono-400 mb-0.5">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-2 py-1 bg-mono-800 rounded text-mono-50 focus:outline-none focus:ring-1 focus:ring-mono-700 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-mono-400 mb-0.5">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-2 py-1 bg-mono-800 rounded text-mono-50 focus:outline-none focus:ring-1 focus:ring-mono-700 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-mono-400 mb-0.5">Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-2 py-1 bg-mono-800 rounded text-mono-50 focus:outline-none focus:ring-1 focus:ring-mono-700 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-mono-400 mb-0.5">
                        <span>Company</span>
                        <span className="text-mono-500 ml-1">(optional)</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-mono-500" />
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full pl-7 pr-2 py-1 bg-mono-800 rounded text-mono-50 focus:outline-none focus:ring-1 focus:ring-mono-700 text-xs"
                          placeholder="Company name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-mono-400 mb-0.5">
                        <span>Phone</span>
                        <span className="text-mono-500 ml-1">(optional)</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-mono-500" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-7 pr-2 py-1 bg-mono-800 rounded text-mono-50 focus:outline-none focus:ring-1 focus:ring-mono-700 text-xs"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] text-mono-400 mb-0.5">
                        <span>Sector</span>
                        <span className="text-mono-500 ml-1">(optional)</span>
                      </label>
                      <select
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        className="w-full px-2 py-1 bg-mono-800 rounded text-mono-50 focus:outline-none focus:ring-1 focus:ring-mono-700 text-xs"
                      >
                        <option value="">Select a sector</option>
                        {sectors.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {isLoginMode && (
                <div className="space-y-2">
                  <div>
                    <label className="block text-[10px] text-mono-400 mb-0.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-2 py-1 bg-mono-800 rounded text-mono-50 focus:outline-none focus:ring-1 focus:ring-mono-700 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-mono-400 mb-0.5">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-2 py-1 bg-mono-800 rounded text-mono-50 focus:outline-none focus:ring-1 focus:ring-mono-700 text-xs"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="text-red-500 text-[10px]">{error}</div>
              )}

              <button
                type="submit"
                className="w-full py-1.5 bg-mono-50 text-mono-900 rounded hover:bg-mono-200 transition-colors font-medium text-xs"
              >
                {isLoginMode ? 'Login' : showPlans ? 'Create Account' : 'Continue'}
              </button>

              {!showPlans && (
                <>
                  <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-mono-800"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px]">
                      <span className="px-2 bg-mono-900 text-mono-400">Or continue with</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onGoogleLogin}
                    className="w-full py-1.5 bg-mono-800 text-mono-50 rounded hover:bg-mono-700 transition-colors font-medium text-xs flex items-center justify-center gap-1.5"
                  >
                    <svg width="14" height="14" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                      <g fill="none" fillRule="evenodd">
                        <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                        <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                      </g>
                    </svg>
                    <span className="ml-1">Google</span>
                  </button>
                </>
              )}
            </form>
          )}
          {!showPlans && (
            <p className="mt-2 text-center text-[10px] text-mono-400">
              {isLoginMode ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-mono-50 hover:text-mono-200 transition-colors"
              >
                {isLoginMode ? 'Sign up' : 'Login'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}