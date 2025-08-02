
import React from 'react';
import type { Prefecture } from '../types';

interface PrefecturePathProps {
  prefecture: Prefecture;
  isVisited: boolean;
  onClick: () => void;
  onMouseEnter: (event: React.MouseEvent<SVGPathElement>) => void;
}

const PrefecturePath: React.FC<PrefecturePathProps> = ({ prefecture, isVisited, onClick, onMouseEnter }) => {
  const fill = isVisited ? `url(#pattern-${prefecture.id})` : '#e2e8f0'; // slate-200
  const className = isVisited ? 'map-path map-path-visited cursor-pointer' : 'map-path cursor-default';

  return (
    <path
      d={prefecture.d}
      fill={fill}
      stroke="#475569" // slate-600
      strokeWidth="0.5"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={className}
    />
  );
};

export default PrefecturePath;
