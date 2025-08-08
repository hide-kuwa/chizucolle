'use client';

import React, { useState } from 'react';
import type { Photo } from '@/types';

interface Props {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
}

export default function PhotoViewer({ photos, initialIndex, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);

  const next = () => setIndex(prev => (prev + 1) % photos.length);
  const prev = () => setIndex(prev => (prev - 1 + photos.length) % photos.length);

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
        src={photos[index].url}
        alt={photos[index].name}
        className="max-h-full max-w-full object-contain"
      />
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl text-white"
        onClick={next}
        aria-label="next"
      >
        ›
      </button>
    </div>
  );
}

