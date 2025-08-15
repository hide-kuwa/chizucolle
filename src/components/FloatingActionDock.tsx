'use client';

type Props = {
  onPaint?: () => void;
  onErase?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onShare?: () => void;
};

export default function FloatingActionDock({ onPaint, onErase, onUndo, onRedo, onShare }: Props) {
  return (
    <div className="fixed bottom-4 right-4 z-[60]">
      <div className="rounded-2xl border bg-white/90 backdrop-blur shadow-lg p-2 flex gap-2">
        <button onClick={onPaint} className="px-3 py-2 rounded-xl border hover:bg-neutral-50">塗る</button>
        <button onClick={onErase} className="px-3 py-2 rounded-xl border hover:bg-neutral-50">消しゴム</button>
        <button onClick={onUndo} className="px-3 py-2 rounded-xl border hover:bg-neutral-50">元に戻す</button>
        <button onClick={onRedo} className="px-3 py-2 rounded-xl border hover:bg-neutral-50">やり直す</button>
        <button onClick={onShare} className="px-3 py-2 rounded-xl bg-neutral-900 text-white hover:opacity-90">共有</button>
      </div>
    </div>
  );
}
