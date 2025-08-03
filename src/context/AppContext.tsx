'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Memory, VisitStatus } from '@/types';
import { authService } from '@/services/authService';
import { driveService } from '@/services/driveService';
import { firestoreService } from '@/services/firestoreService';
import { auth } from '@/lib/firebase';

interface AppContextType {
  user: User | null;
  loading: boolean;
  memories: Memory[];
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  addMemory: (prefectureId: string, photos: File[]) => Promise<void>;
  refreshMemories: () => Promise<void>;
  updateMemoryStatus: (prefectureId: string, status: VisitStatus) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async authUser => {
      setUser(authUser);
      if (authUser) {
        const fetched = await firestoreService.getMemories(authUser.uid);
        setMemories(fetched);
      } else {
        setMemories([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    setLoading(true);
    await authService.signInWithGoogle();
    // onAuthStateChanged will update state
  };

  const signOut = async () => {
    setLoading(true);
    await authService.signOut();
    // onAuthStateChanged will handle cleanup
  };

  const addMemory = useCallback(
    async (prefectureId: string, photos: File[]) => {
      if (!user) throw new Error('User must be logged in to add memories.');
      setLoading(true);
      try {
        const accessToken = await auth.currentUser?.getIdToken();
        if (!accessToken) throw new Error('Missing access token');
        const uploaded = await driveService.uploadPhotos(accessToken, prefectureId, photos);
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
    [user],
  );

  const refreshMemories = useCallback(async () => {
    if (!user) return;
    const fetched = await firestoreService.getMemories(user.uid);
    setMemories(fetched);
  }, [user]);

  const updateMemoryStatus = useCallback(
    async (prefectureId: string, status: VisitStatus) => {
      if (!user) throw new Error('User must be logged in to update status.');
      setLoading(true);
      try {
        await firestoreService.updateMemoryStatus(user.uid, prefectureId, status);
        await refreshMemories();
      } catch (error) {
        console.error('Failed to update memory status:', error);
      } finally {
        setLoading(false);
      }
    },
    [user, refreshMemories],
  );

  const value = {
    user,
    loading,
    memories,
    signIn,
    signOut,
    addMemory,
    refreshMemories,
    updateMemoryStatus,
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

