import { useState } from 'react';
import { ArrowLeft, Smartphone } from 'lucide-react';
import type { DiagnosisInput } from '../../types/diagnosis';
import type { DiagnosisResult } from '../../types/result';
import { PersonCountStep } from './PersonCountStep';
import { PersonInfoStep } from './PersonInfoStep';
import { CommonSettingsStep } from './CommonSettingsStep';
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
    personCount,
    currentPersonIndex,
    persons,
    common,
    progress,
    handlePersonCountComplete,
    handlePersonComplete,
    handleCommonComplete,
    handleConfirm,
    handleBack,
  } = useDiagnosis({ onComplete: handleDiagnosisComplete });

  const showBackButton = step !== 'person_count';

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
            <p className="mt-4 text-text-sub">診断中...</p>
          </div>
        ) : (
          <>
            {step === 'person_count' && (
              <PersonCountStep onComplete={handlePersonCountComplete} />
            )}
            {step === 'person_info' && (
              <PersonInfoStep
                personIndex={currentPersonIndex}
                totalPersons={personCount}
                initialData={persons[currentPersonIndex]}
                onComplete={(data) => handlePersonComplete(currentPersonIndex, data)}
              />
            )}
            {step === 'common_settings' && (
              <CommonSettingsStep
                initialData={common}
                onComplete={handleCommonComplete}
              />
            )}
            {step === 'confirm' && (
              <ConfirmStep
                personCount={personCount}
                persons={persons}
                common={common!}
                onConfirm={handleConfirm}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
