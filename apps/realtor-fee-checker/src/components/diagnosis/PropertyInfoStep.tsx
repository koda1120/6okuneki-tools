import { Card } from '@6okuneki/shared';
import { ChevronRight } from 'lucide-react';
import type { PropertyInfo, PropertyType, AreaType } from '../../types';
import { PROPERTY_TYPE_OPTIONS, AREA_OPTIONS } from '../../constants/config';

interface PropertyInfoStepProps {
  propertyInfo: PropertyInfo;
  onUpdate: (updates: Partial<PropertyInfo>) => void;
  onNext: () => void;
  canProceed: boolean;
}

export function PropertyInfoStep({
  propertyInfo,
  onUpdate,
  onNext,
  canProceed,
}: PropertyInfoStepProps) {
  const handleRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onUpdate({ rent: null });
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        onUpdate({ rent: numValue });
      }
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-bold text-text-main mb-4">物件情報を入力</h2>

          {/* 家賃（必須） */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-main mb-2">
              家賃（万円）<span className="text-red-500 ml-1">*必須</span>
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                min="0"
                value={propertyInfo.rent ?? ''}
                onChange={handleRentChange}
                className="w-full h-12 px-4 pr-12 border border-border rounded-lg text-base
                         focus:border-accent focus:outline-none"
                placeholder="例: 8.5"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-sub">
                万円
              </span>
            </div>
          </div>

          {/* 物件種別（任意） */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-main mb-2">
              物件種別
            </label>
            <select
              value={propertyInfo.propertyType ?? ''}
              onChange={(e) =>
                onUpdate({ propertyType: (e.target.value || null) as PropertyType | null })
              }
              className="w-full h-12 px-4 border border-border rounded-lg text-base
                       focus:border-accent focus:outline-none bg-white appearance-none
                       bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235A6978%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]
                       bg-no-repeat bg-[right_12px_center]"
            >
              <option value="">選択してください</option>
              {PROPERTY_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* エリア（任意） */}
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              エリア
            </label>
            <select
              value={propertyInfo.area ?? ''}
              onChange={(e) =>
                onUpdate({ area: (e.target.value || null) as AreaType | null })
              }
              className="w-full h-12 px-4 border border-border rounded-lg text-base
                       focus:border-accent focus:outline-none bg-white appearance-none
                       bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235A6978%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]
                       bg-no-repeat bg-[right_12px_center]"
            >
              <option value="">選択してください</option>
              {AREA_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* 次へボタン */}
      <button
        onClick={onNext}
        disabled={!canProceed}
        className={`
          w-full h-12 rounded-lg font-medium flex items-center justify-center gap-2
          ${canProceed
            ? 'bg-accent text-white hover:opacity-90'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
        `}
      >
        次へ
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
