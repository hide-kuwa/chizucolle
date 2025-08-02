'use client';
import React, { useEffect, useRef, useState } from 'react';
import type { Prefecture } from '../types';
import { prefectures } from '../data/prefectures';

// Mock data will be replaced by real data from a global context later.
const mockMemories: { prefectureId: string }[] = [
  { prefectureId: 'JP-13' },
];

interface JapanMapProps {
  onPrefectureClick: (prefecture: Prefecture) => void;
  onPrefectureHover: (name: string, event: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

export default function JapanMap({ onPrefectureClick, onPrefectureHover, onMouseLeave }: JapanMapProps) {
  const [svgMarkup, setSvgMarkup] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const visitedPrefectureIds = mockMemories.map(m => m.prefectureId);

  // Load SVG markup from public folder
  useEffect(() => {
    fetch('/japan.svg')
      .then(res => res.text())
      .then(setSvgMarkup)
      .catch(() => setSvgMarkup(''));
  }, []);

  // After SVG is loaded, attach events and coloring
  useEffect(() => {
    if (!svgMarkup) return;
    const container = containerRef.current;
    if (!container) return;
    const svg = container.querySelector('svg');
    if (!svg) return;

    svg.classList.add('w-full', 'h-auto');

    const handlers: Array<{ g: SVGGElement; c: () => void; e: (ev: Event) => void; l: () => void }> = [];
    const groups = svg.querySelectorAll<SVGGElement>('g.prefecture');
    groups.forEach(group => {
      const code = group.getAttribute('data-code');
      if (!code) return;
      const id = `JP-${code.padStart(2, '0')}`;
      const prefecture = prefectures.find(p => p.id === id);
      if (!prefecture) return;

      const click = () => onPrefectureClick(prefecture);
      const enter = (ev: Event) => onPrefectureHover(prefecture.name, ev as unknown as React.MouseEvent);
      const leave = () => onMouseLeave();
      group.addEventListener('click', click);
      group.addEventListener('mouseenter', enter);
      group.addEventListener('mouseleave', leave);

      if (visitedPrefectureIds.includes(prefecture.id)) {
        group.setAttribute('fill', '#93c5fd');
      } else {
        group.setAttribute('fill', '#f1f5f9');
      }

      handlers.push({ g: group, c: click, e: enter, l: leave });
    });

    return () => {
      handlers.forEach(({ g, c, e, l }) => {
        g.removeEventListener('click', c);
        g.removeEventListener('mouseenter', e);
        g.removeEventListener('mouseleave', l);
      });
    };
  }, [svgMarkup, onPrefectureClick, onPrefectureHover, onMouseLeave, visitedPrefectureIds]);

  return (
    <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg border">
      <div ref={containerRef} onMouseLeave={onMouseLeave} dangerouslySetInnerHTML={{ __html: svgMarkup }} />
    </div>
  );
}
