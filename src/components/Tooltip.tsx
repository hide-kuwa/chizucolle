'use client';
import React from 'react';

interface TooltipProps {
  text: string;
  x: number;
  y: number;
}

export default function Tooltip({ text, x, y }: TooltipProps) {
  if (x === 0 && y === 0) return null;
  return (
    <div
      className="fixed z-50 px-3 py-1.5 text-sm font-semibold text-white bg-gray-900 rounded-md shadow-lg pointer-events-none"
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      {text}
    </div>
  );
}
