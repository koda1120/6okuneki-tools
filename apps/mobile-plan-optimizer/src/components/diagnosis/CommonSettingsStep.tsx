import { useState } from 'react';
import { Settings, ChevronRight, CreditCard, Globe, Headphones, Smartphone } from 'lucide-react';
import type { CommonSettings } from '../../types/diagnosis';
import { createEmptyCommonSettings } from '../../types/diagnosis';
import {
  HOME_INTERNET_OPTIONS,
  CREDIT_CARD_OPTIONS,
  PRIORITY_OPTIONS,
  SUPPORT_NEED_OPTIONS,
  OVERSEAS_USAGE_OPTIONS,
  TETHERING_USAGE_OPTIONS,
  FAMILY_CARRIER_PREFERENCE_OPTIONS,
  CONCERNS_OPTIONS,
  DEVICE_TYPE_OPTIONS,
  DEVICE_PURCHASE_OPTIONS,
  HAS_5G_DEVICE_OPTIONS,
} from '../../constants/options';

interface CommonSettingsStepProps {
  initialData: CommonSettings | null;
  onComplete: (data: CommonSettings) => void;
}

type SubStep = 'discount' | 'priority' | 'support' | 'device';

export function CommonSettingsStep({
  initialData,
  onComplete,
}: CommonSettingsStepProps) {
  const [subStep, setSubStep] = useState<SubStep>('discount');
  const [data, setData] = useState<CommonSettings>(
    initialData || createEmptyCommonSettings()
  );

  const updateField = <K extends keyof CommonSettings>(
    key: K,
    value: CommonSettings[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (subStep === 'discount') {
      setSubStep('priority');
    } else if (subStep === 'priority') {
      setSubStep('support');
    } else if (subStep === 'support') {
      setSubStep('device');
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (subStep === 'priority') {
      setSubStep('discount');
    } else if (subStep === 'support') {
      setSubStep('priority');
    } else if (subStep === 'device') {
      setSubStep('support');
    }
  };

  const renderSubStepIndicator = () => {
    const steps = ['割引条件', '重視ポイント', 'サポート', '端末'];
    const currentIndex = ['discount', 'priority', 'support', 'device'].indexOf(subStep);

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
          <Settings className="w-6 h-6 text-accent" />
        </div>
        <h2 className="text-lg font-bold text-text-main">共通設定</h2>
        <p className="text-sm text-text-sub mt-1">
          割引や希望条件を教えてください
        </p>
      </div>

      {renderSubStepIndicator()}

      {/* 割引条件 */}
      {subStep === 'discount' && (
        <div className="space-y-5">
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-accent" />
              <label className="text-sm font-medium text-text-main">
                自宅の光回線
              </label>
            </div>
            <p className="text-xs text-text-sub mb-3">
              セット割引が適用できる場合があります
            </p>
            <div className="space-y-2">
              {HOME_INTERNET_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('homeInternet', option.value)}
                  className={`w-full p-3 rounded-lg border-2 text-sm text-left tap-target focus-ring ${
                    data.homeInternet === option.value
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
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-accent" />
              <label className="text-sm font-medium text-text-main">
                お持ちのクレジットカード
              </label>
            </div>
            <p className="text-xs text-text-sub mb-3">
              カード割引が適用できる場合があります
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CREDIT_CARD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('creditCard', option.value)}
                  className={`p-3 rounded-lg border-2 text-sm tap-target focus-ring ${
                    data.creditCard === option.value
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

      {/* 重視ポイント */}
      {subStep === 'priority' && (
        <div className="space-y-5">
          <div className="card">
            <label className="block text-sm font-medium text-text-main mb-3">
              最も重視するポイント
            </label>
            <div className="space-y-2">
              {PRIORITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('priority', option.value)}
                  className={`w-full p-3 rounded-lg border-2 text-sm text-left tap-target focus-ring ${
                    data.priority === option.value
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

          <div className="card">
            <label className="block text-sm font-medium text-text-main mb-3">
              海外での利用
            </label>
            <div className="space-y-2">
              {OVERSEAS_USAGE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('overseasUsage', option.value)}
                  className={`w-full p-3 rounded-lg border-2 text-sm text-left tap-target focus-ring ${
                    data.overseasUsage === option.value
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
              テザリングの利用
            </label>
            <div className="space-y-2">
              {TETHERING_USAGE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('tetheringUsage', option.value)}
                  className={`w-full p-3 rounded-lg border-2 text-sm text-left tap-target focus-ring ${
                    data.tetheringUsage === option.value
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
              家族のキャリアについて
            </label>
            <div className="space-y-2">
              {FAMILY_CARRIER_PREFERENCE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('familyCarrierPreference', option.value)}
                  className={`w-full p-3 rounded-lg border-2 text-sm text-left tap-target focus-ring ${
                    data.familyCarrierPreference === option.value
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

      {/* サポート */}
      {subStep === 'support' && (
        <div className="space-y-5">
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Headphones className="w-5 h-5 text-accent" />
              <label className="text-sm font-medium text-text-main">
                サポートの必要度
              </label>
            </div>
            <div className="space-y-2">
              {SUPPORT_NEED_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('supportNeed', option.value)}
                  className={`w-full p-3 rounded-lg border-2 text-sm text-left tap-target focus-ring ${
                    data.supportNeed === option.value
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

          <div className="card">
            <label className="block text-sm font-medium text-text-main mb-3">
              乗り換えで不安なこと（複数選択可）
            </label>
            <div className="space-y-2">
              {CONCERNS_OPTIONS.map((option) => {
                const isSelected = data.concerns.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      if (option.value === 'none') {
                        updateField('concerns', ['none']);
                      } else {
                        const newConcerns = isSelected
                          ? data.concerns.filter((c) => c !== option.value)
                          : [...data.concerns.filter((c) => c !== 'none'), option.value];
                        updateField('concerns', newConcerns);
                      }
                    }}
                    className={`w-full p-3 rounded-lg border-2 text-sm text-left tap-target focus-ring ${
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
        </div>
      )}

      {/* 端末 */}
      {subStep === 'device' && (
        <div className="space-y-5">
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-5 h-5 text-accent" />
              <label className="text-sm font-medium text-text-main">
                お使いの端末
              </label>
            </div>
            <div className="flex gap-2">
              {DEVICE_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('deviceType', option.value)}
                  className={`flex-1 p-3 rounded-lg border-2 text-sm tap-target focus-ring ${
                    data.deviceType === option.value
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
              端末の購入予定
            </label>
            <div className="space-y-2">
              {DEVICE_PURCHASE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('devicePurchase', option.value)}
                  className={`w-full p-3 rounded-lg border-2 text-sm text-left tap-target focus-ring ${
                    data.devicePurchase === option.value
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
              5G対応端末ですか？
            </label>
            <div className="flex gap-2">
              {HAS_5G_DEVICE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField('has5gDevice', option.value)}
                  className={`flex-1 p-3 rounded-lg border-2 text-sm tap-target focus-ring ${
                    data.has5gDevice === option.value
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

      {/* ナビゲーションボタン */}
      <div className="flex gap-3 pt-4">
        {subStep !== 'discount' && (
          <button
            onClick={handleBack}
            className="flex-1 h-12 rounded-lg font-medium text-text-sub border-2 border-border bg-white tap-target focus-ring"
          >
            戻る
          </button>
        )}
        <button
          onClick={handleNext}
          className="flex-1 h-12 rounded-lg font-bold text-white bg-accent hover:bg-accent/90 flex items-center justify-center gap-2 tap-target focus-ring"
        >
          {subStep === 'device' ? '確認へ' : '次へ'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
