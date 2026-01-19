import { useState } from 'react';
import { Settings, Globe, CreditCard, Users, Target, Headphones, Check } from 'lucide-react';
import type { CommonSettings, CreditCard as CreditCardType } from '../../types/diagnosis';
import { createEmptyCommonSettings } from '../../types/diagnosis';
import {
  HOME_INTERNET_OPTIONS,
  CREDIT_CARD_OPTIONS,
  FAMILY_MEMBERS_OPTIONS,
  PRIORITY_OPTIONS,
  SUPPORT_NEED_OPTIONS,
} from '../../constants/options';

interface SettingsStepProps {
  initialData?: CommonSettings;
  onComplete: (data: CommonSettings) => void;
}

export function SettingsStep({ initialData, onComplete }: SettingsStepProps) {
  const [data, setData] = useState<CommonSettings>(initialData || createEmptyCommonSettings());

  const updateField = <K extends keyof CommonSettings>(key: K, value: CommonSettings[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCreditCard = (card: CreditCardType) => {
    setData((prev) => {
      const currentCards = prev.creditCards;
      if (currentCards.includes(card)) {
        return { ...prev, creditCards: currentCards.filter((c) => c !== card) };
      } else {
        return { ...prev, creditCards: [...currentCards, card] };
      }
    });
  };

  const handleNext = () => {
    onComplete(data);
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg mb-3">
          <Settings className="w-6 h-6 text-accent" />
        </div>
        <h2 className="text-lg font-bold text-text-main">割引条件・希望</h2>
        <p className="text-sm text-text-sub mt-1">
          お得な割引を適用するために教えてください
        </p>
      </div>

      {/* 光回線 */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-5 h-5 text-accent" />
          <label className="text-sm font-medium text-text-main">
            自宅の光回線は？
          </label>
        </div>
        <p className="text-xs text-text-sub mb-3">
          セット割が適用できる場合があります
        </p>
        <div className="grid grid-cols-2 gap-2">
          {HOME_INTERNET_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateField('homeInternet', option.value)}
              className={`p-3 rounded-lg border-2 text-sm tap-target focus-ring ${
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

      {/* クレジットカード */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-5 h-5 text-accent" />
          <label className="text-sm font-medium text-text-main">
            お持ちのクレジットカードは？
          </label>
        </div>
        <p className="text-xs text-text-sub mb-3">
          複数選択可・カード割引が適用できる場合があります
        </p>
        <div className="grid grid-cols-2 gap-2">
          {CREDIT_CARD_OPTIONS.map((option) => {
            const isSelected = data.creditCards.includes(option.value as CreditCardType);
            return (
              <button
                key={option.value}
                onClick={() => toggleCreditCard(option.value as CreditCardType)}
                className={`p-3 rounded-lg border-2 text-sm tap-target focus-ring flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'border-accent bg-accent/5 text-accent'
                    : 'border-border bg-white text-text-main hover:border-accent/50'
                }`}
              >
                {isSelected && <Check className="w-4 h-4" />}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 家族人数 */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-accent" />
          <label className="text-sm font-medium text-text-main">
            同じキャリアで契約する家族は？
          </label>
        </div>
        <p className="text-xs text-text-sub mb-3">
          家族割の適用人数（本人含む）
        </p>
        <div className="flex gap-2">
          {FAMILY_MEMBERS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateField('familyMembers', option.value as 1 | 2 | 3 | 4 | 5)}
              className={`flex-1 p-3 rounded-lg border-2 text-sm tap-target focus-ring ${
                data.familyMembers === option.value
                  ? 'border-accent bg-accent/5 text-accent'
                  : 'border-border bg-white text-text-main hover:border-accent/50'
              }`}
            >
              {option.value === 5 ? '5+' : option.value}人
            </button>
          ))}
        </div>
      </div>

      {/* 重視ポイント */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-accent" />
          <label className="text-sm font-medium text-text-main">
            最も重視するポイントは？
          </label>
        </div>
        <div className="space-y-2">
          {PRIORITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateField('priority', option.value)}
              className={`w-full p-3 rounded-lg border-2 text-left tap-target focus-ring ${
                data.priority === option.value
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

      {/* サポート */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Headphones className="w-5 h-5 text-accent" />
          <label className="text-sm font-medium text-text-main">
            サポートの必要度は？
          </label>
        </div>
        <div className="space-y-2">
          {SUPPORT_NEED_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateField('supportNeed', option.value)}
              className={`w-full p-3 rounded-lg border-2 text-left tap-target focus-ring ${
                data.supportNeed === option.value
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

      {/* 次へボタン */}
      <button
        onClick={handleNext}
        className="w-full h-14 rounded-lg font-bold text-white bg-accent hover:bg-accent/90 tap-target focus-ring"
      >
        確認画面へ
      </button>
    </div>
  );
}
