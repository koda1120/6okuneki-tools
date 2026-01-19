import { Receipt, CheckCircle } from 'lucide-react';
import type { DiagnosisSummary } from '../../types';

interface SummaryCardProps {
  summary: DiagnosisSummary;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  const classifiedRate = summary.transactionCount > 0
    ? Math.round((summary.classifiedCount / summary.transactionCount) * 100)
    : 0;

  return (
    <div className="bg-bg-card rounded-softer shadow-warm-lg p-6">
      {/* メインの合計金額 */}
      <div className="text-center mb-6 pb-6 border-b border-border">
        <p className="text-sm text-text-sub mb-2">今月の支出合計</p>
        <p className="text-4xl font-bold text-text-main">
          <span className="text-2xl mr-1">¥</span>
          {summary.totalAmount.toLocaleString()}
        </p>
      </div>

      {/* 取引件数と分類状況 */}
      <div className="flex items-center justify-between">
        {/* 取引件数 */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-accent-light rounded-full flex items-center justify-center">
            <Receipt className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-main">
              {summary.transactionCount}
              <span className="text-sm font-normal text-text-sub ml-1">件</span>
            </p>
            <p className="text-xs text-text-sub">の取引を分析</p>
          </div>
        </div>

        {/* 分類率 */}
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end mb-1">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-sm text-text-sub">分類率</span>
          </div>
          <p className="text-2xl font-bold text-success">
            {classifiedRate}
            <span className="text-sm font-normal">%</span>
          </p>
        </div>
      </div>

      {/* 分類済み / 未分類 */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-text-sub">分類済み</span>
            <span className="font-medium text-text-main">{summary.classifiedCount}件</span>
          </div>
          {summary.unclassifiedCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-border" />
              <span className="text-text-sub">未分類</span>
              <span className="font-medium text-text-main">{summary.unclassifiedCount}件</span>
            </div>
          )}
        </div>

        {/* 分類率バー */}
        <div className="mt-3 h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-success rounded-full transition-all duration-500"
            style={{ width: `${classifiedRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}
