'use client';
import React, { useEffect, useMemo, useState } from 'react';
import JapanMap from './JapanMap';
import type { Memory } from '@/types';

type Props = {
  isOpen: boolean;
  memories: Memory[];
  newlyVisited: string[];
  onClose: () => void;
};

const TripShareModal: React.FC<Props> = ({ isOpen, memories, newlyVisited, onClose }) => {
  const [showShareButtons, setShowShareButtons] = useState(false);

  const previewMemories = useMemo(() => {
    const ids = new Set(newlyVisited);
    const base = memories.filter(m => !ids.has(m.prefectureId));
    const added = Array.from(ids).map(id => ({
      prefectureId: id,
      status: 'visited',
      photos: memories.find(m => m.prefectureId === id)?.photos || [],
    }));
    return [...base, ...added];
  }, [memories, newlyVisited]);

  useEffect(() => {
    if (isOpen) {
      setShowShareButtons(false);
      const timer = setTimeout(() => setShowShareButtons(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-3xl rounded bg-surface p-4">
        <button className="absolute right-2 top-2" onClick={onClose}>
          ✕
        </button>
        <JapanMap
          memories={previewMemories}
          onPrefectureClick={() => {}}
          onPrefectureHover={() => {}}
          onMouseLeave={() => {}}
          flashPrefectures={newlyVisited}
        />
        {showShareButtons && (
          <div className="mt-4 flex justify-center gap-4">
            <button className="rounded bg-blue-500 px-3 py-1 text-white">X</button>
            <button className="rounded bg-pink-500 px-3 py-1 text-white">Instagram</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripShareModal;
