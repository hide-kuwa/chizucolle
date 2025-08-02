'use client';
import React from 'react';
import type { Prefecture } from '../types';
import { prefectures } from '../data/prefectures';

const mockMemories: { prefectureId: string, primaryPhotoUrl: string }[] = [
    { prefectureId: 'JP-13', primaryPhotoUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=300' }
];

// ★ Define the props interface to accept event handlers
interface JapanMapProps {
  onPrefectureClick: (prefecture: Prefecture) => void;
  onPrefectureHover: (name: string, event: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

export default function JapanMap({ onPrefectureClick, onPrefectureHover, onMouseLeave }: JapanMapProps) {
  const visitedPrefectureIds = mockMemories.map(m => m.prefectureId);

  return (
    <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg border">
      {/* ★ CRITICAL FIX: Update the viewBox to the correct dimensions for the geolonia map */}
      <svg viewBox="0 0 960 960" className="w-full h-auto" onMouseLeave={onMouseLeave}>
        <defs>
          {mockMemories.map(memory => (
            <pattern key={`pattern-${memory.prefectureId}`} id={`pattern-${memory.prefectureId}`} patternUnits="userSpaceOnUse" width="100" height="100">
              <image href={memory.primaryPhotoUrl} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
            </pattern>
          ))}
        </defs>
        <g>
          {prefectures.map(p => {
            const isVisited = visitedPrefectureIds.includes(p.id);
            return (
              <path
                key={p.id}
                d={p.d}
                fill={isVisited ? `url(#pattern-${p.id})` : '#f1f5f9'}
                stroke="#64748b"
                strokeWidth="0.5"
                // ★ CRITICAL FIX: Connect the event handlers to each path
                onClick={() => onPrefectureClick(p)}
                onMouseEnter={(e) => onPrefectureHover(p.name, e)}
                className="cursor-pointer transition-all duration-150 ease-in-out hover:opacity-80 hover:stroke-blue-500 hover:stroke-width-1"
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
