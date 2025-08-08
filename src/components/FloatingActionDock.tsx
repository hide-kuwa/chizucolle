'use client';
type Props={
  open:boolean;
  pt:{x:number;y:number};
  hasPhotos:boolean;
  onSet:(st:'lived'|'visited'|'passed'|'unvisited')=>void;
  onAddPhoto:()=>void;
};
export default function FloatingActionDock({open,pt,hasPhotos,onSet,onAddPhoto}:Props){
  if(!open) return null;
  return (
    <div style={{position:'fixed',left:Math.max(8,pt.x+12),top:Math.max(8,pt.y+12),zIndex:1000}} className="rounded-xl border-2 border-black/60 bg-white px-3 py-2 shadow-lg">
      <div className="grid grid-cols-3 gap-2">
        <button data-variant="lived" className="rounded px-3 py-1 border-2 border-black/60" onClick={()=>onSet('lived')}>住んだ</button>
        <button data-variant="visited" className="rounded px-3 py-1 border-2 border-black/60" onClick={()=>onSet('visited')}>訪れた</button>
        <button data-variant="passed" className="rounded px-3 py-1 border-2 border-black/60" onClick={()=>onSet('passed')}>通った</button>
        <button data-variant="unvisited" className="rounded px-3 py-1 border-2 border-black/60" onClick={()=>onSet('unvisited')}>未訪問</button>
        <button data-variant="wish" className="rounded px-3 py-1 border-2 border-black/60">行きたい</button>
        <button data-photos={hasPhotos? 'yes':'no'} className="rounded px-3 py-1 border-2 border-black/60 bg-white" onClick={onAddPhoto}>写真を追加</button>
      </div>
    </div>
  );
}
