'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import type { Prefecture, VisitStatus } from '@/types';
import { useGlobalContext } from '@/context/AppContext';
import PhotoViewer from './PhotoViewer';

interface Props {
  prefecture: Prefecture;
  isOpen: boolean;
  onClose: () => void;
  onAddPhoto: () => void;
  position: { x: number; y: number };
}

export default function PrefectureDetailModal({ prefecture, isOpen, onClose, onAddPhoto, position }: Props) {
  const { memories, updateMemoryStatus } = useGlobalContext();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

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
  const photos = memory?.photos || [];

  const StatusButton = ({ status, label }: { status: VisitStatus; label: string }) => {
    const isActive = currentStatus === status;
    const dataState = status;

    return (
      <button
        data-state={dataState}
        onClick={() => updateMemoryStatus(prefecture.id, status)}
        className={`w-full aspect-square flex items-center justify-center rounded-lg p-1 text-xs font-semibold transition-colors ${isActive ? 'ring-2 ring-black/30' : ''}`}
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
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {photos.slice(0, 4).map((photo, idx) => (
                <img
                  key={photo.id}
                  src={photo.url}
                  alt={photo.name}
                  className="h-24 w-full cursor-pointer rounded-md object-cover"
                  onClick={() => setViewerIndex(idx)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p className="mb-2 text-sm text-text-secondary">まだ写真がありません</p>
              <button
                onClick={onAddPhoto}
                className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-500"
              >
                最初の思い出を追加
              </button>
            </div>
          )}

          {photos.length > 0 && (
            <div className="space-y-2">
              <button
                onClick={onAddPhoto}
                className="w-full rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-500"
              >
                写真を追加する
              </button>
              <Link
                href="/gallery"
                onClick={onClose}
                className="block w-full text-center text-sm text-primary underline"
              >
                ギャラリーで全てを見る
              </Link>
            </div>
          )}

          <div className="border-t border-background"></div>
          <div className="grid grid-cols-4 gap-2">
            <StatusButton status="visited" label="訪れた" />
            <StatusButton status="lived" label="住んでいた" />
            <StatusButton status="passed" label="通り過ぎた" />
            <StatusButton status="unvisited" label="未訪問" />
          </div>
        </div>
      </div>
      {viewerIndex !== null && photos.length > 0 && (
        <PhotoViewer
          photos={photos}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </div>
  );
}

