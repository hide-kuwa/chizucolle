'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const Portal = dynamic(() => import('./Portal'), { ssr: false, loading: () => null });

type Props = {
  onPaint?: () => void;
  onErase?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onShare?: () => void;
};

export default function FloatingActionDock({ onPaint, onErase, onUndo, onRedo, onShare }: Props) {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [fallbackOpen, setFallbackOpen] = useState(false);
  const [supportsPopover, setSupportsPopover] = useState(false);

  useEffect(() => {
    setSupportsPopover(typeof (HTMLElement.prototype as any).togglePopover === 'function');
  }, []);

  const toggle = () => {
    const el = popoverRef.current as any;
    if (supportsPopover && el && typeof el.togglePopover === 'function') {
      el.togglePopover();
    } else {
      setFallbackOpen(v => !v);
    }
  };

  const closeFallback = () => setFallbackOpen(false);

  return (
    <>
      <button
        onClick={toggle}
        className="fixed bottom-4 right-4 z-[2147483647] h-12 w-12 rounded-full bg-neutral-900 text-white shadow-lg grid place-items-center"
        aria-expanded={fallbackOpen}
      >
        ＋
      </button>

      <div
        ref={popoverRef}
        {...({ popover: 'auto' } as any)}
        className="p-2 bg-white/95 backdrop-blur border rounded-2xl shadow grid gap-2 fixed right-4 bottom-20"
      >
        <button onClick={onPaint} className="px-3 py-2 rounded-xl border">塗る</button>
        <button onClick={onErase} className="px-3 py-2 rounded-xl border">消しゴム</button>
        <button onClick={onUndo} className="px-3 py-2 rounded-xl border">元に戻す</button>
        <button onClick={onRedo} className="px-3 py-2 rounded-xl border">やり直す</button>
        <button onClick={onShare} className="px-3 py-2 rounded-xl border">共有</button>
      </div>

      {!supportsPopover && fallbackOpen && (
        <Portal>
          <div className="fixed inset-0 pointer-events-none z-[2147483647]">
            <div className="absolute bottom-4 right-4 pointer-events-auto">
              <div className="relative">
                <div className="absolute bottom-14 right-0 grid gap-2 bg-white/95 backdrop-blur border rounded-2xl shadow p-2">
                  <button onClick={onPaint} className="px-3 py-2 rounded-xl border">塗る</button>
                  <button onClick={onErase} className="px-3 py-2 rounded-xl border">消しゴム</button>
                  <button onClick={onUndo} className="px-3 py-2 rounded-xl border">元に戻す</button>
                  <button onClick={onRedo} className="px-3 py-2 rounded-xl border">やり直す</button>
                  <button onClick={onShare} className="px-3 py-2 rounded-xl border">共有</button>
                </div>
              </div>
            </div>
            <button
              onClick={closeFallback}
              className="absolute inset-0 h-full w-full pointer-events-auto bg-transparent"
              aria-label="close"
            />
          </div>
        </Portal>
      )}
    </>
  );
}
