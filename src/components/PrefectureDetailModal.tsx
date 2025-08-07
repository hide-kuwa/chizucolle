'use client';
import React from 'react';
import { Rnd } from 'react-rnd';
import type { Prefecture, VisitStatus } from '@/types';
import { useGlobalContext } from '@/context/AppContext';

interface Props {
  prefecture: Prefecture;
  isOpen: boolean;
  onClose: () => void;
  onAddPhoto: () => void;
  zIndex: number;
  onFocus: () => void;
}

export default function PrefectureDetailModal({ prefecture, isOpen, onClose, onAddPhoto, zIndex, onFocus }: Props) {
  const { memories, updateMemoryStatus } = useGlobalContext();
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
    <Rnd
      default={{
        x: window.innerWidth / 2 - 160,
        y: 150,
        width: 320,
        height: 'auto',
      }}
      minWidth={280}
      minHeight={250}
      bounds="parent"
      onDragStart={onFocus}
      onClick={onFocus}
      style={{ zIndex }}
      className="flex flex-col overflow-hidden rounded-lg border-2 border-text-primary bg-surface shadow-2xl"
      dragHandleClassName="handle"
    >
      <div className="handle flex cursor-move items-center justify-between bg-primary p-2 text-white">
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
    </Rnd>
  );
}

