'use client';
import React, { useState, useEffect } from 'react';
import Auth from '@/components/Auth';
import JapanMap from '@/components/JapanMap';
import AddMemoryModal from '@/components/AddMemoryModal';
import PrefectureDetailModal from '@/components/PrefectureDetailModal';
import type { Prefecture } from '@/types';
import { useGlobalContext } from '@/context/AppContext';
import Tooltip from '@/components/Tooltip';

export default function Home() {
  const { user, memories, addMemory, refreshMemories } = useGlobalContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPrefecture, setSelectedPrefecture] = useState<Prefecture | null>(null);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [tappedPrefectureId, setTappedPrefectureId] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const openAddModal = () => {
    setSelectedPrefecture(null);
    setIsModalOpen(true);
  };

  const handlePrefectureClick = (prefecture: Prefecture) => {
    if (isTouchDevice) {
      if (tappedPrefectureId === prefecture.id) {
        setSelectedPrefecture(prefecture);
        setIsDetailModalOpen(true);
        setTappedPrefectureId(null);
      } else {
        setTappedPrefectureId(prefecture.id);
      }
    } else {
      setSelectedPrefecture(prefecture);
      setIsDetailModalOpen(true);
    }
  };

  const handleMapBackgroundClick = () => {
    setTappedPrefectureId(null);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPrefecture(null);
  };

  const openAddModalFromDetail = () => {
    setIsDetailModalOpen(false);
    setIsModalOpen(true);
  };

  const handlePrefectureHover = (
    name: string,
    event: React.MouseEvent<SVGPathElement>,
  ) => {
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
                onClick={openAddModal}
                className="rounded-button bg-primary px-3 py-1 text-white"
              >
                思い出を追加
              </button>
            )}
            <Auth />
          </div>
        </nav>
      </header>

      <div className="container mx-auto p-4 flex-grow flex flex-col items-center justify-center">
        <JapanMap
          memories={memories}
          onPrefectureClick={handlePrefectureClick}
          onPrefectureHover={handlePrefectureHover}
          onMouseLeave={handleMouseLeave}
          tappedPrefectureId={tappedPrefectureId}
          onMapBackgroundClick={handleMapBackgroundClick}
        />
      </div>

      {selectedPrefecture && (
        <PrefectureDetailModal
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
          prefecture={selectedPrefecture}
          onAddPhoto={openAddModalFromDetail}
        />
      )}

      <AddMemoryModal
        isOpen={isModalOpen}
        prefectureId={selectedPrefecture?.id}
        onClose={() => { setIsModalOpen(false); setSelectedPrefecture(null); }}
        onUpload={async (prefectureId, files) => {
          await addMemory(prefectureId, files);
          await refreshMemories();
        }}
      />
      {tooltip && <Tooltip text={tooltip.text} x={tooltip.x} y={tooltip.y} />}
    </main>
  );
}

