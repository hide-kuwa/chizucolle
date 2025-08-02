import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import type { User } from "../types";

// This function maps the user object from Firebase to our app's User type
const formatUser = (user: FirebaseUser): User => ({
  uid: user.uid,
  displayName: user.displayName,
  photoURL: user.photoURL,
});

export const authService = {
  signInWithGoogle: async (): Promise<User> => {
    const provider = new GoogleAuthProvider();
    // Add Google Drive scope here for the future
    provider.addScope('https://www.googleapis.com/auth/drive.file');

    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return formatUser(user);
  },

  signOut: (): Promise<void> => {
    return firebaseSignOut(auth);
  },

  onAuthStateChanged: (callback: (user: User | null) => void): (() => void) => {
    const unsubscribe = firebaseOnAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (user) {
        callback(formatUser(user));
      } else {
        callback(null);
      }
    });
    // Return the unsubscribe function to clean up the listener
    return unsubscribe;
  },
};
