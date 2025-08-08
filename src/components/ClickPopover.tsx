'use client';
type Props = { open: boolean; pt: { x: number; y: number }; children: React.ReactNode; onClose: () => void };
export default function ClickPopover({ open, pt, children, onClose }: Props) {
  if (!open) return null;
  return (
    <div style={{ position: 'absolute', left: pt.x, top: pt.y, zIndex: 80, pointerEvents: 'auto' }} className="rounded-xl border bg-white px-3 py-2 shadow-lg">
      <div className="flex items-start gap-2">
        <div className="grow">{children}</div>
        <button className="ml-2 rounded border px-2 py-1 bg-white" onClick={onClose}>×</button>
      </div>
    </div>
  );
}

