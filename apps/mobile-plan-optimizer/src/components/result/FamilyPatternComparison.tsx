import { Users, Check, AlertCircle } from 'lucide-react';
import type { FamilyPattern } from '../../types/result';

interface FamilyPatternComparisonProps {
  patterns: FamilyPattern[];
}

export function FamilyPatternComparison({
  patterns,
}: FamilyPatternComparisonProps) {
  const formatPrice = (price: number) => price.toLocaleString();

  // キャリア名のマッピング
  const carrierNames: Record<string, string> = {
    linemo: 'LINEMO',
    ahamo: 'ahamo',
    povo: 'povo',
    ymobile: 'Y!mobile',
    uqmobile: 'UQモバイル',
    rakuten: '楽天モバイル',
    iijmio: 'IIJmio',
    mineo: 'mineo',
    nuro_mobile: 'NUROモバイル',
    ocn_mobile: 'OCNモバイルONE',
    biglobe: 'BIGLOBEモバイル',
  };

  return (
    <div className="space-y-4">
      {patterns.map((pattern, index) => (
        <div key={index} className="card">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-text-main text-sm">
                {pattern.type === 'same_carrier'
                  ? `同一キャリア（${carrierNames[pattern.carrierId || ''] || pattern.carrierId}）`
                  : '各自最適プラン'}
              </h3>
            </div>
          </div>

          {/* 料金 */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-text-sub">月額合計</span>
              <span className="text-xl font-bold text-accent">
                {formatPrice(pattern.totalMonthlyPrice)}
                <span className="text-sm font-normal text-text-sub">円</span>
              </span>
            </div>
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-xs text-text-sub">年間</span>
              <span className="text-sm text-text-sub">
                {formatPrice(pattern.totalYearlyPrice)}円
              </span>
            </div>
          </div>

          {/* メリット */}
          {pattern.pros.length > 0 && (
            <div className="mb-2">
              <p className="text-xs font-medium text-success mb-1">メリット</p>
              <ul className="space-y-1">
                {pattern.pros.map((pro, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-1 text-xs text-text-sub"
                  >
                    <Check className="w-3 h-3 text-success flex-shrink-0 mt-0.5" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* デメリット */}
          {pattern.cons.length > 0 && (
            <div>
              <p className="text-xs font-medium text-warning mb-1">注意点</p>
              <ul className="space-y-1">
                {pattern.cons.map((con, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-1 text-xs text-text-sub"
                  >
                    <AlertCircle className="w-3 h-3 text-warning flex-shrink-0 mt-0.5" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
