'use client';
import React from 'react';
import type { Prefecture, Memory, VisitStatus } from '../types';
import { prefectures } from '../data/prefectures';

type MapDisplayMode = 'simple_color' | 'photo' | 'none';

interface JapanMapProps {
  memories: Memory[];
  displayMode: MapDisplayMode;
  onPrefectureClick: (prefecture: Prefecture) => void;
  onPrefectureHover: (name: string, event: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

const statusColors: Record<VisitStatus, string> = {
  unvisited: '#E2E8F0', // slate-200
  passed_through: '#bae6fd', // sky-200
  visited: '#6ee7b7', // emerald-300
  lived: '#fca5a5', // red-400
};

export default function JapanMap({ memories, displayMode, onPrefectureClick, onPrefectureHover, onMouseLeave }: JapanMapProps) {

  const getFill = (prefectureId: string): string => {
    const memory = memories.find(m => m.prefectureId === prefectureId);
    const status = memory?.status || 'unvisited';

    if (displayMode === 'none' || status === 'unvisited') {
      return statusColors.unvisited;
    }

    if (displayMode === 'photo' && memory?.photos && memory.photos.length > 0) {
      // Use the first photo as the primary one for the pattern
      return `url(#pattern-${prefectureId})`;
    }

    // Fallback to simple color
    return statusColors[status];
  };

  return (
    <div className="w-full max-w-4xl rounded-box border bg-surface p-4 shadow-card">
      <svg viewBox="0 0 960 960" className="w-full h-auto" onMouseLeave={onMouseLeave}>
        <defs>
          {memories.map(memory => (
            (memory.photos && memory.photos.length > 0) && (
              <pattern key={`pattern-${memory.prefectureId}`} id={`pattern-${memory.prefectureId}`} patternUnits="userSpaceOnUse" width="100" height="100">
                <image href={memory.photos[0].url} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
              </pattern>
            )
          ))}
        </defs>
        <g>
          {prefectures.map(p => (
              <path
                key={p.id}
                d={p.d}
                fill={getFill(p.id)}
                strokeWidth="0.5"
                onClick={() => onPrefectureClick(p)}
                onMouseEnter={(e) => onPrefectureHover(p.name, e)}
                className="cursor-pointer stroke-text-primary transition-all duration-150 ease-in-out hover:opacity-80"
              />
          ))}
        </g>
      </svg>
    </div>
  );
}
