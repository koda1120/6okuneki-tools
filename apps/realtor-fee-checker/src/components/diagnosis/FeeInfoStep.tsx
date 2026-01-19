import { useState, useEffect } from 'react';
import { Card } from '@6okuneki/shared';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import type { PropertyInfo } from '../../types';
import { MOVE_IN_MONTH_OPTIONS } from '../../constants/config';

interface FeeInfoStepProps {
  propertyInfo: PropertyInfo;
  onUpdate: (updates: Partial<PropertyInfo>) => void;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
}

type FeeType = '0.5' | '1' | '1.1' | 'custom';

const FEE_OPTIONS: { value: FeeType; label: string; months: number | null }[] = [
  { value: '0.5', label: '0.5ヶ月分', months: 0.5 },
  { value: '1', label: '1ヶ月分', months: 1 },
  { value: '1.1', label: '1.1ヶ月分（税込上限）', months: 1.1 },
  { value: 'custom', label: 'その他（手入力）', months: null },
];

export function FeeInfoStep({
  propertyInfo,
  onUpdate,
  onNext,
  onPrevious,
  canProceed,
}: FeeInfoStepProps) {
  const [feeType, setFeeType] = useState<FeeType | null>(null);
  const [customFee, setCustomFee] = useState<string>('');

  const rent = propertyInfo.rent;

  // 月数選択時に自動計算
  useEffect(() => {
    if (feeType && feeType !== 'custom' && rent !== null) {
      const option = FEE_OPTIONS.find(o => o.value === feeType);
      if (option && option.months !== null) {
        const calculatedFee = Math.round(rent * option.months * 100) / 100;
        onUpdate({ brokerageFee: calculatedFee });
      }
    }
  }, [feeType, rent, onUpdate]);

  const handleFeeTypeChange = (type: FeeType) => {
    setFeeType(type);
    if (type === 'custom') {
      setCustomFee('');
      onUpdate({ brokerageFee: null });
    }
  };

  const handleCustomFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomFee(value);
    if (value === '') {
      onUpdate({ brokerageFee: null });
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        onUpdate({ brokerageFee: numValue });
      }
    }
  };

  // 計算された金額を表示
  const getCalculatedFee = () => {
    if (feeType && feeType !== 'custom' && rent !== null) {
      const option = FEE_OPTIONS.find(o => o.value === feeType);
      if (option && option.months !== null) {
        return Math.round(rent * option.months * 100) / 100;
      }
    }
    return null;
  };

  const calculatedFee = getCalculatedFee();

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-bold text-text-main mb-4">手数料情報を入力</h2>

          {/* 仲介手数料（必須） */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-main mb-2">
              請求された仲介手数料<span className="text-red-500 ml-1">*必須</span>
            </label>

            {rent === null ? (
              <p className="text-sm text-warning">※ 前の画面で家賃を入力してください</p>
            ) : (
              <>
                <p className="text-xs text-text-sub mb-3">
                  家賃 {rent}万円 の場合
                </p>

                {/* 月数選択ボタン */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {FEE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleFeeTypeChange(option.value)}
                      className={`
                        h-12 rounded-lg text-sm font-medium border transition-colors
                        ${feeType === option.value
                          ? 'bg-accent text-white border-accent'
                          : 'bg-white text-text-main border-border hover:border-accent'}
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {/* 計算結果表示 */}
                {feeType && feeType !== 'custom' && calculatedFee !== null && (
                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 mb-3">
                    <p className="text-sm text-text-main">
                      計算結果: <span className="font-bold text-accent">{calculatedFee}万円</span>
                    </p>
                  </div>
                )}

                {/* その他（手入力）の場合 */}
                {feeType === 'custom' && (
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      min="0"
                      value={customFee}
                      onChange={handleCustomFeeChange}
                      className="w-full h-12 px-4 pr-12 border border-border rounded-lg text-base
                               focus:border-accent focus:outline-none"
                      placeholder="例: 8.5"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-sub">
                      万円
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* 入居予定月（任意） */}
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              入居予定月
            </label>
            <select
              value={propertyInfo.moveInMonth ?? ''}
              onChange={(e) =>
                onUpdate({
                  moveInMonth: e.target.value ? parseInt(e.target.value, 10) : null,
                })
              }
              className="w-full h-12 px-4 border border-border rounded-lg text-base
                       focus:border-accent focus:outline-none bg-white"
            >
              <option value="">選択してください</option>
              {MOVE_IN_MONTH_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-text-sub mt-1">
              1〜3月は繁忙期のため交渉が難しい傾向があります
            </p>
          </div>
        </div>
      </Card>

      {/* ボタン */}
      <div className="flex gap-3">
        <button
          onClick={onPrevious}
          className="flex-1 h-12 rounded-lg font-medium flex items-center justify-center gap-2
                   bg-white border border-border text-text-main hover:bg-gray-50"
        >
          <ChevronLeft className="w-5 h-5" />
          戻る
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`
            flex-1 h-12 rounded-lg font-medium flex items-center justify-center gap-2
            ${canProceed
              ? 'bg-accent text-white hover:opacity-90'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
          `}
        >
          次へ
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
