'use client';

import React from 'react';
import { useGlobalContext } from '@/context/AppContext';
import { prefectures } from '@/data/prefectures';
import type { Photo } from '@/types';
import useHorizontalScroll from '@/hooks/useHorizontalScroll';

function PhotoRow({ photos }: { photos: Photo[] }) {
  const { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove, onWheel } =
    useHorizontalScroll<HTMLDivElement>();

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onWheel={onWheel}
      className="flex gap-2 overflow-x-auto pb-2"
    >
      {photos.map(photo => (
        <img
          key={photo.id}
          src={photo.url}
          alt={photo.name}
          loading="lazy"
          className="h-32 w-48 flex-shrink-0 rounded-lg object-cover"
        />
      ))}
    </div>
  );
}

export default function GalleryPage() {
  const { memories } = useGlobalContext();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto space-y-8 p-4">
        {prefectures.map(pref => {
          const memory = memories.find(m => m.prefectureId === pref.id);
          if (!memory || memory.photos.length === 0) return null;
          return (
            <section key={pref.id} className="space-y-2">
              <h2 className="text-lg font-semibold text-text-primary">
                {pref.name}
              </h2>
              <PhotoRow photos={memory.photos} />
            </section>
          );
        })}
      </div>
    </main>
  );
}

