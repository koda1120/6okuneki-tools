import { CheckCircle, User, Settings, AlertTriangle } from 'lucide-react';
import type { PersonDiagnosis, CommonSettings } from '../../types/diagnosis';
import {
  RELATIONSHIP_OPTIONS,
  DATA_USAGE_OPTIONS,
  CALL_FREQUENCY_OPTIONS,
  CURRENT_CARRIER_OPTIONS,
  HOME_INTERNET_OPTIONS,
  CREDIT_CARD_OPTIONS,
  PRIORITY_OPTIONS,
  SUPPORT_NEED_OPTIONS,
} from '../../constants/options';
import { RESULT_DISCLAIMER } from '../../constants/disclaimer';

interface ConfirmStepProps {
  personCount: number;
  persons: PersonDiagnosis[];
  common: CommonSettings;
  onConfirm: () => void;
}

export function ConfirmStep({
  persons,
  common,
  onConfirm,
}: ConfirmStepProps) {
  const getLabel = (
    options: readonly { value: string; label: string }[],
    value: string | undefined
  ) => {
    const option = options.find((o) => o.value === value);
    return option?.label || '未設定';
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-success/10 rounded-lg mb-3">
          <CheckCircle className="w-6 h-6 text-success" />
        </div>
        <h2 className="text-lg font-bold text-text-main">入力内容の確認</h2>
        <p className="text-sm text-text-sub mt-1">
          以下の内容で診断を実行します
        </p>
      </div>

      {/* 各人の情報 */}
      <div className="space-y-4">
        {persons.map((person, index) => (
          <div key={index} className="card">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-accent" />
              <h3 className="font-bold text-text-main">
                {index === 0 ? 'あなた' : `${index + 1}人目`}
                {index > 0 && person.relationship && (
                  <span className="font-normal text-text-sub ml-2">
                    ({getLabel(RELATIONSHIP_OPTIONS, person.relationship)})
                  </span>
                )}
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-sub">データ使用量</span>
                <span className="text-text-main">
                  {getLabel(DATA_USAGE_OPTIONS, person.dataUsage)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-sub">通話頻度</span>
                <span className="text-text-main">
                  {getLabel(CALL_FREQUENCY_OPTIONS, person.callFrequency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-sub">現在のキャリア</span>
                <span className="text-text-main">
                  {getLabel(CURRENT_CARRIER_OPTIONS, person.currentCarrier)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 共通設定 */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Settings className="w-5 h-5 text-accent" />
          <h3 className="font-bold text-text-main">共通設定</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-sub">光回線</span>
            <span className="text-text-main">
              {getLabel(HOME_INTERNET_OPTIONS, common.homeInternet)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-sub">クレジットカード</span>
            <span className="text-text-main">
              {getLabel(CREDIT_CARD_OPTIONS, common.creditCard)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-sub">重視ポイント</span>
            <span className="text-text-main">
              {getLabel(PRIORITY_OPTIONS, common.priority)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-sub">サポート</span>
            <span className="text-text-main">
              {getLabel(SUPPORT_NEED_OPTIONS, common.supportNeed)}
            </span>
          </div>
        </div>
      </div>

      {/* 免責事項 */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-amber-800 mb-2">
              診断結果について
            </h4>
            <p className="text-xs text-amber-700 leading-relaxed whitespace-pre-wrap">
              {RESULT_DISCLAIMER}
            </p>
          </div>
        </div>
      </div>

      {/* 診断実行ボタン */}
      <button
        onClick={onConfirm}
        className="w-full h-14 rounded-lg font-bold text-white bg-accent hover:bg-accent/90 flex items-center justify-center gap-2 tap-target focus-ring"
      >
        診断を実行する
      </button>
    </div>
  );
}
