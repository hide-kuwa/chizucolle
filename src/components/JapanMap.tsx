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

    return statusColors[status];
  };

  return (
    <div className="w-full max-w-4xl sm:mx-auto rounded-box border bg-surface p-2 sm:p-4 shadow-card">
      <svg viewBox="0 0 688 684" className="w-full h-auto" onMouseLeave={onMouseLeave} onClick={onMapBackgroundClick}>
        <g onClick={(e) => e.stopPropagation()}>
          {prefectures.map(p => {
            const memory = memories.find(m => m.prefectureId === p.id);
            const hasPhotos = memory?.photos && memory.photos.length > 0;
            const code = parseInt(p.id.replace('JP-', ''), 10).toString();

            return (
              // Prefecture shape with hover animation and border
                <path
                  key={p.id}
                  id={`pref-${code}`}
                  data-pref={code}
                  data-name={p.name}
                  d={p.d}
                  fill={getFill(p.id)}
                  onClick={(e) => onPrefectureClick(p, e)}
                  onMouseEnter={(e) => onPrefectureHover(p.name, e)}
                  className={`
                  cursor-pointer
                  transition-all transition-transform duration-200 ease-in-out
                  hover:scale-105 hover:-translate-y-1 hover:stroke-primary hover:stroke-[1.5px] hover:drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]
                  ${p.id === tappedPrefectureId
                    ? 'animate-float stroke-accent stroke-[2px]'
                    : hasPhotos
                      ? 'stroke-white stroke-2'
                      : 'stroke-white stroke-[0.5px]'}
                `}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
