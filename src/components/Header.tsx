'use client';

import Link from 'next/link';
import React from 'react';
import { useGlobalContext } from '@/context/AppContext';

interface Props {
  onAddMemory?: () => void;
}

export default function Header({ onAddMemory }: Props) {
  const { user, isInitialSetupComplete, setIsInitialSetupComplete } = useGlobalContext();

  return (
    <header className="w-full bg-surface shadow-card">
      <nav className="container mx-auto flex items-center justify-between px-4 py-2">
        <Link href="/" className="text-2xl font-bold text-primary">
          地図コレ
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/gallery" className="text-primary hover:underline">
            ギャラリー
          </Link>
          {!isInitialSetupComplete && (
            <button
              onClick={() => setIsInitialSetupComplete(true)}
              className="rounded-button bg-primary px-3 py-1 text-white"
            >
              初期設定完了
            </button>
          )}
          {user && onAddMemory && (
            <button
              onClick={onAddMemory}
              className="rounded-button bg-primary px-3 py-1 text-white"
            >
              思い出を追加
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

