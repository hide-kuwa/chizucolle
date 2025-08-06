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
  if (!isOpen) return null;
  const memory = memories.find(m => m.prefectureId === prefecture.id);
  const currentStatus = memory?.status || 'unvisited';

  const getModalStyle = () => {
    const modalWidth = 320; // w-80
    const modalHeight = 250; // modal approximate height
    const offset = 24; // distance from cursor

    const isRightSide = position.x > window.innerWidth / 2;

    let top = position.y - modalHeight / 2;
    const left = isRightSide
      ? position.x - modalWidth - offset
      : position.x + offset;

    if (top < 16) top = 16;
    if (top + modalHeight > window.innerHeight - 16)
      top = window.innerHeight - modalHeight - 16;

    return { top: `${top}px`, left: `${left}px` };
  };

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
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        style={getModalStyle()}
        className="absolute w-80 rounded-2xl bg-surface p-5 shadow-2xl transition-all duration-300 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-xl font-bold text-primary">{prefecture.name}</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <StatusButton status="visited" label="訪れた" />
            <StatusButton status="lived" label="住んでいた" />
            <StatusButton status="passed_through" label="通り過ぎた" />
            <StatusButton status="unvisited" label="未訪問" />
          </div>

          <div className="my-3 border-t border-background"></div>

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

