'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  children: React.ReactNode;
  onReady?: (
    api: {
      container: HTMLDivElement;
      stage: HTMLDivElement;
      screenPoint: (x: number, y: number) => { x: number; y: number };
    }
  ) => void;
};

export default function MapViewport({ children, onReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const min = 0.6, max = 6;

  const apply = useCallback((s: number, x: number, y: number) => {
    const st = stageRef.current;
    if (st) {
      st.style.transform = `translate(${x}px,${y}px) scale(${s})`;
    }
  }, []);
  useEffect(() => {
    apply(scale, tx, ty);
  }, [scale, tx, ty, apply]);

  useEffect(() => {
    const c = containerRef.current, st = stageRef.current;
    if (!c || !st) return;
    const rC = c.getBoundingClientRect();
    const rS = st.firstElementChild
      ? (st.firstElementChild as HTMLElement).getBoundingClientRect()
      : st.getBoundingClientRect();
    const w = rS.width, h = rS.height;
    const s = Math.min(rC.width / w, rC.height / h) * 0.98;
    const nx = (rC.width - w * s) / 2, ny = (rC.height - h * s) / 2;
    setScale(s);
    setTx(nx);
    setTy(ny);
  }, []);

  const screenPoint = useCallback((x: number, y: number) => {
    const c = containerRef.current;
    if (!c) return { x, y };
    const cr = c.getBoundingClientRect();
    return { x: x - cr.left, y: y - cr.top };
  }, []);

  useEffect(() => {
    if (onReady && containerRef.current && stageRef.current) {
      onReady({
        container: containerRef.current,
        stage: stageRef.current,
        screenPoint,
      });
    }
  }, [onReady, screenPoint]);

  useEffect(() => {
    const c = containerRef.current as (HTMLDivElement & { __lastDist?: number }) | null;
    if (!c) return;
    let p1: { id: number; x: number; y: number } | null = null,
      p2: { id: number; x: number; y: number } | null = null,
      dragging = false,
      lastX = 0,
      lastY = 0;
    const setPointer = (e: PointerEvent) => ({ id: e.pointerId, x: e.clientX, y: e.clientY });
    const onDown = (e: PointerEvent) => {
      c.setPointerCapture(e.pointerId);
      if (!p1) {
        p1 = setPointer(e);
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
      } else if (!p2 && e.pointerId !== p1.id) {
        p2 = setPointer(e);
        dragging = false;
      }
    };
    const onMove = (e: PointerEvent) => {
      if (p1 && p1.id === e.pointerId) {
        p1 = { ...p1, x: e.clientX, y: e.clientY };
      } else if (p2 && p2.id === e.pointerId) {
        p2 = { ...p2, x: e.clientX, y: e.clientY };
      }
      if (p1 && p2) {
        const dx = p2.x - p1.x, dy = p2.y - p1.y, cx = (p1.x + p2.x) / 2, cy = (p1.y + p2.y) / 2;
        const dist = Math.hypot(dx, dy);
        c.__lastDist ??= dist;
        const factor = dist / c.__lastDist;
        c.__lastDist = dist;
        const ns = Math.max(min, Math.min(max, scale * factor));
        const sp = screenPoint(cx, cy);
        const ox = (sp.x - tx) / scale, oy = (sp.y - ty) / scale;
        const ntx = sp.x - ox * ns, nty = sp.y - oy * ns;
        setScale(ns);
        setTx(ntx);
        setTy(nty);
      } else if (dragging) {
        const dx = e.clientX - lastX, dy = e.clientY - lastY;
        setTx(v => v + dx);
        setTy(v => v + dy);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };
    const onUp = (e: PointerEvent) => {
      if (p2 && p2.id === e.pointerId) {
        p2 = null;
        c.__lastDist = undefined;
      } else if (p1 && p1.id === e.pointerId) {
        p1 = null;
        dragging = false;
      }
    };
    c.addEventListener('pointerdown', onDown);
    c.addEventListener('pointermove', onMove);
    c.addEventListener('pointerup', onUp);
    c.addEventListener('pointercancel', onUp);
    return () => {
      c.removeEventListener('pointerdown', onDown);
      c.removeEventListener('pointermove', onMove);
      c.removeEventListener('pointerup', onUp);
      c.removeEventListener('pointercancel', onUp);
    };
  }, [scale, tx, ty, screenPoint]);

  const zoomTo = useCallback(
    (ns: number) => {
      const c = containerRef.current, st = stageRef.current;
      if (!c || !st) return;
      const cr = c.getBoundingClientRect();
      const cx = cr.left + cr.width / 2, cy = cr.top + cr.height / 2;
      const sp = { x: cx - cr.left, y: cy - cr.top };
      const ox = (sp.x - tx) / scale, oy = (sp.y - ty) / scale;
      const clamped = Math.max(min, Math.min(max, ns));
      setScale(clamped);
      setTx(sp.x - ox * clamped);
      setTy(sp.y - oy * clamped);
    },
    [scale, tx, ty]
  );

  const slider = useMemo(() => Math.round(((scale - min) / (max - min)) * 100), [scale]);
  const onSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    zoomTo(min + (max - min) * (v / 100));
  };

  return (
    <div ref={containerRef} className="map-container w-full h-[100vh] bg-white">
      <div className="pc-zoom">
        <button className="rounded border px-2 py-1 bg-white" onClick={() => zoomTo(scale * 0.85)}>
          -
        </button>
        <input type="range" min={0} max={100} value={slider} onChange={onSlider} />
        <button className="rounded border px-2 py-1 bg-white" onClick={() => zoomTo(scale * 1.15)}>
          +
        </button>
      </div>
      <div ref={stageRef} className="map-stage">
        {children}
      </div>
    </div>
  );
}

