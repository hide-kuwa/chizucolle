'use client';
export default function HoverLabelFixed({open,name,pt}:{open:boolean;name:string;pt:{x:number;y:number}}){
  if(!open) return null;
  return (
    <div style={{position:'fixed',left:pt.x+12,top:pt.y-28,zIndex:1000}} className="rounded bg-white/95 px-2 py-1 text-sm shadow border">
      <span className="font-medium">{name}</span>
    </div>
  );
}
