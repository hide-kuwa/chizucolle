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
        <div>
          <p>Welcome, {user.displayName}!</p>
          {user.photoURL && <img src={user.photoURL} alt="User avatar" width={50} height={50} style={{borderRadius: '50%'}} />}
          <button onClick={handleSignOut} style={{marginLeft: '10px'}}>Sign Out</button>
        </div>
      ) : (
        <button onClick={handleSignIn}>Sign in with Google</button>
      )}
    </div>
  );
}
