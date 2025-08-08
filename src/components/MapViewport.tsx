'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Ready = {
  container: HTMLDivElement;
  stage: HTMLDivElement;
  overlay: HTMLDivElement;
  screenPoint: (x: number, y: number) => { x: number; y: number };
};
type Props = { children: React.ReactNode; overlayChildren?: React.ReactNode; onReady?: (api: Ready) => void };

export default function MapViewport({ children, overlayChildren, onReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [minScale, setMinScale] = useState(0.5);
  const max = 6;

  const apply = useCallback((s: number, x: number, y: number) => {
    const st = stageRef.current;
    if (st) st.style.transform = `translate(${x}px,${y}px) scale(${s})`;
  }, []);
  useEffect(() => { apply(scale, tx, ty); }, [scale, tx, ty, apply]);

  const fitAll = useCallback(() => {
    const c = containerRef.current, st = stageRef.current;
    if (!c || !st) return;
    const old = st.style.transform;
    st.style.transform = 'translate(0px,0px) scale(1)';

    const cr = c.getBoundingClientRect();
    const sr = st.getBoundingClientRect();
    const els = Array.from(st.querySelectorAll('[data-pref]')) as HTMLElement[];
    if (!els.length) { st.style.transform = old; return; }

    let L = Infinity, T = Infinity, R = -Infinity, B = -Infinity;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      L = Math.min(L, r.left); T = Math.min(T, r.top);
      R = Math.max(R, r.right); B = Math.max(B, r.bottom);
    }
    const W0 = R - L, H0 = B - T;                 // 県群のピクセル幅・高さ（変換なし）
    const L0 = L - sr.left, T0 = T - sr.top;      // ステージ座標系に変換

    const s = Math.min(cr.width / W0, cr.height / H0) * 0.98;
    const nx = (cr.width - s * W0) / 2 - s * L0;
    const ny = (cr.height - s * H0) / 2 - s * T0;

    setMinScale(s);
    setScale(s); setTx(nx); setTy(ny);
    st.style.transform = old;
  }, []);

  useEffect(() => { fitAll(); }, [fitAll]);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const ro = new ResizeObserver(() => fitAll());
    ro.observe(c);
    window.addEventListener('orientationchange', fitAll);
    return () => { ro.disconnect(); window.removeEventListener('orientationchange', fitAll); };
  }, [fitAll]);

  const screenPoint = useCallback((x: number, y: number) => {
    const c = containerRef.current; if (!c) return { x, y };
    const cr = c.getBoundingClientRect();
    return { x: x - cr.left, y: y - cr.top };
  }, []);

  useEffect(() => {
    if (onReady && containerRef.current && stageRef.current && overlayRef.current) {
      onReady({ container: containerRef.current, stage: stageRef.current, overlay: overlayRef.current, screenPoint });
    }
  }, [onReady, screenPoint]);

  useEffect(() => {
    const c = containerRef.current as (HTMLDivElement & { __ld?: number }) | null;
    if (!c) return;
    let p1: { id: number; x: number; y: number } | null = null;
    let p2: { id: number; x: number; y: number } | null = null;
    let dragging = false, lastX = 0, lastY = 0;

    const setP = (e: PointerEvent) => ({ id: e.pointerId, x: e.clientX, y: e.clientY });
    const onDown = (e: PointerEvent) => { c.setPointerCapture(e.pointerId); if (!p1) { p1 = setP(e); dragging = true; lastX = e.clientX; lastY = e.clientY; } else if (!p2 && e.pointerId !== p1.id) { p2 = setP(e); dragging = false; } };
    const onMove = (e: PointerEvent) => {
      if (p1 && p1.id === e.pointerId) p1 = { ...p1, x: e.clientX, y: e.clientY };
      else if (p2 && p2.id === e.pointerId) p2 = { ...p2, x: e.clientX, y: e.clientY };
      if (p1 && p2) {
        const dx = p2.x - p1.x, dy = p2.y - p1.y, cx = (p1.x + p2.x) / 2, cy = (p1.y + p2.y) / 2;
        const dist = Math.hypot(dx, dy); c.__ld ??= dist; const factor = dist / c.__ld; c.__ld = dist;
        const ns = Math.max(minScale, Math.min(max, scale * factor));
        const sp = screenPoint(cx, cy);
        const ox = (sp.x - tx) / scale, oy = (sp.y - ty) / scale;
        setScale(ns); setTx(sp.x - ox * ns); setTy(sp.y - oy * ns);
      } else if (dragging) {
        const dx = e.clientX - lastX, dy = e.clientY - lastY;
        setTx(v => v + dx); setTy(v => v + dy);
        lastX = e.clientX; lastY = e.clientY;
      }
    };
    const onUp = (e: PointerEvent) => { if (p2 && p2.id === e.pointerId) { p2 = null; c.__ld = undefined; } else if (p1 && p1.id === e.pointerId) { p1 = null; dragging = false; } };
    c.addEventListener('pointerdown', onDown); c.addEventListener('pointermove', onMove);
    c.addEventListener('pointerup', onUp); c.addEventListener('pointercancel', onUp);
    return () => { c.removeEventListener('pointerdown', onDown); c.removeEventListener('pointermove', onMove); c.removeEventListener('pointerup', onUp); c.removeEventListener('pointercancel', onUp); };
  }, [scale, tx, ty, screenPoint, minScale]);

  const zoomTo = useCallback((ns: number) => {
    const c = containerRef.current; if (!c) return;
    const cr = c.getBoundingClientRect();
    const sp = { x: cr.width / 2, y: cr.height / 2 };
    const ox = (sp.x - tx) / scale, oy = (sp.y - ty) / scale;
    const cl = Math.max(minScale, Math.min(max, ns));
    setScale(cl); setTx(sp.x - ox * cl); setTy(sp.y - oy * cl);
  }, [scale, tx, ty, minScale]);

  const slider = useMemo(() => Math.round(((scale - minScale) / (max - minScale)) * 100), [scale, minScale]);
  const onSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    zoomTo(minScale + (max - minScale) * (v / 100));
  };

  return (
    <div ref={containerRef} className="map-container w-full h-[100vh] bg-white">
      <div className="pc-zoom">
        <button className="rounded border px-2 py-1 bg-white" onClick={() => zoomTo(scale * 0.85)}>-</button>
        <input className="vertical" type="range" min={0} max={100} value={slider} onChange={onSlider}/>
        <button className="rounded border px-2 py-1 bg-white" onClick={() => zoomTo(scale * 1.15)}>+</button>
      </div>
      <div ref={stageRef} className="map-stage">{children}</div>
      <div ref={overlayRef} className="map-overlay">{overlayChildren}</div>
    </div>
  );
}

