'use client';
import React from 'react';

interface TooltipProps {
  text: string;
  x: number;
  y: number;
}

export default function Tooltip({ text, x, y }: TooltipProps) {
  if (!text) return null;
  return (
    <div
      className="pointer-events-none fixed z-50 rounded-button bg-text-primary px-3 py-1.5 text-sm font-semibold text-white shadow-card"
      style={{ top: `${y}px`, left: `${x}px` }}
    >
      {text}
    </div>
  );
};
