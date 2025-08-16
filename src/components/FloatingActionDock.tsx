'use client';

import { useEffect, useRef, useState } from 'react';
import Portal from './Portal';

type Props = {
  onPaint?: () => void;
  onErase?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onShare?: () => void;
};

export default function FloatingActionDock({ onPaint, onErase, onUndo, onRedo, onShare }: Props) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: Event) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    const id = setTimeout(() => {
      document.addEventListener('pointerdown', handler, true);
    }, 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener('pointerdown', handler, true);
    };
  }, [open]);

  return (
    <Portal>
      <div className="fixed inset-0 pointer-events-none z-[2147483647]">
        <div className="absolute bottom-4 right-4 pointer-events-auto">
          <div className="relative" ref={panelRef}>
            <div className={`absolute bottom-14 right-0 grid gap-2 transition-all duration-200 ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
              <button onClick={onPaint} className="px-3 py-2 rounded-xl border bg-white/90 backdrop-blur shadow">塗る</button>
              <button onClick={onErase} className="px-3 py-2 rounded-xl border bg-white/90 backdrop-blur shadow">消しゴム</button>
              <button onClick={onUndo} className="px-3 py-2 rounded-xl border bg-white/90 backdrop-blur shadow">元に戻す</button>
              <button onClick={onRedo} className="px-3 py-2 rounded-xl border bg-white/90 backdrop-blur shadow">やり直す</button>
              <button onClick={onShare} className="px-3 py-2 rounded-xl border bg-white/90 backdrop-blur shadow">共有</button>
            </div>
            <button
              onClick={() => setOpen(v => !v)}
              className="h-12 w-12 rounded-full bg-neutral-900 text-white shadow-lg grid place-items-center"
              aria-expanded={open}
            >
              ＋
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
