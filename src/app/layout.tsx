import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '地図コレ',
  description: '47都道府県の訪問記録を楽しくコレクション',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-svh bg-neutral-50 text-neutral-900 antialiased">{children}</body>
    </html>
  );
}
