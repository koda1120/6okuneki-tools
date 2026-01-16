import { Card } from '@6okuneki/shared';
import { Wallet, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../lib/savingsCalculator';

interface SavingsCardProps {
  currentFee: number;
  legalMaxFee: number;
  potentialSavings: number;
  isOvercharged: boolean;
}

export function SavingsCard({
  currentFee,
  legalMaxFee,
  potentialSavings,
  isOvercharged,
}: SavingsCardProps) {
  return (
    <Card>
      <div className="p-4">
        <h3 className="text-sm font-medium text-text-sub mb-3">節約可能額</h3>

        {/* メイン金額 */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
            <Wallet className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">
              最大 {formatCurrency(potentialSavings)}
            </p>
            <p className="text-xs text-text-sub">交渉次第で節約できる可能性があります</p>
          </div>
        </div>

        {/* 詳細 */}
        <div className="bg-bg-base rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-sub">請求額</span>
            <span className="text-text-main font-medium">{formatCurrency(currentFee)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-sub">法定上限</span>
            <span className="text-text-main font-medium">{formatCurrency(legalMaxFee)}</span>
          </div>
        </div>

        {/* 法定上限超過警告 */}
        {isOvercharged && (
          <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg flex gap-2">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-warning">法定上限を超えている可能性</p>
              <p className="text-xs text-text-sub mt-1">
                仲介手数料の上限は家賃の1.1ヶ月分（税込）です。
                この金額は上限を超えている可能性があります。
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
