import type { Prefecture } from '../types';

// This contains the SVG path data for all 47 prefectures.
// Please populate this file with appropriate SVG path data for a map of Japan.
// Example structure:
export const prefectures: Prefecture[] = [
  { id: 'JP-13', name: 'Tokyo', d: 'M_SOME_SVG_PATH_DATA_HERE' },
  { id: 'JP-27', name: 'Osaka', d: 'M_ANOTHER_SVG_PATH_DATA_HERE' },
  // ... and so on for all 47 prefectures
];
