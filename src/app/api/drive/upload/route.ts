import { NextRequest, NextResponse } from 'next/server';
import type { Photo } from '@/types';

// API route that proxies file uploads to Google Drive using the user's access token.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const prefectureId = formData.get('prefectureId') as string;
    const files = formData.getAll('files') as File[];
    const authHeader = req.headers.get('authorization');
    const accessToken = authHeader?.split(' ')[1];
    if (!accessToken) {
      return NextResponse.json({ error: 'Missing access token' }, { status: 401 });
    }

    const uploaded: Photo[] = [];
    for (const file of files) {
      const metadata = {
        name: file.name,
        mimeType: file.type,
        description: `prefecture:${prefectureId}`,
      };
      const uploadBody = new FormData();
      uploadBody.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      uploadBody.append('file', file);

      const driveRes = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: uploadBody,
        },
      );

      if (!driveRes.ok) {
        const message = await driveRes.text();
        throw new Error(message);
      }
      const { id, name, webViewLink } = await driveRes.json();
      uploaded.push({ id, name, url: webViewLink });
    }

    return NextResponse.json({ photos: uploaded });
  } catch (err) {
    console.error('Google Drive upload failed', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

