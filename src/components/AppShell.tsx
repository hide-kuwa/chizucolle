'use client';
import Link from 'next/link';
import { ReactNode } from 'react';

type Props = { children: ReactNode };
export default function AppShell({ children }: Props) {
  return (
    <div className="min-h-svh bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          <Link href="/" className="font-bold tracking-tight text-lg">地図コレ</Link>
          <nav className="ml-4 hidden md:flex items-center gap-1 text-sm">
            <Link href="/" className="px-3 py-2 rounded-lg hover:bg-neutral-100">マップ</Link>
            <Link href="#" className="px-3 py-2 rounded-lg hover:bg-neutral-100">リスト</Link>
            <Link href="#" className="px-3 py-2 rounded-lg hover:bg-neutral-100">旅のしおり</Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link href="#" className="px-3 py-2 rounded-lg bg-neutral-900 text-white hover:opacity-90">共有</Link>
            <Link href="#" className="px-3 py-2 rounded-lg border hover:bg-neutral-50">設定</Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-neutral-500">© 地図コレ</div>
      </footer>
    </div>
  );
}
