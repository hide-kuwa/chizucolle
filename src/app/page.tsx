'use client';
import React, { useState, useEffect } from 'react';
import Auth from '@/components/Auth';
import JapanMap from '@/components/JapanMap';
import AddMemoryModal from '@/components/AddMemoryModal';
import PrefectureDetailModal from '@/components/PrefectureDetailModal';
import LoginModal from '@/components/LoginModal';
import type { Prefecture } from '@/types';
import { useGlobalContext } from '@/context/AppContext';
import Tooltip from '@/components/Tooltip';

export default function Home() {
  const { user, memories, addMemory, refreshMemories, signIn } = useGlobalContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPrefecture, setSelectedPrefecture] = useState<Prefecture | null>(null);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [tappedPrefectureId, setTappedPrefectureId] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const [showPrefectureNames, setShowPrefectureNames] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const openAddModal = () => {
    setSelectedPrefecture(null);
    setIsModalOpen(true);
  };

  const handlePrefectureClick = (
    prefecture: Prefecture,
    event: React.MouseEvent<SVGPathElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY + rect.height / 2,
    };
    setPopupPosition(position);

    if (isTouchDevice) {
      if (tappedPrefectureId === prefecture.id) {
        setSelectedPrefecture(prefecture);
        setIsDetailModalOpen(true);
        setTappedPrefectureId(null);
      } else {
        setTappedPrefectureId(prefecture.id);
        setIsDetailModalOpen(false);
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

  const handleAddPhotoRequest = () => {
    if (user) {
      setIsDetailModalOpen(false);
      setIsModalOpen(true);
    } else {
      setIsDetailModalOpen(false);
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
          tappedPrefectureId={tappedPrefectureId}
          onMapBackgroundClick={handleMapBackgroundClick}
        />
      </div>

      {/* ↓↓↓ ここの部分が、一番大事な心臓部だ！ ↓↓↓ */}

      {/* 県が選択されて、ポップアップの位置が決まったら、詳細モーダルを開く！ */}
      {selectedPrefecture && isDetailModalOpen && popupPosition && (
        // Display the prefecture details in a dedicated modal
        <PrefectureDetailModal
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
          prefecture={selectedPrefecture}
          onAddPhoto={handleAddPhotoRequest}
          position={popupPosition}
        />
      )}

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

      {tooltip && <Tooltip text={tooltip.text} x={tooltip.x} y={tooltip.y} />}
    </main>
  );
}

