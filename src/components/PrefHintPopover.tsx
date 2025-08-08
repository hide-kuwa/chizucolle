'use client';

type Props = { code: string | null; name: string | null; x: number; y: number };

export default function PrefHintPopover({ code, name, x, y }: Props) {
  if (!code) return null;
  const label = name || '';
  return (
    <div
      style={{ position: 'fixed', left: Math.max(8, x), top: Math.max(8, y), zIndex: 50 }}
      className="rounded-xl border bg-white/95 px-2 py-1 text-sm shadow-md"
    >
      <div className="flex items-center gap-2">
        <span className="font-medium">{label}</span>
        <span className="text-xs text-gray-500">クリック/タップで開く</span>
      </div>
    </div>
  );
}

