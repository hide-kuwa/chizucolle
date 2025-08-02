'use client';
import React from 'react';
import type { Prefecture } from '../types';
import { prefectures } from '../data/prefectures';

// Mock data will be replaced by real data from a global context later.
const mockMemories: { prefectureId: string, primaryPhotoUrl: string }[] = [
    { prefectureId: 'JP-13', primaryPhotoUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=300' }
];

interface JapanMapProps {
  onPrefectureClick: (prefecture: Prefecture) => void;
}

export default function JapanMap({ onPrefectureClick }: JapanMapProps) {
  const visitedPrefectureIds = mockMemories.map(m => m.prefectureId);

  return (
    <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg border">
      <svg viewBox="0 0 500 450" className="w-full h-auto">
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
                onClick={() => onPrefectureClick(p)}
                className="cursor-pointer transition-opacity hover:opacity-80"
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
