import { useState } from 'react';
import { Card } from '@6okuneki/shared';
import { ChevronLeft, Search, SkipForward, Calendar } from 'lucide-react';
import type { PropertyInfo, VacancyPeriod } from '../../types';
import { BUILDING_AGE_OPTIONS, VACANCY_PERIOD_OPTIONS } from '../../constants/config';

interface DetailInfoStepProps {
  propertyInfo: PropertyInfo;
  onUpdate: (updates: Partial<PropertyInfo>) => void;
  onDiagnose: () => void;
  onPrevious: () => void;
}

type BuildingAgeInputMode = 'select' | 'year';

export function DetailInfoStep({
  propertyInfo,
  onUpdate,
  onDiagnose,
  onPrevious,
}: DetailInfoStepProps) {
  const [ageInputMode, setAgeInputMode] = useState<BuildingAgeInputMode>('select');
  const [builtYear, setBuiltYear] = useState<string>('');

  const currentYear = new Date().getFullYear();

  const handleBuiltYearChange = (value: string) => {
    setBuiltYear(value);

    if (value === '') {
      onUpdate({ buildingAge: null, isNewConstruction: null });
      return;
    }

    const year = parseInt(value, 10);
    if (!isNaN(year) && year >= 1950 && year <= currentYear) {
      const age = currentYear - year;
      onUpdate({
        buildingAge: age,
        isNewConstruction: age === 0,
      });
    }
  };

  const calculatedAge = builtYear ? currentYear - parseInt(builtYear, 10) : null;
  const isValidYear = builtYear !== '' &&
    !isNaN(parseInt(builtYear, 10)) &&
    parseInt(builtYear, 10) >= 1950 &&
    parseInt(builtYear, 10) <= currentYear;

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-bold text-text-main mb-2">詳細情報（任意）</h2>
          <p className="text-sm text-text-sub mb-4">
            入力するとより正確な診断ができます
          </p>

          {/* 築年数 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-main mb-2">
              築年数
            </label>

            {/* 入力方法切り替え */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  setAgeInputMode('select');
                  setBuiltYear('');
                }}
                className={`
                  flex-1 h-10 rounded-lg text-sm font-medium border
                  ${ageInputMode === 'select'
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white text-text-sub border-border hover:border-accent'}
                `}
              >
                年数で選ぶ
              </button>
              <button
                type="button"
                onClick={() => {
                  setAgeInputMode('year');
                  onUpdate({ buildingAge: null, isNewConstruction: null });
                }}
                className={`
                  flex-1 h-10 rounded-lg text-sm font-medium border flex items-center justify-center gap-1
                  ${ageInputMode === 'year'
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white text-text-sub border-border hover:border-accent'}
                `}
              >
                <Calendar className="w-4 h-4" />
                建築年で入力
              </button>
            </div>

            {/* 年数で選ぶ */}
            {ageInputMode === 'select' && (
              <select
                value={propertyInfo.buildingAge ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    onUpdate({ buildingAge: null, isNewConstruction: null });
                  } else {
                    const numValue = parseInt(value, 10);
                    onUpdate({
                      buildingAge: numValue,
                      isNewConstruction: numValue === 0,
                    });
                  }
                }}
                className="w-full h-12 px-4 border border-border rounded-lg text-base
                         focus:border-accent focus:outline-none bg-white"
              >
                <option value="">選択してください</option>
                {BUILDING_AGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {/* 建築年で入力 */}
            {ageInputMode === 'year' && (
              <div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1950"
                    max={currentYear}
                    value={builtYear}
                    onChange={(e) => handleBuiltYearChange(e.target.value)}
                    placeholder={`例: ${currentYear - 10}`}
                    className="flex-1 h-12 px-4 border border-border rounded-lg text-base
                             focus:border-accent focus:outline-none"
                  />
                  <span className="text-text-sub">年築</span>
                </div>
                {isValidYear && calculatedAge !== null && (
                  <p className="text-sm text-accent mt-2 font-medium">
                    → 築{calculatedAge === 0 ? '新築' : `約${calculatedAge}年`}
                  </p>
                )}
                {builtYear !== '' && !isValidYear && (
                  <p className="text-sm text-warning mt-2">
                    1950〜{currentYear}年の範囲で入力してください
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 空室期間 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-main mb-2">
              空室期間（わかれば）
            </label>
            <select
              value={propertyInfo.vacancyPeriod ?? ''}
              onChange={(e) =>
                onUpdate({
                  vacancyPeriod: (e.target.value || null) as VacancyPeriod | null,
                })
              }
              className="w-full h-12 px-4 border border-border rounded-lg text-base
                       focus:border-accent focus:outline-none bg-white"
            >
              <option value="">選択してください</option>
              {VACANCY_PERIOD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-text-sub mt-1">
              空室期間が長いほどADが付いている可能性が高いです
            </p>
          </div>

          {/* フリーレント */}
          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              フリーレントや家賃割引の提示がありましたか？
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onUpdate({ hasFreebies: true })}
                className={`
                  flex-1 h-12 rounded-lg font-medium border
                  ${propertyInfo.hasFreebies === true
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white text-text-main border-border hover:border-accent'}
                `}
              >
                はい
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ hasFreebies: false })}
                className={`
                  flex-1 h-12 rounded-lg font-medium border
                  ${propertyInfo.hasFreebies === false
                    ? 'bg-accent text-white border-accent'
                    : 'bg-white text-text-main border-border hover:border-accent'}
                `}
              >
                いいえ
              </button>
            </div>
            <p className="text-xs text-text-sub mt-1">
              提示があればADが付いている可能性が高いです
            </p>
          </div>
        </div>
      </Card>

      {/* ボタン */}
      <div className="space-y-3">
        <button
          onClick={onDiagnose}
          className="w-full h-12 rounded-lg font-medium flex items-center justify-center gap-2
                   bg-accent text-white hover:opacity-90"
        >
          <Search className="w-5 h-5" />
          入力して診断する
        </button>

        <button
          onClick={() => {
            // 任意項目をクリアして診断
            onUpdate({
              buildingAge: null,
              vacancyPeriod: null,
              isNewConstruction: null,
              hasFreebies: null,
            });
            onDiagnose();
          }}
          className="w-full h-12 rounded-lg font-medium flex items-center justify-center gap-2
                   bg-white border border-border text-text-sub hover:bg-gray-50"
        >
          <SkipForward className="w-5 h-5" />
          スキップして診断
        </button>

        <button
          onClick={onPrevious}
          className="w-full h-12 rounded-lg font-medium flex items-center justify-center gap-2
                   text-text-sub hover:text-text-main"
        >
          <ChevronLeft className="w-5 h-5" />
          戻る
        </button>
      </div>
    </div>
  );
}
