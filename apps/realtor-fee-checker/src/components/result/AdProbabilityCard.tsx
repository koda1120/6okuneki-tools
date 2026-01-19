import { Card } from '@6okuneki/shared';
import { TrendingUp, TrendingDown, Minus, FileText } from 'lucide-react';
import type { AdProbability, ScoreFactor } from '../../types';
import { meterColors } from '../../constants/colors';
import { getProbabilityLabel, getProbabilityDescription, generateExplanation } from '../../lib/adCalculator';

interface AdProbabilityCardProps {
  probability: AdProbability;
  score: number;
  factors: ScoreFactor[];
}

function getMeterColor(score: number): string {
  if (score >= 80) return meterColors.veryHigh;
  if (score >= 60) return meterColors.high;
  if (score >= 40) return meterColors.medium;
  return meterColors.low;
}

export function AdProbabilityCard({ probability, score, factors }: AdProbabilityCardProps) {
  const meterColor = getMeterColor(score);
  const label = getProbabilityLabel(probability);
  const description = getProbabilityDescription(probability);
  const explanation = generateExplanation(probability, factors);

  return (
    <Card>
      <div className="p-4">
        <h3 className="text-sm font-medium text-text-sub mb-3">AD付き可能性</h3>

        {/* メーター */}
        <div className="mb-4">
          <div className="flex justify-between items-end mb-2">
            <span className="text-3xl font-bold" style={{ color: meterColor }}>
              {label}
            </span>
            <span className="text-lg font-medium text-text-sub">{score}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${score}%`,
                backgroundColor: meterColor,
              }}
            />
          </div>
        </div>

        <p className="text-sm text-text-main mb-4">{description}</p>

        {/* 診断理由（文章形式） */}
        {factors.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-accent" />
              <h4 className="text-sm font-medium text-text-main">診断理由</h4>
            </div>
            <div className="text-sm text-text-main leading-relaxed whitespace-pre-line">
              {explanation}
            </div>
          </div>
        )}

        {/* 判定要因（詳細リスト） */}
        {factors.length > 0 && (
          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-medium text-text-sub mb-2">判定要因の詳細</h4>
            <ul className="space-y-2">
              {factors.map((factor, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  {factor.impact === 'positive' && (
                    <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  )}
                  {factor.impact === 'negative' && (
                    <TrendingDown className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  {factor.impact === 'neutral' && (
                    <Minus className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  )}
                  <span className="text-text-main">{factor.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
