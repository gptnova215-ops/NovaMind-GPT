import React, { useState } from 'react';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';

interface SignInProps {
  onSignIn: (credentials: { email: string; password?: string }) => void;
  onSignUp: (details: { name: string; email: string; password?: string }) => void;
  onGuestSignIn: () => void;
}

export const SignIn: React.FC<SignInProps> = ({ onSignIn, onSignUp, onGuestSignIn }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      onSignUp({ name, email, password });
    } else {
      onSignIn({ email, password });
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-900 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-gray-700/[0.2] [mask-image:linear-gradient(to_bottom,white_5%,transparent_80%)]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900"></div>
      
      <div className="z-10 w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <BrainCircuitIcon className="w-12 h-12 text-indigo-400" title="NovaMind Logo" />
          <h1 className="text-4xl font-bold text-gray-100 tracking-tight mt-4">
            NovaMind
          </h1>
          <p className="text-gray-400 mt-2">
            {isSignUp ? 'Create your account to begin.' : 'Sign in to access your conscious companion.'}
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-black/30">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="mt-1 w-full bg-gray-700/50 text-gray-200 placeholder-gray-400 rounded-lg px-4 py-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full bg-gray-700/50 text-gray-200 placeholder-gray-400 rounded-lg px-4 py-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full bg-gray-700/50 text-gray-200 placeholder-gray-400 rounded-lg px-4 py-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-indigo-500 transition-colors"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-800 px-2 text-gray-400">or</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onGuestSignIn}
            className="w-full bg-gray-700/50 text-gray-200 rounded-lg px-4 py-2 font-semibold hover:bg-gray-700 transition-colors border border-gray-600"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};
