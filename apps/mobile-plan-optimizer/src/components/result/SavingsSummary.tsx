import { TrendingDown, Wallet, Database, Phone } from 'lucide-react';
import type { DiagnosisSummary } from '../../types/result';

interface SavingsSummaryProps {
  summary: DiagnosisSummary;
}

export function SavingsSummary({ summary }: SavingsSummaryProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const hasSavings =
    summary.estimatedYearlySavings !== null && summary.estimatedYearlySavings > 0;

  const voiceOptionLabel = {
    none: '通話オプション不要',
    '5min': '5分かけ放題がおすすめ',
    unlimited: 'かけ放題がおすすめ',
  };

  return (
    <div className="card">
      {/* 節約額ハイライト（あれば） */}
      {hasSavings && (
        <div className="text-center pb-4 mb-4 border-b border-border">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-success" />
            </div>
            <span className="text-sm text-text-sub">年間節約見込み</span>
          </div>
          <p className="price-large text-success">
            ¥{formatPrice(summary.estimatedYearlySavings!)}
          </p>
          <p className="text-xs text-text-sub mt-1">
            現在の月額 ¥{formatPrice(summary.currentMonthlyFee!)} から
          </p>
        </div>
      )}

      {/* おすすめ月額 */}
      <div className="text-center mb-4">
        <p className="text-sm text-text-sub mb-1">
          おすすめプランの月額
        </p>
        <p className="price-large text-text-main">
          ¥{formatPrice(summary.recommendedMonthlyFee)}
          <span className="price-unit text-text-sub">/月</span>
        </p>
      </div>

      {/* 診断結果の詳細 */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-accent" />
          <div>
            <p className="text-xs text-text-sub">推定データ量</p>
            <p className="text-sm font-semibold text-text-main">
              {summary.estimatedDataUsage}GB/月
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-accent" />
          <div>
            <p className="text-xs text-text-sub">通話オプション</p>
            <p className="text-sm font-semibold text-text-main">
              {voiceOptionLabel[summary.recommendedVoiceOption]}
            </p>
          </div>
        </div>
      </div>

      {/* 現在の料金が不明な場合 */}
      {!hasSavings && summary.currentMonthlyFee === null && (
        <div className="mt-4 pt-4 border-t border-border text-center">
          <div className="inline-flex items-center gap-2 text-sm text-text-sub">
            <Wallet className="w-4 h-4" />
            現在の料金を入力すると節約額を計算できます
          </div>
        </div>
      )}
    </div>
  );
}
