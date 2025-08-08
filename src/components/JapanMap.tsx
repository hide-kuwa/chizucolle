'use client';
import type { Memory, Prefecture, VisitStatus } from '@/types';
import { prefectures } from '../data/prefectures';

type Props = {
  memories: Memory[];
  onPrefectureClick: (pref: Prefecture, event: React.MouseEvent<SVGPathElement>) => void;
  onPrefectureHover: (name: string, event: React.MouseEvent<SVGPathElement>) => void;
  onMouseLeave: () => void;
  onMapBackgroundClick?: () => void;
};

const statusColors: Record<VisitStatus, string> = {
  unvisited: '#e5e7eb',
  visited: '#93c5fd',
  passed: '#86efac',
  lived: '#fca5a5',
};

export default function JapanMap({
  memories,
  onPrefectureClick,
  onPrefectureHover,
  onMouseLeave,
  onMapBackgroundClick,
}: Props) {
  const getFill = (prefectureId: string): string => {
    const memory = memories.find((m) => m.prefectureId === prefectureId);
    if (!memory) return statusColors.unvisited;
    return statusColors[memory.status];
  };

  return (
    <div className="relative w-full h-[100vh]">
      <svg
        viewBox="0 0 688 684"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
        onMouseLeave={onMouseLeave}
        onClick={onMapBackgroundClick}
      >
        <g>
          {prefectures.map((p) => {
            return (
              <path
                key={p.id}
                d={p.d}
                data-pref={p.id}
                data-name={p.name}
                fill={getFill(p.id)}
                onClick={(e)=>{ e.stopPropagation(); onPrefectureClick(p, e); }}
                onMouseEnter={(e)=> onPrefectureHover(p.name, e)}
                onMouseMove={(e)=> onPrefectureHover(p.name, e)}
                style={{ transformBox:'fill-box', transformOrigin:'center' }}
                className="stroke-white hover:stroke-primary hover:stroke-[1.5px]"
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
