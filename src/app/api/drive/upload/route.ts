import { NextRequest, NextResponse } from 'next/server';
import type { Photo } from '@/types';

// API route that proxies file uploads to Google Drive using the user's access token.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const prefectureId = formData.get('prefectureId') as string;
    const files = formData.getAll('files') as File[];
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
    }
    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      return NextResponse.json({ error: 'Missing access token' }, { status: 401 });
    }

    const uploaded: Photo[] = [];
    for (const file of files) {
      // Step 1: Create the file metadata
      const metadata = {
        name: file.name,
        parents: [], // We'll handle folder creation later to keep it simple
        mimeType: file.type,
        description: `prefecture:${prefectureId}`,
      };

      // Step 2: Construct the multipart request body MANUALLY for precision
      const body = new FormData();
      body.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      body.append('file', file);

      const driveRes = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // Let the browser set the Content-Type header with the correct boundary
          },
          body: body,
        },
      );

      // ★★★【ここが最重要！】★★★
      // もしエラーなら、Googleからの「本当のメッセージ」を全部コンソールに出力する！
      if (!driveRes.ok) {
        const errorBody = await driveRes.json();
        console.error('Google Drive API Error:', JSON.stringify(errorBody, null, 2));
        throw new Error(`Google Drive API responded with status ${driveRes.status}: ${errorBody.error.message}`);
      }
      const { id, name, webViewLink } = await driveRes.json();
      uploaded.push({ id, name, url: webViewLink });
    }

    return NextResponse.json({ photos: uploaded });
  } catch (err) {
    // エラーメッセージをより具体的にする
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    console.error('Google Drive upload failed in API route:', errorMessage);
    return NextResponse.json({ error: 'Upload failed', details: errorMessage }, { status: 500 });
  }
}

