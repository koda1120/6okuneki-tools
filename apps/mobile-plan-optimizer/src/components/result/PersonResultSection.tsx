import { User, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { PersonResult } from '../../types/result';
import { PlanCard } from './PlanCard';

interface PersonResultSectionProps {
  personResult: PersonResult;
  totalPersons: number;
}

export function PersonResultSection({
  personResult,
  totalPersons,
}: PersonResultSectionProps) {
  const [showMore, setShowMore] = useState(false);

  const personLabel =
    personResult.personIndex === 0 ? 'あなた' : `${personResult.personIndex + 1}人目`;

  const topPlans = showMore
    ? personResult.rankedPlans
    : personResult.rankedPlans.slice(0, 3);

  return (
    <div>
      {/* セクションヘッダー */}
      {totalPersons > 1 && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-accent" />
          </div>
          <h3 className="font-bold text-text-main">{personLabel}のおすすめ</h3>
        </div>
      )}

      {/* 推定データ使用量 */}
      <div className="mb-3 text-sm text-text-sub">
        推定データ使用量: 約{personResult.estimatedDataUsage}GB/月
        {personResult.recommendedVoiceOption !== 'none' && (
          <span className="ml-2">
            / 通話オプション:{' '}
            {personResult.recommendedVoiceOption === '5min'
              ? '5分かけ放題推奨'
              : '完全かけ放題推奨'}
          </span>
        )}
      </div>

      {/* プランカード */}
      <div className="space-y-3">
        {topPlans.map((planScore, index) => (
          <PlanCard
            key={planScore.plan.id}
            planScore={planScore}
            rank={index + 1}
            isTop={index === 0}
          />
        ))}
      </div>

      {/* もっと見るボタン */}
      {personResult.rankedPlans.length > 3 && (
        <button
          onClick={() => setShowMore(!showMore)}
          className="w-full mt-3 py-2 text-sm text-accent flex items-center justify-center gap-1"
        >
          {showMore ? (
            <>
              閉じる
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              他{personResult.rankedPlans.length - 3}件を見る
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
