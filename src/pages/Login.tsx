import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, X } from 'lucide-react';
import { login } from '../services/auth';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      await login(email, password);
      navigate('/'); // Redirect to main page after login
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google login
  };

  return (
    <div className="min-h-screen bg-mono-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-mono-800 p-8 rounded-xl relative">
        <button
          onClick={() => navigate('/')}
          className="absolute right-4 top-4 text-mono-400 hover:text-mono-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-mono-50" />
          <h2 className="mt-6 text-3xl font-bold text-mono-50">Welcome back</h2>
          <p className="mt-2 text-sm text-mono-400">
            Or{' '}
            <button
              onClick={() => navigate('/signup')}
              className="font-medium text-mono-50 hover:text-mono-200"
            >
              create a new account
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
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-mono-700 placeholder-mono-400 text-mono-50 bg-mono-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-mono-50 focus:border-transparent"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-mono-700 placeholder-mono-400 text-mono-50 bg-mono-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-mono-50 focus:border-transparent"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-mono-900 bg-mono-50 hover:bg-mono-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mono-50"
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-mono-700 text-sm font-medium rounded-lg text-mono-50 hover:bg-mono-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mono-50"
            >
              <img src="/google.svg" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
