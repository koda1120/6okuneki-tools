import { BarChart3, TrendingDown, RefreshCw, ChevronDown, ChevronUp, Smartphone } from 'lucide-react';
import { useState } from 'react';
import type { DiagnosisResult } from '../../types/result';
import { SavingsSummary } from './SavingsSummary';
import { SavingsTips } from './SavingsTips';
import { PlanCard } from './PlanCard';

interface ResultPageProps {
  result: DiagnosisResult;
  onRestart: () => void;
}

export function ResultPage({ result, onRestart }: ResultPageProps) {
  const [showAllTips, setShowAllTips] = useState(false);
  const [showAllPlans, setShowAllPlans] = useState(false);

  const displayedPlans = showAllPlans
    ? result.rankedPlans
    : result.rankedPlans.slice(0, 3);

  return (
    <div className="min-h-screen bg-bg-base pb-24">
      {/* ヘッダー */}
      <header className="bg-white border-b border-border py-4 px-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-main">診断結果</h1>
              <p className="text-xs text-text-sub">
                157プランから最適なプランを選びました
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4">
        {/* 節約サマリー */}
        <SavingsSummary summary={result.summary} />

        {/* 警告表示 */}
        {result.globalWarnings.length > 0 && (
          <div className="mt-4 p-4 bg-warning/5 border border-warning/20 rounded-lg">
            <ul className="text-sm text-warning space-y-1">
              {result.globalWarnings.map((warning, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span>!</span>
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 節約提案 */}
        {result.savingTips.length > 0 && (
          <section className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-text-main flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-success" />
                節約のヒント
              </h2>
              {result.savingTips.length > 2 && (
                <button
                  onClick={() => setShowAllTips(!showAllTips)}
                  className="text-sm text-accent flex items-center gap-1 font-medium"
                >
                  {showAllTips ? '閉じる' : 'すべて見る'}
                  {showAllTips ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
            <SavingsTips
              tips={showAllTips ? result.savingTips : result.savingTips.slice(0, 2)}
            />
          </section>
        )}

        {/* おすすめプラン一覧 */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-text-main flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-accent" />
              おすすめプラン
            </h2>
            <span className="text-sm text-text-sub">
              {result.rankedPlans.length}件
            </span>
          </div>

          <div className="space-y-4">
            {displayedPlans.map((planScore, index) => (
              <PlanCard
                key={`${planScore.plan.carrierId}-${planScore.plan.name}`}
                planScore={planScore}
                rank={index + 1}
                isTop={index === 0}
              />
            ))}
          </div>

          {/* もっと見るボタン */}
          {result.rankedPlans.length > 3 && (
            <button
              onClick={() => setShowAllPlans(!showAllPlans)}
              className="w-full mt-4 h-12 rounded-lg border border-border text-text-main font-medium flex items-center justify-center gap-2 tap-target focus-ring hover:bg-gray-50 transition-colors"
            >
              {showAllPlans ? (
                <>
                  閉じる
                  <ChevronUp className="w-5 h-5" />
                </>
              ) : (
                <>
                  他{result.rankedPlans.length - 3}件を見る
                  <ChevronDown className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </section>

        {/* やり直しボタン */}
        <div className="mt-8 pb-8">
          <button
            onClick={onRestart}
            className="w-full h-12 rounded-lg font-medium text-text-sub border border-border bg-white flex items-center justify-center gap-2 tap-target focus-ring hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            もう一度診断する
          </button>
        </div>
      </main>
    </div>
  );
}
