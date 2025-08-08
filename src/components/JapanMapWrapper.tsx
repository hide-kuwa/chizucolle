'use client';
import { useRef, RefObject } from 'react';
import { usePrefInteract } from '@/hooks/usePrefInteract';
import PrefHintPopover from '@/components/PrefHintPopover';

export default function JapanMapWrapper(props: { onOpenPref: (code: string) => void; children: React.ReactNode; }) {
  const ref = useRef<HTMLDivElement>(null);
  const hover = usePrefInteract({ container: ref as RefObject<HTMLElement | null>, onOpen: props.onOpenPref });
  return (
    <div ref={ref} className="relative">
      {props.children}
      <PrefHintPopover code={hover.code} name={hover.name} x={hover.x} y={hover.y} />
    </div>
  );
}

