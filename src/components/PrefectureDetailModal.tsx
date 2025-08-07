'use client';
import React, { useEffect, useRef, useState } from 'react';
import type { Prefecture, VisitStatus } from '@/types';
import { useGlobalContext } from '@/context/AppContext';

interface Props {
  prefecture: Prefecture;
  isOpen: boolean;
  onClose: () => void;
  onAddPhoto: () => void;
  position: { x: number; y: number };
}

export default function PrefectureDetailModal({ prefecture, isOpen, onClose, onAddPhoto, position }: Props) {
  const { memories, updateMemoryStatus } = useGlobalContext();
  const modalRef = useRef<HTMLDivElement>(null);
  const [adjustedPos, setAdjustedPos] = useState(position);

  useEffect(() => {
    const adjustPosition = () => {
      const width = modalRef.current?.offsetWidth || 0;
      const height = modalRef.current?.offsetHeight || 0;
      const margin = 16;
      let x = position.x;
      let y = position.y;
      if (x + width + margin > window.innerWidth) {
        x = position.x - width - margin;
      }
      if (x < margin) x = margin;
      if (y + height + margin > window.innerHeight) {
        y = window.innerHeight - height - margin;
      }
      if (y < margin) y = margin;
      setAdjustedPos({ x, y });
    };
    adjustPosition();
    window.addEventListener('resize', adjustPosition);
    return () => window.removeEventListener('resize', adjustPosition);
  }, [position]);

  if (!isOpen) return null;
  const memory = memories.find(m => m.prefectureId === prefecture.id);
  const currentStatus = memory?.status || 'unvisited';

  const StatusButton = ({ status, label }: { status: VisitStatus; label: string }) => {
    const isActive = currentStatus === status;

    const colorClasses = () => {
      switch (status) {
        case 'visited':
          return isActive
            ? 'bg-visited text-emerald-900 shadow-md'
            : 'bg-visited-light text-emerald-700 hover:bg-visited';
        default:
          return isActive
            ? 'bg-primary text-white shadow-md'
            : 'bg-background text-text-secondary hover:bg-slate-200';
      }
    };

    return (
      <button
        onClick={() => updateMemoryStatus(prefecture.id, status)}
        className={`w-full aspect-square flex items-center justify-center rounded-lg p-2 text-sm font-semibold transition-colors ${colorClasses()}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div
      ref={modalRef}
      style={{ position: 'absolute', left: adjustedPos.x, top: adjustedPos.y }}
      className="pointer-events-auto z-50 flex w-80 flex-col overflow-hidden rounded-lg border-2 border-text-primary bg-surface shadow-2xl"
    >
      <div className="flex items-center justify-between bg-primary p-2 text-white">
        <h3 className="font-bold">{prefecture.name}</h3>
        <button onClick={onClose} className="rounded-full px-2 py-0 hover:bg-blue-700">
          ×
        </button>
      </div>

      <div className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-3">
          <StatusButton status="visited" label="訪れた" />
          <StatusButton status="lived" label="住んでいた" />
          <StatusButton status="passed_through" label="通り過ぎた" />
          <StatusButton status="unvisited" label="未訪問" />
        </div>
        <div className="border-t border-background"></div>
        <div>
          <button
            onClick={onAddPhoto}
            className="flex w-full items-center justify-center space-x-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-500"
          >
            <span>思い出の写真を追加</span>
          </button>
        </div>
      </div>
    </div>
  );
}

