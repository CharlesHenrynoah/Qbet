import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, X, Phone, Upload, ChevronDown, Calendar, User, AtSign } from 'lucide-react';
import { signup } from '../services/auth';

const countryPhoneCodes = [
  { code: '+1', country: 'United States' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+33', country: 'France' },
  { code: '+49', country: 'Germany' },
  { code: '+39', country: 'Italy' },
  { code: '+34', country: 'Spain' },
  { code: '+31', country: 'Netherlands' },
  { code: '+32', country: 'Belgium' },
  { code: '+41', country: 'Switzerland' },
  { code: '+46', country: 'Sweden' },
  { code: '+47', country: 'Norway' },
  { code: '+45', country: 'Denmark' },
  { code: '+358', country: 'Finland' },
  { code: '+48', country: 'Poland' },
  { code: '+43', country: 'Austria' },
  { code: '+351', country: 'Portugal' },
  { code: '+353', country: 'Ireland' },
  { code: '+30', country: 'Greece' },
  { code: '+420', country: 'Czech Republic' },
  { code: '+36', country: 'Hungary' }
].sort((a, b) => a.country.localeCompare(b.country));

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [gender, setGender] = useState('mr'); // 'mr' or 'mrs'
  const [error, setError] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCountryList, setShowCountryList] = useState(false);

  const isLettersOnly = (str: string) => /^[A-Za-z]+$/.test(str);
  
  const isAtLeast18 = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const isValidPhoneNumber = (phone: string) => {
    return /^\d{10}$/.test(phone.replace(/\D/g, ''));
  };

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const validateFirstName = (value: string) => {
    if (!isLettersOnly(value) && value.length > 0) {
      setErrors(prev => ({ ...prev, firstName: 'First name should only contain letters' }));
    } else {
      setErrors(prev => ({ ...prev, firstName: '' }));
    }
    setFirstName(value);
  };

  const validateLastName = (value: string) => {
    if (!isLettersOnly(value) && value.length > 0) {
      setErrors(prev => ({ ...prev, lastName: 'Last name should only contain letters' }));
    } else {
      setErrors(prev => ({ ...prev, lastName: '' }));
    }
    setLastName(value);
  };

  const validateDateOfBirth = (value: string) => {
    if (value && !isAtLeast18(value)) {
      setErrors(prev => ({ ...prev, dateOfBirth: 'You must be at least 18 years old to register' }));
    } else {
      setErrors(prev => ({ ...prev, dateOfBirth: '' }));
    }
    setDateOfBirth(value);
  };

  const validateEmail = (value: string) => {
    if (!isValidEmail(value) && value.length > 0) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address (e.g., name@example.com)' }));
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
    setEmail(value);
  };

  const validatePassword = (value: string) => {
    if (value.length > 0) {
      const errors: string[] = [];
      if (!/(?=.*[a-z])/.test(value)) errors.push('one lowercase letter');
      if (!/(?=.*[A-Z])/.test(value)) errors.push('one uppercase letter');
      if (!/(?=.*\d)/.test(value)) errors.push('one number');
      if (!/(?=.*[@$!%*?&])/.test(value)) errors.push('one special character');
      if (value.length < 8) errors.push('minimum 8 characters');
      
      if (errors.length > 0) {
        setErrors(prev => ({ 
          ...prev, 
          password: `Password must contain ${errors.join(', ')}` 
        }));
      } else {
        setErrors(prev => ({ ...prev, password: '' }));
      }
    } else {
      setErrors(prev => ({ ...prev, password: '' }));
    }
    setPassword(value);
  };

  const validateConfirmPassword = (value: string) => {
    if (value.length > 0 && value !== password) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
    setConfirmPassword(value);
  };

  const validatePhone = (value: string) => {
    if (value.length > 0 && !isValidPhoneNumber(value)) {
      setErrors(prev => ({ ...prev, phone: 'Please enter a valid 10-digit phone number' }));
    } else {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
    setPhone(value);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check all validations before submitting
    if (
      !isLettersOnly(firstName) ||
      !isLettersOnly(lastName) ||
      !isAtLeast18(dateOfBirth) ||
      !isValidEmail(email) ||
      !isValidPassword(password) ||
      password !== confirmPassword ||
      !isValidPhoneNumber(phone)
    ) {
      return;
    }

    try {
      await signup(
        email,
        username,
        password,
        firstName,
        lastName,
        dateOfBirth,
        `${countryCode}${phone}`,
        gender,
        profilePicture,
        username
      );
      navigate('/'); // Redirect to main page after signup
    } catch (err) {
      setError('Failed to create account');
    }
  };

  return (
    <div className="min-h-screen bg-mono-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 bg-mono-800 p-8 rounded-xl relative">
        <button
          onClick={() => navigate('/')}
          className="absolute right-4 top-4 text-mono-400 hover:text-mono-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          {previewUrl ? (
            <div className="relative w-24 h-24 mx-auto">
              <img
                src={previewUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-mono-50"
              />
              <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 bg-mono-50 rounded-full p-2 cursor-pointer hover:bg-mono-200 transition-colors"
              >
                <Upload className="w-4 h-4 text-mono-900" />
              </label>
            </div>
          ) : (
            <div className="relative w-24 h-24 mx-auto">
              <div className="w-24 h-24 rounded-full bg-mono-700 flex items-center justify-center">
                <UserPlus className="w-12 h-12 text-mono-50" />
              </div>
              <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 bg-mono-50 rounded-full p-2 cursor-pointer hover:bg-mono-200 transition-colors"
              >
                <Upload className="w-4 h-4 text-mono-900" />
              </label>
            </div>
          )}
          <input
            type="file"
            id="profile-picture"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="mt-6 flex justify-center space-x-8">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="hidden"
                checked={gender === 'mr'}
                onChange={() => setGender('mr')}
              />
              <div className={`px-4 py-2 rounded-lg transition-colors ${
                gender === 'mr' 
                  ? 'bg-mono-50 text-mono-900' 
                  : 'bg-mono-700 text-mono-400'
              }`}>
                Mr
              </div>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="hidden"
                checked={gender === 'mrs'}
                onChange={() => setGender('mrs')}
              />
              <div className={`px-4 py-2 rounded-lg transition-colors ${
                gender === 'mrs' 
                  ? 'bg-mono-50 text-mono-900' 
                  : 'bg-mono-700 text-mono-400'
              }`}>
                Mrs
              </div>
            </label>
          </div>

          <h2 className="mt-6 text-3xl font-bold text-mono-50">Create your account</h2>
          <p className="mt-2 text-sm text-mono-400">
            Or{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-medium text-mono-50 hover:text-mono-200"
            >
              sign in to existing account
            </button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="firstName" className="sr-only">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => validateFirstName(e.target.value)}
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.firstName ? 'border-red-500' : 'border-mono-700'
                  } placeholder:text-mono-400 text-mono-50 bg-mono-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-mono-50 focus:border-transparent`}
                  placeholder="First Name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => validateLastName(e.target.value)}
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.lastName ? 'border-red-500' : 'border-mono-700'
                  } placeholder:text-mono-400 text-mono-50 bg-mono-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-mono-50 focus:border-transparent`}
                  placeholder="Last Name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
              <div>
                <div className="relative flex items-center mb-1">
                  <Calendar className="absolute left-3 z-10 w-5 h-5 text-mono-400 pointer-events-none" />
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => validateDateOfBirth(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className={`appearance-none pl-10 block w-full px-3 py-2 border ${
                      errors.dateOfBirth ? 'border-red-500' : 'border-mono-700'
                    } text-mono-50 bg-mono-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-mono-50 focus:border-transparent [&::-webkit-calendar-picker-indicator]:bg-mono-50 [&::-webkit-calendar-picker-indicator]:rounded [&::-webkit-calendar-picker-indicator]:hover:bg-mono-200 [&::-webkit-calendar-picker-indicator]:p-1 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-datetime-edit-fields-wrapper]:ml-0 [&::-webkit-datetime-edit]:ml-0 [&::-webkit-datetime-edit-text]:text-mono-50 [&::-webkit-datetime-edit-month-field]:text-mono-50 [&::-webkit-datetime-edit-day-field]:text-mono-50 [&::-webkit-datetime-edit-year-field]:text-mono-50 placeholder:text-mono-400`}
                    required
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => validateEmail(e.target.value)}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-mono-700'
                } placeholder:text-mono-400 text-mono-50 bg-mono-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-mono-50 focus:border-transparent`}
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative flex items-center">
                <User className="absolute left-3 z-10 w-5 h-5 text-mono-400 pointer-events-none" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none pl-10 block w-full px-3 py-2 border border-mono-700 text-mono-50 bg-mono-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-mono-50 focus:border-transparent placeholder:text-mono-400"
                  placeholder="Username"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => validatePassword(e.target.value)}
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-500' : 'border-mono-700'
                  } placeholder:text-mono-400 text-mono-50 bg-mono-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-mono-50 focus:border-transparent`}
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => validateConfirmPassword(e.target.value)}
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-mono-700'
                  } placeholder:text-mono-400 text-mono-50 bg-mono-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-mono-50 focus:border-transparent`}
                  placeholder="Confirm Password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div>
              <div className="relative flex">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCountryList(!showCountryList)}
                    className="flex items-center px-3 py-2 border border-mono-700 rounded-l-lg bg-mono-900 text-mono-50 hover:bg-mono-800 focus:outline-none focus:ring-2 focus:ring-mono-50"
                  >
                    {countryCode}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                  {showCountryList && (
                    <div className="absolute z-10 mt-1 w-64 bg-mono-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {countryPhoneCodes.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          className="w-full px-4 py-2 text-left hover:bg-mono-700 text-mono-50"
                          onClick={() => {
                            setCountryCode(country.code);
                            setShowCountryList(false);
                          }}
                        >
                          {country.country} ({country.code})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => validatePhone(e.target.value)}
                  className={`flex-1 appearance-none relative block w-full px-3 py-2 border border-l-0 ${
                    errors.phone ? 'border-red-500' : 'border-mono-700'
                  } text-mono-50 rounded-r-lg placeholder:text-mono-400 bg-mono-900 focus:outline-none focus:ring-2 focus:ring-mono-50 focus:border-transparent`}
                  placeholder="Phone number"
                  required
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-mono-900 bg-mono-50 hover:bg-mono-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mono-50"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
