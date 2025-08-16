'use client';
import dynamic from 'next/dynamic';

const JapanMap = dynamic(() => import('@/components/JapanMap'), { ssr: false });

export default function Page() {
  return (
    <div className="h-[100svh] w-full overflow-hidden grid place-items-center">
      <div className="map-fit relative w-full h-full">
        <JapanMap />
      </div>
    </div>
  );
}
