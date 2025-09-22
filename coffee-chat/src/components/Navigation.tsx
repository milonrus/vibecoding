'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface NavigationProps {
  onOpenAuth?: () => void;
}

export default function Navigation({ onOpenAuth }: NavigationProps) {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthClick = () => {
    if (onOpenAuth) {
      onOpenAuth();
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-logo">
          <Link href="/">Not a Tourist</Link>
        </div>
        <div className="nav-buttons">
          {user ? (
            <>
              <span className="text-white">Welcome, {user.displayName || user.email}</span>
              <Link href="/chat" className="nav-button">
                AI Coffee Chat
              </Link>
              <button onClick={logout} className="nav-button secondary">
                Sign Out
              </button>
            </>
          ) : (
            <button onClick={handleAuthClick} className="nav-button">
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}