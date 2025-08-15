'use client';
import React, { useState, useEffect } from 'react';
import JapanMap from '@/components/JapanMap';
import AddMemoryModal from '@/components/AddMemoryModal';
import PrefectureDetailModal from '@/components/PrefectureDetailModal';
import LoginModal from '@/components/LoginModal';
import MergeConflictModal from '@/components/MergeConflictModal';
import FloatingActionDock from '@/components/FloatingActionDock';
import HoverLabelFixed from '@/components/HoverLabelFixed';
import type { Prefecture, VisitStatus } from '@/types';
import { useGlobalContext } from '@/context/AppContext';
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
    incrementRegistrationAndCheckAd,
    updateMemoryStatus,
  } = useGlobalContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrefecture, setSelectedPrefecture] = useState<Prefecture | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const [tappedPrefectureId, setTappedPrefectureId] = useState<string | null>(null);
  const [hover, setHover] = useState<{open:boolean; name:string; pt:{x:number;y:number}}>({open:false,name:'',pt:{x:0,y:0}});
  const [dockAt, setDockAt] = useState<{open:boolean; pt:{x:number;y:number}}>({open:false, pt:{x:0,y:0}});
  const [isTouchDevice, setIsTouchDevice] = useState(false);

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
  const handleClose = () => {
    setIsDetailModalOpen(false);
    setSelectedPrefecture(null);
    setPopupPosition(null);
  };

  const handleAddPhotoRequest = (prefecture: Prefecture) => {
    setSelectedPrefecture(prefecture);
    if (user) {
      setIsModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handlePrefectureClick = (
    prefecture: Prefecture,
    event: React.MouseEvent<SVGPathElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + window.scrollX + rect.width / 2,
      y: rect.top + window.scrollY + rect.height / 2,
    };
    setPopupPosition(position);

    if (isTouchDevice) {
      if (tappedPrefectureId === prefecture.id) {
        setSelectedPrefecture(prefecture);
        setIsDetailModalOpen(true);
        setTappedPrefectureId(null);
        setDockAt({ open: true, pt: { x: position.x - window.scrollX, y: position.y - window.scrollY } });
      } else {
        setTappedPrefectureId(prefecture.id);
        setIsDetailModalOpen(false);
        setDockAt({ open: false, pt: { x: 0, y: 0 } });
      }
      return;
    }

    setSelectedPrefecture(prefecture);
    setIsDetailModalOpen(true);
    setDockAt({ open: true, pt: { x: position.x - window.scrollX, y: position.y - window.scrollY } });
  };

  const handlePrefectureHover = (
    name: string,
    event: React.MouseEvent<SVGPathElement>
  ) => {
    setHover({ open: true, name, pt: { x: event.clientX, y: event.clientY } });
  };

  const handleMouseLeave = () => {
    setHover((s) => ({ ...s, open: false }));
    setTappedPrefectureId(null);
  };

  const closeDock = () => setDockAt({open:false, pt:{x:0,y:0}});

  const updateVisitStatus = (
    prefectureId: string,
    status: 'lived' | 'visited' | 'passed' | 'unvisited',
  ) => {
    const st: VisitStatus = status;
    return updateMemoryStatus(prefectureId, st);
  };

  const openPhotoModal = (prefectureId: string) => {
    const pref = prefectures.find((p) => p.id === prefectureId);
    if (pref) handleAddPhotoRequest(pref);
  };

  const hasPhotos = selectedPrefecture
    ? !!(memories.find((m) => m.prefectureId === selectedPrefecture.id)?.photos?.length)
    : false;

  return (
    <main className="relative flex min-h-screen flex-col bg-background">
      <div className="container mx-auto flex flex-grow flex-col items-center justify-center p-4">
        <JapanMap
          memories={memories}
          onPrefectureClick={handlePrefectureClick}
          onPrefectureHover={handlePrefectureHover}
          onMouseLeave={handleMouseLeave}
          onMapBackgroundClick={closeDock}
        />
        <HoverLabelFixed open={hover.open} name={hover.name} pt={hover.pt} />

        <FloatingActionDock
          open={dockAt.open && !!selectedPrefecture}
          pt={dockAt.pt}
          hasPhotos={hasPhotos}
          onSet={st => selectedPrefecture && updateVisitStatus(selectedPrefecture.id, st)}
          onAddPhoto={() => selectedPrefecture && openPhotoModal(selectedPrefecture.id)}
        />
      </div>

      <FooterAd />

      <div className="absolute inset-0 pointer-events-none">
        {selectedPrefecture && popupPosition && (
          <PrefectureDetailModal
            isOpen={isDetailModalOpen}
            prefecture={selectedPrefecture}
            onClose={handleClose}
            onAddPhoto={() => handleAddPhotoRequest(selectedPrefecture!)}
            position={popupPosition}
          />
        )}
      </div>

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

      {isAdModalOpen && <InterstitialAd onClose={() => setIsAdModalOpen(false)} />}
    </main>
  );
}
