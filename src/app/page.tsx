'use client';
import { useMemo } from 'react';
import AppShell from '@/components/AppShell';
import FloatingActionDock from '@/components/FloatingActionDock';

export default function Page() {
  const stats = useMemo(() => ({ visited: 12, total: 47, updatedAt: '2025-08-16' }), []);
  return (
    <AppShell>
      <section className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border bg-white shadow-sm p-2 md:p-3">
          <div className="aspect-[4/3] w-full rounded-xl border bg-neutral-100 grid place-items-center text-neutral-500">JapanMap</div>
        </div>
        <aside className="rounded-2xl border bg-white shadow-sm p-4 space-y-4">
          <h2 className="font-semibold">進捗</h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border p-4">
              <div className="text-2xl font-bold">{stats.visited}</div>
              <div className="text-xs text-neutral-500">訪問済</div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-2xl font-bold">{stats.total - stats.visited}</div>
              <div className="text-xs text-neutral-500">未訪問</div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-neutral-500">合計</div>
            </div>
          </div>
          <div className="text-xs text-neutral-500">最終更新 {stats.updatedAt}</div>
          <div className="grid gap-2">
            <button className="px-4 py-2 rounded-xl bg-neutral-900 text-white hover:opacity-90">SNSでシェア</button>
            <button className="px-4 py-2 rounded-xl border hover:bg-neutral-50">画像を書き出す</button>
          </div>
        </aside>
      </section>
      <FloatingActionDock
        onPaint={() => {}}
        onErase={() => {}}
        onUndo={() => {}}
        onRedo={() => {}}
        onShare={() => {}}
      />
    </AppShell>
  );
}
