'use client';
type Props = {
  code: string | null;
  name: string | null;
  x: number;
  y: number;
  onOpen?: (code: string) => void;
  onToggleVisited?: (code: string) => void;
};

const PREF_NAMES: Record<string, string> = {
  '1': '北海道','2': '青森県','3': '岩手県','4': '宮城県','5': '秋田県','6': '山形県','7': '福島県',
  '8': '茨城県','9': '栃木県','10': '群馬県','11': '埼玉県','12': '千葉県','13': '東京都','14': '神奈川県',
  '15': '新潟県','16': '富山県','17': '石川県','18': '福井県','19': '山梨県','20': '長野県',
  '21': '岐阜県','22': '静岡県','23': '愛知県','24': '三重県',
  '25': '滋賀県','26': '京都府','27': '大阪府','28': '兵庫県','29': '奈良県','30': '和歌山県',
  '31': '鳥取県','32': '島根県','33': '岡山県','34': '広島県','35': '山口県',
  '36': '徳島県','37': '香川県','38': '愛媛県','39': '高知県',
  '40': '福岡県','41': '佐賀県','42': '長崎県','43': '熊本県','44': '大分県','45': '宮崎県','46': '鹿児島県','47': '沖縄県'
};

export default function PrefHoverActions({ code, name, x, y, onOpen, onToggleVisited }: Props) {
  if (!code) return null;
  const n = name || PREF_NAMES[code] || '';
  return (
    <div style={{ position: 'fixed', left: x, top: y, zIndex: 9999 }} className="rounded-xl shadow-lg bg-white/90 backdrop-blur px-2 py-1 text-sm border">
      <div className="flex items-center gap-2">
        <span className="font-medium">{n}</span>
        <button onClick={() => code && onOpen?.(code)} className="px-2 py-0.5 rounded border hover:bg-gray-50">開く</button>
        <button onClick={() => code && onToggleVisited?.(code)} className="px-2 py-0.5 rounded border hover:bg-gray-50">Visited</button>
      </div>
    </div>
  );
}
