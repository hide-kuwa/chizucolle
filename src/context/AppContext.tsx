'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Memory, VisitStatus } from '@/types';
import { authService } from '@/services/authService';
import { driveService } from '@/services/driveService';
import { firestoreService } from '@/services/firestoreService';
import { auth, db } from '@/lib/firebase';
import { getRedirectResult, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

const LOCAL_STORAGE_KEY = 'chizucolle_memories';

  interface AppContextType {
  user: User | null;
  loading: boolean;
  memories: Memory[];
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  addMemory: (prefectureId: string, photos: File[]) => Promise<void>;
  refreshMemories: () => Promise<void>;
  updateMemoryStatus: (prefectureId: string, status: VisitStatus) => Promise<void>;
  conflict: { local: Memory[]; remote: Memory[] } | null;
  onSelectLocal: () => Promise<void>;
  onSelectRemote: () => Promise<void>;
  isInitialSetupComplete: boolean;
  setIsInitialSetupComplete: (value: boolean) => void;
  registrationsSinceLastAd: number;
    incrementRegistrationAndCheckAd: () => boolean;
    // Trip recording state
    isRecordingTrip: boolean;
    setIsRecordingTrip: (value: boolean) => void;
    newlyVisited: string[];
    toggleNewlyVisited: (prefectureId: string) => void;
    resetTripRecording: () => void;
    updateMultipleMemoryStatuses: (prefectureIds: string[], status: VisitStatus) => Promise<void>;
  }

const AppContext = createContext<AppContextType | undefined>(undefined);

  export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [driveAccessToken, setDriveAccessToken] = useState<string | null>(null);
  const [conflict, setConflict] = useState<{ local: Memory[]; remote: Memory[] } | null>(null);
  const [isInitialSetupComplete, setIsInitialSetupComplete] = useState(false);
    const [registrationsSinceLastAd, setRegistrationsSinceLastAd] = useState(0);
    const [isRecordingTrip, setIsRecordingTrip] = useState(false);
    const [newlyVisited, setNewlyVisited] = useState<string[]>([]);

  const memoriesEqual = (a: Memory[], b: Memory[]) => {
    if (a.length !== b.length) return false;
    const sortById = (arr: Memory[]) => [...arr].sort((x, y) => x.prefectureId.localeCompare(y.prefectureId));
    const sortedA = sortById(a);
    const sortedB = sortById(b);
    return sortedA.every((mem, idx) => {
      const other = sortedB[idx];
      return (
        mem.prefectureId === other.prefectureId &&
        mem.status === other.status &&
        JSON.stringify(mem.photos) === JSON.stringify(other.photos)
      );
    });
  };

    const updateMemory = useCallback((memory: Memory) => {
    setMemories(prev => {
      const index = prev.findIndex(m => m.prefectureId === memory.prefectureId);
      if (index > -1) {
        const updated = [...prev];
        updated[index] = memory;
        return updated;
      }
      return [...prev, memory];
    });
    }, []);

    const toggleNewlyVisited = useCallback((prefectureId: string) => {
      setNewlyVisited(prev =>
        prev.includes(prefectureId)
          ? prev.filter(id => id !== prefectureId)
          : [...prev, prefectureId],
      );
    }, []);

    const resetTripRecording = useCallback(() => {
      setIsRecordingTrip(false);
      setNewlyVisited([]);
    }, []);

    const updateMultipleMemoryStatuses = useCallback(
      async (prefectureIds: string[], status: VisitStatus) => {
        await Promise.all(prefectureIds.map(id => updateMemoryStatus(id, status)));
      },
      [updateMemoryStatus],
    );

  useEffect(() => {
    getRedirectResult(auth)
      .then(result => {
        if (result) {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential?.accessToken) {
            setDriveAccessToken(credential.accessToken);
          }
          console.log('Successfully signed in with redirect', result.user);
        }
      })
      .catch(error => {
        console.error('Error getting redirect result', error);
      });
  }, []);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async authUser => {
      setUser(authUser);
      if (authUser) {
        setLoading(true);
        const token = await authService.getAccessToken();
        if (token) {
          setDriveAccessToken(token);
        }

        let localMemories: Memory[] = [];
        try {
          const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (localData) {
            localMemories = JSON.parse(localData);
          }
        } catch (error) {
          console.error('Failed to parse memories from localStorage', error);
        }

        const firestoreMemories = await firestoreService.getMemories(authUser.uid);

        if (localMemories.length && firestoreMemories.length === 0) {
          await Promise.all(
            localMemories.map(memory =>
              setDoc(doc(db, 'users', authUser.uid, 'memories', memory.prefectureId), memory),
            ),
          );
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          setMemories(localMemories);
        } else if (
          localMemories.length &&
          firestoreMemories.length &&
          !memoriesEqual(localMemories, firestoreMemories)
        ) {
          setMemories(localMemories);
          setConflict({ local: localMemories, remote: firestoreMemories });
        } else {
          const finalMemories = firestoreMemories.length ? firestoreMemories : localMemories;
          setMemories(finalMemories);
          if (firestoreMemories.length) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
          }
        }
        setLoading(false);
      } else {
        setConflict(null);
        try {
          const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (localData) {
            setMemories(JSON.parse(localData));
          } else {
            setMemories([]);
          }
        } catch (error) {
          console.error('Failed to parse memories from localStorage', error);
          setMemories([]);
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    setLoading(true);
    try {
      const token = await authService.signInWithGoogle();
      if (token) setDriveAccessToken(token);
      // onAuthStateChanged will update state
    } catch (error) {
      console.error('Sign in failed', error);
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    await authService.signOut();
    // onAuthStateChanged will handle cleanup
  };

  const incrementRegistrationAndCheckAd = useCallback(() => {
    if (!isInitialSetupComplete) return false;
    let shouldShow = false;
    setRegistrationsSinceLastAd(prev => {
      if (prev === 0 || prev === 3) {
        shouldShow = true;
        return 1;
      }
      return prev + 1;
    });
    return shouldShow;
  }, [isInitialSetupComplete]);

  const addMemory = useCallback(
    async (prefectureId: string, photos: File[]) => {
      if (!user) throw new Error('User must be logged in to add memories.');
      setLoading(true);
      try {
        const token = driveAccessToken;
        if (!token) throw new Error('Missing access token');
        const uploaded = await driveService.uploadPhotos(token, prefectureId, photos);
        await firestoreService.addPhotosToMemory(user.uid, prefectureId, uploaded);
        setMemories(prev => {
          const index = prev.findIndex(m => m.prefectureId === prefectureId);
          if (index > -1) {
            const updated = [...prev];
            const memory = updated[index];
            memory.photos = [...memory.photos, ...uploaded];
            memory.status = 'visited';
            return updated;
          }
          return [...prev, { prefectureId, status: 'visited', photos: uploaded }];
        });
      } catch (error) {
        console.error('Failed to add memory:', error);
      } finally {
        setLoading(false);
      }
    },
    [user, driveAccessToken],
  );

  const refreshMemories = useCallback(async () => {
    if (!user) return;
    const fetched = await firestoreService.getMemories(user.uid);
    setMemories(fetched);
  }, [user]);

  const updateMemoryStatus = useCallback(
    async (prefectureId: string, status: VisitStatus) => {
      if (user) {
        setLoading(true);
        try {
          await firestoreService.updateMemoryStatus(user.uid, prefectureId, status);
          updateMemory({ prefectureId, status, photos: memories.find(m => m.prefectureId === prefectureId)?.photos || [] });
        } catch (error) {
          console.error('Failed to update memory status:', error);
        } finally {
          setLoading(false);
        }
      } else {
        const currentMemories = [...memories];
        const index = currentMemories.findIndex(m => m.prefectureId === prefectureId);
        let newMemory: Memory;
        if (index > -1) {
          newMemory = { ...currentMemories[index], status };
          currentMemories[index] = newMemory;
        } else {
          newMemory = { prefectureId, status, photos: [] };
          currentMemories.push(newMemory);
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentMemories));
        updateMemory(newMemory);
      }
    },
    [user, memories, updateMemory],
  );

  const onSelectLocal = useCallback(async () => {
    if (!user || !conflict) return;
    setLoading(true);
    try {
      await Promise.all(
        conflict.remote.map(remote =>
          deleteDoc(doc(db, 'users', user.uid, 'memories', remote.prefectureId)),
        ),
      );
      await Promise.all(
        conflict.local.map(memory =>
          setDoc(doc(db, 'users', user.uid, 'memories', memory.prefectureId), memory),
        ),
      );
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setMemories(conflict.local);
      setConflict(null);
    } catch (error) {
      console.error('Failed to save local memories to Firestore', error);
    } finally {
      setLoading(false);
    }
  }, [user, conflict]);

  const onSelectRemote = useCallback(async () => {
    if (!conflict) return;
    setLoading(true);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setMemories(conflict.remote);
      setConflict(null);
    } finally {
      setLoading(false);
    }
  }, [conflict]);

  const value = {
    user,
    loading,
    memories,
    signIn,
    signOut,
    addMemory,
    refreshMemories,
    updateMemoryStatus,
    conflict,
    onSelectLocal,
    onSelectRemote,
    isInitialSetupComplete,
    setIsInitialSetupComplete,
    registrationsSinceLastAd,
    incrementRegistrationAndCheckAd,
    isRecordingTrip,
    setIsRecordingTrip,
    newlyVisited,
    toggleNewlyVisited,
    resetTripRecording,
    updateMultipleMemoryStatuses,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useGlobalContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within an AppProvider');
  }
  return context;
};

