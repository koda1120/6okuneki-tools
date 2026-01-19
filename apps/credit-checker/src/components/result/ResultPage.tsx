import { RotateCcw, Wallet, PieChart, RefreshCw, Lightbulb, HelpCircle } from 'lucide-react';
import { Button } from '@6okuneki/shared';
import { SummaryCard } from './SummaryCard';
import { CategoryChart } from './CategoryChart';
import { SubscriptionList } from './SubscriptionList';
import { ReviewTips } from './ReviewTips';
import { UnclassifiedList } from './UnclassifiedList';
import { ExportButtons } from './ExportButtons';
import type { DiagnosisResult } from '../../types';

interface ResultPageProps {
  result: DiagnosisResult;
  onRestart: () => void;
}

export function ResultPage({ result, onRestart }: ResultPageProps) {
  return (
    <div className="min-h-screen bg-bg-base py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-light rounded-full mb-4 shadow-warm">
            <Wallet className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-text-main mb-2">
            あなたの支出レポート
          </h1>
          <p className="text-text-sub">
            {result.summary.periodStart} 〜 {result.summary.periodEnd}
          </p>
        </div>

        {/* セクション1: サマリー */}
        <section className="mb-10 animate-fade-in-up delay-100" style={{ opacity: 0 }}>
          <SummaryCard summary={result.summary} />
        </section>

        {/* セクション2: カテゴリ別 */}
        {result.byCategory.length > 0 && (
          <section className="mb-10 animate-fade-in-up delay-200" style={{ opacity: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <PieChart className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold text-text-main">カテゴリ別に見ると...</h2>
            </div>
            <p className="text-sm text-text-sub mb-4">
              どこにお金を使っているか、内訳を見てみましょう
            </p>
            <CategoryChart categories={result.byCategory} />
          </section>
        )}

        {/* セクション3: サブスク */}
        {result.subscriptions.length > 0 && (
          <section className="mb-10 animate-fade-in-up delay-300" style={{ opacity: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold text-text-main">毎月の固定費</h2>
            </div>
            <p className="text-sm text-text-sub mb-4">
              サブスクや定期払いを見つけました
            </p>
            <SubscriptionList
              subscriptions={result.subscriptions}
              monthlyTotal={result.subscriptionMonthlyTotal}
              yearlyTotal={result.subscriptionYearlyTotal}
            />
          </section>
        )}

        {/* セクション4: 見直し提案 */}
        {result.reviewTips.length > 0 && (
          <section className="mb-10 animate-fade-in-up delay-400" style={{ opacity: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-warning" />
              <h2 className="text-lg font-bold text-text-main">気づきポイント</h2>
            </div>
            <p className="text-sm text-text-sub mb-4">
              支出を見直すヒントをお伝えします
            </p>
            <ReviewTips tips={result.reviewTips} />
          </section>
        )}

        {/* セクション5: 未分類 */}
        {result.unclassified.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-5 h-5 text-text-sub" />
              <h2 className="text-lg font-bold text-text-main">確認が必要な項目</h2>
            </div>
            <p className="text-sm text-text-sub mb-4">
              自動で分類できなかった{result.unclassified.length}件です
            </p>
            <UnclassifiedList items={result.unclassified} />
          </section>
        )}

        {/* エクスポートボタン */}
        <div className="mb-8">
          <ExportButtons result={result} />
        </div>

        {/* もう一度診断 */}
        <Button
          variant="secondary"
          size="lg"
          onClick={onRestart}
          className="w-full rounded-soft"
        >
          <span className="flex items-center justify-center gap-2">
            <RotateCcw className="w-5 h-5" />
            別のCSVを診断する
          </span>
        </Button>

        {/* 免責事項 */}
        <div className="mt-10 p-5 bg-bg-card rounded-soft shadow-warm">
          <p className="text-xs text-text-sub leading-relaxed">
            <strong className="text-text-main">データの取り扱い：</strong>CSVデータはサーバーに送信されません。すべてブラウザ内で処理され、ページを閉じると破棄されます。
          </p>
          <p className="text-xs text-text-sub leading-relaxed mt-3">
            <strong className="text-text-main">分類精度：</strong>自動分類は100%の精度を保証しません。分類できなかった項目はご自身で確認してください。
          </p>
          <p className="text-xs text-text-sub leading-relaxed mt-3">
            <strong className="text-text-main">免責：</strong>本ツールの利用により生じた損害について、当方は一切の責任を負いません。
          </p>
        </div>
      </div>
    </div>
  );
}
