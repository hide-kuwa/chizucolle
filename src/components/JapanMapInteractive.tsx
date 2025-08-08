'use client';
import { useRef, useState } from 'react';
import MapViewport from './MapViewport';
import { usePrefInteract } from '@/hooks/usePrefInteract';
import HoverLabel from './HoverLabel';
import ClickPopover from './ClickPopover';

export default function JapanMapInteractive(props: {
  renderMap: () => React.ReactNode;
  renderClickContent: (code: string) => React.ReactNode;
  onOpenWindow: (code: string, initial: { left: number; top: number }) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [clickAt, setClickAt] = useState<{
    open: boolean;
    code: string | null;
    pt: { x: number; y: number };
  }>({ open: false, code: null, pt: { x: 0, y: 0 } });
  const hover = usePrefInteract(hostRef, (code, ptV) => {
    const cr = hostRef.current!.getBoundingClientRect();
    const pt = { x: ptV.x - cr.left, y: ptV.y - cr.top };
    setClickAt({ open: true, code, pt });
    props.onOpenWindow(code, { left: pt.x, top: pt.y });
  });

  return (
    <MapViewport onReady={() => {}}>
      <div ref={hostRef} className="relative">
        {props.renderMap()}
        <HoverLabel code={hover.code} label={hover.label} pt={hover.pt} />
        <ClickPopover
          open={clickAt.open}
          pt={clickAt.pt}
          onClose={() => setClickAt(s => ({ ...s, open: false }))}
        >
          {clickAt.code ? props.renderClickContent(clickAt.code) : null}
        </ClickPopover>
      </div>
    </MapViewport>
  );
}

