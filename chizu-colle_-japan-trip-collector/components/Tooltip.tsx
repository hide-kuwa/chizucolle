
import React from 'react';

interface TooltipProps {
  text: string;
  x: number;
  y: number;
}

const Tooltip: React.FC<TooltipProps> = ({ text, x, y }) => {
  return (
    <div
      className="fixed z-50 px-3 py-1.5 text-sm font-semibold text-white bg-gray-800 rounded-md shadow-lg pointer-events-none"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      {text}
    </div>
  );
};

export default Tooltip;
