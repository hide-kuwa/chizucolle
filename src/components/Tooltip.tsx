'use client';
import React from 'react';
import { TooltipData } from '@/types';

export default function Tooltip({ data }: { data: TooltipData | null }) {
  if (!data) return null;
  return (
    <div
      className="fixed z-50 px-3 py-1.5 text-sm font-semibold text-white bg-gray-900 rounded-md shadow-lg pointer-events-none"
      style={{ left: `${data.x + 15}px`, top: `${data.y + 15}px` }}
    >
      {data.text}
    </div>
  );
}
