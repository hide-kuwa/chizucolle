import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  // 超重要：本番環境では、より堅牢な認証・認可チェックを行うこと！
  const secret = req.headers.get('x-config-secret');
  if (secret !== process.env.CONFIG_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const newTheme = await req.json();
    const themePath = path.join(process.cwd(), 'src', 'data', 'theme.json');

    // JSONを整形して書き込む
    await fs.writeFile(themePath, JSON.stringify(newTheme, null, 2), 'utf8');

    return NextResponse.json({ message: 'Theme updated successfully!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 });
  }
}
