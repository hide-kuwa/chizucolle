'use client';

import React from 'react';

interface Props {
  isOpen: boolean;
  onSelectLocal: () => void;
  onSelectRemote: () => void;
}

export default function MergeConflictModal({ isOpen, onSelectLocal, onSelectRemote }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in-scale">
      <div className="w-full max-w-sm rounded-2xl bg-surface p-6 text-center shadow-2xl">
        <h3 className="mb-2 text-lg font-bold text-primary">保存データの選択</h3>
        <p className="mb-6 text-text-secondary">
          このブラウザの作業内容とクラウド上のデータに違いがあります。どちらを使用しますか？
        </p>
        <div className="space-y-2">
          <button
            onClick={onSelectLocal}
            className="w-full rounded-lg bg-primary py-2.5 font-semibold text-white transition hover:bg-blue-500"
          >
            このブラウザの作業内容を優先する
          </button>
          <button
            onClick={onSelectRemote}
            className="w-full rounded-lg bg-background py-2.5 font-semibold text-text-secondary transition hover:bg-slate-200"
          >
            クラウドに保存されたデータを優先する
          </button>
        </div>
      </div>
    </div>
  );
}

