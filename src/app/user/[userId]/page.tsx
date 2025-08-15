'use client';
import { useEffect, useState } from 'react';
import JapanMap from '@/components/JapanMap';
import { firestoreService } from '@/services/firestoreService';
import type { Memory } from '@/types';

export default function UserProfilePage({ params }: { params: { userId: string } }) {
  const { userId } = params;
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    firestoreService.getMemories(userId).then(setMemories);
  }, [userId]);

  const visitedCount = memories.filter(m => m.status !== 'unvisited').length;

  const share = () => {
    const text = `私は${visitedCount}/47都道府県を訪れました！`;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">プロフィール</h1>
      <p>{visitedCount}/47 都道府県</p>
      <button onClick={share} className="rounded bg-blue-500 px-4 py-2 text-white">旅の軌跡をシェアする</button>
      <div className="h-96">
        <JapanMap
          memories={memories}
          onPrefectureClick={() => {}}
          onPrefectureHover={() => {}}
          onMouseLeave={() => {}}
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {memories.flatMap(m => m.photos || []).map(photo => (
          <img key={photo.id} src={photo.url} alt={photo.name} className="h-24 w-full object-cover" />
        ))}
      </div>
    </div>
  );
}
