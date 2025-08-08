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
  const min = 0.5, max = 6;

  const apply = useCallback((s: number, x: number, y: number) => {
    const st = stageRef.current;
    if (st) st.style.transform = `translate(${x}px,${y}px) scale(${s})`;
  }, []);
  useEffect(() => { apply(scale, tx, ty); }, [scale, tx, ty, apply]);

  const fitAll = useCallback(() => {
    const c = containerRef.current, st = stageRef.current;
    if (!c || !st) return;
    const prev = st.style.transform;
    st.style.transform = 'translate(0px,0px) scale(1)';
    const cr = c.getBoundingClientRect();
    const target = st.firstElementChild as HTMLElement | null;
    const tr = target ? target.getBoundingClientRect() : st.getBoundingClientRect();
    st.style.transform = prev;
    const s = Math.min(cr.width / tr.width, cr.height / tr.height) * 0.98;
    const nx = (cr.width - tr.width * s) / 2;
    const ny = (cr.height - tr.height * s) / 2;
    setScale(s); setTx(nx); setTy(ny);
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
        const ns = Math.max(min, Math.min(max, scale * factor));
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
  }, [scale, tx, ty, screenPoint]);

  const zoomTo = useCallback((ns: number) => {
    const c = containerRef.current; if (!c) return;
    const cr = c.getBoundingClientRect();
    const sp = { x: cr.width / 2, y: cr.height / 2 };
    const ox = (sp.x - tx) / scale, oy = (sp.y - ty) / scale;
    const cl = Math.max(min, Math.min(max, ns));
    setScale(cl); setTx(sp.x - ox * cl); setTy(sp.y - oy * cl);
  }, [scale, tx, ty]);

  const slider = useMemo(() => Math.round(((scale - min) / (max - min)) * 100), [scale]);
  const onSlider = (e: React.ChangeEvent<HTMLInputElement>) => { const v = parseInt(e.target.value, 10); zoomTo(min + (max - min) * (v / 100)); };

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

