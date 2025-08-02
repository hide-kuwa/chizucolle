
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Memory, Photo } from '../types';
import { authService } from '../services/authService';
import { driveService } from '../services/driveService';

interface AppContextType {
  user: User | null;
  loading: boolean;
  memories: Memory[];
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  addMemory: (prefectureId: string, photos: File[]) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(authUser => {
      setUser(authUser);
      if (authUser) {
        // In a real app, you'd fetch memories from a database here.
        driveService.getInitialMemories().then(initialMemories => {
            setMemories(initialMemories);
            setLoading(false);
        });
      } else {
        setMemories([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    setLoading(true);
    await authService.signInWithGoogle();
    // onAuthStateChanged will handle setting the user
  };

  const signOut = async () => {
    setLoading(true);
    await authService.signOut();
    // onAuthStateChanged will handle cleanup
  };

  const addMemory = useCallback(async (prefectureId: string, photos: File[]) => {
    if (!user) throw new Error("User must be logged in to add memories.");
    setLoading(true);
    try {
      const newPhotos = await driveService.uploadPhotos(prefectureId, photos);
      setMemories(prevMemories => {
        const existingMemoryIndex = prevMemories.findIndex(m => m.prefectureId === prefectureId);
        if (existingMemoryIndex > -1) {
          const updatedMemories = [...prevMemories];
          const existingMemory = updatedMemories[existingMemoryIndex];
          existingMemory.photos.push(...newPhotos);
          // Set new primary photo if it's the first one for that memory
          if (!existingMemory.primaryPhotoUrl) {
              existingMemory.primaryPhotoUrl = newPhotos[0]?.url;
          }
          return updatedMemories;
        } else {
          return [...prevMemories, {
            prefectureId,
            photos: newPhotos,
            primaryPhotoUrl: newPhotos[0]?.url,
          }];
        }
      });
    } catch (error) {
      console.error("Failed to add memory:", error);
      // Handle error display to user
    } finally {
      setLoading(false);
    }
  }, [user]);

  const value = { user, loading, memories, signIn, signOut, addMemory };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useGlobalContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within an AppProvider');
  }
  return context;
};
