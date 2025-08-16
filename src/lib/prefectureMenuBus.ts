export type PrefectureMenuAction = 'visited' | 'passed' | 'unvisited' | 'want' | 'lived' | 'add_photos';
type OpenDetail = { id: string; x: number; y: number };

export const openPrefectureMenu = (detail: OpenDetail) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('prefecture-menu:open', { detail }));
};

export const closePrefectureMenu = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event('prefecture-menu:close'));
};

export const onPrefectureMenuSelect = (handler: (detail: { id: string; action: PrefectureMenuAction }) => void) => {
  if (typeof window === 'undefined') return () => {};
  const listener = (e: Event) => handler((e as CustomEvent).detail);
  window.addEventListener('prefecture-menu:select', listener as EventListener);
  return () => window.removeEventListener('prefecture-menu:select', listener as EventListener);
};

export const emitPrefectureMenuSelect = (detail: { id: string; action: PrefectureMenuAction }) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('prefecture-menu:select', { detail }));
};
