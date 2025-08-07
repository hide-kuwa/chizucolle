'use client';
import React, { useState } from 'react';
import Auth from '@/components/Auth';
import JapanMap from '@/components/JapanMap';
import AddMemoryModal from '@/components/AddMemoryModal';
import PrefectureDetailModal from '@/components/PrefectureDetailModal';
import LoginModal from '@/components/LoginModal';
import MergeConflictModal from '@/components/MergeConflictModal';
import type { Prefecture } from '@/types';
import { useGlobalContext } from '@/context/AppContext';
import Tooltip from '@/components/Tooltip';

type WindowState = {
  prefecture: Prefecture;
  zIndex: number;
};

export default function Home() {
  const {
    user,
    memories,
    addMemory,
    refreshMemories,
    signIn,
    conflict,
    onSelectLocal,
    onSelectRemote,
  } = useGlobalContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrefecture, setSelectedPrefecture] = useState<Prefecture | null>(null);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [showPrefectureNames, setShowPrefectureNames] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [openWindows, setOpenWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(100);

  const handlePrefectureClick = (prefecture: Prefecture) => {
    const existingWindowIndex = openWindows.findIndex(w => w.prefecture.id === prefecture.id);

    if (existingWindowIndex !== -1) {
      handleFocus(prefecture.id);
    } else {
      setOpenWindows(prev => [...prev, { prefecture, zIndex: nextZIndex }]);
      setNextZIndex(prev => prev + 1);
    }
  };

  const handleClose = (prefectureId: string) => {
    setOpenWindows(prev => prev.filter(w => w.prefecture.id !== prefectureId));
  };

  const handleFocus = (prefectureId: string) => {
    const windowIndex = openWindows.findIndex(w => w.prefecture.id === prefectureId);
    if (windowIndex !== -1 && openWindows[windowIndex].zIndex < nextZIndex - 1) {
      setOpenWindows(prev =>
        prev.map(w =>
          w.prefecture.id === prefectureId ? { ...w, zIndex: nextZIndex } : w,
        ),
      );
      setNextZIndex(prev => prev + 1);
    }
  };

  const handleAddPhotoRequest = (prefecture: Prefecture) => {
    setSelectedPrefecture(prefecture);
    if (user) {
      setIsModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handlePrefectureHover = (
    name: string,
    event: React.MouseEvent<SVGPathElement>,
  ) => {
    if (showPrefectureNames) {
      setTooltip({ text: name, x: event.clientX + 15, y: event.clientY + 15 });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="pointer-events-none absolute top-0 left-0 right-0 flex justify-between p-4">
        <h1 className="pointer-events-auto text-2xl font-bold text-primary">地図コレ</h1>
        <div className="pointer-events-auto"><Auth /></div>
      </header>

      <div className="container mx-auto p-4 flex-grow flex flex-col items-center justify-center">
        <div className="mb-4 bg-surface p-2 rounded-box shadow-card self-start">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPrefectureNames}
              onChange={() => setShowPrefectureNames(!showPrefectureNames)}
              className="form-checkbox h-5 w-5 text-primary"
            />
            <span className="text-text-secondary">都道府県名を表示</span>
          </label>
        </div>

        <JapanMap
          memories={memories}
          onPrefectureClick={handlePrefectureClick}
          onPrefectureHover={handlePrefectureHover}
          onMouseLeave={handleMouseLeave}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {openWindows.map(windowState => (
          <PrefectureDetailModal
            key={windowState.prefecture.id}
            isOpen={true}
            prefecture={windowState.prefecture}
            onClose={() => handleClose(windowState.prefecture.id)}
            onAddPhoto={() => handleAddPhotoRequest(windowState.prefecture)}
            zIndex={windowState.zIndex}
            onFocus={() => handleFocus(windowState.prefecture.id)}
          />
        ))}
      </div>

      {/* 写真追加モーダル */}
      <AddMemoryModal
        isOpen={isModalOpen}
        prefectureId={selectedPrefecture?.id}
        onClose={() => { setIsModalOpen(false); setSelectedPrefecture(null); }}
        onUpload={async (prefectureId, files) => {
          await addMemory(prefectureId, files);
          await refreshMemories();
        }}
      />

      {/* ログインモーダル */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSignIn={() => {
          signIn();
          setIsLoginModalOpen(false);
        }}
      />

      <MergeConflictModal
        isOpen={!!conflict}
        onSelectLocal={onSelectLocal}
        onSelectRemote={onSelectRemote}
      />

      {tooltip && <Tooltip text={tooltip.text} x={tooltip.x} y={tooltip.y} />}
    </main>
  );
}

