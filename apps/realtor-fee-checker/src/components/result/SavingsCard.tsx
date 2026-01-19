import { Wallet, AlertTriangle, TrendingDown } from 'lucide-react';
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
    <div className="bg-white border border-border rounded-card shadow-card overflow-hidden">
      <div className="p-5">
        {/* メイン金額 */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 bg-accent/10 rounded-card flex items-center justify-center">
            <Wallet className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-xs text-text-sub mb-1">節約可能額</p>
            <p className="text-2xl font-bold text-accent">
              最大 {formatCurrency(potentialSavings)}
            </p>
          </div>
        </div>

        {/* 比較表 */}
        <div className="border border-border rounded-card overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border">
                <td className="px-4 py-3 text-text-sub bg-bg-base">請求額</td>
                <td className="px-4 py-3 text-right font-medium text-text-main">
                  {formatCurrency(currentFee)}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-4 py-3 text-text-sub bg-bg-base">法定上限</td>
                <td className="px-4 py-3 text-right font-medium text-text-main">
                  {formatCurrency(legalMaxFee)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-text-sub bg-bg-base">
                  <div className="flex items-center gap-1">
                    <TrendingDown className="w-4 h-4 text-accent" />
                    交渉目標
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-bold text-accent">
                  0円
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-text-sub mt-3 text-center">
          AD付き物件なら仲介手数料0円も可能です
        </p>

        {/* 法定上限超過警告 */}
        {isOvercharged && (
          <div className="mt-4 p-4 bg-warning/10 border border-warning/30 rounded-card flex gap-3">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-warning">法定上限を超えている可能性</p>
              <p className="text-xs text-text-sub mt-1 leading-relaxed">
                仲介手数料の上限は家賃の1.1ヶ月分（税込）です。
                この金額は上限を超えている可能性があります。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
