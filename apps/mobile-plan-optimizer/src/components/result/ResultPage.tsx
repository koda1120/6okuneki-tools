import { BarChart3, TrendingDown, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { DiagnosisResult } from '../../types/result';
import { SavingsSummary } from './SavingsSummary';
import { SavingsTips } from './SavingsTips';
import { PersonResultSection } from './PersonResultSection';
import { FamilyPatternComparison } from './FamilyPatternComparison';

interface ResultPageProps {
  result: DiagnosisResult;
  onRestart: () => void;
}

export function ResultPage({ result, onRestart }: ResultPageProps) {
  const [showAllTips, setShowAllTips] = useState(false);

  return (
    <div className="min-h-screen bg-bg-base pb-24">
      {/* ヘッダー - シンプル・ミニマル */}
      <header className="bg-white border-b border-border py-4 px-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-main">診断結果</h1>
              <p className="text-xs text-text-sub">
                あなたに最適なプランを見つけました
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

        {/* 各人の結果 */}
        <section className="mt-8 space-y-6">
          {result.personResults.map((personResult) => (
            <PersonResultSection
              key={personResult.personIndex}
              personResult={personResult}
              totalPersons={result.summary.totalPersons}
            />
          ))}
        </section>

        {/* 家族パターン比較 */}
        {result.familyPatterns && result.familyPatterns.length > 0 && (
          <section className="mt-8">
            <h2 className="font-bold text-text-main mb-3">
              家族プランの比較
            </h2>
            <FamilyPatternComparison patterns={result.familyPatterns} />
          </section>
        )}

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
