
import type { User } from '../types';

// This is a mock implementation of an authentication service.
// In a real application, this would be replaced with Firebase Authentication SDK.

const FAKE_USER: User = {
  uid: '12345-abcde',
  displayName: 'Alex Traveler',
  photoURL: 'https://i.pravatar.cc/150?u=alex',
};

let currentUser: User | null = null;
let onAuthCallback: ((user: User | null) => void) | null = null;

const simulateAuthChange = () => {
  if (onAuthCallback) {
    onAuthCallback(currentUser);
  }
};

export const authService = {
  signInWithGoogle: (): Promise<User> => {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log("Simulating Google Sign-In...");
        // This is where you would request Google Drive API scopes in a real app.
        alert("In a real app, you would now be asked for Google Drive permission: \n'https://www.googleapis.com/auth/drive.file'");
        currentUser = FAKE_USER;
        simulateAuthChange();
        resolve(FAKE_USER);
      }, 1000);
    });
  },

  signOut: (): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log("Simulating Sign-Out...");
        currentUser = null;
        simulateAuthChange();
        resolve();
      }, 500);
    });
  },

  onAuthStateChanged: (callback: (user: User | null) => void): (() => void) => {
    onAuthCallback = callback;
    // Immediately invoke with current state to set initial user
    simulateAuthChange(); 
    // Return an unsubscribe function
    return () => {
      onAuthCallback = null;
    };
  },
};
