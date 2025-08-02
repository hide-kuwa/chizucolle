
import React from 'react';
import type { Prefecture } from '../types';
import { useGlobalContext } from '../context/AppContext';
import PrefecturePath from './PrefecturePath';

interface JapanMapProps {
  prefectures: Prefecture[];
  visitedPrefectureIds: string[];
  onPrefectureClick: (prefecture: Prefecture) => void;
  onPrefectureHover: (name: string, event: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

const JapanMap: React.FC<JapanMapProps> = ({ prefectures, visitedPrefectureIds, onPrefectureClick, onPrefectureHover, onMouseLeave }) => {
    const { memories } = useGlobalContext();

    return (
        <div className="w-full max-w-4xl p-4 bg-white rounded-box shadow-lg border border-base-200">
            <svg viewBox="0 0 500 450" className="w-full h-auto" onMouseLeave={onMouseLeave}>
                <defs>
                    {memories.map(memory => (
                        memory.primaryPhotoUrl && (
                            <pattern key={`pattern-${memory.prefectureId}`} id={`pattern-${memory.prefectureId}`} patternUnits="userSpaceOnUse" width="100" height="100">
                               <image href={memory.primaryPhotoUrl} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
                            </pattern>
                        )
                    ))}
                </defs>
                <rect width="100%" height="100%" fill="#a5f3fc" /> {/* Ocean background */}
                <g>
                    {prefectures.map(prefecture => (
                        <PrefecturePath
                            key={prefecture.id}
                            prefecture={prefecture}
                            isVisited={visitedPrefectureIds.includes(prefecture.id)}
                            onClick={() => onPrefectureClick(prefecture)}
                            onMouseEnter={(e) => onPrefectureHover(prefecture.name, e)}
                        />
                    ))}
                </g>
            </svg>
        </div>
    );
};

export default JapanMap;
