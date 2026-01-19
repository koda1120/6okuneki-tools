import { Tv, ExternalLink, AlertCircle } from 'lucide-react';
import type { SubscriptionDetection } from '../../types';

interface SubscriptionListProps {
  subscriptions: SubscriptionDetection[];
  monthlyTotal: number;
  yearlyTotal: number;
}

export function SubscriptionList({ subscriptions, monthlyTotal, yearlyTotal }: SubscriptionListProps) {
  if (subscriptions.length === 0) {
    return null;
  }

  return (
    <div className="bg-bg-card rounded-softer shadow-warm overflow-hidden">
      {/* 月額合計を大きく表示 */}
      <div className="p-6 bg-gradient-to-br from-accent-light to-bg-card border-b border-border">
        <div className="text-center">
          <p className="text-sm text-text-sub mb-1">毎月の固定支出</p>
          <p className="text-3xl font-bold text-accent">
            <span className="text-xl mr-1">¥</span>
            {monthlyTotal.toLocaleString()}
            <span className="text-base font-normal text-text-sub">/月</span>
          </p>
          <p className="text-sm text-text-sub mt-2">
            年間で <span className="font-medium text-text-main">¥{yearlyTotal.toLocaleString()}</span>
          </p>
        </div>

        {/* 注意喚起 */}
        {monthlyTotal > 5000 && (
          <div className="mt-4 flex items-start gap-2 p-3 bg-warning/10 rounded-lg">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-sm text-text-main">
              使っていないサービスがないか確認してみましょう
            </p>
          </div>
        )}
      </div>

      {/* サービス一覧 */}
      <div className="p-4 space-y-3">
        {subscriptions.map((sub, index) => (
          <div
            key={index}
            className="bg-bg-base rounded-soft p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-light rounded-full flex items-center justify-center">
                <Tv className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-medium text-text-main">{sub.serviceName}</p>
                <p className="text-sm text-text-sub">
                  {sub.frequency === 'yearly' ? '年額' : '月額'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-bold text-text-main">
                ¥{sub.monthlyAmount.toLocaleString()}
              </p>
              {sub.cancelUrl && (
                <a
                  href={sub.cancelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-accent hover:underline mt-1"
                >
                  解約手続き
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* フッター */}
      <div className="px-6 py-4 bg-bg-base border-t border-border">
        <p className="text-xs text-text-sub text-center">
          {subscriptions.length}件のサブスク・定期払いを検出しました
        </p>
      </div>
    </div>
  );
}
