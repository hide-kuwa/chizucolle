'use client';
type Props = {
  visible: boolean;
  onSet: (state: 'lived' | 'visited' | 'passed' | 'unvisited') => void;
  onAddPhoto: () => void;
};
export default function ActionDock({ visible, onSet, onAddPhoto }: Props) {
  if (!visible) return null;
  return (
    <div style={{ position: 'absolute', left: 12, bottom: 12, zIndex: 90, pointerEvents: 'auto' }}>
      <div className="flex gap-2 flex-wrap">
        <button data-state="lived" className="rounded px-3 py-1 border" onClick={() => onSet('lived')}>住んでいた</button>
        <button data-state="visited" className="rounded px-3 py-1 border" onClick={() => onSet('visited')}>訪れた</button>
        <button data-state="passed" className="rounded px-3 py-1 border" onClick={() => onSet('passed')}>通り過ぎた</button>
        <button data-state="unvisited" className="rounded px-3 py-1 border" onClick={() => onSet('unvisited')}>未訪問</button>
        <button className="rounded px-3 py-1 border" onClick={onAddPhoto}>思い出の写真を追加</button>
      </div>
    </div>
  );
}

