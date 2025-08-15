'use client';
import type { Status } from '@/types';

interface MapLegendProps {
  statuses: Status[];
}

export default function MapLegend({ statuses }: MapLegendProps) {
  const displayStatuses = statuses.filter(s => s.action === 'setState');

  return (
    <div className="absolute bottom-4 left-4 rounded-lg bg-surface/80 p-3 shadow-lg backdrop-blur-sm">
      <h4 className="mb-2 text-sm font-bold">凡例</h4>
      <ul className="space-y-1">
        {displayStatuses.map(status => (
          <li key={status.id} className="flex items-center">
            <span
              className="mr-2 h-4 w-4 rounded-full"
              style={{ backgroundColor: status.color }}
            ></span>
            <span className="text-xs text-text-secondary">{status.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

