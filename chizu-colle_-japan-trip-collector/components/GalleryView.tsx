
import React, { useState, useEffect } from 'react';
import type { Prefecture, Photo } from '../types';
import { useGlobalContext } from '../context/AppContext';
import Spinner from './Spinner';

interface GalleryViewProps {
  prefecture: Prefecture;
  onBack: () => void;
}

const GalleryView: React.FC<GalleryViewProps> = ({ prefecture, onBack }) => {
  const { memories, loading: contextLoading } = useGlobalContext();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const memory = memories.find(m => m.prefectureId === prefecture.id);
    if (memory) {
      setPhotos(memory.photos);
    }
    setLoading(false);
  }, [prefecture, memories]);

  const isLoading = loading || contextLoading;

  return (
    <div className="w-full max-w-6xl animate-fade-in">
      <div className="mb-6">
        <button onClick={onBack} className="text-primary hover:text-accent font-semibold transition-colors">&larr; Back to Map</button>
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2">{prefecture.name} Memories</h2>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map(photo => (
            <div key={photo.id} className="group relative overflow-hidden rounded-box shadow-md">
              <img src={photo.url} alt={photo.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <p className="absolute bottom-0 left-0 p-3 text-white text-sm font-semibold truncate w-full">{photo.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-box shadow-md">
          <h3 className="text-xl font-semibold text-text-primary">No Memories Yet</h3>
          <p className="text-text-secondary mt-2">You haven't added any photos for {prefecture.name}. Click 'Add Memory' to start your collection!</p>
        </div>
      )}
    </div>
  );
};

export default GalleryView;
