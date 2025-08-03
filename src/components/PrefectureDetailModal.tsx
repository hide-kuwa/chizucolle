'use client';
import React from 'react';
import type { Prefecture, VisitStatus } from '@/types';
import { useGlobalContext } from '@/context/AppContext';

interface Props {
  prefecture: Prefecture;
  isOpen: boolean;
  onClose: () => void;
  onAddPhoto: () => void;
  position: { x: number; y: number };
}

export default function PrefectureDetailModal({ prefecture, isOpen, onClose, onAddPhoto, position }: Props) {
  const { memories, updateMemoryStatus, user, signIn } = useGlobalContext();
  if (!isOpen) return null;
  const memory = memories.find(m => m.prefectureId === prefecture.id);
  const status = memory?.status || 'unvisited';

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateMemoryStatus(prefecture.id, e.target.value as VisitStatus);
  };

  const handleAddPhotoClick = () => {
    if (!user) {
      if (window.confirm('写真を追加するにはログインが必要です。ログインしますか？')) {
        signIn();
      }
    } else {
      onAddPhoto();
    }
  };

  const getModalStyle = () => {
    if (!position) return {};
    const modalWidth = 448;
    const modalHeight = 350;

    let left = position.x - modalWidth / 2;
    let top = position.y - modalHeight / 2;

    if (left < 16) left = 16;
    if (top < 16) top = 16;
    if (left + modalWidth > window.innerWidth - 16) {
      left = window.innerWidth - modalWidth - 16;
    }
    if (top + modalHeight > window.innerHeight - 16) {
      top = window.innerHeight - modalHeight - 16;
    }

    return {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
    };
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        style={getModalStyle()}
        className="absolute bg-surface rounded-box shadow-card w-full max-w-lg p-6 transform transition-all duration-300 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-primary mb-4">{prefecture.name}</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-text-secondary mb-1">訪問ステータス</label>
          <select value={status} onChange={handleStatusChange} className="w-full p-2 border rounded-button">
            <option value="unvisited">未訪問</option>
            <option value="passed_through">通り過ぎた</option>
            <option value="visited">訪れた</option>
            <option value="lived">住んでいた</option>
          </select>
        </div>

        <h3 className="text-lg font-semibold mb-2">思い出の写真</h3>
        <div className="grid grid-cols-3 gap-2 mb-4 h-32 overflow-y-auto bg-background p-2 rounded-box">
          {memory?.photos && memory.photos.length > 0 ? (
            memory.photos.map(photo => (
              <img key={photo.id} src={photo.url} alt={photo.name} className="h-24 w-full object-cover rounded-md" />
            ))
          ) : (
            <p className="col-span-3 text-center text-text-secondary">まだ写真がありません</p>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="rounded-button bg-background px-4 py-2">閉じる</button>
          <button onClick={handleAddPhotoClick} className="rounded-button bg-accent px-4 py-2 text-white">写真を追加</button>
        </div>
      </div>
    </div>
  );
}
