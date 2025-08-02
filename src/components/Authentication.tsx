'use client';

import { useGlobalContext } from '../context/AppContext'; // Assuming AppContext is now the global context provider

export default function Authentication() {
  const { user, loading, signIn, signOut } = useGlobalContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}!</p>
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="User avatar"
              width={50}
              height={50}
              style={{ borderRadius: '50%' }}
            />
          )}
          <button onClick={signOut} style={{ marginLeft: '10px' }}>
            Sign Out
          </button>
        </div>
      ) : (
        <button onClick={signIn}>Sign in with Google</button>
      )}
    </div>
  );
}
