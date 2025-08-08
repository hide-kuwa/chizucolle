'use client';
type Props={
  open:boolean;
  pt:{x:number;y:number};
  onSet:(st:'lived'|'visited'|'passed'|'unvisited')=>void;
  onAddPhoto:()=>void;
  onClose:()=>void;
};
export default function FloatingActionDock({open,pt,onSet,onAddPhoto,onClose}:Props){
  if(!open) return null;
  return (
    <div style={{position:'fixed',left:Math.max(8,pt.x+12),top:Math.max(8,pt.y+12),zIndex:1000}} className="rounded-xl border-2 border-black/60 bg-white px-2 py-2 shadow-lg">
      <div className="flex items-center gap-2">
        <button data-state="lived" className="rounded px-3 py-1 border-2 border-black/60" onClick={()=>onSet('lived')}>住んでいた</button>
        <button data-state="visited" className="rounded px-3 py-1 border-2 border-black/60" onClick={()=>onSet('visited')}>訪れた</button>
        <button data-state="passed" className="rounded px-3 py-1 border-2 border-black/60" onClick={()=>onSet('passed')}>通り過ぎた</button>
        <button data-state="unvisited" className="rounded px-3 py-1 border-2 border-black/60" onClick={()=>onSet('unvisited')}>未訪問</button>
        <button className="rounded px-3 py-1 border-2 border-black/60 bg-white" onClick={onAddPhoto}>思い出の写真を追加</button>
        <button className="rounded px-2 py-1 border-2 border-black/60 bg-white" onClick={onClose}>×</button>
      </div>
    </div>
  );
}
