import type { Photo } from '../types';

// Service responsible for communicating with our backend API which in turn
// uploads files to the user's Google Drive.
export const driveService = {
  uploadPhotos: async (
    accessToken: string,
    prefectureId: string,
    files: File[],
  ): Promise<Photo[]> => {
    const formData = new FormData();
    formData.append('prefectureId', prefectureId);
    files.forEach(file => formData.append('files', file));

    const response = await fetch('/api/drive/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload photos to Google Drive');
    }

    const data = await response.json();
    return data.photos as Photo[];
  },
};

