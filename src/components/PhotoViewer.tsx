'use client';

import React, { useEffect, useState } from 'react';
import type { Photo } from '@/types';
import { firestoreService } from '@/services/firestoreService';

interface Props {
  userId: string;
  prefectureId: string;
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
}
export default function PhotoViewer({ userId, prefectureId, photos, initialIndex, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [caption, setCaption] = useState(photos[initialIndex]?.caption || '');
  const [likes, setLikes] = useState(photos[initialIndex]?.likes || 0);

  useEffect(() => {
    setCaption(photos[index]?.caption || '');
    setLikes(photos[index]?.likes || 0);
  }, [index, photos]);

  const saveCaption = async () => {
    if (!userId) return;
    await firestoreService.updatePhotoCaption(userId, prefectureId, photos[index].id, caption);
    photos[index].caption = caption;
  };

  const likePhoto = async () => {
    const newLikes = (likes || 0) + 1;
    setLikes(newLikes);
    photos[index].likes = newLikes;
    await firestoreService.updatePhotoLikes(userId, prefectureId, photos[index].id, newLikes);
  };

  const next = () => setIndex(prev => (prev + 1) % photos.length);
  const prev = () => setIndex(prev => (prev - 1 + photos.length) % photos.length);

  const photo = photos[index];
  const createdAt = photo.createdAt instanceof Date
    ? photo.createdAt.toISOString()
    : photo.createdAt;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <button
        className="absolute top-4 right-4 text-3xl text-white"
        onClick={onClose}
      >
        ×
      </button>
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl text-white"
        onClick={prev}
        aria-label="previous"
      >
        ‹
      </button>
      <img
        src={photo.url}
        alt={photo.name}
        className="max-h-full max-w-full object-contain"
      />
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl text-white"
        onClick={next}
        aria-label="next"
      >
        ›
      </button>
      <div className="absolute bottom-6 left-6 text-white">
        <p>{photo.name}</p>
        {createdAt && <p className="text-sm">{createdAt}</p>}
        <button onClick={likePhoto} className="mt-2 text-lg">❤️ {likes}</button>
      </div>
      <div className="absolute bottom-6 right-6 flex flex-col">
        <input
          value={caption}
          onChange={e => setCaption(e.target.value)}
          placeholder="キャプションを入力"
          className="rounded p-1 text-black"
        />
        <button
          onClick={saveCaption}
          className="mt-2 rounded bg-white/80 px-2 py-1 text-black"
        >
          保存
        </button>
      </div>
    </div>
  );
}

