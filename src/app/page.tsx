'use client';
import { useState } from 'react';
import Auth from '@/components/Auth';
import JapanMap from '@/components/JapanMap';
import AddMemoryModal from '@/components/AddMemoryModal';
import type { Prefecture, VisitStatus } from '@/types';
import { firestoreService } from '@/services/firestoreService';
import { useGlobalContext } from '@/context/AppContext';

// Define the possible display modes for the map
type MapDisplayMode = 'simple_color' | 'photo' | 'none';

export default function Home() {
  const { user, memories, addMemory, refreshMemories } = useGlobalContext();
  const [displayMode, setDisplayMode] = useState<MapDisplayMode>('photo');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePrefectureClick = async (prefecture: Prefecture) => {
    if (!user) {
      alert('Please sign in to record your visit!');
      return;
    }
    const currentMemory = memories.find(m => m.prefectureId === prefecture.id);
    const currentStatus = currentMemory?.status || 'unvisited';
    const statuses: VisitStatus[] = ['unvisited', 'passed_through', 'visited', 'lived'];
    const nextStatus = statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];

    await firestoreService.updateMemoryStatus(user.uid, prefecture.id, nextStatus);
    await refreshMemories();
    alert(`${prefecture.name} status updated to: ${nextStatus}`);
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      <header className="w-full bg-white shadow-md">
        <nav className="container mx-auto flex items-center justify-between px-4 py-2">
          <h1 className="text-2xl font-bold text-blue-600">地図コレ</h1>
          <div className="flex items-center space-x-4">
            {user && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="rounded bg-blue-500 px-3 py-1 text-white"
              >
                思い出を追加
              </button>
            )}
            <Auth />
          </div>
        </nav>
      </header>

      <div className="container mx-auto p-4">
        {/* UI to change display mode */}
        <div className="my-4 rounded bg-white p-2 shadow-sm">
          <span className="mr-4 font-bold">Map Display Mode:</span>
          <button onClick={() => setDisplayMode('none')}>None</button>
          <button onClick={() => setDisplayMode('simple_color')} className="mx-2">
            Color
          </button>
          <button onClick={() => setDisplayMode('photo')}>Photo</button>
        </div>

        <JapanMap
          memories={memories}
          displayMode={displayMode}
          onPrefectureClick={handlePrefectureClick}
        />
      </div>

      <AddMemoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={async (prefectureId, files) => {
          await addMemory(prefectureId, files);
          await refreshMemories();
        }}
      />
    </main>
  );
}

