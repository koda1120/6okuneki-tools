import { useState, useEffect } from 'react';
import { Card } from '@6okuneki/shared';
import { ChevronRight } from 'lucide-react';
import type { PropertyInfo, PropertyType, AreaType, StationDistance } from '../../types';
import { PROPERTY_TYPE_OPTIONS, AREA_OPTIONS, STATION_DISTANCE_OPTIONS } from '../../constants/config';

interface PropertyInfoStepProps {
  propertyInfo: PropertyInfo;
  onUpdate: (updates: Partial<PropertyInfo>) => void;
  onNext: () => void;
  canProceed: boolean;
}

// 万円オプション（3〜20）
const MAN_OPTIONS = Array.from({ length: 18 }, (_, i) => ({
  value: i + 3,
  label: `${i + 3}`,
}));

// 千円オプション（0〜9）
const SEN_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  value: i,
  label: `${i}`,
}));

export function PropertyInfoStep({
  propertyInfo,
  onUpdate,
  onNext,
  canProceed,
}: PropertyInfoStepProps) {
  const [manYen, setManYen] = useState<number | null>(null);
  const [senYen, setSenYen] = useState<number | null>(null);

  // 万円・千円が両方選択されたら家賃を計算
  useEffect(() => {
    if (manYen !== null && senYen !== null) {
      const rent = manYen + senYen * 0.1;
      onUpdate({ rent });
    } else if (manYen !== null && senYen === null) {
      // 万円だけ選択された場合は千円を0として計算
      onUpdate({ rent: manYen });
    }
  }, [manYen, senYen, onUpdate]);

  const handleManChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '') {
      setManYen(null);
      onUpdate({ rent: null });
    } else {
      setManYen(parseInt(value, 10));
    }
  };

  const handleSenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '') {
      setSenYen(null);
    } else {
      setSenYen(parseInt(value, 10));
    }
  };

  const selectClassName = `h-12 px-4 border border-border rounded-lg text-base
    focus:border-accent focus:outline-none bg-white appearance-none
    bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235A6978%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]
    bg-no-repeat bg-[right_12px_center]`;

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-bold text-text-main mb-4">物件情報を入力</h2>

          {/* 家賃（必須） */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-main mb-2">
              家賃<span className="text-red-500 ml-1">*必須</span>
            </label>
            <div className="flex items-center gap-1">
              <select
                value={manYen ?? ''}
                onChange={handleManChange}
                className={`w-20 ${selectClassName}`}
              >
                <option value="">--</option>
                {MAN_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="text-text-main font-medium">万</span>
              <select
                value={senYen ?? ''}
                onChange={handleSenChange}
                className={`w-20 ${selectClassName}`}
                disabled={manYen === null}
              >
                <option value="">--</option>
                {SEN_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="text-text-main font-medium">千円</span>
            </div>
            {propertyInfo.rent !== null && (
              <p className="text-sm text-accent font-medium mt-2">
                → {propertyInfo.rent}万円
              </p>
            )}
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
              className={`w-full ${selectClassName}`}
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-main mb-2">
              都道府県
            </label>
            <select
              value={propertyInfo.area ?? ''}
              onChange={(e) =>
                onUpdate({ area: (e.target.value || null) as AreaType | null })
              }
              className={`w-full ${selectClassName}`}
            >
              <option value="">選択してください</option>
              {AREA_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 駅徒歩（任意） */}
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              駅徒歩
            </label>
            <select
              value={propertyInfo.stationDistance ?? ''}
              onChange={(e) =>
                onUpdate({ stationDistance: (e.target.value || null) as StationDistance | null })
              }
              className={`w-full ${selectClassName}`}
            >
              <option value="">選択してください</option>
              {STATION_DISTANCE_OPTIONS.map((option) => (
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
