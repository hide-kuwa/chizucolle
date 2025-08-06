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
  signInWithGoogle: async (): Promise<string | undefined> => {
    const provider = new GoogleAuthProvider();
    // ★★★【ここが、最後の鍵だ！】★★★
    // ログインの、まさにその瞬間に、ドライブへのアクセス許可も、同時に要求する！
    provider.addScope('https://www.googleapis.com/auth/drive.file');

    if (isMobileDevice()) {
      await signInWithRedirect(auth, provider);
      return undefined; // access token will be retrieved via getRedirectResult
    } else {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      return credential?.accessToken ?? undefined;
    }
  },

  getAccessToken: async (): Promise<string | undefined> => {
    const currentUser = auth.currentUser;
    if (!currentUser) return undefined;

    try {
      await currentUser.getIdTokenResult(true);
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/drive.file');

      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      console.log('Access Token Refreshed!');
      return credential?.accessToken;
    } catch (error) {
      console.error('Failed to refresh access token', error);
      return undefined;
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
