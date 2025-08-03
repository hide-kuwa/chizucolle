'use client';
import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
}

export default function LoginModal({ isOpen, onClose, onSignIn }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in-scale" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl bg-surface p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-2 text-lg font-bold text-primary">ログインが必要です</h3>
        <p className="mb-6 text-text-secondary">
          思い出の写真を保存・管理するには、Googleアカウントでのログインをお願いします。
        </p>
        <div className="space-y-2">
          <button
            onClick={onSignIn}
            className="w-full rounded-lg bg-primary py-2.5 font-semibold text-white transition hover:bg-blue-500"
          >
            Googleでログイン
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-background py-2.5 font-semibold text-text-secondary transition hover:bg-slate-200"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}

