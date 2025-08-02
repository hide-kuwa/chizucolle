import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../lib/firebase"; // Import from our real firebase.ts
import { User } from "../types"; // Assuming a simple User type exists in src/types.ts

// This function maps the user object from Firebase to our app's User type
const formatUser = (user: FirebaseUser): User => ({
  uid: user.uid,
  displayName: user.displayName,
  photoURL: user.photoURL,
});

export const authService = {
  signInWithGoogle: async (): Promise<User> => {
    const provider = new GoogleAuthProvider();
    // This scope is crucial for the future Google Drive integration
    provider.addScope('https://www.googleapis.com/auth/drive.file');

    const result = await signInWithPopup(auth, provider);
    return formatUser(result.user);
  },

  signOut: (): Promise<void> => {
    return firebaseSignOut(auth);
  },

  onAuthStateChanged: (callback: (user: User | null) => void): (() => void) => {
    const unsubscribe = firebaseOnAuthStateChanged(auth, (user: FirebaseUser | null) => {
      callback(user ? formatUser(user) : null);
    });
    // Return the unsubscribe function for cleanup
    return unsubscribe;
  },
};
