import { Home } from 'lucide-react';
import type { DiagnosisResult } from '../../types';
import { useDiagnosis } from '../../hooks/useDiagnosis';
import { ProgressIndicator } from './ProgressIndicator';
import { PropertyInfoStep } from './PropertyInfoStep';
import { FeeInfoStep } from './FeeInfoStep';
import { DetailInfoStep } from './DetailInfoStep';

interface DiagnosisPageProps {
  onComplete: (result: DiagnosisResult) => void;
}

export function DiagnosisPage({ onComplete }: DiagnosisPageProps) {
  const {
    step,
    propertyInfo,
    updatePropertyInfo,
    goToNextStep,
    goToPreviousStep,
    executeDiagnosis,
    canProceedStep1,
    canProceedStep2,
  } = useDiagnosis();

  const handleDiagnose = () => {
    const result = executeDiagnosis();
    if (result) {
      onComplete(result);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
              <Home className="w-6 h-6 text-accent" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-text-main">仲介手数料をチェック</h1>
          <p className="text-sm text-text-sub mt-1">
            物件情報を入力して診断
          </p>
        </div>

        {/* プログレス */}
        <ProgressIndicator currentStep={step} />

        {/* ステップコンテンツ */}
        {step === 1 && (
          <PropertyInfoStep
            propertyInfo={propertyInfo}
            onUpdate={updatePropertyInfo}
            onNext={goToNextStep}
            canProceed={canProceedStep1}
          />
        )}

        {step === 2 && (
          <FeeInfoStep
            propertyInfo={propertyInfo}
            onUpdate={updatePropertyInfo}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
            canProceed={canProceedStep2}
          />
        )}

        {step === 3 && (
          <DetailInfoStep
            propertyInfo={propertyInfo}
            onUpdate={updatePropertyInfo}
            onDiagnose={handleDiagnose}
            onPrevious={goToPreviousStep}
          />
        )}
      </div>
    </div>
  );
}
