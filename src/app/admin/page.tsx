'use client';
import React, { useState, useEffect } from 'react';

// このページは本番では認証で保護する必要があります

type Theme = {
  colors: Record<string, string>;
  borderRadius: Record<string, string>;
  boxShadow: Record<string, string>;
  map: {
    height: string;
  };
};

export default function AdminPage() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [secret, setSecret] = useState('');

  useEffect(() => {
    // サーバーから現在のテーマを取得する（Next.js 13+ではAPIルート経由が一般的）
    // ここでは簡単化のため、静的にインポートします
    import('@/data/theme.json').then(data => setTheme(data.default as Theme));
  }, []);

  const handleThemeChange = (category: keyof Theme, key: string, value: string) => {
    setTheme(prev => {
      if (!prev) return null;
      const newTheme = { ...prev };
      (newTheme[category] as Record<string, string>)[key] = value;
      return newTheme;
    });
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/theme/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-config-secret': secret,
        },
        body: JSON.stringify(theme),
      });
      if (!res.ok) throw new Error('Failed to save');
      alert('テーマを更新しました！');
    } catch (error) {
      alert('エラー：' + error);
    }
  };

  if (!theme) return <div>Loading theme...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold">UIコンフィグページ</h1>
      <p className="text-gray-600 mb-6">ここでの変更は、サイト全体のデザインに即座に反映されます。</p>

      <div className="mb-4">
        <label>秘密の鍵:</label>
        <input type="password" value={secret} onChange={e => setSecret(e.target.value)} className="border p-1 ml-2" />
      </div>

        <h2 className="text-xl font-bold mt-8 mb-4">Colors</h2>
        <div className="space-y-4">
          {Object.entries(theme.colors).map(([name, value]) => (
            <div key={name} className="flex items-center">
              <label className="w-32">{name}:</label>
              <input
                type="color"
                value={value as string}
                onChange={(e) => handleThemeChange('colors', name, e.target.value)}
              />
               <span className="ml-4 p-2" style={{ backgroundColor: value as string }}>{value as string}</span>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mt-8 mb-4">Map Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <label className="w-32">Map Height:</label>
            <input
              type="text"
              value={theme.map.height}
              onChange={(e) => handleThemeChange('map', 'height', e.target.value)}
              className="border p-1 ml-2"
              placeholder="e.g., 66.67vh or 800px"
            />
          </div>
        </div>

        <button onClick={handleSave} className="mt-8 rounded-button bg-primary text-white py-2 px-6">
          変更を保存
        </button>
      </div>
    );
  }
