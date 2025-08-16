'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { emitPrefectureMenuSelect } from '@/lib/prefectureMenuBus';

type State = { open: boolean; id: string | null; x: number; y: number };

export default function PrefectureActionMenu() {
  const [s, setS] = useState<State>({ open: false, id: null, x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement | null>(null);

  const pos = useMemo(() => {
    const pad = 8;
    const w = 200;
    const h = 248;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
    let left = s.x;
    let top = s.y;
    if (left + w + pad > vw) left = Math.max(pad, vw - w - pad);
    if (top + h + pad > vh) top = Math.max(pad, vh - h - pad);
    return { left, top };
  }, [s.x, s.y]);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent).detail as { id: string; x: number; y: number };
      setS({ open: true, id: d.id, x: d.x, y: d.y });
    };
    const onClose = () => setS(prev => ({ ...prev, open: false }));
    window.addEventListener('prefecture-menu:open', onOpen as EventListener);
    window.addEventListener('prefecture-menu:close', onClose as EventListener);
    return () => {
      window.removeEventListener('prefecture-menu:open', onOpen as EventListener);
      window.removeEventListener('prefecture-menu:close', onClose as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!s.open) return;
    const outside = (e: Event) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setS(prev => ({ ...prev, open: false }));
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setS(prev => ({ ...prev, open: false }));
    };
    const id = setTimeout(() => {
      document.addEventListener('pointerdown', outside, true);
      document.addEventListener('keydown', esc, true);
    }, 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener('pointerdown', outside, true);
      document.removeEventListener('keydown', esc, true);
    };
  }, [s.open]);

  const act = useCallback(
    (action: 'visited' | 'passed' | 'unvisited' | 'want' | 'lived' | 'add_photos') => {
      if (!s.id) return;
      emitPrefectureMenuSelect({ id: s.id, action });
      setS(prev => ({ ...prev, open: false }));
    },
    [s.id],
  );

  if (!s.open) return null;

  return (
    <div className="fixed inset-0 z-[2147483647] pointer-events-none">
      <div
        ref={panelRef}
        className="absolute pointer-events-auto rounded-2xl border bg-white/95 backdrop-blur shadow-lg p-2 w-[200px] grid gap-2"
        style={{ left: pos.left, top: pos.top }}
      >
        <button onClick={() => act('visited')} className="px-3 py-2 rounded-xl border hover:bg-neutral-50">訪れた</button>
        <button onClick={() => act('passed')} className="px-3 py-2 rounded-xl border hover:bg-neutral-50">通った</button>
        <button onClick={() => act('unvisited')} className="px-3 py-2 rounded-xl border hover:bg-neutral-50">未訪問</button>
        <button onClick={() => act('want')} className="px-3 py-2 rounded-xl border hover:bg-neutral-50">行きたい</button>
        <button onClick={() => act('lived')} className="px-3 py-2 rounded-xl border hover:bg-neutral-50">住んだ</button>
        <button onClick={() => act('add_photos')} className="px-3 py-2 rounded-xl border hover:bg-neutral-50">写真を追加</button>
      </div>
    </div>
  );
}
