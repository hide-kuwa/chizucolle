'use client';
import { RefObject, useEffect, useRef, useState } from 'react';

const N: Record<string, string> = {'1':'北海道','2':'青森県','3':'岩手県','4':'宮城県','5':'秋田県','6':'山形県','7':'福島県','8':'茨城県','9':'栃木県','10':'群馬県','11':'埼玉県','12':'千葉県','13':'東京都','14':'神奈川県','15':'新潟県','16':'富山県','17':'石川県','18':'福井県','19':'山梨県','20':'長野県','21':'岐阜県','22':'静岡県','23':'愛知県','24':'三重県','25':'滋賀県','26':'京都府','27':'大阪府','28':'兵庫県','29':'奈良県','30':'和歌山県','31':'鳥取県','32':'島根県','33':'岡山県','34':'広島県','35':'山口県','36':'徳島県','37':'香川県','38':'愛媛県','39':'高知県','40':'福岡県','41':'佐賀県','42':'長崎県','43':'熊本県','44':'大分県','45':'宮崎県','46':'鹿児島県','47':'沖縄県'};

export function usePrefInteract(container: RefObject<HTMLElement | null>, onOpen: (code: string, viewportPt: { x: number; y: number }) => void) {
  const [hover, setHover] = useState<{ code: string | null; label: string | null; pt: { x: number; y: number } }>({ code: null, label: null, pt: { x: 0, y: 0 } });
  const lastEl = useRef<HTMLElement | null>(null);
  const primed = useRef<{ code: string; ts: number } | null>(null);

  const place = (el: HTMLElement | null, cx?: number, cy?: number) => {
    if (!el || !container.current) return;
    const r = el.getBoundingClientRect(), cr = container.current.getBoundingClientRect();
    const x = Math.max(8, (typeof cx === 'number' ? cx : (r.left + r.right) / 2) - cr.left + 12);
    const y = Math.max(8, (typeof cy === 'number' ? cy : (r.top + r.bottom) / 2) - cr.top - 28);
    const code = el.dataset.pref || '';
    setHover({ code, label: N[code] || '', pt: { x, y } });
  };

  useEffect(() => {
    const root = container.current; if (!root) return;
    const clear = () => { if (lastEl.current) lastEl.current.classList.remove('pref-wiggle'); lastEl.current = null; setHover(s => ({ ...s, code: null, label: null })); };
    const setEl = (el: HTMLElement | null) => { if (el === lastEl.current) return; if (lastEl.current) lastEl.current.classList.remove('pref-wiggle'); if (el) el.classList.add('pref-wiggle'); lastEl.current = el; };

    const onMove = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; const el = (e.target as HTMLElement)?.closest('[data-pref]') as HTMLElement | null; if (!el) { clear(); return; } setEl(el); place(el, e.clientX, e.clientY); };
    const onLeave = () => clear();

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      const el = (e.target as HTMLElement)?.closest('[data-pref]') as HTMLElement | null; if (!el) return;
      const code = el.dataset.pref || '', now = Date.now();
      if (primed.current && primed.current.code === code && now - primed.current.ts < 1500) {
        const r = el.getBoundingClientRect(); onOpen(code, { x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2 }); primed.current = null; return;
      }
      primed.current = { code, ts: now }; setEl(el); place(el, e.clientX, e.clientY);
    };

    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest('[data-pref]') as HTMLElement | null; if (!el) return;
      const code = el.dataset.pref || ''; const r = el.getBoundingClientRect(); onOpen(code, { x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2 });
    };

    root.addEventListener('pointermove', onMove); root.addEventListener('pointerleave', onLeave);
    root.addEventListener('pointerdown', onPointerDown); root.addEventListener('click', onClick);
    return () => { root.removeEventListener('pointermove', onMove); root.removeEventListener('pointerleave', onLeave); root.removeEventListener('pointerdown', onPointerDown); root.removeEventListener('click', onClick); };
  }, [container, onOpen]);

  return hover;
}
