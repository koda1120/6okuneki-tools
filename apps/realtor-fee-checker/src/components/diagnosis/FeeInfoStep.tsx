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

export function FeeInfoStep({
  propertyInfo,
  onUpdate,
  onNext,
  onPrevious,
  canProceed,
}: FeeInfoStepProps) {
  const handleFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onUpdate({ brokerageFee: null });
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        onUpdate({ brokerageFee: numValue });
      }
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-bold text-text-main mb-4">手数料情報を入力</h2>

          {/* 仲介手数料（必須） */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-main mb-2">
              請求された仲介手数料（万円）<span className="text-red-500 ml-1">*必須</span>
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                min="0"
                value={propertyInfo.brokerageFee ?? ''}
                onChange={handleFeeChange}
                className="w-full h-12 px-4 pr-12 border border-border rounded-lg text-base
                         focus:border-accent focus:outline-none"
                placeholder="例: 8.5"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-sub">
                万円
              </span>
            </div>
            <p className="text-xs text-text-sub mt-1">
              見積もりや請求書に記載の金額を入力してください
            </p>
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
                       focus:border-accent focus:outline-none bg-white appearance-none
                       bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235A6978%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]
                       bg-no-repeat bg-[right_12px_center]"
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
