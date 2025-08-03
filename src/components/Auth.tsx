'use client';

import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const { user, loading } = useAuth();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Authentication Error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign Out Error:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <div className="flex items-center">
          <p>Welcome, {user.displayName}!</p>
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="User avatar"
              className="ml-2 h-12 w-12 rounded-full"
            />
          )}
          <button
            onClick={handleSignOut}
            className="ml-2 rounded-button bg-accent px-2 py-1 text-white"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          onClick={handleSignIn}
          className="rounded-button bg-primary px-3 py-1 text-white"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}
