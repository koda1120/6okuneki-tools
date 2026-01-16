import { Card } from '@6okuneki/shared';
import { ChevronLeft, Search, SkipForward } from 'lucide-react';
import type { PropertyInfo, VacancyPeriod } from '../../types';
import { BUILDING_AGE_OPTIONS, VACANCY_PERIOD_OPTIONS } from '../../constants/config';

interface DetailInfoStepProps {
  propertyInfo: PropertyInfo;
  onUpdate: (updates: Partial<PropertyInfo>) => void;
  onDiagnose: () => void;
  onPrevious: () => void;
}

export function DetailInfoStep({
  propertyInfo,
  onUpdate,
  onDiagnose,
  onPrevious,
}: DetailInfoStepProps) {
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
                       focus:border-accent focus:outline-none bg-white appearance-none
                       bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235A6978%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]
                       bg-no-repeat bg-[right_12px_center]"
            >
              <option value="">選択してください</option>
              {BUILDING_AGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
                       focus:border-accent focus:outline-none bg-white appearance-none
                       bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235A6978%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]
                       bg-no-repeat bg-[right_12px_center]"
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
