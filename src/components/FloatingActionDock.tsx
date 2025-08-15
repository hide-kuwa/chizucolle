'use client';
import type { Status } from '@/types';

type Props={
  open:boolean;
  pt:{x:number;y:number};
  hasPhotos:boolean;
  statuses: Status[];
  onSet:(st:string)=>void;
  onAddPhoto:()=>void;
};
export default function FloatingActionDock({open,pt,hasPhotos,statuses,onSet,onAddPhoto}:Props){
  if(!open) return null;
  const setStateStatuses = statuses.filter(s=>s.action==='setState');
  const addPhotoStatus = statuses.find(s=>s.action==='addPhoto');
  return (
    <div style={{position:'fixed',left:Math.max(8,pt.x+12),top:Math.max(8,pt.y+12),zIndex:1000}} className="rounded-xl border-2 border-black/60 bg-white px-3 py-2 shadow-lg">
      <div className="grid grid-cols-3 gap-2">
        {setStateStatuses.map(s=>(
          <button key={s.id} data-variant={s.id} className="rounded px-3 py-1 border-2 border-black/60" style={{backgroundColor:s.color}} onClick={()=>onSet(s.id)}>{s.label}</button>
        ))}
        {addPhotoStatus && (
          <button data-variant={addPhotoStatus.id} data-photos={hasPhotos? 'yes':'no'} className="rounded px-3 py-1 border-2 border-black/60 bg-white" style={{backgroundColor:addPhotoStatus.color}} onClick={onAddPhoto}>{addPhotoStatus.label}</button>
        )}
      </div>
    </div>
  );
}
