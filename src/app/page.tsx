'use client';

import { useState } from 'react';
import Auth from '@/components/Auth'; // Assuming Auth component exists
import JapanMap from '@/components/JapanMap';
import type { Prefecture } from '@/types';

export default function Home() {
  const [view, setView] = useState<'map' | 'gallery'>('map');
  const [selectedPrefecture, setSelectedPrefecture] = useState<Prefecture | null>(null);

  const handlePrefectureClick = (prefecture: Prefecture) => {
    setSelectedPrefecture(prefecture);
    // For now, just log it. We will build the gallery view next.
    console.log(`Clicked on ${prefecture.name}`);
    // setView('gallery');
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      <header className="w-full bg-white shadow-md">
        <nav className="container mx-auto px-4 py-2 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">地図コレ</h1>
          <Auth />
        </nav>
      </header>

      <div className="flex-grow flex items-center justify-center p-4">
        {view === 'map' && (
          <JapanMap onPrefectureClick={handlePrefectureClick} />
        )}
        {/* Gallery View will be added here in the next step */}
        {view === 'gallery' && selectedPrefecture && (
          <div>
            <h2>{selectedPrefecture.name} Memories</h2>
            <button onClick={() => setView('map')}>Back to Map</button>
            {/* Photo gallery will be implemented here */}
          </div>
        )}
      </div>
    </main>
  );
}
