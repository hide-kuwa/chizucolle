'use client';
import React from 'react';
import type { Prefecture, Memory, VisitStatus } from '../types';
import { prefectures } from '../data/prefectures';

interface JapanMapProps {
  memories: Memory[];
  onPrefectureClick: (
    prefecture: Prefecture,
    event: React.MouseEvent<SVGPathElement>,
  ) => void;
  onPrefectureHover: (
    name: string,
    event: React.MouseEvent<SVGPathElement>,
  ) => void;
  onMouseLeave: () => void;
  tappedPrefectureId: string | null;
  onMapBackgroundClick: () => void;
}

const statusColors: Record<VisitStatus, string> = {
  unvisited: '#E2E8F0', // slate-200
  passed_through: '#bae6fd', // sky-200
  visited: '#6ee7b7', // emerald-300
  lived: '#fca5a5', // red-400
};

export default function JapanMap({ memories, onPrefectureClick, onPrefectureHover, onMouseLeave, tappedPrefectureId, onMapBackgroundClick }: JapanMapProps) {

  const getFill = (prefectureId: string): string => {
    const memory = memories.find(m => m.prefectureId === prefectureId);
    const status = memory?.status || 'unvisited';

    if (memory?.photos && memory.photos.length > 0) {
      return `url(#pattern-${prefectureId})`;
    }

    return statusColors[status];
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-box border bg-surface p-4 shadow-card">
      <svg viewBox="0 0 960 960" className="w-full h-auto" onMouseLeave={onMouseLeave} onClick={onMapBackgroundClick}>
        <defs>
          {memories.map(memory => (
            (memory.photos && memory.photos.length > 0) && (
              <pattern key={`pattern-${memory.prefectureId}`} id={`pattern-${memory.prefectureId}`} patternUnits="userSpaceOnUse" width="100" height="100">
                <image href={memory.photos[0].url} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
              </pattern>
            )
          ))}
        </defs>
        <g onClick={(e) => e.stopPropagation()}>
          {prefectures.map(p => (
              <path
                key={p.id}
                d={p.d}
                fill={getFill(p.id)}
                onClick={(e) => onPrefectureClick(p, e)}
                onMouseEnter={(e) => onPrefectureHover(p.name, e)}
                className={`
                  cursor-pointer stroke-text-secondary stroke-[0.5px]
                  transition-all duration-200 ease-in-out
                  hover:scale-105 hover:stroke-primary hover:stroke-[1.5px]
                  ${p.id === tappedPrefectureId ? 'animate-float stroke-accent stroke-[2px]' : ''}
                `}
              />
          ))}
        </g>
      </svg>
    </div>
  );
}
