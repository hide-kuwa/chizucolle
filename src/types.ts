import type { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
}

export interface Prefecture {
  id: string;
  name: string;
  d: string; // SVG path data
}

export interface Photo {
  id: string;
  url: string;
  name: string;
  createdAt?: string | Timestamp;
  caption?: string;
  likes?: number;
}

export interface Status {
  id: string;
  label: string;
  color: string;
  action: string;
}

// Define the possible visit statuses
export type VisitStatus = string;

export interface Memory {
  prefectureId: string;
  status: VisitStatus; // Replaces the simple "visited" concept
  photos: Photo[];
  notes?: string; // Optional field for future use
}

export interface TooltipData {
  text: string;
  x: number;
  y: number;
}
