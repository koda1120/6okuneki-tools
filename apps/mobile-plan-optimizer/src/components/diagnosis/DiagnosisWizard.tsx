import { useState } from 'react';
import { ArrowLeft, Smartphone } from 'lucide-react';
import type { DiagnosisInput } from '../../types/diagnosis';
import type { DiagnosisResult } from '../../types/result';
import { UserInfoStep } from './UserInfoStep';
import { SettingsStep } from './SettingsStep';
import { ConfirmStep } from './ConfirmStep';
import { useDiagnosis } from '../../hooks/useDiagnosis';
import { calculateDiagnosis } from '../../lib/calculator';

interface DiagnosisWizardProps {
  onComplete: (input: DiagnosisInput, result: DiagnosisResult) => void;
}

export function DiagnosisWizard({ onComplete }: DiagnosisWizardProps) {
  const [isCalculating, setIsCalculating] = useState(false);

  const handleDiagnosisComplete = async (input: DiagnosisInput) => {
    setIsCalculating(true);
    // 少し遅延を入れてローディング表示
    await new Promise((resolve) => setTimeout(resolve, 500));
    const result = calculateDiagnosis(input);
    setIsCalculating(false);
    onComplete(input, result);
  };

  const {
    step,
    user,
    common,
    progress,
    handleUserComplete,
    handleSettingsComplete,
    handleConfirm,
    handleBack,
  } = useDiagnosis({ onComplete: handleDiagnosisComplete });

  const showBackButton = step !== 'user_info';

  return (
    <div className="min-h-screen bg-bg-base">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-white border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="p-2 -ml-2 tap-target rounded-lg hover:bg-gray-100 focus-ring"
                aria-label="戻る"
              >
                <ArrowLeft className="w-5 h-5 text-text-sub" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-accent" />
              <h1 className="font-bold text-text-main">携帯プラン診断</h1>
            </div>
          </div>
          {/* プログレスバー */}
          <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {isCalculating ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full spinner" />
            <p className="mt-4 text-text-sub">157プランから最適を分析中...</p>
          </div>
        ) : (
          <>
            {step === 'user_info' && (
              <UserInfoStep
                initialData={user}
                onComplete={handleUserComplete}
              />
            )}
            {step === 'settings' && (
              <SettingsStep
                initialData={common}
                onComplete={handleSettingsComplete}
              />
            )}
            {step === 'confirm' && (
              <ConfirmStep
                user={user}
                common={common}
                onConfirm={handleConfirm}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
