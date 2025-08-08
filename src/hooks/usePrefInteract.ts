'use client';
import { RefObject, useEffect, useRef, useState } from 'react';

// Information about the currently hovered prefecture
export type HoverInfo = { code: string | null; name: string | null; x: number; y: number };

/**
 * Handles hover/click interactions for prefecture paths.
 * - Desktop: hover to highlight, click to open.
 * - Mobile/tablet: first tap highlights, second tap within 1.5s opens.
 */
export function usePrefInteract(opts: {
  container: RefObject<HTMLElement | null>;
  selector?: string;
  onOpen: (code: string) => void;
}) {
  const { container, onOpen } = opts;
  const selector = opts.selector ?? '[data-pref]';
  const [hover, setHover] = useState<HoverInfo>({ code: null, name: null, x: 0, y: 0 });
  const lastEl = useRef<HTMLElement | null>(null);
  const primed = useRef<{ code: string; ts: number } | null>(null);

  useEffect(() => {
    const root = container.current;
    if (!root) return;

    const clearLast = () => {
      if (lastEl.current) lastEl.current.classList.remove('pref-wiggle');
      lastEl.current = null;
      setHover(s => ({ ...s, code: null, name: null }));
    };

    const setEl = (el: HTMLElement | null) => {
      if (el === lastEl.current) return;
      if (lastEl.current) lastEl.current.classList.remove('pref-wiggle');
      if (el) el.classList.add('pref-wiggle');
      lastEl.current = el;
      if (el) {
        const r = el.getBoundingClientRect();
        const code = el.dataset.pref || '';
        const name = el.dataset.name || '';
        setHover({ code, name, x: r.left + r.width * 0.65, y: r.top + r.height * 0.35 });
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const t = e.target as HTMLElement | null;
      const el = t ? (t.closest(selector) as HTMLElement | null) : null;
      if (!el) {
        clearLast();
        return;
      }
      setEl(el);
    };

    const onPointerLeave = () => clearLast();

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      const t = e.target as HTMLElement | null;
      const el = t ? (t.closest(selector) as HTMLElement | null) : null;
      if (!el) return;
      const code = el.dataset.pref || '';
      const now = Date.now();
      if (primed.current && primed.current.code === code && now - primed.current.ts < 1500) {
        onOpen(code);
        primed.current = null;
        return;
      }
      primed.current = { code, ts: now };
      setEl(el);
    };

    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const el = t ? (t.closest(selector) as HTMLElement | null) : null;
      if (!el) return;
      if (window.matchMedia('(pointer: fine) and (hover: hover)').matches) {
        const code = el.dataset.pref || '';
        if (code) onOpen(code);
      }
    };

    root.addEventListener('pointermove', onPointerMove);
    root.addEventListener('pointerleave', onPointerLeave);
    root.addEventListener('pointerdown', onPointerDown);
    root.addEventListener('click', onClick);
    return () => {
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerleave', onPointerLeave);
      root.removeEventListener('pointerdown', onPointerDown);
      root.removeEventListener('click', onClick);
    };
  }, [container, selector, onOpen]);

  return hover;
}

