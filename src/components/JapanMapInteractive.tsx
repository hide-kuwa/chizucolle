'use client';
import { useEffect, useRef, useState } from 'react';
import MapViewport from './MapViewport';
import { usePrefInteract } from '@/hooks/usePrefInteract';
import HoverLabel from './HoverLabel';
import ClickPopover from './ClickPopover';
import ActionDock from './ActionDock';

export default function JapanMapInteractive(props:{
  renderMap:()=>React.ReactNode;
  renderClickContent:(code:string)=>React.ReactNode;
  onOpenWindow:(code:string, initial:{left:number;top:number})=>void;
  onSetState:(code:string, st:'lived'|'visited'|'passed'|'unvisited')=>void;
  onAddPhoto:(code:string)=>void;
}){
  const hostRef = useRef<HTMLDivElement>(null);
  const [overlayEl, setOverlayEl] = useState<HTMLDivElement|null>(null);
  const [clickAt, setClickAt] = useState<{open:boolean; code:string|null; pt:{x:number;y:number}}>({open:false, code:null, pt:{x:0,y:0}});

  const toOverlay = (ptHost:{x:number;y:number})=>{
    if(!overlayEl || !hostRef.current) return ptHost;
    const or = overlayEl.getBoundingClientRect();
    const hr = hostRef.current.getBoundingClientRect();
    return { x: ptHost.x + hr.left - or.left, y: ptHost.y + hr.top - or.top };
  };

  const hover = usePrefInteract(hostRef, (code, viewportPt)=>{
    if(!overlayEl) return;
    const or = overlayEl.getBoundingClientRect();
    const pt = { x: viewportPt.x - or.left, y: viewportPt.y - or.top };
    setClickAt({ open:true, code, pt });
    props.onOpenWindow(code, pt);
  });

  const hoverPt = toOverlay(hover.pt);

  useEffect(()=>{ if(!overlayEl) return; const r=()=>setClickAt(s=>({...s})); window.addEventListener('scroll',r,true); return()=>window.removeEventListener('scroll',r,true); },[overlayEl]);

  return (
    <MapViewport
      onReady={({ overlay }) => setOverlayEl(overlay)}
      overlayChildren={
        <>
          <HoverLabel code={hover.code} label={hover.label} pt={hoverPt}/>
          <ClickPopover open={!!clickAt.open} pt={clickAt.pt} onClose={()=>setClickAt(s=>({...s,open:false}))}>
            {clickAt.code ? props.renderClickContent(clickAt.code) : null}
          </ClickPopover>
          <ActionDock
            visible={!!clickAt.code}
            onSet={(st)=> clickAt.code && props.onSetState(clickAt.code, st)}
            onAddPhoto={()=> clickAt.code && props.onAddPhoto(clickAt.code)}
          />
        </>
      }
    >
      <div ref={hostRef}>{props.renderMap()}</div>
    </MapViewport>
  );
}

