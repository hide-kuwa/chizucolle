'use client';
import React, { useState } from 'react';
import Auth from '@/components/Auth';
import JapanMap from '@/components/JapanMap';
import AddMemoryModal from '@/components/AddMemoryModal';
import GalleryView from '@/components/GalleryView';
import type { Prefecture } from '@/types';
import { useGlobalContext } from '@/context/AppContext';
import Tooltip from '@/components/Tooltip';

// Define the possible display modes for the map
type MapDisplayMode = 'simple_color' | 'photo' | 'none';

export default function Home() {
  const { user, memories, addMemory, refreshMemories } = useGlobalContext();
  const [displayMode, setDisplayMode] = useState<MapDisplayMode>('photo');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrefecture, setSelectedPrefecture] = useState<Prefecture | null>(null);
  const [modalPrefectureId, setModalPrefectureId] = useState<string>('');
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const openAddModal = (prefectureId: string) => {
    setModalPrefectureId(prefectureId);
    setIsModalOpen(true);
  };

  const handlePrefectureClick = (prefecture: Prefecture) => {
    if (!user) {
      alert('Please sign in to record your visit!');
      return;
    }
    const currentMemory = memories.find(m => m.prefectureId === prefecture.id);
    if (currentMemory) {
      setSelectedPrefecture(prefecture);
    } else {
      openAddModal(prefecture.id);
    }
  };

  const handlePrefectureHover = (name: string, event: React.MouseEvent) => {
    setTooltip({ text: name, x: event.clientX + 15, y: event.clientY + 15 });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="w-full bg-surface shadow-card">
        <nav className="container mx-auto flex items-center justify-between px-4 py-2">
          <h1 className="text-2xl font-bold text-primary">地図コレ</h1>
          <div className="flex items-center space-x-4">
            {user && (
              <button
                onClick={() => openAddModal('')}
                className="rounded-button bg-primary px-3 py-1 text-white"
              >
                思い出を追加
              </button>
            )}
            <Auth />
          </div>
        </nav>
      </header>

      <div className="container mx-auto p-4">
        {selectedPrefecture ? (
          <GalleryView
            prefecture={selectedPrefecture}
            onBackToMap={() => setSelectedPrefecture(null)}
            onAddPhoto={() => openAddModal(selectedPrefecture.id)}
          />
        ) : (
          <>
            {/* UI to change display mode */}
            <div className="my-4 rounded-box bg-surface p-2 shadow-card">
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
              onPrefectureHover={handlePrefectureHover}
              onMouseLeave={handleMouseLeave}
            />
          </>
        )}
      </div>

      <AddMemoryModal
        isOpen={isModalOpen}
        prefectureId={modalPrefectureId || undefined}
        onClose={() => setIsModalOpen(false)}
        onUpload={async (prefectureId, files) => {
          await addMemory(prefectureId, files);
          await refreshMemories();
        }}
      />
      {tooltip && <Tooltip text={tooltip.text} x={tooltip.x} y={tooltip.y} />}
    </main>
  );
}

