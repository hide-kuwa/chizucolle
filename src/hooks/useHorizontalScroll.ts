import { useRef } from 'react';

export default function useHorizontalScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    startX.current = e.pageX;
    scrollLeft.current = ref.current?.scrollLeft || 0;
  };

  const endDragging = () => {
    isDown.current = false;
  };

  const onMouseLeave = endDragging;
  const onMouseUp = endDragging;

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = x - startX.current;
    if (ref.current) {
      ref.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    if (ref.current) {
      ref.current.scrollLeft += e.deltaY;
    }
  };

  return { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove, onWheel };
}

