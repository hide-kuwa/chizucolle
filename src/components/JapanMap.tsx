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
            const memory = memories.find((m) => m.prefectureId === p.id);
            const hasPhotos = !!(memory?.photos && memory.photos.length > 0);
            return (
              <path
                key={p.id}
                d={p.d}
                fill={getFill(p.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  onPrefectureClick(p, e);
                }}
                onMouseEnter={(e) => onPrefectureHover(p.name, e)}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                className={`hover:scale-[1.03] hover:stroke-primary hover:stroke-[1.5px] hover:drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] ${
                  hasPhotos ? 'stroke-white stroke-[1.5px]' : 'stroke-white stroke-[0.5px]'
                }`}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
