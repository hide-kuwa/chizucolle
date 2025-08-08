'use client';
import React from 'react';
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

  const getModalStyle = () => {
    const modalWidth = 320; // w-80
    const modalHeight = 250; // approximate height
    const offset = 24; // distance from cursor
    const margin = 16; // margin from viewport edges

    let top = position.y - modalHeight / 2;
    let left = position.x + offset;

    if (left + modalWidth > window.innerWidth - margin) {
      left = position.x - modalWidth - offset;
    }

    if (left < margin) {
      left = margin;
    }

    if (top < margin) {
      top = margin;
    }

    if (top + modalHeight > window.innerHeight - margin) {
      top = window.innerHeight - modalHeight - margin;
    }

    return { top: `${top}px`, left: `${left}px` };
  };

  if (!isOpen) return null;

  const memory = memories.find(m => m.prefectureId === prefecture.id);
  const currentStatus = memory?.status || 'unvisited';

  const StatusButton = ({ status, label }: { status: VisitStatus; label: string }) => {
    const isActive = currentStatus === status;
    const dataState = status;

    return (
      <button
        data-state={dataState}
        onClick={() => updateMemoryStatus(prefecture.id, status)}
        className={`w-full aspect-square flex items-center justify-center rounded-lg p-2 text-sm font-semibold transition-colors ${isActive ? 'ring-2 ring-black/30' : ''}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        style={getModalStyle()}
        className="absolute flex w-80 flex-col overflow-hidden rounded-lg border-2 border-text-primary bg-surface shadow-2xl animate-fade-in-scale"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-slate-100 p-2 border-b-2 border-text-primary">
          <h3 className="font-bold text-text-primary">{prefecture.name}</h3>
          <button onClick={onClose} className="rounded-full px-2 text-text-secondary hover:bg-slate-200">
            ×
          </button>
        </div>

        <div className="space-y-3 p-4">
          <div className="grid grid-cols-2 gap-3">
            <StatusButton status="visited" label="訪れた" />
            <StatusButton status="lived" label="住んでいた" />
            <StatusButton status="passed" label="通り過ぎた" />
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
    </div>
  );
}

