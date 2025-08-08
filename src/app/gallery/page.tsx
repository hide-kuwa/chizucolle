'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { useGlobalContext } from '@/context/AppContext';
import { prefectures } from '@/data/prefectures';

export default function GalleryPage() {
  const { memories } = useGlobalContext();
  const photos = memories.flatMap(m =>
    m.photos.map(p => ({ ...p, prefectureId: m.prefectureId }))
  );

  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        setVisibleCount(v => Math.min(v + 20, photos.length));
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [photos.length]);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-4">
        <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
          {photos.slice(0, visibleCount).map(photo => (
            <div key={photo.id} className="mb-4 break-inside-avoid-column">
              <img
                src={photo.url}
                alt={photo.name}
                className="w-full rounded-lg object-cover"
              />
              <p className="mt-1 text-sm text-text-secondary">
                {prefectures.find(p => p.id === photo.prefectureId)?.name || ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

