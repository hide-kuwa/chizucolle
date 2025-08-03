import { db } from '../lib/firebase';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import type { Memory, VisitStatus } from '../types';

// The user's memories will be stored in a subcollection under their user document
const getMemoriesCollectionRef = (userId: string) => {
  return collection(db, 'users', userId, 'memories');
};

export const firestoreService = {
  // Fetch all memories for a logged-in user
  getMemories: async (userId: string): Promise<Memory[]> => {
    const querySnapshot = await getDocs(getMemoriesCollectionRef(userId));
    return querySnapshot.docs.map(doc => doc.data() as Memory);
  },

  // Update or create a memory for a specific prefecture
  updateMemoryStatus: async (userId: string, prefectureId: string, status: VisitStatus): Promise<void> => {
    const memoryDocRef = doc(db, 'users', userId, 'memories', prefectureId);
    // Get existing data to avoid overwriting photos
    const docSnap = await getDoc(memoryDocRef);
    const existingData = docSnap.exists() ? docSnap.data() : { photos: [] };

    const newMemory: Memory = {
      ...existingData,
      prefectureId,
      status,
      photos: existingData.photos || [],
    };
    await setDoc(memoryDocRef, newMemory, { merge: true });
  },

  // We will add photo-related functions later when implementing Google Drive upload
};
