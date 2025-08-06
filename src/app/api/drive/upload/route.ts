import { NextRequest, NextResponse } from 'next/server';
import type { Photo } from '@/types';

const APP_FOLDER_NAME = 'Chizu-Colle Memories';

/**
 * Finds the ID of the app's dedicated folder in Google Drive, creating it if it doesn't exist.
 */
async function getOrCreateAppFolder(accessToken: string): Promise<string> {
  // First, search for the folder
  const params = new URLSearchParams({
    q: `name='${APP_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder'`,
    spaces: 'drive',
    fields: 'files(id, name)',
  });
  const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!searchRes.ok) {
    const errorBody = await searchRes.json();
    console.error('Google Drive API Error (Folder Search):', JSON.stringify(errorBody, null, 2));
    throw new Error('Could not search for app folder in Google Drive.');
  }

  const searchData = await searchRes.json();
  if (searchData.files.length > 0) {
    return searchData.files[0].id; // Folder found
  }

  // If not found, create it
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: APP_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });

  if (!createRes.ok) {
    const errorBody = await createRes.json();
    console.error('Google Drive API Error (Folder Creation):', JSON.stringify(errorBody, null, 2));
    throw new Error('Could not create app folder in Google Drive.');
  }

  const createData = await createRes.json();
  return createData.id;
}

/**
 * Finds or creates a subfolder with the given name inside the parent folder.
 */
async function getOrCreatePrefectureFolder(
  accessToken: string,
  parentId: string,
  prefectureName: string,
): Promise<string> {
  const params = new URLSearchParams({
    q: `'${parentId}' in parents and name='${prefectureName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    spaces: 'drive',
    fields: 'files(id, name)',
  });

  const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!searchRes.ok) {
    const errorBody = await searchRes.json();
    console.error('Google Drive API Error (Prefecture Folder Search):', JSON.stringify(errorBody, null, 2));
    throw new Error('Could not search for prefecture folder in Google Drive.');
  }

  const searchData = await searchRes.json();
  if (searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: prefectureName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    }),
  });

  if (!createRes.ok) {
    const errorBody = await createRes.json();
    console.error('Google Drive API Error (Prefecture Folder Creation):', JSON.stringify(errorBody, null, 2));
    throw new Error('Could not create prefecture folder in Google Drive.');
  }

  const createData = await createRes.json();
  return createData.id;
}

function formatTimestamp(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}_${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const prefectureName = formData.get('prefectureId') as string;
    const files = formData.getAll('files') as File[];
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
    }
    const accessToken = authHeader.split(' ')[1];

    // ★★★【ここが、最後の鍵だ！】★★★
    // アップロードする前に、まず「宝箱」の場所を確保する！
    const appFolderId = await getOrCreateAppFolder(accessToken);
    const prefectureFolderId = await getOrCreatePrefectureFolder(accessToken, appFolderId, prefectureName);

    const uploaded: Photo[] = [];
    for (const file of files) {
      const timestamp = formatTimestamp(new Date());
      const newName = `${timestamp}_${file.name}`;

      const metadata = {
        name: newName,
        parents: [prefectureFolderId],
        mimeType: file.type,
        description: `prefecture:${prefectureName}`,
      };

      const body = new FormData();
      body.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      body.append('file', file);

      const driveRes = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: body,
        },
      );

      if (!driveRes.ok) {
        const errorBody = await driveRes.json();
        console.error('Google Drive API Error (File Upload):', JSON.stringify(errorBody, null, 2));
        throw new Error(`Google Drive API responded with status ${driveRes.status}: ${errorBody.error.message}`);
      }

      const { id, name, webViewLink } = await driveRes.json();
      uploaded.push({ id, name, url: webViewLink });
    }

    return NextResponse.json({ photos: uploaded });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    console.error('Google Drive upload failed in API route:', errorMessage);
    return NextResponse.json({ error: 'Upload failed', details: errorMessage }, { status: 500 });
  }
}

