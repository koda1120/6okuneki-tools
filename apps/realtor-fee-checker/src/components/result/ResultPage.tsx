import { FileText, RotateCcw, Shield, MessageCircle } from 'lucide-react';
import type { DiagnosisResult } from '../../types';
import { GaugeMeter } from './GaugeMeter';
import { SavingsCard } from './SavingsCard';
import { NegotiationTips } from './NegotiationTips';
import { NegotiationDifficultyCard } from './NegotiationDifficultyCard';
import { AdExplanation } from './AdExplanation';
import { config } from '../../constants/config';
import { generateExplanation } from '../../lib/adCalculator';

interface ResultPageProps {
  result: DiagnosisResult;
  onRestart: () => void;
}

export function ResultPage({ result, onRestart }: ResultPageProps) {
  const reportDate = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 診断理由の説明文を生成
  const explanation = generateExplanation(result.adProbability, result.adProbabilityFactors);

  return (
    <div className="min-h-screen bg-bg-base pb-24">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* レポートヘッダー */}
        <div className="bg-white border border-border rounded-card shadow-card overflow-hidden mb-6">
          <div className="bg-accent px-5 py-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-white" />
              <div>
                <h1 className="text-lg font-bold text-white">診断結果レポート</h1>
                <p className="text-xs text-white/80">{reportDate}</p>
              </div>
            </div>
          </div>

          {/* 信頼性バッジ */}
          <div className="px-5 py-3 border-b border-border flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-xs text-text-sub">専門スタッフによる無料相談対応</span>
          </div>

          {/* ゲージメーター */}
          <div className="px-5 py-6">
            <GaugeMeter
              score={result.adProbabilityScore}
              probability={result.adProbability}
            />
          </div>

          {/* 診断理由 */}
          {result.adProbabilityFactors.length > 0 && (
            <div className="px-5 pb-5">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-bold text-text-main mb-2">診断理由</h3>
                <p className="text-sm text-text-main leading-relaxed whitespace-pre-line">
                  {explanation}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* セクション: 手数料分析 */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-accent rounded-full"></span>
            手数料分析
          </h2>
          <SavingsCard
            currentFee={result.currentFee}
            legalMaxFee={result.legalMaxFee}
            potentialSavings={result.potentialSavings}
            isOvercharged={result.isOvercharged}
          />
        </div>

        {/* セクション: アドバイス */}
        {result.tips.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-accent rounded-full"></span>
              診断からのアドバイス
            </h2>
            <NegotiationTips tips={result.tips} />
          </div>
        )}

        {/* セクション: 交渉について */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-accent rounded-full"></span>
            交渉について
          </h2>
          <NegotiationDifficultyCard />
        </div>

        {/* セクション: ADとは */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-accent rounded-full"></span>
            AD（広告料）とは
          </h2>
          <AdExplanation />
        </div>

        {/* やり直しボタン */}
        <button
          onClick={onRestart}
          className="w-full h-12 rounded-card font-medium flex items-center justify-center gap-2
                   bg-white border border-border text-text-sub hover:bg-gray-50 shadow-card"
        >
          <RotateCcw className="w-5 h-5" />
          もう一度診断する
        </button>
      </div>

      {/* スティッキーLINE CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 shadow-lg">
        <div className="max-w-md mx-auto">
          <a
            href={config.lineOfficialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-14 bg-line-green text-white font-bold rounded-card
                     flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-card"
          >
            <MessageCircle className="w-6 h-6" />
            無料で相談する
          </a>
          <p className="text-xs text-text-sub text-center mt-2">
            相談は無料です。契約の強制はありません。
          </p>
        </div>
      </div>
    </div>
  );
}
