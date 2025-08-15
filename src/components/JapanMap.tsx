'use client';
import type { Memory, Prefecture, Status } from '@/types';
import { prefectures } from '../data/prefectures';

// 二つの未来の機能を、すべて受け入れる最強の Props を定義！
type Props = {
  memories: Memory[];
  statuses: Status[]; // mainブランチから来た、カスタマイズ可能なステータス定義
  onPrefectureClick: (pref: Prefecture, event: React.MouseEvent<SVGPathElement>) => void;
  onPrefectureHover: (name: string, event: React.MouseEvent<SVGPathElement>) => void;
  onMouseLeave: () => void;
  onMapBackgroundClick?: () => void;
  isRecordingTrip?: boolean; // codexブランチから来た「旅の記録モード」
  selectedPrefectures?: string[]; // codexブランチから来た、選択中の都道府県
  flashPrefectures?: string[]; // codexブランチから来た、アニメーションさせる都道府県
};

const PREF_JP: Record<string, string> = {
  '1':'北海道','2':'青森県','3':'岩手県','4':'宮城県','5':'秋田県','6':'山形県','7':'福島県','8':'茨城県','9':'栃木県','10':'群馬県','11':'埼玉県','12':'千葉県','13':'東京都','14':'神奈川県','15':'新潟県','16':'富山県','17':'石川県','18':'福井県','19':'山梨県','20':'長野県','21':'岐阜県','22':'静岡県','23':'愛知県','24':'三重県','25':'滋賀県','26':'京都府','27':'大阪府','28':'兵庫県','29':'奈良県','30':'和歌山県','31':'鳥取県','32':'島根県','33':'岡山県','34':'広島県','35':'山口県','36':'徳島県','37':'香川県','38':'愛媛県','39':'高知県','40':'福岡県','41':'佐賀県','42':'長崎県','43':'熊本県','44':'大分県','45':'宮崎県','46':'鹿児島県','47':'沖縄県'
};

// 両方の機能を受け入れた、新しいJapanMapの誕生だ！
export default function JapanMap({
  memories,
  statuses,
  onPrefectureClick,
  onPrefectureHover,
  onMouseLeave,
  onMapBackgroundClick,
  isRecordingTrip = false,
  selectedPrefectures = [],
  flashPrefectures = [],
}: Props) {
  // 色の定義は、ハードコードではなく、statusesから動的に生成する！ (mainブランチの賢いやり方)
  const statusColors = statuses.reduce((acc, s) => {
    acc[s.id] = s.color;
    return acc;
  }, {} as Record<string, string>);
  const defaultColor = statusColors['unvisited'] || '#d1d5db';

  const getFill = (prefectureId: string): string => {
    const m = memories.find(x => x.prefectureId === prefectureId);
    if (!m?.status) return defaultColor;
    return statusColors[m.status] ?? defaultColor;
  };

  return (
    // 前回の変更を反映して、高さは h-map にしておこう！
    <div className="relative w-full h-map">
      <svg
        viewBox="0 0 688 684"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
        onMouseLeave={onMouseLeave}
        onClick={onMapBackgroundClick}
      >
        <g>
          {prefectures.map((p) => {
            return (
              <path
                key={p.id}
                d={p.d}
                data-pref={p.id}
                data-name={PREF_JP[p.id]}
                fill={getFill(p.id)}
                onClick={(e) => { e.stopPropagation(); onPrefectureClick(p, e); }}
                onMouseEnter={(e) => onPrefectureHover(PREF_JP[p.id], e)}
                onMouseMove={(e) => onPrefectureHover(PREF_JP[p.id], e)}
                // アニメーションのためのクラスも、もちろん搭載する！ (codexブランチのカッコいい演出)
                className={`stroke-white transition-all duration-200 ease-in-out ${
                  isRecordingTrip && selectedPrefectures.includes(p.id)
                    ? 'scale-[1.05] stroke-primary stroke-2'
                    : 'hover:scale-[1.03]'
                } ${flashPrefectures.includes(p.id) ? 'animate-pulse' : ''}`}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}