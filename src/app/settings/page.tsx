'use client';

import { useState } from 'react';
import theme from '@/data/theme.json';
import type { Status } from '@/types';

export default function SettingsPage() {
  const [statuses, setStatuses] = useState<Status[]>(theme.statuses);

  const handleChange = (
    index: number,
    field: 'label' | 'color',
    value: string,
  ) => {
    setStatuses(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = async () => {
    await fetch('/api/theme/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-config-secret': process.env.NEXT_PUBLIC_CONFIG_SECRET || '',
      },
      body: JSON.stringify({ ...theme, statuses }),
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-xl font-bold">設定</h1>
      <table className="mb-4 min-w-full">
        <thead>
          <tr>
            <th className="text-left">ID</th>
            <th className="text-left">ラベル</th>
            <th className="text-left">色</th>
          </tr>
        </thead>
        <tbody>
          {statuses.map((status, index) => (
            <tr key={status.id}>
              <td className="p-2">{status.id}</td>
              <td className="p-2">
                <input
                  value={status.label}
                  onChange={e => handleChange(index, 'label', e.target.value)}
                  className="w-full rounded border px-2 py-1"
                />
              </td>
              <td className="p-2">
                <input
                  type="color"
                  value={status.color}
                  onChange={e => handleChange(index, 'color', e.target.value)}
                  className="h-9 w-16 rounded border"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleSave}
        className="rounded bg-primary px-4 py-2 text-white"
      >
        変更を保存
      </button>
    </div>
  );
}

