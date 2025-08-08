'use client';
import { useEffect, useRef, useState, RefObject } from 'react';

type HoverState = { code: string | null; name: string | null; x: number; y: number };

export function usePrefHover(container: RefObject<HTMLElement>, selector = '[data-pref]') {
  const [state, setState] = useState<HoverState>({ code: null, name: null, x: 0, y: 0 });
  const lastEl = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = container.current;
    if (!root) return;
    const onMove = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const el = t ? (t.closest(selector) as HTMLElement | null) : null;
      if (el !== lastEl.current) {
        if (lastEl.current) lastEl.current.classList.remove('pref-hover');
        if (el) el.classList.add('pref-hover');
        lastEl.current = el;
      }
      if (el) {
        const code = el.dataset.pref || (el.id?.match(/\d{1,2}/)?.[0] ?? '');
        const name = el.dataset.name || '';
        setState({ code: code || null, name: name || null, x: e.clientX + 12, y: e.clientY + 12 });
      } else {
        setState((s) => ({ ...s, code: null, name: null }));
      }
    };
    const onLeave = () => {
      if (lastEl.current) lastEl.current.classList.remove('pref-hover');
      lastEl.current = null;
      setState((s) => ({ ...s, code: null, name: null }));
    };
    root.addEventListener('mousemove', onMove);
    root.addEventListener('mouseleave', onLeave);
    return () => {
      root.removeEventListener('mousemove', onMove);
      root.removeEventListener('mouseleave', onLeave);
    };
  }, [container, selector]);

  return state;
}
