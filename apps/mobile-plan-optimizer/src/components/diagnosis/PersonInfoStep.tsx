import { useState } from 'react';
import { User, ChevronRight, Wifi, Phone, Smartphone } from 'lucide-react';
import type { PersonDiagnosis } from '../../types/diagnosis';
import { createEmptyPersonDiagnosis } from '../../types/diagnosis';
import {
  RELATIONSHIP_OPTIONS,
  DATA_USAGE_OPTIONS,
  CALL_DURATION_OPTIONS,
  CALL_FREQUENCY_OPTIONS,
  CURRENT_CARRIER_OPTIONS,
  WIFI_OPTIONS,
  WIFI_CONNECTION_OPTIONS,
  MAIN_USAGE_LOCATION_OPTIONS,
  OUTSIDE_ACTIVITIES_OPTIONS,
  CALL_TARGET_OPTIONS,
  LINE_CALL_OPTIONS,
  MONTHLY_FEE_OPTIONS,
  SAME_FAMILY_NAME_OPTIONS,
} from '../../constants/options';

interface PersonInfoStepProps {
  personIndex: number;
  totalPersons: number;
  initialData?: PersonDiagnosis;
  onComplete: (data: PersonDiagnosis) => void;
}

type SubStep = 'basic' | 'data' | 'call' | 'current';

