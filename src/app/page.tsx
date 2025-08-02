'use client';

import { useState } from 'react';
import Auth from '@/components/Auth';
import JapanMap from '@/components/JapanMap';
import Tooltip from '@/components/Tooltip';
import type { Prefecture, TooltipData } from '@/types';

export default function Home() {
  const [view, setView] = useState<'map' | 'gallery'>('map');
  const [selectedPrefecture, setSelectedPrefecture] = useState<Prefecture | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const handlePrefectureClick = (prefecture: Prefecture) => {
    setSelectedPrefecture(prefecture);
    console.log(`Clicked on ${prefecture.name}`);
    // In the future, this will change the view to 'gallery'
    // setView('gallery');
  };

  const handlePrefectureHover = (name: string, event: React.MouseEvent) => {
    setTooltip({ text: name, x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
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
          <JapanMap
            onPrefectureClick={handlePrefectureClick}
            onPrefectureHover={handlePrefectureHover}
            onMouseLeave={handleMouseLeave}
          />
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
      {tooltip && <Tooltip text={tooltip.text} x={tooltip.x} y={tooltip.y} />}
    </main>
  );
}
