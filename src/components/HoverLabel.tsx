'use client';
type Props = { code: string | null; label: string | null; pt: { x: number; y: number } };
export default function HoverLabel({ code, label, pt }: Props) {
  if (!code || !label) return null;
  return (
    <div
      style={{ position: 'absolute', left: pt.x, top: pt.y, zIndex: 45 }}
      className="rounded bg-white/95 px-2 py-1 text-sm shadow border"
    >
      <span className="font-medium">{label}</span>
    </div>
  );
}

