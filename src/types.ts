export interface User {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
}

export interface Prefecture {
  id: string;
  name: string;
  d: string;
}

export interface Photo {
  id: string;
  url: string;
  name: string;
}

export interface Memory {
  prefectureId: string;
  photos: Photo[];
  primaryPhotoUrl?: string;
}

export interface TooltipData {
  text: string;
  x: number;
  y: number;
}
