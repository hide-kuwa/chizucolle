'use client';
import React, { useState, useEffect } from 'react';
import Auth from '@/components/Auth';
import JapanMap from '@/components/JapanMap';
import AddMemoryModal from '@/components/AddMemoryModal';
import PrefectureDetailModal from '@/components/PrefectureDetailModal';
import LoginModal from '@/components/LoginModal';
import MergeConflictModal from '@/components/MergeConflictModal';
import GalleryView from '@/components/GalleryView';
import type { Prefecture } from '@/types';
import { useGlobalContext } from '@/context/AppContext';
import Tooltip from '@/components/Tooltip';
import { prefectures } from '@/data/prefectures';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const FooterAd: React.FC = () => {
  useEffect(() => {
    try {
      ((window.adsbygoogle = window.adsbygoogle || [])).push({});
    } catch (e) {
      console.error(e);
    }
  }, []);
  return (
    <div className="flex justify-center py-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-0000000000000000" // TODO: Replace with real Ad Unit ID
        data-ad-slot="0000000000"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

const InterstitialAd: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  useEffect(() => {
    try {
      ((window.adsbygoogle = window.adsbygoogle || [])).push({});
    } catch (e) {
      console.error(e);
    }
  }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="relative rounded-box bg-surface p-4 shadow-card">
        <button onClick={onClose} className="absolute right-2 top-2">
          ✕
        </button>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-0000000000000000" // TODO: Replace with real Ad Unit ID
          data-ad-slot="0000000000"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
  );
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
    isInitialSetupComplete,
    setIsInitialSetupComplete,
    incrementRegistrationAndCheckAd,
  } = useGlobalContext();
  const [view, setView] = useState<'map' | 'gallery'>('map');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPrefecture, setSelectedPrefecture] = useState<Prefecture | null>(null);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [tappedPrefectureId, setTappedPrefectureId] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const [showPrefectureNames, setShowPrefectureNames] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0000000000000000'; // TODO: Replace with real Ad Unit ID
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
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

  const handleBackToMap = () => {
    setView('map');
    setSelectedPrefecture(null);
  };

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="w-full bg-surface shadow-card">
        <nav className="container mx-auto flex items-center justify-between px-4 py-2">
          <h1 className="text-2xl font-bold text-primary">地図コレ</h1>
          <div className="flex items-center space-x-4">
            {!isInitialSetupComplete && (
              <button
                onClick={() => setIsInitialSetupComplete(true)}
                className="rounded-button bg-primary px-3 py-1 text-white"
              >
                初期設定完了
              </button>
            )}
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

      <div className="container mx-auto flex-grow p-4 flex flex-col items-center justify-center">
        {view === 'map' && (
          <>
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
          </>
        )}

        {view === 'gallery' && selectedPrefecture && (
          <GalleryView
            prefecture={selectedPrefecture}
            onBackToMap={handleBackToMap}
            onAddPhoto={handleAddPhotoRequest}
          />
        )}
      </div>

      <FooterAd />

      {selectedPrefecture && isDetailModalOpen && popupPosition && (
        <PrefectureDetailModal
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
          prefecture={selectedPrefecture}
          onAddPhoto={handleAddPhotoRequest}
          position={popupPosition}
        />
      )}

      <AddMemoryModal
        isOpen={isModalOpen}
        prefectureId={selectedPrefecture?.id}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onUpload={async (prefectureId, files) => {
          await addMemory(prefectureId, files);
          await refreshMemories();
          const pref =
            selectedPrefecture || prefectures.find(p => p.id === prefectureId) || null;
          if (pref) {
            setSelectedPrefecture(pref);
            setView('gallery');
          }
          const shouldShowAd = incrementRegistrationAndCheckAd();
          if (shouldShowAd) {
            setIsAdModalOpen(true);
          }
        }}
      />

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

      {isAdModalOpen && <InterstitialAd onClose={() => setIsAdModalOpen(false)} />}
    </main>
  );
}
