
import type { Photo, Memory } from '../types';

// This is a mock implementation of a Google Drive service.
// It simulates uploading files and retrieving them, as if a backend were managing it.

const MOCK_DB: { [key: string]: Photo[] } = {
    'JP-13': [ // Tokyo
        { id: 'tokyo-1', name: 'Shibuya Crossing', url: 'https://picsum.photos/seed/shibuya/800/600' },
        { id: 'tokyo-2', name: 'Tokyo Tower', url: 'https://picsum.photos/seed/tokyotower/800/600' },
    ],
    'JP-26': [ // Kyoto
        { id: 'kyoto-1', name: 'Kinkaku-ji', url: 'https://picsum.photos/seed/kinkakuji/800/600' },
    ],
};

const getObjectURL = (file: File): Promise<string> => {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
    });
}

export const driveService = {
  getInitialMemories: (): Promise<Memory[]> => {
    console.log("Fetching initial memories...");
    return new Promise(resolve => {
      setTimeout(() => {
        const memories = Object.entries(MOCK_DB).map(([prefectureId, photos]) => ({
            prefectureId,
            photos,
            primaryPhotoUrl: photos[0]?.url,
        }));
        resolve(memories);
      }, 500);
    });
  },

  uploadPhotos: async (prefectureId: string, files: File[]): Promise<Photo[]> => {
    console.log(`Simulating upload of ${files.length} photos to prefecture ${prefectureId}...`);
    // This simulates a server-side proxy model.
    
    const uploadedPhotos: Photo[] = [];

    for (const file of files) {
        await new Promise(res => setTimeout(res, 300)); // Simulate network latency per file
        const newPhoto: Photo = {
            id: `new-${Date.now()}-${Math.random()}`,
            name: file.name,
            url: await getObjectURL(file), // Using data URL as a temporary representation
        };
        uploadedPhotos.push(newPhoto);

        if (!MOCK_DB[prefectureId]) {
            MOCK_DB[prefectureId] = [];
        }
        MOCK_DB[prefectureId].push(newPhoto);
    }
    
    console.log("Upload simulation complete.");
    return uploadedPhotos;
  },

  getPhotosForPrefecture: (prefectureId: string): Promise<Photo[]> => {
    console.log(`Fetching photos for ${prefectureId}...`);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(MOCK_DB[prefectureId] || []);
      }, 500);
    });
  },
};
