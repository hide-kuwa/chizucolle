
import React from 'react';
import { useGlobalContext } from '../context/AppContext';
import { PlusIcon } from './icons/PlusIcon';

interface HeaderProps {
  onAddMemoryClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddMemoryClick }) => {
  const { user, signIn, signOut, loading } = useGlobalContext();

  return (
    <header className="w-full bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary">Chizu-Colle</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <button
                onClick={onAddMemoryClick}
                className="flex items-center space-x-2 bg-accent hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-button transition-colors duration-200 shadow-sm disabled:bg-gray-400"
                disabled={loading}
              >
                <PlusIcon />
                <span>Add Memory</span>
              </button>
            )}
            <div className="w-px h-6 bg-base-300 hidden sm:block"></div>
            {loading ? (
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <img
                  src={user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`}
                  alt={user.displayName || 'User'}
                  className="w-10 h-10 rounded-full object-cover border-2 border-base-300"
                />
                <div className="hidden sm:flex flex-col items-start">
                    <span className="font-semibold text-text-primary">{user.displayName}</span>
                    <button onClick={signOut} className="text-sm text-text-secondary hover:text-accent transition-colors">Sign Out</button>
                </div>
              </div>
            ) : (
              <button
                onClick={signIn}
                className="bg-primary hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-button transition-colors duration-200 shadow-sm"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
