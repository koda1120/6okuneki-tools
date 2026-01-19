import { useState } from 'react';
import { Smartphone, Phone, Building2 } from 'lucide-react';
import type { UserUsage } from '../../types/diagnosis';
import { createEmptyUserUsage } from '../../types/diagnosis';
import {
  DATA_USAGE_OPTIONS,
  CALL_FREQUENCY_OPTIONS,
  CURRENT_CARRIER_OPTIONS,
} from '../../constants/options';

interface UserInfoStepProps {
  initialData?: UserUsage;
  onComplete: (data: UserUsage) => void;
}

export function UserInfoStep({ initialData, onComplete }: UserInfoStepProps) {
  const [data, setData] = useState<UserUsage>(initialData || createEmptyUserUsage());

  const updateField = <K extends keyof UserUsage>(key: K, value: UserUsage[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    onComplete(data);
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg mb-3">
          <Smartphone className="w-6 h-6 text-accent" />
        </div>
        <h2 className="text-lg font-bold text-text-main">あなたの使い方</h2>
        <p className="text-sm text-text-sub mt-1">
          3つの質問に答えてください
        </p>
      </div>

      {/* データ使用量 */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone className="w-5 h-5 text-accent" />
          <label className="text-sm font-medium text-text-main">
            毎月のデータ使用量は？
          </label>
        </div>
        <p className="text-xs text-text-sub mb-3">
          わからない場合はスマホの設定から確認できます
        </p>
        <div className="grid grid-cols-3 gap-2">
          {DATA_USAGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateField('dataUsage', option.value)}
              className={`p-3 rounded-lg border-2 text-center tap-target focus-ring ${
                data.dataUsage === option.value
                  ? 'border-accent bg-accent/5 text-accent font-bold'
                  : 'border-border bg-white text-text-main hover:border-accent/50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 通話頻度 */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Phone className="w-5 h-5 text-accent" />
          <label className="text-sm font-medium text-text-main">
            電話（通話）はどれくらい？
          </label>
        </div>
        <div className="space-y-2">
          {CALL_FREQUENCY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateField('callFrequency', option.value)}
              className={`w-full p-3 rounded-lg border-2 text-left tap-target focus-ring ${
                data.callFrequency === option.value
                  ? 'border-accent bg-accent/5 text-accent'
                  : 'border-border bg-white text-text-main hover:border-accent/50'
              }`}
            >
              <span className="font-medium">{option.label}</span>
              {option.description && (
                <span className="text-text-sub text-xs ml-2">
                  {option.description}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 現在のキャリア */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-5 h-5 text-accent" />
          <label className="text-sm font-medium text-text-main">
            今使っているキャリアは？
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CURRENT_CARRIER_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateField('currentCarrier', option.value)}
              className={`p-3 rounded-lg border-2 text-sm tap-target focus-ring ${
                data.currentCarrier === option.value
                  ? 'border-accent bg-accent/5 text-accent'
                  : 'border-border bg-white text-text-main hover:border-accent/50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 次へボタン */}
      <button
        onClick={handleNext}
        className="w-full h-14 rounded-lg font-bold text-white bg-accent hover:bg-accent/90 tap-target focus-ring"
      >
        次へ
      </button>
    </div>
  );
}
