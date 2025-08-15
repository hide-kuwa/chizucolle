'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useGlobalContext } from '@/context/AppContext';

export default function Sidebar() {
  const { user, signIn, signOut } = useGlobalContext();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`bg-surface h-full text-text-primary shadow-lg transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      <nav className="h-full flex flex-col p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mb-4 self-end p-2 rounded-lg hover:bg-background"
        >
          {isCollapsed ? '開く' : '畳む'}
        </button>

        <ul className="space-y-2 flex-grow">
          <li>
            <Link href="/" className="flex items-center p-2 rounded-lg hover:bg-background">
              <span className="text-2xl">🗺️</span>
              {!isCollapsed && <span className="ml-3 font-semibold">地図</span>}
            </Link>
          </li>
          <li>
            <Link href="/gallery" className="flex items-center p-2 rounded-lg hover:bg-background">
              <span className="text-2xl">🖼️</span>
              {!isCollapsed && <span className="ml-3 font-semibold">ギャラリー</span>}
            </Link>
          </li>
          {/**
          <li>
            <Link href="/settings" className="flex items-center p-2 rounded-lg hover:bg-background">
              <span className="text-2xl">⚙️</span>
              {!isCollapsed && <span className="ml-3 font-semibold">設定</span>}
            </Link>
          </li>
          */}
        </ul>

        <div className="border-t border-background pt-4">
          {user ? (
            <button
              onClick={signOut}
              className="flex items-center w-full p-2 rounded-lg hover:bg-background"
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full" />
              ) : (
                <span className="text-2xl">👤</span>
              )}
              {!isCollapsed && <span className="ml-3 text-sm">サインアウト</span>}
            </button>
          ) : (
            <button
              onClick={signIn}
              className="flex items-center w-full p-2 rounded-lg hover:bg-background"
            >
              <span className="text-2xl">🚪</span>
              {!isCollapsed && <span className="ml-3 font-semibold">ログイン</span>}
            </button>
          )}
        </div>
      </nav>
    </aside>
  );
}