export function PersonInfoStep({
  personIndex,
  totalPersons,
  initialData,
  onComplete,
}: PersonInfoStepProps) {
  const [subStep, setSubStep] = useState<SubStep>(personIndex === 0 ? 'data' : 'basic');
  const [data, setData] = useState<PersonDiagnosis>(
    initialData || createEmptyPersonDiagnosis()
  );

  const isFirstPerson = personIndex === 0;
  const personLabel = isFirstPerson ? 'あなた' : `${personIndex + 1}人目`;

  const updateField = <K extends keyof PersonDiagnosis>(
    key: K,
    value: PersonDiagnosis[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (subStep === 'basic') {
      setSubStep('data');
    } else if (subStep === 'data') {
      setSubStep('call');
    } else if (subStep === 'call') {
      setSubStep('current');
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (subStep === 'data' && !isFirstPerson) {
      setSubStep('basic');
    } else if (subStep === 'call') {
      setSubStep('data');
    } else if (subStep === 'current') {
      setSubStep('call');
    }
  };

  const canProceed = () => {
    if (subStep === 'basic') {
      return data.relationship !== undefined;
    }
    if (subStep === 'data') {
      return data.dataUsage !== 'unknown' || data.homeActivities.length > 0 || data.outsideActivities.length > 0;
    }
    if (subStep === 'call') {
      return true; // 通話は任意
    }
    return true;
  };

  const renderSubStepIndicator = () => {
    const steps = isFirstPerson
      ? ['データ通信', '通話', '現在の契約']
      : ['基本情報', 'データ通信', '通話', '現在の契約'];
    const currentIndex = isFirstPerson
      ? ['data', 'call', 'current'].indexOf(subStep)
      : ['basic', 'data', 'call', 'current'].indexOf(subStep);

    return (
      <div className="flex items-center justify-center gap-2 mb-6">
        {steps.map((label, index) => (
          <div key={label} className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full ${
                index <= currentIndex ? 'bg-accent' : 'bg-gray-300'
              }`}
            />
            {index < steps.length - 1 && (
              <div
                className={`w-8 h-0.5 ${
                  index < currentIndex ? 'bg-accent' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg mb-3">
          <User className="w-6 h-6 text-accent" />
        </div>
        <h2 className="text-lg font-bold text-text-main">
          {personLabel}の情報
          {totalPersons > 1 && (
            <span className="text-sm font-normal text-text-sub ml-2">
              ({personIndex + 1}/{totalPersons})
            </span>
          )}
        </h2>
      </div>

      {renderSubStepIndicator()}

      {/* 基本情報（2人目以降） */}
      {subStep === 'basic' && !isFirstPerson && (
        <div className="space-y-5">
          <div className="card">
            <label className="block text-sm font-medium text-text-main mb-3">
              あなたとの続柄
            </label>
            <div className="grid grid-cols-2 gap-2">
              {RELATIONSHIP_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('relationship', option.value)}
                  className={`p-3 rounded-lg border-2 text-sm text-left tap-target focus-ring ${
                    data.relationship === option.value
                      ? 'border-accent bg-accent/5 text-accent'
                      : 'border-border bg-white text-text-main hover:border-accent/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <label className="block text-sm font-medium text-text-main mb-3">
              同居していますか？
            </label>
            <div className="flex gap-3">
              {[
                { value: true, label: 'はい' },
                { value: false, label: 'いいえ' },
              ].map((option) => (
                <button
                  key={String(option.value)}
                  onClick={() => updateField('livingTogether', option.value)}
                  className={`flex-1 p-3 rounded-lg border-2 text-sm tap-target focus-ring ${
                    data.livingTogether === option.value
                      ? 'border-accent bg-accent/5 text-accent'
                      : 'border-border bg-white text-text-main hover:border-accent/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <label className="block text-sm font-medium text-text-main mb-3">
              苗字は同じですか？
            </label>
            <div className="flex gap-2">
              {SAME_FAMILY_NAME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('sameFamilyName', option.value)}
                  className={`flex-1 p-3 rounded-lg border-2 text-sm tap-target focus-ring ${
                    data.sameFamilyName === option.value
                      ? 'border-accent bg-accent/5 text-accent'
                      : 'border-border bg-white text-text-main hover:border-accent/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* データ通信 */}
      {subStep === 'data' && (
        <div className="space-y-5">
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Wifi className="w-5 h-5 text-accent" />
              <label className="text-sm font-medium text-text-main">
                自宅のWi-Fi環境
              </label>
            </div>
            <div className="space-y-2">
              {WIFI_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('hasWifi', option.value)}
                  className={`w-full p-3 rounded-lg border-2 text-sm text-left tap-target focus-ring ${
                    data.hasWifi === option.value
                      ? 'border-accent bg-accent/5 text-accent'
                      : 'border-border bg-white text-text-main hover:border-accent/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {data.hasWifi === 'yes' && (
            <div className="card">
              <label className="block text-sm font-medium text-text-main mb-3">
                自宅でのWi-Fi接続頻度
              </label>
              <div className="space-y-2">
                {WIFI_CONNECTION_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateField('wifiConnection', option.value)}
                    className={`w-full p-3 rounded-lg border-2 text-sm text-left tap-target focus-ring ${
                      data.wifiConnection === option.value
                        ? 'border-accent bg-accent/5 text-accent'
                        : 'border-border bg-white text-text-main hover:border-accent/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <label className="block text-sm font-medium text-text-main mb-3">
              主な利用場所
            </label>
            <div className="space-y-2">
              {MAIN_USAGE_LOCATION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('mainUsageLocation', option.value)}
                  className={`w-full p-3 rounded-lg border-2 text-sm text-left tap-target focus-ring ${
                    data.mainUsageLocation === option.value
                      ? 'border-accent bg-accent/5 text-accent'
                      : 'border-border bg-white text-text-main hover:border-accent/50'
                  }`}
                >
                  <span>{option.label}</span>
                  {option.description && (
                    <span className="text-text-sub ml-2">({option.description})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <label className="block text-sm font-medium text-text-main mb-3">
              外出先での利用（複数選択可）
            </label>
            <div className="grid grid-cols-2 gap-2">
              {OUTSIDE_ACTIVITIES_OPTIONS.map((option) => {
                const isSelected = data.outsideActivities.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      const newActivities = isSelected
                        ? data.outsideActivities.filter((a) => a !== option.value)
                        : [...data.outsideActivities, option.value];
                      updateField('outsideActivities', newActivities);
                    }}
                    className={`p-3 rounded-lg border-2 text-sm text-left tap-target focus-ring ${
                      isSelected
                        ? 'border-accent bg-accent/5 text-accent'
                        : 'border-border bg-white text-text-main hover:border-accent/50'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card">
            <label className="block text-sm font-medium text-text-main mb-3">
              月のデータ使用量（わかれば）
            </label>
            <div className="space-y-2">
              {DATA_USAGE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('dataUsage', option.value)}
                  className={`w-full p-3 rounded-lg border-2 text-sm text-left tap-target focus-ring ${
                    data.dataUsage === option.value
                      ? 'border-accent bg-accent/5 text-accent'
                      : 'border-border bg-white text-text-main hover:border-accent/50'
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                  {option.description && (
                    <span className="text-text-sub ml-2 text-xs">
                      {option.description}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 通話 */}
      {subStep === 'call' && (
        <div className="space-y-5">
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="w-5 h-5 text-accent" />
              <label className="text-sm font-medium text-text-main">
                1回の通話時間
              </label>
            </div>
            <div className="space-y-2">
              {CALL_DURATION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('callDuration', option.value)}
                  className={`w-full p-3 rounded-lg border-2 text-sm text-left tap-target focus-ring ${
                    data.callDuration === option.value
                      ? 'border-accent bg-accent/5 text-accent'
                      : 'border-border bg-white text-text-main hover:border-accent/50'
                  }`}
                >
                  <span>{option.label}</span>
                  {option.description && (
                    <span className="text-text-sub ml-2">({option.description})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <label className="block text-sm font-medium text-text-main mb-3">
              通話頻度
            </label>
            <div className="space-y-2">
              {CALL_FREQUENCY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('callFrequency', option.value)}
                  className={`w-full p-3 rounded-lg border-2 text-sm text-left tap-target focus-ring ${
                    data.callFrequency === option.value
                      ? 'border-accent bg-accent/5 text-accent'
                      : 'border-border bg-white text-text-main hover:border-accent/50'
                  }`}
                >
                  <span>{option.label}</span>
                  {option.description && (
                    <span className="text-text-sub ml-2">({option.description})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <label className="block text-sm font-medium text-text-main mb-3">
              主な通話相手
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CALL_TARGET_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('callTarget', option.value)}
                  className={`p-3 rounded-lg border-2 text-sm tap-target focus-ring ${
                    data.callTarget === option.value
                      ? 'border-accent bg-accent/5 text-accent'
                      : 'border-border bg-white text-text-main hover:border-accent/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <label className="block text-sm font-medium text-text-main mb-3">
              LINE通話で代替可能？
            </label>
            <div className="space-y-2">
              {LINE_CALL_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('lineCallOk', option.value)}
                  className={`w-full p-3 rounded-lg border-2 text-sm text-left tap-target focus-ring ${
                    data.lineCallOk === option.value
                      ? 'border-accent bg-accent/5 text-accent'
                      : 'border-border bg-white text-text-main hover:border-accent/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 現在の契約 */}
      {subStep === 'current' && (
        <div className="space-y-5">
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-5 h-5 text-accent" />
              <label className="text-sm font-medium text-text-main">
                現在のキャリア
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

          <div className="card">
            <label className="block text-sm font-medium text-text-main mb-3">
              現在の月額料金（端末代除く）
            </label>
            <select
              value={data.currentMonthlyFee}
              onChange={(e) => updateField('currentMonthlyFee', e.target.value)}
              className="w-full h-12 px-4 rounded-lg border-2 border-border bg-white text-text-main focus:border-accent focus:outline-none"
            >
              {MONTHLY_FEE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* ナビゲーションボタン */}
      <div className="flex gap-3 pt-4">
        {((subStep !== 'basic' && !isFirstPerson) ||
          (subStep !== 'data' && isFirstPerson)) && (
          <button
            onClick={handleBack}
            className="flex-1 h-12 rounded-lg font-medium text-text-sub border-2 border-border bg-white tap-target focus-ring"
          >
            戻る
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`flex-1 h-12 rounded-lg font-bold text-white flex items-center justify-center gap-2 tap-target focus-ring ${
            canProceed()
              ? 'bg-accent hover:bg-accent/90'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {subStep === 'current' ? (
            personIndex < totalPersons - 1 ? '次の人へ' : '次へ'
          ) : (
            '次へ'
          )}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
