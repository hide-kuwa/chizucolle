'use client';

import { useState } from 'react';
import Auth from '@/components/Auth';
import JapanMap from '@/components/JapanMap';
import Tooltip from '@/components/Tooltip';
import type { Prefecture, TooltipData } from '@/types';

export default function Home() {
  const [selectedPrefecture, setSelectedPrefecture] = useState<Prefecture | null>(null);
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

  const handlePrefectureClick = (prefecture: Prefecture) => {
    setSelectedPrefecture(prefecture);
    console.log(`Clicked on ${prefecture.name}`);
    // In the future, this will change the view to a gallery
  };

  const handlePrefectureHover = (name: string, event: React.MouseEvent) => {
    setTooltipData({ text: name, x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
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
        <JapanMap 
          onPrefectureClick={handlePrefectureClick}
          onPrefectureHover={handlePrefectureHover}
          onMouseLeave={handleMouseLeave}
        />
      </div>
      <Tooltip data={tooltipData} />
    </main>
  );
}
