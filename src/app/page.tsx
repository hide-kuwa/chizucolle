'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { firestoreService } from '@/services/firestoreService';
import Auth from '@/components/Auth';
import JapanMap from '@/components/JapanMap';
import type { Prefecture, Memory, VisitStatus } from '@/types';

// Define the possible display modes for the map
type MapDisplayMode = 'simple_color' | 'photo' | 'none';

export default function Home() {
  const { user } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [displayMode, setDisplayMode] = useState<MapDisplayMode>('photo');

  // Fetch memories from Firestore when user logs in
  useEffect(() => {
    if (user) {
      firestoreService.getMemories(user.uid).then(setMemories);
    } else {
      setMemories([]);
    }
  }, [user]);

  const handlePrefectureClick = async (prefecture: Prefecture) => {
    if (!user) {
      alert('Please sign in to record your visit!');
      return;
    }
    // Example of how to cycle through statuses. A real UI would have a dropdown/modal.
    const currentMemory = memories.find(m => m.prefectureId === prefecture.id);
    const currentStatus = currentMemory?.status || 'unvisited';
    const statuses: VisitStatus[] = ['unvisited', 'passed_through', 'visited', 'lived'];
    const nextStatus = statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];

    await firestoreService.updateMemoryStatus(user.uid, prefecture.id, nextStatus);
    // Refetch memories to update the UI
    firestoreService.getMemories(user.uid).then(setMemories);

    alert(`${prefecture.name} status updated to: ${nextStatus}`);
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      <header className="w-full bg-white shadow-md">
        <nav className="container mx-auto px-4 py-2 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">地図コレ</h1>
          <Auth />
        </nav>
      </header>

      <div className="container mx-auto p-4">
        {/* UI to change display mode */}
        <div className="my-4 p-2 bg-white rounded shadow-sm">
          <span className="font-bold mr-4">Map Display Mode:</span>
          <button onClick={() => setDisplayMode('none')}>None</button>
          <button onClick={() => setDisplayMode('simple_color')} className="mx-2">Color</button>
          <button onClick={() => setDisplayMode('photo')}>Photo</button>
        </div>

        <JapanMap 
          memories={memories}
          displayMode={displayMode}
          onPrefectureClick={handlePrefectureClick}
        />
      </div>
    </main>
  );
}
