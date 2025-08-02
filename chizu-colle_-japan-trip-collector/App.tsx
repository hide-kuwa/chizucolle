
import React, { useState, useCallback } from 'react';
import { AppProvider, useGlobalContext } from './context/AppContext';
import Header from './components/Header';
import JapanMap from './components/JapanMap';
import GalleryView from './components/GalleryView';
import AddMemoryModal from './components/AddMemoryModal';
import Tooltip from './components/Tooltip';
import type { Prefecture, TooltipData } from './types';
import { prefectures } from './data/prefectures';

const AppContent: React.FC = () => {
    const { memories, user } = useGlobalContext();
    const [view, setView] = useState<'map' | 'gallery'>('map');
    const [selectedPrefecture, setSelectedPrefecture] = useState<Prefecture | null>(null);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

    const handlePrefectureClick = useCallback((prefecture: Prefecture) => {
        const memory = memories.find(m => m.prefectureId === prefecture.id);
        if (memory && memory.photos.length > 0) {
            setSelectedPrefecture(prefecture);
            setView('gallery');
        } else {
            // Can be used to show a message or open add modal directly
            console.log(`No memories for ${prefecture.name} yet.`);
        }
    }, [memories]);

    const handleBackToMap = useCallback(() => {
        setView('map');
        setSelectedPrefecture(null);
    }, []);

    const handleShowTooltip = useCallback((prefectureName: string, event: React.MouseEvent) => {
        setTooltipData({
            text: prefectureName,
            x: event.clientX + 15,
            y: event.clientY + 15,
        });
    }, []);

    const handleHideTooltip = useCallback(() => {
        setTooltipData(null);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header onAddMemoryClick={() => user && setAddModalOpen(true)} />
            <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
                {view === 'map' && (
                    <JapanMap
                        prefectures={prefectures}
                        visitedPrefectureIds={memories.map(m => m.prefectureId)}
                        onPrefectureClick={handlePrefectureClick}
                        onPrefectureHover={handleShowTooltip}
                        onMouseLeave={handleHideTooltip}
                    />
                )}
                {view === 'gallery' && selectedPrefecture && (
                    <GalleryView prefecture={selectedPrefecture} onBack={handleBackToMap} />
                )}
            </main>
            {isAddModalOpen && (
                <AddMemoryModal onClose={() => setAddModalOpen(false)} />
            )}
            {tooltipData && <Tooltip text={tooltipData.text} x={tooltipData.x} y={tooltipData.y} />}
        </div>
    );
};

const App: React.FC = () => (
    <AppProvider>
        <AppContent />
    </AppProvider>
);

export default App;
