import { Home, RotateCcw } from 'lucide-react';
import type { DiagnosisResult } from '../../types';
import { AdProbabilityCard } from './AdProbabilityCard';
import { SavingsCard } from './SavingsCard';
import { NegotiationTips } from './NegotiationTips';
import { NegotiationDifficultyCard } from './NegotiationDifficultyCard';
import { LineCtaCard } from './LineCtaCard';
import { AdExplanation } from './AdExplanation';

interface ResultPageProps {
  result: DiagnosisResult;
  onRestart: () => void;
}

export function ResultPage({ result, onRestart }: ResultPageProps) {
  return (
    <div className="min-h-screen bg-bg-base">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
              <Home className="w-6 h-6 text-accent" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-text-main">診断結果</h1>
          <p className="text-sm text-text-sub mt-1">
            あなたの物件の仲介手数料診断
          </p>
        </div>

        {/* 結果カード群 */}
        <div className="space-y-4">
          {/* AD可能性メーター */}
          <AdProbabilityCard
            probability={result.adProbability}
            score={result.adProbabilityScore}
            factors={result.adProbabilityFactors}
          />

          {/* 節約可能額 */}
          <SavingsCard
            currentFee={result.currentFee}
            legalMaxFee={result.legalMaxFee}
            potentialSavings={result.potentialSavings}
            isOvercharged={result.isOvercharged}
          />

          {/* アドバイス */}
          <NegotiationTips tips={result.tips} />

          {/* 交渉の難しさ */}
          <NegotiationDifficultyCard />

          {/* LINE CTA - 最重要 */}
          <LineCtaCard />

          {/* ADとは */}
          <AdExplanation />

          {/* やり直しボタン */}
          <button
            onClick={onRestart}
            className="w-full h-12 rounded-lg font-medium flex items-center justify-center gap-2
                     bg-white border border-border text-text-sub hover:bg-gray-50"
          >
            <RotateCcw className="w-5 h-5" />
            もう一度診断する
          </button>
        </div>
      </div>
    </div>
  );
}
