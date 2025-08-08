'use client';

import React, { useState } from 'react';
import type { Prefecture, VisitStatus } from '@/types';
import { useGlobalContext } from '@/context/AppContext';

interface GalleryViewProps {
  prefecture: Prefecture;
  onBackToMap: () => void;
  onAddPhoto: () => void;
}

const GalleryView: React.FC<GalleryViewProps> = ({ prefecture, onBackToMap, onAddPhoto }) => {
  const { memories, updateMemoryStatus } = useGlobalContext();
  const memory = memories.find(m => m.prefectureId === prefecture.id);
  const [status, setStatus] = useState<VisitStatus>(memory?.status || 'unvisited');

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as VisitStatus;
    setStatus(newStatus);
    await updateMemoryStatus(prefecture.id, newStatus);
  };

  return (
    <div className="min-h-[70vh] rounded-box bg-surface p-4 shadow-card">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{prefecture.name}</h2>
        <button
          onClick={onBackToMap}
          className="rounded-button bg-primary px-3 py-1 text-white"
        >
          地図に戻る
        </button>
      </header>

      <div className="mb-4 flex items-center space-x-2">
        <span>現在のステータス:</span>
        <select
          value={status}
          onChange={handleStatusChange}
          className="rounded-button border p-1"
        >
          <option value="lived">住んでいた</option>
          <option value="visited">訪れた</option>
          <option value="passed">通り過ぎた</option>
          <option value="unvisited">未訪問</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {memory?.photos?.map(photo => (
          <img
            key={photo.id}
            src={photo.url}
            alt={photo.name}
            className="h-32 w-full rounded-box object-cover"
          />
        ))}
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={onAddPhoto}
          className="rounded-button bg-accent px-4 py-2 text-white"
        >
          さらに写真を追加する
        </button>
      </div>
    </div>
  );
};

export default GalleryView;

