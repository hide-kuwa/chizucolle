'use client';
import React from 'react';
import type { Memory, VisitStatus } from '../types';
import { prefectures } from '../data/prefectures';

interface JapanMapProps {
  memories: Memory[];
}

const statusColors: Record<VisitStatus, string> = {
  unvisited: '#E2E8F0', // slate-200
  passed_through: '#bae6fd', // sky-200
  visited: '#6ee7b7', // emerald-300
  lived: '#fca5a5', // red-400
};

export default function JapanMap({ memories }: JapanMapProps) {
  const getFill = (prefectureId: string): string => {
    const memory = memories.find(m => m.prefectureId === prefectureId);
    const status = memory?.status || 'unvisited';
    return statusColors[status];
  };

  return (
    <div className="w-full max-w-4xl sm:mx-auto rounded-box border bg-surface p-2 sm:p-4 shadow-card">
      <svg viewBox="0 0 688 684" className="w-full h-auto">
        {prefectures.map(p => {
          const code = parseInt(p.id.replace('JP-', ''), 10).toString();
          return (
            <path
              key={p.id}
              data-pref={code}
              data-name={p.name}
              d={p.d}
              fill={getFill(p.id)}
              className="cursor-pointer"
            />
          );
        })}
      </svg>
    </div>
  );
}

