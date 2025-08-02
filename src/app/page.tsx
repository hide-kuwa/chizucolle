'use client';
import { useState } from 'react';
import Auth from '@/components/Auth';
import JapanMap from '@/components/JapanMap';
import Tooltip from '@/components/Tooltip';
import type { Prefecture, TooltipData } from '@/types';

export default function Home() {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const handlePrefectureClick = (prefecture: Prefecture) => {
    // This will now work and provide feedback to the user
    console.log(`Clicked on ${prefecture.name}! ID: ${prefecture.id}`);
    alert(`You clicked on ${prefecture.name}!`);
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
        {/* ★ CRITICAL FIX: Pass all required event handlers as props */}
        <JapanMap 
          onPrefectureClick={handlePrefectureClick}
          onPrefectureHover={handlePrefectureHover}
          onMouseLeave={handleMouseLeave}
        />
      </div>
      {tooltip && <Tooltip text={tooltip.text} x={tooltip.x} y={tooltip.y} />}
    </main>
  );
}
