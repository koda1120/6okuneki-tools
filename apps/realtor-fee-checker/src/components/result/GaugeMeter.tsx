import type { AdProbability } from '../../types';
import { getProbabilityLabel } from '../../lib/adCalculator';

interface GaugeMeterProps {
  score: number;
  probability: AdProbability;
}

function getGaugeColor(score: number): string {
  if (score >= 80) return '#B8860B'; // gold
  if (score >= 60) return '#1E3A5F'; // accent (dark navy)
  if (score >= 40) return '#5C6878'; // text-sub
  return '#9CA3AF'; // gray
}

function getNegotiationLabel(score: number): string {
  if (score >= 70) return '交渉余地: 高';
  if (score >= 50) return '交渉余地: 中';
  if (score >= 30) return '交渉余地: やや低';
  return '交渉余地: 低';
}

export function GaugeMeter({ score, probability }: GaugeMeterProps) {
  const color = getGaugeColor(score);
  const label = getProbabilityLabel(probability);
  const negotiationLabel = getNegotiationLabel(score);

  // 半円のパス計算
  const radius = 80;
  const strokeWidth = 12;
  const centerX = 100;
  const centerY = 90;

  // スコアに応じた角度（0-180度）
  const angle = (score / 100) * 180;
  const angleRad = (angle * Math.PI) / 180;

  // 終点の座標
  const endX = centerX - radius * Math.cos(angleRad);
  const endY = centerY - radius * Math.sin(angleRad);

  // SVGのarcフラグ
  const largeArcFlag = angle > 180 ? 1 : 0;

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="120" viewBox="0 0 200 120">
        {/* 背景の半円 */}
        <path
          d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
          fill="none"
          stroke="#E2E5EA"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* スコアの半円 */}
        {score > 0 && (
          <path
            d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.5s ease-out',
            }}
          />
        )}

        {/* 中央のスコア表示 */}
        <text
          x={centerX}
          y={centerY - 15}
          textAnchor="middle"
          className="text-3xl font-bold"
          fill={color}
        >
          {score}
        </text>
        <text
          x={centerX}
          y={centerY + 5}
          textAnchor="middle"
          className="text-xs"
          fill="#5C6878"
        >
          / 100
        </text>
      </svg>

      {/* ラベル */}
      <div className="text-center -mt-2">
        <p className="text-lg font-bold" style={{ color }}>
          AD可能性: {label}
        </p>
        <p className="text-sm text-text-sub mt-1">{negotiationLabel}</p>
      </div>
    </div>
  );
}
