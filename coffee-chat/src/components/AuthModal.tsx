'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');

    try {
      if (isSignIn) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      onClose();
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithGoogle();
      onClose();
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError('');
  };

  const closeModal = () => {
    onClose();
    resetForm();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeModal}>
          ×
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {isSignIn ? 'Sign In' : 'Sign Up'}
        </h2>

        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="auth-button google w-full mb-4"
        >
          {loading ? 'Loading...' : `${isSignIn ? 'Sign in' : 'Sign up'} with Google`}
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <form onSubmit={handleEmailAuth} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
          />

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="auth-button"
          >
            {loading ? 'Loading...' : (isSignIn ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-switch">
          {isSignIn ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => {
              setIsSignIn(!isSignIn);
              setError('');
            }}
          >
            {isSignIn ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}