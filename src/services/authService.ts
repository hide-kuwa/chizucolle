import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { User } from "../types";
import { isMobileDevice } from "@/utils/isMobile";

const formatUser = (user: FirebaseUser): User => ({
  uid: user.uid,
  displayName: user.displayName,
  photoURL: user.photoURL,
});

export const authService = {
  signInWithGoogle: async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    // ★★★【ここが、最後の鍵だ！】★★★
    // ログインの、まさにその瞬間に、ドライブへのアクセス許可も、同時に要求する！
    provider.addScope('https://www.googleapis.com/auth/drive.file');

    if (isMobileDevice()) {
      await signInWithRedirect(auth, provider);
    } else {
      await signInWithPopup(auth, provider);
    }
  },

  signOut: (): Promise<void> => {
    return firebaseSignOut(auth);
  },

  onAuthStateChanged: (callback: (user: User | null) => void): (() => void) => {
    const unsubscribe = firebaseOnAuthStateChanged(auth, (user: FirebaseUser | null) => {
      callback(user ? formatUser(user) : null);
    });
    return unsubscribe;
  },
};
