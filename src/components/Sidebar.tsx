'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useGlobalContext } from '@/context/AppContext';

// 将来的に、ここにHeroiconsやLucide Reactなどのアイコンライブラリを導入することを推奨する
// const MapIcon = () => <svg>...</svg>; 

export default function Sidebar() {
  const { user, signIn, signOut } = useGlobalContext();
  // デフォルトで折りたたんでおくことで、地図を主役にする思想を強調する
  const [isCollapsed, setIsCollapsed] = useState(true);

  const NavLink = ({ href, icon, text }: { href: string, icon: string, text: string }) => (
    <li>
      <Link href={href} className="flex items-center p-2 rounded-lg hover:bg-background text-text-secondary hover:text-text-primary group">
        <span className="text-2xl w-8 text-center">{icon}</span>
        {!isCollapsed && <span className="ml-3 font-semibold whitespace-nowrap">{text}</span>}
      </Link>
    </li>
  );

  return (
    <aside className={`bg-surface h-full flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <nav className="flex-1 flex flex-col pt-4 px-2">
        {/* 展開/折りたたみボタン */}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-lg hover:bg-background self-start mb-4 ml-2">
          <span className="text-2xl">🍔</span>
        </button>

        <ul className="space-y-2 flex-grow">
          <NavLink href="/" icon="🗺️" text="地図" />
          <NavLink href="/gallery" icon="🖼️" text="ギャラリー" />
          {/* <NavLink href="/settings" icon="⚙️" text="設定" /> */}
        </ul>

        <div className="border-t border-background mt-4 pt-4 px-2">
          {user ? (
            <button onClick={signOut} className="flex items-center w-full p-2 rounded-lg hover:bg-background group">
              {user.photoURL ? (
                <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full" />
              ) : (
                <span className="text-2xl w-8 text-center">👤</span>
              )}
              {!isCollapsed && <span className="ml-3 text-sm whitespace-nowrap">サインアウト</span>}
            </button>
          ) : (
            <button onClick={signIn} className="flex items-center w-full p-2 rounded-lg hover:bg-background group">
              <span className="text-2xl w-8 text-center">🚪</span>
              {!isCollapsed && <span className="ml-3 font-semibold whitespace-nowrap">ログイン</span>}
            </button>
          )}
        </div>
      </nav>
    </aside>
  );
}

