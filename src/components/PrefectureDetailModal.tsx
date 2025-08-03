'use client';
import React from 'react';
import type { Prefecture, VisitStatus } from '@/types';
import { useGlobalContext } from '@/context/AppContext';

interface Props {
  prefecture: Prefecture;
  isOpen: boolean;
  onClose: () => void;
  onAddPhoto: () => void;
}

export default function PrefectureDetailModal({ prefecture, isOpen, onClose, onAddPhoto }: Props) {
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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-surface rounded-box shadow-card w-full max-w-lg p-6 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
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
